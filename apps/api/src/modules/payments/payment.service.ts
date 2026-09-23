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
import { Prisma } from "@prisma/client";
import { chapaService } from "./chapa.service";
import {
  createNotification,
  sendCoursePaymentConfirmationEmail,
  sendSubscriptionConfirmationEmail,
} from "../notifications/notification.service";
import { getSetting } from "../settings/settings.service";

/** Typed shape of the JSON metadata stored on a PaymentTransaction. */
interface PaymentMetadata {
  plan?: "MONTHLY" | "YEARLY";
  courseId?: string;
  courseTitle?: string;
  [key: string]: unknown;
}

async function lockAndCompletePayment(
  tx: any,
  transactionId: string,
  chapaRefFallback: string | null,
  verification: any
) {
  await tx.$queryRaw`SELECT "id" FROM "payment_transactions" WHERE "id" = ${transactionId} FOR UPDATE`;
  const lockedPayment = await tx.paymentTransaction.findUnique({
    where: { id: transactionId },
  });
  
  if (lockedPayment?.status === PaymentStatus.SUCCESSFUL) {
    return { alreadyCompleted: true, updatedPayment: lockedPayment };
  }

  const updatedPayment = await tx.paymentTransaction.update({
    where: { id: transactionId },
    data: {
      status: PaymentStatus.SUCCESSFUL,
      chapaRef: verification.chapaRef || chapaRefFallback,
      metadata: verification.rawResponse ?? undefined,
    },
  });

  return { alreadyCompleted: false, updatedPayment };
}

export const COURSE_ACCESS_CURRENCY = "ETB";

/**
 * Generate a cryptographically unique transaction reference for a course payment.
 */
function generateTxRef(): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  return `blih_course_${timestamp}_${random}`;
}

/**
 * Initiates a per-course payment checkout session.
 * returnUrl and callbackUrl are always derived from server env vars —
 * clients cannot override them to prevent open-redirect attacks.
 */
export async function initializeCoursePayment(userId: string, courseId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      talentProfile: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Verify course exists and is published
  const course = await prisma.course.findFirst({
    where: { id: courseId, status: "PUBLISHED" },
    select: { id: true, title: true, price: true },
  });

  if (!course) {
    throw new AppError(404, "Course not found or not published");
  }

  // Check if user is already enrolled in this course
  const existingEnrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existingEnrollment) {
    return {
      alreadyEnrolled: true,
      checkoutUrl: null,
      txRef: null,
      enrollment: existingEnrollment,
    };
  }

  const txRef = generateTxRef();
  const priceStr = await getSetting("PRICE_SKILLS_ACCESS", "1000");
  const price = course.price || Number(priceStr) || 1000;

  // Create PENDING payment record, store courseId + title in metadata
  const payment = await prisma.paymentTransaction.create({
    data: {
      userId,
      txRef,
      amount: price,
      currency: COURSE_ACCESS_CURRENCY,
      paymentType: PaymentType.COURSE_ACCESS,
      status: PaymentStatus.PENDING,
      metadata: { courseId: course.id, courseTitle: course.title } as Prisma.JsonObject,
    },
  });

  const nameParts = (user.talentProfile?.fullName || "Blih Learner")
    .trim()
    .split(" ");
  const firstName = nameParts[0] || "Learner";
  const lastName = nameParts.slice(1).join(" ") || "User";

  const returnUrl = `${env.skillsWebUrl}/checkout/return?tx_ref=${txRef}`;
  const callbackUrl = `${env.apiUrl}/api/v1/payments/webhook`;

  const chapaRes = await chapaService.initializePayment({
    amount: price,
    currency: COURSE_ACCESS_CURRENCY,
    email: user.email,
    firstName,
    lastName,
    txRef,
    returnUrl,
    callbackUrl,
    title: `Blih Skills — ${course.title}`,
    description:
      `${price.toLocaleString()} ETB for full access to "${course.title}" on Blih Skills.`,
  });

  if (chapaRes.checkoutUrl) {
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { chapaRef: chapaRes.checkoutUrl },
    });
  }

  return {
    alreadyEnrolled: false,
    checkoutUrl: chapaRes.checkoutUrl,
    txRef,
    paymentId: payment.id,
  };
}

