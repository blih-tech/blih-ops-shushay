import { Resend } from "resend";
import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";

// Resend client — instantiated lazily so missing key never crashes boot
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (env.nodeEnv === "test") return null;
  if (!env.resend.apiKey) return null;
  if (!_resend) _resend = new Resend(env.resend.apiKey);
  return _resend;
}

// ─── Branded email helpers ────────────────────────────────────────────────────

/** Minimal responsive HTML email wrapper */
function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f7ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7ff;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,91,255,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1E5BFF,#0A3DCC);padding:28px 36px;">
            <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">BLIH</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.7);margin-left:8px;text-transform:uppercase;letter-spacing:2px;">Skills &amp; Talent</span>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:36px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f7ff;padding:20px 36px;border-top:1px solid #E6EAF3;">
            <p style="margin:0;font-size:12px;color:#6E6678;line-height:1.6;">
              You received this email because you have an account on <strong>Blih Skills &amp; Talent</strong>.<br/>
              If you did not request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── In-app notification helpers ──────────────────────────────────────────────

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

// ─── Email delivery helpers ───────────────────────────────────────────────────

/**
 * Sends a Skills payment confirmation email to the learner.
 * Non-fatal — returns { success: false } on any failure.
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  userName: string,
  amount: number,
  txRef: string,
) {
  const resend = getResend();
  if (!resend) {
    console.log(`[EMAIL DEV] Skills payment confirmation → ${email} | txRef: ${txRef} | amount: ${amount} ETB`);
    return { success: true };
  }

  try {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#17131F;">Payment Confirmed 🎉</h2>
      <p style="margin:0 0 12px;font-size:15px;color:#4A4154;line-height:1.6;">
        Hi <strong>${userName}</strong>, your payment has been received and your Blih Skills access is now active.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF3FF;border-radius:10px;padding:16px;margin-bottom:20px;">
        <tr><td style="font-size:13px;color:#6E6678;">Amount paid</td><td align="right" style="font-size:15px;font-weight:700;color:#1E5BFF;">${amount.toLocaleString()} ETB</td></tr>
        <tr><td style="font-size:13px;color:#6E6678;padding-top:8px;">Reference</td><td align="right" style="font-size:12px;font-family:monospace;color:#17131F;padding-top:8px;">${txRef}</td></tr>
      </table>
      <p style="margin:0 0 24px;font-size:14px;color:#4A4154;line-height:1.6;">
        You now have <strong>permanent access</strong> to all published courses on Blih Skills.
        Start learning at your own pace and earn verified certificates.
      </p>
      <a href="${env.skillsWebUrl}/courses" style="display:inline-block;background:linear-gradient(135deg,#1E5BFF,#0A3DCC);color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">Browse Courses →</a>
    `;

    await resend.emails.send({
      from: env.resend.emailFrom,
      to: email,
      subject: "✅ Blih Skills Access Confirmed",
      html: wrapHtml("Skills Payment Confirmed", body),
    });

    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Skills payment email to ${email}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a company subscription confirmation email.
 * Non-fatal — returns { success: false } on any failure.
 */
export async function sendSubscriptionConfirmationEmail(
  email: string,
  companyName: string,
  amount: number,
  plan: string,
) {
  const resend = getResend();
  if (!resend) {
    console.log(`[EMAIL DEV] Subscription confirmation → ${email} | company: ${companyName} | plan: ${plan}`);
    return { success: true };
  }

  try {
    const planLabel = plan === "YEARLY" ? "Yearly" : "Monthly";
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#17131F;">Subscription Active 🚀</h2>
      <p style="margin:0 0 12px;font-size:15px;color:#4A4154;line-height:1.6;">
        Hi <strong>${companyName}</strong>, your company subscription is now active.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF3FF;border-radius:10px;padding:16px;margin-bottom:20px;">
        <tr><td style="font-size:13px;color:#6E6678;">Plan</td><td align="right" style="font-size:15px;font-weight:700;color:#1E5BFF;">${planLabel}</td></tr>
        <tr><td style="font-size:13px;color:#6E6678;padding-top:8px;">Amount paid</td><td align="right" style="font-size:15px;font-weight:700;color:#17131F;padding-top:8px;">${amount.toLocaleString()} ETB</td></tr>
      </table>
      <p style="margin:0 0 24px;font-size:14px;color:#4A4154;line-height:1.6;">
        You can now access the full talent directory, view complete profiles, and post unlimited job listings.
      </p>
      <a href="${env.talentWebUrl}/company/talents" style="display:inline-block;background:linear-gradient(135deg,#1E5BFF,#0A3DCC);color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">Browse Talents →</a>
    `;

    await resend.emails.send({
      from: env.resend.emailFrom,
      to: email,
      subject: `✅ ${companyName} — ${planLabel} Subscription Activated`,
      html: wrapHtml("Subscription Confirmed", body),
    });

    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Subscription email to ${email}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a new job application notification to the company HR email.
 * Non-fatal — returns { success: false } on any failure.
 */
export async function sendJobApplicationEmail(
  companyEmail: string,
  jobTitle: string,
  applicantName: string,
) {
  const resend = getResend();
  if (!resend) {
    console.log(`[EMAIL DEV] Job application → ${companyEmail} | job: "${jobTitle}" | applicant: ${applicantName}`);
    return { success: true };
  }

  try {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#17131F;">New Application Received 📋</h2>
      <p style="margin:0 0 12px;font-size:15px;color:#4A4154;line-height:1.6;">
        A new candidate has applied to your job posting on Blih.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF3FF;border-radius:10px;padding:16px;margin-bottom:20px;">
        <tr><td style="font-size:13px;color:#6E6678;">Position</td><td align="right" style="font-size:15px;font-weight:700;color:#1E5BFF;">${jobTitle}</td></tr>
        <tr><td style="font-size:13px;color:#6E6678;padding-top:8px;">Applicant</td><td align="right" style="font-size:14px;font-weight:600;color:#17131F;padding-top:8px;">${applicantName}</td></tr>
      </table>
      <p style="margin:0 0 24px;font-size:14px;color:#4A4154;line-height:1.6;">
        Log in to your Blih dashboard to review their profile, CV, and cover letter.
      </p>
      <a href="${env.talentWebUrl}/company/jobs" style="display:inline-block;background:linear-gradient(135deg,#1E5BFF,#0A3DCC);color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">View Applications →</a>
    `;

    await resend.emails.send({
      from: env.resend.emailFrom,
      to: companyEmail,
      subject: `📋 New Application: ${jobTitle} — ${applicantName}`,
      html: wrapHtml("New Job Application", body),
    });

    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Job application email to ${companyEmail}: ${err.message}`);
    return { success: false, error: err.message };
  }
}
