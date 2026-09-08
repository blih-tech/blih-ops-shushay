import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
    },
  });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  if (notification.userId !== userId) {
    throw new AppError(403, "Access denied");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function sendPaymentConfirmationEmail(
  email: string,
  userName: string,
  amount: number,
  txRef: string,
) {
  try {
    console.log(
      `[EMAIL SERVICE] Sending payment confirmation email to ${email} for txRef: ${txRef}, amount: ${amount} ETB for user ${userName}.`,
    );
    // In production, integrate with SendGrid/AWS SES/Resend here
    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL SERVICE FAILED] Failed to send email to ${email}: ${err.message}`);
    // Return non-fatal error so transaction logic never rolls back on email provider issue
    return { success: false, error: err.message };
  }
}

export async function sendSubscriptionConfirmationEmail(
  email: string,
  companyName: string,
  amount: number,
  plan: string,
) {
  try {
    console.log(
      `[EMAIL SERVICE] Sending subscription confirmation email to ${email} for ${companyName}: ${plan} plan, amount: ${amount} ETB.`,
    );
    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL SERVICE FAILED] Failed to send subscription email to ${email}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function sendJobApplicationEmail(
  companyEmail: string,
  jobTitle: string,
  applicantName: string,
) {
  try {
    console.log(
      `[EMAIL SERVICE] Sending job application email notification to ${companyEmail} for position '${jobTitle}' applied by '${applicantName}'.`,
    );
    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL SERVICE FAILED] Failed to send job application email to ${companyEmail}: ${err.message}`);
    return { success: false, error: err.message };
  }
}
