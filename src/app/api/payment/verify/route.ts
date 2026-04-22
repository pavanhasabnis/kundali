import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { getTierByTag, computeExpiryISO } from "@/lib/pricing";
import { sendPurchaseReceipt } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payment = await db.query.payments.findFirst({
    where: eq(payments.razorpayOrderId, razorpay_order_id),
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  await db.update(payments).set({
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: "paid",
  }).where(eq(payments.id, payment.id));

  // Subscription tier payment → update users.plan + planExpiresAt + billingCycle.
  // Non-subscription (e.g. product:book) leaves user plan untouched.
  const tier = getTierByTag(payment.plan);

  if (tier) {
    const expiresAt = computeExpiryISO(tier);
    const creditWasApplied = (payment.discountAmount ?? 0) > 0;
    await db.update(users).set({
      plan: tier.plan,
      planExpiresAt: expiresAt,
      billingCycle: tier.cycle,
      // Clear trial once a real payment lands — user is now paying.
      trialEndsAt: null,
      // Burn the one-shot starter credit when it actually funded this order.
      ...(creditWasApplied ? { starterCreditApplied: true } : {}),
      updatedAt: new Date().toISOString(),
    }).where(eq(users.id, payment.userId));

    // Fire receipt email — non-blocking. Webhook is idempotent and may also
    // try to send; Resend dedupes on subject+to within a short window.
    const user = await db.query.users.findFirst({
      where: eq(users.id, payment.userId),
    });
    if (user) {
      sendPurchaseReceipt({
        to: user.email,
        name: user.name,
        planLabel: tier.description,
        amountRupees: tier.rupees,
        expiresAtISO: expiresAt,
        paymentId: razorpay_payment_id,
      }).catch((e) => console.error("receipt email failed", e));
    }
  }

  return NextResponse.json({
    success: true,
    plan: tier?.plan ?? payment.plan,
    cycle: tier?.cycle,
    subscription: Boolean(tier),
    paymentId: razorpay_payment_id,
  });
}
