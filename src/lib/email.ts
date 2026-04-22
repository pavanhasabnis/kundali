/**
 * Transactional email client. All outbound transactional mail goes through
 * Resend. We export one function per mail type so callers don't have to think
 * about templating.
 *
 * Config:
 *   RESEND_API_KEY        — required
 *   EMAIL_FROM            — defaults to "Bhaagyavedh <noreply@bhaagyavedh.com>"
 *   EMAIL_REPLY_TO        — optional; defaults to info@bhaagyavedh.com
 *
 * Dev behaviour: if RESEND_API_KEY is missing, we log the payload instead of
 * sending so local checkouts don't 500. This also lets the rest of the app
 * come up without email creds.
 */

import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "Bhaagyavedh <noreply@bhaagyavedh.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "info@bhaagyavedh.com";

const resend = API_KEY ? new Resend(API_KEY) : null;

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  if (!resend) {
    console.log(`[email:dry-run] to=${opts.to} subject=${opts.subject}`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      replyTo: REPLY_TO,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
  } catch (err) {
    console.error("email send failed", err);
  }
}

/* ─── Templates ──────────────────────────────────────────────── */

function wrap(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#faf7ee;font-family:Georgia,serif;color:#3d0c0c;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;padding:16px 0 24px;">
      <span style="font-size:28px;font-weight:700;color:#d4a843;letter-spacing:1px;">भाग्यवेध</span>
    </div>
    <div style="background:#ffffff;border:1px solid #e5d5b5;border-radius:12px;padding:32px 28px;">
      ${body}
    </div>
    <p style="font-size:12px;color:#8c6a1d;text-align:center;margin-top:24px;">
      © Bhaagyavedh · Kothrud, Pune · info@bhaagyavedh.com
    </p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── Purchase receipt ───────────────────────────────────────── */

export async function sendPurchaseReceipt(opts: {
  to: string;
  name: string;
  planLabel: string;
  amountRupees: number;
  expiresAtISO: string;
  paymentId: string;
}): Promise<void> {
  const expiry = new Date(opts.expiresAtISO).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const subject = `Payment received — ${opts.planLabel}`;
  const body = `
    <h1 style="font-size:20px;margin:0 0 12px;color:#3d0c0c;">नमस्कार ${escapeHtml(opts.name)},</h1>
    <p style="font-size:15px;line-height:1.6;color:#5c1a1a;">
      Your payment of <strong>₹${opts.amountRupees.toLocaleString("en-IN")}</strong>
      for <strong>${escapeHtml(opts.planLabel)}</strong> was successfully received.
    </p>
    <div style="background:#faf7ee;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#8c6a1d;text-transform:uppercase;letter-spacing:1px;">Valid through</p>
      <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#3d0c0c;">${expiry}</p>
    </div>
    <p style="font-size:13px;color:#8c6a1d;margin:16px 0;">Payment ID: ${escapeHtml(opts.paymentId)}</p>
    <p style="font-size:15px;line-height:1.6;color:#5c1a1a;">
      Access your plan here:
      <a href="https://bhaagyavedh.com/mr/account" style="color:#d4a843;font-weight:600;">My Account</a>
    </p>
    <p style="font-size:14px;color:#8c6a1d;margin-top:20px;">
      धन्यवाद,<br/>भाग्यवेध टीम
    </p>
  `;
  const text = `
Payment received — ${opts.planLabel}

Hi ${opts.name},

Your payment of ₹${opts.amountRupees} for ${opts.planLabel} was successful.
Valid through: ${expiry}
Payment ID: ${opts.paymentId}

Account: https://bhaagyavedh.com/mr/account

Thanks,
Bhaagyavedh
  `.trim();
  await send({ to: opts.to, subject, html: wrap(subject, body), text });
}

/* ─── Expiry 3-day warning ────────────────────────────────── */

export async function sendExpiryWarning(opts: {
  to: string;
  name: string;
  planLabel: string;
  expiresAtISO: string;
  daysLeft: number;
}): Promise<void> {
  const expiry = new Date(opts.expiresAtISO).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const subject = `Your ${opts.planLabel} expires in ${opts.daysLeft} day${opts.daysLeft === 1 ? "" : "s"}`;
  const body = `
    <h1 style="font-size:20px;margin:0 0 12px;color:#3d0c0c;">नमस्कार ${escapeHtml(opts.name)},</h1>
    <p style="font-size:15px;line-height:1.6;color:#5c1a1a;">
      Your <strong>${escapeHtml(opts.planLabel)}</strong> subscription expires on
      <strong>${expiry}</strong> (${opts.daysLeft} day${opts.daysLeft === 1 ? "" : "s"} left).
    </p>
    <p style="font-size:15px;line-height:1.6;color:#5c1a1a;">
      Renew now to keep unlimited kundlis, yearly forecast, panchang alerts, and the printed calendar delivery active.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://bhaagyavedh.com/mr/pricing" style="display:inline-block;background:linear-gradient(135deg,#d4a843,#e5bc5a);color:#3d0c0c;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">
        Renew now
      </a>
    </div>
    <p style="font-size:13px;color:#8c6a1d;margin-top:20px;">
      If you do nothing, your account will downgrade to the free tier (1 kundli/day). Existing kundli PDFs remain yours forever.
    </p>
  `;
  const text = `
Your ${opts.planLabel} expires in ${opts.daysLeft} day(s) on ${expiry}.

Renew: https://bhaagyavedh.com/mr/pricing

Otherwise, account downgrades to free (1 kundli/day). Existing kundli PDFs stay yours.
  `.trim();
  await send({ to: opts.to, subject, html: wrap(subject, body), text });
}

/* ─── Expired / downgraded notice ─────────────────────────── */

export async function sendExpiryDowngrade(opts: {
  to: string;
  name: string;
  planLabel: string;
}): Promise<void> {
  const subject = `Your ${opts.planLabel} has expired`;
  const body = `
    <h1 style="font-size:20px;margin:0 0 12px;color:#3d0c0c;">नमस्कार ${escapeHtml(opts.name)},</h1>
    <p style="font-size:15px;line-height:1.6;color:#5c1a1a;">
      Your <strong>${escapeHtml(opts.planLabel)}</strong> subscription has expired. Your account is now on the free tier — you can still generate 1 kundli per day.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#5c1a1a;">
      All your saved kundli PDFs remain available in your account.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://bhaagyavedh.com/mr/pricing" style="display:inline-block;background:linear-gradient(135deg,#d4a843,#e5bc5a);color:#3d0c0c;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">
        Renew subscription
      </a>
    </div>
  `;
  const text = `
Your ${opts.planLabel} subscription has expired. Account now on free tier (1 kundli/day).
Saved kundli PDFs remain in your account.

Renew: https://bhaagyavedh.com/mr/pricing
  `.trim();
  await send({ to: opts.to, subject, html: wrap(subject, body), text });
}
