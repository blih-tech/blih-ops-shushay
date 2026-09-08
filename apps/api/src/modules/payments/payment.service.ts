import { randomBytes } from "crypto";
import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";
import { PaymentStatus, PaymentType, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { chapaService } from "./chapa.service";
import {
  createNotification,
  sendPaymentConfirmationEmail,
  sendSubscriptionConfirmationEmail,
} from "../notifications/notification.service";

export const SKILLS_ACCESS_PRICE = 1000;
export const SKILLS_ACCESS_CURRENCY = "ETB";

/**
 * Generate a cryptographically unique transaction reference for Blih Skills payment.
 * Uses crypto.randomBytes to prevent collisions even under concurrent load.
 */
function generateTxRef(): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  return `blih_skills_${timestamp}_${random}`;
}

/**
 * Initiates a Blih Skills payment checkout session.
 * returnUrl and callbackUrl are always derived from server env vars —
 * clients cannot override them to prevent open-redirect attacks.
 */
export async function initializeSkillsPayment(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      talentProfile: true,
      skillsEntitlement: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Check if user already has access
  if (user.skillsEntitlement) {
    return {
      alreadyHasAccess: true,
      checkoutUrl: null,
      txRef: null,
      entitlement: user.skillsEntitlement,
    };
  }

  const txRef = generateTxRef();

  // Create PENDING payment record
  const payment = await prisma.paymentTransaction.create({
    data: {
      userId,
      txRef,
      amount: SKILLS_ACCESS_PRICE,
      currency: SKILLS_ACCESS_CURRENCY,
      paymentType: PaymentType.SKILLS_ACCESS,
      status: PaymentStatus.PENDING,
    },
  });

  const nameParts = (user.talentProfile?.fullName || "Blih Learner").trim().split(" ");
  const firstName = nameParts[0] || "Learner";
  const lastName = nameParts.slice(1).join(" ") || "User";

  const returnUrl = `${env.skillsWebUrl}/checkout/return?tx_ref=${txRef}`;
  const callbackUrl = `${env.apiUrl}/api/v1/payments/webhook`;

  const chapaRes = await chapaService.initializePayment({
    amount: SKILLS_ACCESS_PRICE,
    currency: SKILLS_ACCESS_CURRENCY,
    email: user.email,
    firstName,
    lastName,
    txRef,
    returnUrl,
    callbackUrl,
    title: "Blih Skills Permanent Access",
    description: "One-time 1,000 ETB payment for permanent access to all Blih Skills courses.",
  });

  if (chapaRes.checkoutUrl) {
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { chapaRef: chapaRes.checkoutUrl },
    });
  }

  return {
    alreadyHasAccess: false,
    checkoutUrl: chapaRes.checkoutUrl,
    txRef,
    paymentId: payment.id,
  };
}

/**
 * Server-side payment verification and entitlement granting.
 * Strictly idempotent: multiple invocations return the same successful entitlement state.
 *
 * @param txRef - Transaction reference to verify
 * @param callerUserId - The authenticated user making the request; when provided, the txRef must
 *   belong to this user. Pass undefined for server-to-server webhook calls (already HMAC-verified).
 */
