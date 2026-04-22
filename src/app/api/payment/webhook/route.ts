/**
 * Razorpay webhook receiver. Server-to-server event delivery — authoritative
 * fallback to the browser-driven /verify handler.
 *
 * Why we need this when /verify already updates DB:
 *   - User closes tab between payment and verify → DB stays in "created".
 *   - Network failure during /verify POST → payment captured upstream, DB
 *     reflects it eventually only via webhook.
 *   - Refunds + disputes arrive only as webhooks.
 *
 * Idempotency: we key on payment record (razorpay_order_id) and skip if already
 * status=paid. Running /verify then webhook (or vice-versa) is safe.
 *
 * Setup (Razorpay dashboard → Settings → Webhooks):
 *   URL:    https://bhaagyavedh.com/api/payment/webhook
 *   Events: payment.captured, payment.failed, refund.processed
 *   Secret: RAZORPAY_WEBHOOK_SECRET (env)
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getTierByTag, computeExpiryISO } from "@/lib/pricing";
import { sendPurchaseReceipt } from "@/lib/email";

interface WebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        method?: string;
        email?: string;
        contact?: string;
        notes?: Record<string, string>;
      };
    };
    refund?: {
      entity: {
        id: string;
        payment_id: string;
        amount: number;
        status: string;
      };
    };
  };
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("webhook: RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // HMAC-SHA256 over the raw request body with the shared secret. If this
  // mismatches, either someone is spoofing or the secret is out of sync —
  // either way we refuse the event.
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    console.warn("webhook: signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let evt: WebhookEvent;
  try {
    evt = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    if (evt.event === "payment.captured" && evt.payload.payment) {
      await handlePaymentCaptured(evt.payload.payment.entity);
    } else if (evt.event === "payment.failed" && evt.payload.payment) {
      await handlePaymentFailed(evt.payload.payment.entity);
    } else if (evt.event === "refund.processed" && evt.payload.refund) {
      await handleRefund(evt.payload.refund.entity);
    }
  } catch (err) {
    console.error("webhook: handler error", err);
    // 500 tells Razorpay to retry. Only do this for transient errors —
    // logical errors (bad data) should 2xx and be logged.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentCaptured(
  p: NonNullable<WebhookEvent["payload"]["payment"]>["entity"],
) {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.razorpayOrderId, p.order_id),
  });
  if (!payment) {
    console.warn("webhook: no payment row for order", p.order_id);
    return;
  }
  // Idempotency — /verify may have already processed.
  if (payment.status === "paid") return;

  await db.update(payments).set({
    razorpayPaymentId: p.id,
    status: "paid",
  }).where(eq(payments.id, payment.id));

  const tier = getTierByTag(payment.plan);
  if (!tier) return; // product:book or unknown tag — no user plan change

  const user = await db.query.users.findFirst({
    where: eq(users.id, payment.userId),
  });
  if (!user) return;

  const creditWasApplied = (payment.discountAmount ?? 0) > 0;
  await db.update(users).set({
    plan: tier.plan,
    planExpiresAt: computeExpiryISO(tier),
    billingCycle: tier.cycle,
    trialEndsAt: null,
    ...(creditWasApplied ? { starterCreditApplied: true } : {}),
    updatedAt: new Date().toISOString(),
  }).where(eq(users.id, user.id));

  // Fire-and-forget receipt email. Failures logged but don't block webhook ack.
  sendPurchaseReceipt({
    to: user.email,
    name: user.name,
    planLabel: tier.description,
    amountRupees: tier.rupees,
    expiresAtISO: computeExpiryISO(tier),
    paymentId: p.id,
  }).catch((e) => console.error("receipt email failed", e));
}

async function handlePaymentFailed(
  p: NonNullable<WebhookEvent["payload"]["payment"]>["entity"],
) {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.razorpayOrderId, p.order_id),
  });
  if (!payment) return;
  if (payment.status === "paid") return; // already captured elsewhere — ignore

  await db.update(payments).set({
    razorpayPaymentId: p.id,
    status: "failed",
  }).where(eq(payments.id, payment.id));
}

async function handleRefund(
  r: NonNullable<WebhookEvent["payload"]["refund"]>["entity"],
) {
  // Find payment by razorpay_payment_id (not order_id)
  const payment = await db.query.payments.findFirst({
    where: eq(payments.razorpayPaymentId, r.payment_id),
  });
  if (!payment) return;

  await db.update(payments).set({
    status: "refunded",
  }).where(eq(payments.id, payment.id));

  // Downgrade user if they had an active subscription tied to this payment.
  const tier = getTierByTag(payment.plan);
  if (tier) {
    await db.update(users).set({
      plan: "free",
      planExpiresAt: null,
      billingCycle: null,
      updatedAt: new Date().toISOString(),
    }).where(eq(users.id, payment.userId));
  }
}