/**
 * Server-side payment verification and enrollment granting.
 * Strictly idempotent: multiple invocations return the same successful enrollment state.
 *
 * @param txRef - Transaction reference to verify
 * @param callerUserId - The authenticated user making the request; when provided, the txRef must
 *   belong to this user. Pass undefined for server-to-server webhook calls (already HMAC-verified).
 */
export async function verifyAndCompletePayment(
  txRef: string,
  callerUserId?: string,
) {
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
    throw new AppError(
      403,
      "You do not have permission to verify this transaction.",
    );
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

    // COURSE_ACCESS
    const metadata = transaction.metadata as PaymentMetadata | null;
    const courseId = metadata?.courseId;
    const existingEnrollment = courseId
      ? await prisma.courseEnrollment.findUnique({
          where: { userId_courseId: { userId: transaction.userId, courseId } },
          include: { course: { select: { id: true, title: true } } },
        })
      : null;

    return {
      verified: true,
      payment: transaction,
      enrollment: existingEnrollment,
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
    verification.currency?.toUpperCase() === transaction.currency.toUpperCase();

  if (verification.status === "pending") {
    throw new AppError(
      400,
      "Payment is still pending. Please complete the payment steps on Chapa.",
    );
  }

  if (!isSuccessStatus || !isAmountValid || !isCurrencyValid) {
    // Mark payment as FAILED if verification criteria not met
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.FAILED,
        metadata: verification.rawResponse ?? {
          reason: "Verification criteria failed",
        },
      },
    });

    let failureReason = "Payment verification failed";
    if (!isSuccessStatus) {
      failureReason = `Payment was not completed (Chapa status: ${verification.status || "failed"}). Please try again.`;
    } else if (!isAmountValid) {
      failureReason = `Paid amount (${verification.amount} ETB) is less than required (${expectedPrice} ETB).`;
    } else if (!isCurrencyValid) {
      failureReason = `Invalid currency (${verification.currency}), expected ${transaction.currency.toUpperCase()}.`;
    }

    throw new AppError(400, failureReason);
  }

  // Handle COMPANY_SUBSCRIPTION payment verification
  if (transaction.paymentType === PaymentType.COMPANY_SUBSCRIPTION) {
    const companyProfile = transaction.user.companyProfile;
    if (!companyProfile) {
      throw new AppError(404, "Company profile not found for this transaction");
    }

    const metadataPlan = (transaction.metadata as PaymentMetadata | null)?.plan as
      | string
      | undefined;

    if (!metadataPlan || (metadataPlan !== "YEARLY" && metadataPlan !== "MONTHLY")) {
      throw new AppError(
        400,
        "Transaction metadata is missing a valid subscription plan. Please contact support.",
      );
    }

    const plan: SubscriptionPlan = metadataPlan === "YEARLY" ? "YEARLY" : "MONTHLY";
    const durationMonths = plan === "YEARLY" ? 12 : 1;

    const now = new Date();
    const existingSub = companyProfile.companySubscription;
    let baseDate = now;

    // If currently active and unexpired, extend from existing expiresAt
    if (
      existingSub &&
      existingSub.expiresAt > now &&
      existingSub.status === SubscriptionStatus.ACTIVE
    ) {
      baseDate = existingSub.expiresAt;
    }

    const calculatedExpiresAt = new Date(baseDate);
    calculatedExpiresAt.setMonth(
      calculatedExpiresAt.getMonth() + durationMonths,
    );

    const result = await prisma.$transaction(async (tx) => {
      const { alreadyCompleted, updatedPayment } = await lockAndCompletePayment(
        tx,
        transaction.id,
        transaction.chapaRef,
        verification
      );
      
      if (alreadyCompleted) {
        return {
          alreadyCompleted: true,
          updatedPayment,
          subscription: await tx.companySubscription.findUnique({
            where: { companyProfileId: companyProfile.id },
          }),
        };
      }

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

    if (result.alreadyCompleted) {
      return {
        verified: true,
        payment: result.updatedPayment,
        subscription: result.subscription,
        message: "Payment already successfully verified",
      };
    }

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
      message:
        "Payment successfully verified and Company Subscription activated",
    };
  }

  // ── COURSE_ACCESS verification ─────────────────────────────────────────────

  const metadata = transaction.metadata as PaymentMetadata | null;
  const courseId = metadata?.courseId;
  const courseTitle = metadata?.courseTitle || "the course";

  if (!courseId) {
    throw new AppError(
      400,
      "Transaction metadata is missing course information. Please contact support.",
    );
  }

  // Verify the course still exists
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true },
  });

  if (!course) {
    throw new AppError(404, "The course associated with this payment no longer exists.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const { alreadyCompleted, updatedPayment } = await lockAndCompletePayment(
      tx,
      transaction.id,
      transaction.chapaRef,
      verification
    );

    if (alreadyCompleted) {
      return {
        alreadyCompleted: true,
        updatedPayment,
        enrollment: await tx.courseEnrollment.findUnique({
          where: { userId_courseId: { userId: transaction.userId, courseId } },
          include: { course: { select: { id: true, title: true } } },
        }),
      };
    }

    const enrollment = await tx.courseEnrollment.upsert({
      where: { userId_courseId: { userId: transaction.userId, courseId } },
      create: {
        userId: transaction.userId,
        courseId,
        paymentId: transaction.id,
      },
      update: {
        paymentId: transaction.id,
      },
      include: { course: { select: { id: true, title: true } } },
    });

    return { updatedPayment, enrollment };
  });

  if (result.alreadyCompleted) {
    return {
      verified: true,
      payment: result.updatedPayment,
      enrollment: result.enrollment,
      message: "Payment already successfully verified",
    };
  }

  // Create in-app notification
  await createNotification({
    userId: transaction.userId,
    type: "COURSE_ENROLLMENT_SUCCESS",
    title: `You're enrolled in "${course.title}"!`,
    message:
      `Your payment of ${transaction.amount.toLocaleString()} ETB has been confirmed. You now have full access to "${course.title}".`,
  });

  // Send confirmation email (resilient / non-blocking)
  const userName =
    transaction.user.talentProfile?.fullName || transaction.user.email;
  sendCoursePaymentConfirmationEmail(
    transaction.user.email,
    userName,
    transaction.amount,
    txRef,
    course.title,
  );

  return {
    verified: true,
    payment: result.updatedPayment,
    enrollment: result.enrollment,
    message: `Payment successfully verified and enrollment in "${course.title}" granted`,
  };
}

/**
 * Returns whether a user is enrolled in a specific course.
 */
export async function getCourseAccessStatus(userId: string, courseId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "ADMIN") {
    return {
      hasAccess: true,
      isAdmin: true,
      grantedAt: new Date().toISOString(),
      enrollment: null,
    };
  }

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: {
      id: true,
      grantedAt: true,
      payment: {
        select: {
          txRef: true,
          amount: true,
          currency: true,
          createdAt: true,
        },
      },
    },
  });

  if (enrollment) {
    return {
      hasAccess: true,
      grantedAt: enrollment.grantedAt,
      enrollment,
    };
  }

  return {
    hasAccess: false,
    grantedAt: null,
    enrollment: null,
  };
}

/**
 * Returns all course IDs (and basic course info) a user is enrolled in.
 */
export async function getUserEnrollments(userId: string) {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId },
    select: {
      courseId: true,
      grantedAt: true,
      course: { select: { id: true, title: true, status: true } },
    },
    orderBy: { grantedAt: "desc" },
  });

  return enrollments;
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
      metadata: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
