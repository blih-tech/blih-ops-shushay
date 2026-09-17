import { randomBytes } from "crypto";
import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";
import {
  PaymentStatus,
  PaymentType,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";
import { chapaService } from "../payments/chapa.service";
import {
  COMPANY_SUBSCRIPTION_PLANS,
  SubscriptionPlanKey,
} from "./company-subscription.constants";
import { getSetting } from "../settings/settings.service";

function generateTxRef(plan: SubscriptionPlanKey): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  return `blih_sub_${plan.toLowerCase()}_${timestamp}_${random}`;
}

export async function initializeCompanySubscription(
  userId: string,
  plan: SubscriptionPlanKey,
) {
  const planConfig = COMPANY_SUBSCRIPTION_PLANS[plan];
  if (!planConfig) {
    throw new AppError(400, "Invalid subscription plan selection");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { companyProfile: true },
  });

  if (!user || user.role !== "COMPANY") {
    throw new AppError(
      403,
      "Only company accounts can initialize a subscription.",
    );
  }

  if (!user.companyProfile) {
    throw new AppError(
      404,
      "Company profile not found. Please set up your company profile first.",
    );
  }

  const txRef = generateTxRef(plan);
  
  const priceKey = plan === "MONTHLY" ? "PRICE_SUBSCRIPTION_MONTHLY" : "PRICE_SUBSCRIPTION_YEARLY";
  const defaultPrice = plan === "MONTHLY" ? "2000" : "10000";
  const priceStr = await getSetting(priceKey, defaultPrice);
  const price = Number(priceStr) || Number(defaultPrice);

  // Create PENDING payment transaction record
  const payment = await prisma.paymentTransaction.create({
    data: {
      userId,
      txRef,
      amount: price,
      currency: planConfig.currency,
      paymentType: PaymentType.COMPANY_SUBSCRIPTION,
      status: PaymentStatus.PENDING,
      metadata: { plan },
    },
  });

  const contactName =
    user.companyProfile.contactName ||
    user.companyProfile.companyName ||
    "Company Admin";
  const nameParts = contactName.trim().split(" ");
  const firstName = nameParts[0] || "Company";
  const lastName = nameParts.slice(1).join(" ") || "Admin";

  const returnUrl = `${env.talentWebUrl}/company/subscription/return?tx_ref=${txRef}`;
  const callbackUrl = `${env.apiUrl}/api/v1/payments/webhook`;

  const chapaRes = await chapaService.initializePayment({
    amount: price,
    currency: planConfig.currency,
    email: user.companyProfile.contactEmail || user.email,
    firstName,
    lastName,
    txRef,
    returnUrl,
    callbackUrl,
    title: planConfig.title,
    description: planConfig.description,
  });

  if (chapaRes.checkoutUrl) {
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { chapaRef: chapaRes.checkoutUrl },
    });
  }

  return {
    checkoutUrl: chapaRes.checkoutUrl,
    txRef,
    paymentId: payment.id,
  };
}

export async function getCompanySubscriptionStatus(userId: string) {
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
    include: {
      companySubscription: true,
    },
  });

  if (!companyProfile) {
    throw new AppError(404, "Company profile not found");
  }

  const subscription = companyProfile.companySubscription;

  if (!subscription) {
    return {
      hasActiveSubscription: false,
      subscription: null,
      expiresAt: null,
      daysRemaining: 0,
    };
  }

  const now = new Date();
  const isExpired = subscription.expiresAt <= now;

  // Dynamic synchronization if record is past expiry date
  if (
    isExpired &&
    (subscription.status !== SubscriptionStatus.EXPIRED ||
      companyProfile.subscriptionActive)
  ) {
    await prisma.$transaction([
      prisma.companySubscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.EXPIRED },
      }),
      prisma.companyProfile.update({
        where: { id: companyProfile.id },
        data: { subscriptionActive: false },
      }),
    ]);
  }

  const hasActiveSubscription =
    !isExpired && subscription.status === SubscriptionStatus.ACTIVE;
  const daysRemaining = hasActiveSubscription
    ? Math.max(
        0,
        Math.ceil(
          (subscription.expiresAt.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return {
    hasActiveSubscription,
    subscription: {
      id: subscription.id,
      plan: subscription.plan,
      status: hasActiveSubscription
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.EXPIRED,
      amount: subscription.amount,
      currency: subscription.currency,
      startDate: subscription.startDate.toISOString(),
      expiresAt: subscription.expiresAt.toISOString(),
    },
    expiresAt: subscription.expiresAt.toISOString(),
    daysRemaining,
  };
}