export async function verifyAndCompletePayment(txRef: string, callerUserId?: string) {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { txRef },
    include: {
      user: {
        include: {
          talentProfile: true,
          companyProfile: { include: { companySubscription: true } },
        },
      },
    },
  });

  if (!transaction) {
    throw new AppError(404, "Transaction reference not found");
  }

  // Ownership check: ensure the authenticated caller owns this transaction.
  // Skipped for webhook path (callerUserId is undefined, already HMAC-verified).
  if (callerUserId && transaction.userId !== callerUserId) {
    throw new AppError(403, "You do not have permission to verify this transaction.");
  }

  // Idempotency: If payment was already verified as SUCCESSFUL, return existing state cleanly
  if (transaction.status === PaymentStatus.SUCCESSFUL) {
    if (transaction.paymentType === PaymentType.COMPANY_SUBSCRIPTION) {
      const existingSub = await prisma.companySubscription.findFirst({
        where: { companyProfile: { userId: transaction.userId } },
      });
      return {
        verified: true,
        payment: transaction,
        subscription: existingSub,
        message: "Payment already successfully verified",
      };
    }

    const existingEntitlement = await prisma.skillsEntitlement.findUnique({
      where: { userId: transaction.userId },
    });

    return {
      verified: true,
      payment: transaction,
      entitlement: existingEntitlement,
      message: "Payment already successfully verified",
    };
  }

  // Call Chapa API for authoritative verification
  const verification = await chapaService.verifyPayment(txRef);

  const isTestMode =
    verification.rawResponse?.data?.mode === "test" ||
    env.chapa.secretKey.startsWith("CHASECK_TEST-");

  const isSuccessStatus =
    verification.status === "success" ||
    verification.status === "successful" ||
    (isTestMode && verification.rawResponse?.status === "success");

  // Validate amount and currency based on payment type
  const expectedPrice = transaction.amount;
  const verifyAmount = verification.amount;

  const isAmountValid = verifyAmount >= expectedPrice;
  // In test-mode the Chapa sandbox can return an empty currency string; allow it.
  const isCurrencyValid =
    (isTestMode && !verification.currency) ||
    verification.currency?.toUpperCase() === SKILLS_ACCESS_CURRENCY;

  if (verification.status === "pending") {
    throw new AppError(400, "Payment is still pending. Please complete the payment steps on Chapa.");
  }

  if (!isSuccessStatus || !isAmountValid || !isCurrencyValid) {
    // Mark payment as FAILED if verification criteria not met
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.FAILED,
        metadata: verification.rawResponse ?? { reason: "Verification criteria failed" },
      },
    });

    let failureReason = "Payment verification failed";
    if (!isSuccessStatus) {
      failureReason = `Payment was not completed (Chapa status: ${verification.status || "failed"}). Please try again.`;
    } else if (!isAmountValid) {
      failureReason = `Paid amount (${verification.amount} ETB) is less than required (${expectedPrice} ETB).`;
    } else if (!isCurrencyValid) {
      failureReason = `Invalid currency (${verification.currency}), expected ${SKILLS_ACCESS_CURRENCY}.`;
    }

    throw new AppError(400, failureReason);
  }

  // Handle COMPANY_SUBSCRIPTION payment verification
  if (transaction.paymentType === PaymentType.COMPANY_SUBSCRIPTION) {
    const companyProfile = transaction.user.companyProfile;
    if (!companyProfile) {
      throw new AppError(404, "Company profile not found for this transaction");
    }

    const metadataPlan = (transaction.metadata as any)?.plan as string | undefined;
    const plan: SubscriptionPlan = metadataPlan === "YEARLY" || transaction.amount >= 10000 ? "YEARLY" : "MONTHLY";
    const durationMonths = plan === "YEARLY" ? 12 : 1;

    const now = new Date();
    const existingSub = companyProfile.companySubscription;
    let baseDate = now;

    // If currently active and unexpired, extend from existing expiresAt
    if (existingSub && existingSub.expiresAt > now && existingSub.status === SubscriptionStatus.ACTIVE) {
      baseDate = existingSub.expiresAt;
    }

    const calculatedExpiresAt = new Date(baseDate);
    calculatedExpiresAt.setMonth(calculatedExpiresAt.getMonth() + durationMonths);

    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.SUCCESSFUL,
          chapaRef: verification.chapaRef || transaction.chapaRef,
          metadata: verification.rawResponse ?? undefined,
        },
      });

      const subscription = await tx.companySubscription.upsert({
        where: { companyProfileId: companyProfile.id },
        create: {
          companyProfileId: companyProfile.id,
          plan,
          status: SubscriptionStatus.ACTIVE,
          amount: transaction.amount,
          currency: transaction.currency,
          startDate: now,
          expiresAt: calculatedExpiresAt,
          paymentId: transaction.id,
        },
        update: {
          plan,
          status: SubscriptionStatus.ACTIVE,
          amount: transaction.amount,
          currency: transaction.currency,
          expiresAt: calculatedExpiresAt,
          paymentId: transaction.id,
        },
      });

      await tx.companyProfile.update({
        where: { id: companyProfile.id },
        data: {
          subscriptionActive: true,
          subscriptionExpiresAt: calculatedExpiresAt,
        },
      });

      return { updatedPayment, subscription };
    });

    await createNotification({
      userId: transaction.userId,
      type: "COMPANY_SUBSCRIPTION_SUCCESS",
      title: "Company Subscription Activated!",
      message: `Your ${plan.toLowerCase()} subscription of ${transaction.amount} ETB has been confirmed. Full company access is unlocked until ${calculatedExpiresAt.toLocaleDateString()}.`,
    });

    const companyName = companyProfile.companyName || transaction.user.email;
    const companyEmail = companyProfile.contactEmail || transaction.user.email;
    sendSubscriptionConfirmationEmail(
      companyEmail,
      companyName,
      transaction.amount,
      plan,
    );

    return {
      verified: true,
      payment: result.updatedPayment,
      subscription: result.subscription,
      message: "Payment successfully verified and Company Subscription activated",
    };
  }

  // Verification succeeded for SKILLS_ACCESS! Execute atomic DB transaction
  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.SUCCESSFUL,
        chapaRef: verification.chapaRef || transaction.chapaRef,
        metadata: verification.rawResponse ?? undefined,
      },
    });

    const entitlement = await tx.skillsEntitlement.upsert({
      where: { userId: transaction.userId },
      create: {
        userId: transaction.userId,
        paymentId: transaction.id,
      },
      update: {
        paymentId: transaction.id,
      },
    });

    return { updatedPayment, entitlement };
  });

  // Create in-app notification
  await createNotification({
    userId: transaction.userId,
    type: "SKILLS_PAYMENT_SUCCESS",
    title: "Blih Skills Access Unlocked!",
    message:
      "Your payment of 1,000 ETB has been confirmed. You now have permanent access to all current and future Blih Skills courses.",
  });

  // Send confirmation email (resilient / non-blocking)
  const userName =
    transaction.user.talentProfile?.fullName || transaction.user.email;
  sendPaymentConfirmationEmail(
    transaction.user.email,
    userName,
    SKILLS_ACCESS_PRICE,
    txRef,
  );

  return {
    verified: true,
    payment: result.updatedPayment,
    entitlement: result.entitlement,
    message: "Payment successfully verified and Skills access granted",
  };
}

/**
 * Returns authoritative Skills access status for a user.
 */
export async function getSkillsAccessStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      skillsEntitlement: {
        include: {
          payment: {
            select: {
              txRef: true,
              amount: true,
              currency: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "ADMIN") {
    return {
      hasAccess: true,
      isAdmin: true,
      grantedAt: new Date().toISOString(),
      payment: null,
    };
  }

  if (user.skillsEntitlement) {
    return {
      hasAccess: true,
      grantedAt: user.skillsEntitlement.grantedAt,
      payment: user.skillsEntitlement.payment,
    };
  }

  return {
    hasAccess: false,
    grantedAt: null,
    payment: null,
  };
}

/**
 * Lists payment transactions for a user.
 */
export async function listUserPayments(userId: string) {
  return prisma.paymentTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      txRef: true,
      amount: true,
      currency: true,
      paymentType: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
