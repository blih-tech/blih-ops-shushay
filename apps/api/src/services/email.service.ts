import { Resend } from "resend";
import { env } from "../config/env";

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!env.resend.apiKey) return null;
  if (!_resend) _resend = new Resend(env.resend.apiKey);
  return _resend;
}

const FROM = () => env.resend.emailFrom;

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
        <tr>
          <td style="background:linear-gradient(135deg,#1E5BFF,#0A3DCC);padding:28px 36px;">
            <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">BLIH</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.7);margin-left:8px;text-transform:uppercase;letter-spacing:2px;">Skills &amp; Talent</span>
          </td>
        </tr>
        <tr><td style="padding:36px;">${body}</td></tr>
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

/**
 * Sends an email verification link to a newly registered user.
 * Falls back to console in dev when RESEND_API_KEY is not set.
 */
export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log(`\n==================================================`);
    console.log(`[EMAIL DEV] Verification Email`);
    console.log(`To:   ${email}`);
    console.log(`Link: ${verificationLink}`);
    console.log(`==================================================\n`);
    return { success: true };
  }

  try {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#17131F;">Verify your email address</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#4A4154;line-height:1.6;">
        Welcome to Blih! Click the button below to verify your email address and activate your account.
      </p>
      <a href="${verificationLink}" style="display:inline-block;background:linear-gradient(135deg,#1E5BFF,#0A3DCC);color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;margin-bottom:24px;">Verify Email Address →</a>
      <p style="margin:0;font-size:12px;color:#6E6678;line-height:1.6;">
        This link will expire in 24 hours. If you did not create an account, you can ignore this email.
      </p>
    `;

    await resend.emails.send({
      from: FROM(),
      to: email,
      subject: "Verify your Blih account",
      html: wrapHtml("Verify your email", body),
    });

    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Verification email to ${email}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a password reset link.
 * Falls back to console in dev when RESEND_API_KEY is not set.
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log(`\n==================================================`);
    console.log(`[EMAIL DEV] Password Reset Email`);
    console.log(`To:   ${email}`);
    console.log(`Link: ${resetLink}`);
    console.log(`==================================================\n`);
    return { success: true };
  }

  try {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#17131F;">Reset your password</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#4A4154;line-height:1.6;">
        We received a request to reset the password for your Blih account. Click the button below to choose a new password.
      </p>
      <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#1E5BFF,#0A3DCC);color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;margin-bottom:24px;">Reset Password →</a>
      <p style="margin:0;font-size:12px;color:#6E6678;line-height:1.6;">
        This link expires in 1 hour. If you did not request a password reset, you can ignore this email — your password will not change.
      </p>
    `;

    await resend.emails.send({
      from: FROM(),
      to: email,
      subject: "Reset your Blih password",
      html: wrapHtml("Password Reset", body),
    });

    return { success: true };
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Password reset email to ${email}: ${err.message}`);
    return { success: false, error: err.message };
  }
}
