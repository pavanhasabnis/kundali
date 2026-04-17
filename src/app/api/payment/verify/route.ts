import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Update payment record
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

  // Update user plan
  const planUpdates: Record<string, unknown> = {
    plan: payment.plan,
    updatedAt: new Date().toISOString(),
  };

  if (payment.plan === "premium") {
    // Set expiry 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    planUpdates.planExpiresAt = expiry.toISOString();
  }

  await db.update(users).set(planUpdates).where(eq(users.id, payment.userId));

  return NextResponse.json({ success: true, plan: payment.plan });
}
