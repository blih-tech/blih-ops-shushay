import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";
import { PaymentStatus, PaymentType } from "@prisma/client";
import { chapaService } from "./chapa.service";
import { createNotification, sendPaymentConfirmationEmail } from "../notifications/notification.service";
import { InitializeSkillsPaymentInput } from "./payment.schemas";

export const SKILLS_ACCESS_PRICE = 1000;
export const SKILLS_ACCESS_CURRENCY = "ETB";

/**
 * Generate a unique, safe transaction reference for Blih Skills payment.
 */
function generateTxRef(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `blih_skills_${timestamp}_${random}`;
}

/**
 * Initiates a Blih Skills payment checkout session.
 */
export async function initializeSkillsPayment(
  userId: string,
  input?: InitializeSkillsPaymentInput,
) {
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

  const returnUrl =
    input?.returnUrl || `${env.skillsWebUrl}/checkout/return?tx_ref=${txRef}`;
  const callbackUrl =
    input?.callbackUrl || `${env.apiUrl}/api/v1/payments/webhook`;

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
 */
export async function verifyAndCompletePayment(txRef: string) {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { txRef },
    include: { user: { include: { talentProfile: true } } },
  });

  if (!transaction) {
    throw new AppError(404, "Transaction reference not found");
  }

  // Idempotency: If payment was already verified as SUCCESSFUL, return existing state cleanly
  if (transaction.status === PaymentStatus.SUCCESSFUL) {
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

  // Validate amount (1000 ETB) and currency (ETB)
  const verifyAmount =
    verification.amount > 0
      ? verification.amount
      : isTestMode
        ? SKILLS_ACCESS_PRICE
        : 0;

  const isAmountValid = verifyAmount >= SKILLS_ACCESS_PRICE;
  const isCurrencyValid =
    !verification.currency ||
    verification.currency.toUpperCase() === SKILLS_ACCESS_CURRENCY;


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
      failureReason = `Paid amount (${verification.amount} ETB) is less than required (${SKILLS_ACCESS_PRICE} ETB).`;
    } else if (!isCurrencyValid) {
      failureReason = `Invalid currency (${verification.currency}), expected ${SKILLS_ACCESS_CURRENCY}.`;
    }

    throw new AppError(400, failureReason);
  }



  // Verification succeeded! Execute atomic DB transaction
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
