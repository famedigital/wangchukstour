import { getCompanyName } from '@/lib/brand';
import { DEFAULT_COMPANY_NAME } from '@/lib/brand-defaults';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SendEmailResult = {
  sent: boolean;
  provider: 'resend' | 'log' | 'none';
  error?: string;
};

/**
 * Sends transactional email via Resend when RESEND_API_KEY is set.
 * Falls back to console logging in development so reset links still work locally.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  let from =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    '';

  if (!from) {
    const company = await getCompanyName().catch(() => DEFAULT_COMPANY_NAME);
    from = `${company} <onboarding@resend.dev>`;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error('Resend email failed:', res.status, body);
        return { sent: false, provider: 'resend', error: body };
      }

      return { sent: true, provider: 'resend' };
    } catch (error) {
      console.error('Resend email error:', error);
      return {
        sent: false,
        provider: 'resend',
        error: error instanceof Error ? error.message : 'send failed',
      };
    }
  }

  console.info('[email:log]', {
    to: input.to,
    subject: input.subject,
    text: input.text,
  });

  return {
    sent: process.env.NODE_ENV !== 'production',
    provider: process.env.NODE_ENV === 'production' ? 'none' : 'log',
    error:
      process.env.NODE_ENV === 'production'
        ? 'Email provider not configured (set RESEND_API_KEY)'
        : undefined,
  };
}

export async function passwordResetEmail(params: {
  name: string;
  resetUrl: string;
}) {
  const company = await getCompanyName();
  const subject = `Reset your ${company} admin password`;
  const text = `Hi ${params.name},

We received a request to reset your ${company} admin password.

Open this link within 1 hour to choose a new password:
${params.resetUrl}

If you did not request this, you can ignore this email.

— ${company}`;

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h1 style="color:#9f1239;font-size:22px">Reset your password</h1>
      <p>Hi ${escapeHtml(params.name)},</p>
      <p>We received a request to reset your ${escapeHtml(company)} admin password.</p>
      <p style="margin:28px 0">
        <a href="${escapeHtml(params.resetUrl)}"
           style="display:inline-block;background:#9f1239;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px">
          Choose a new password
        </a>
      </p>
      <p style="font-size:13px;color:#666">This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
      <p style="font-size:13px;color:#666;word-break:break-all">${escapeHtml(params.resetUrl)}</p>
    </div>
  `;

  return { subject, text, html };
}

export async function loginEmailReminderEmail(params: {
  name: string;
  loginEmail: string;
  loginUrl: string;
}) {
  const company = await getCompanyName();
  const subject = `Your ${company} admin login email`;
  const text = `Hi ${params.name},

You asked us to remind you of your ${company} admin login email.

Login email: ${params.loginEmail}
Sign in: ${params.loginUrl}

If you did not request this, you can ignore this email.

— ${company}`;

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h1 style="color:#9f1239;font-size:22px">Your login email</h1>
      <p>Hi ${escapeHtml(params.name)},</p>
      <p>You asked for a reminder of your ${escapeHtml(company)} admin login.</p>
      <p style="font-size:18px;margin:24px 0"><strong>${escapeHtml(params.loginEmail)}</strong></p>
      <p>
        <a href="${escapeHtml(params.loginUrl)}"
           style="display:inline-block;background:#9f1239;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px">
          Go to admin login
        </a>
      </p>
      <p style="font-size:13px;color:#666">If you did not request this, ignore this email.</p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
