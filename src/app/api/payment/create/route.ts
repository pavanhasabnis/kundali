import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS: Record<string, { amount: number; description: string }> = {
  premium: { amount: 19900, description: "Premium Monthly - ₹199" },
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { plan } = await req.json();
  const planConfig = PLANS[plan];
  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: planConfig.amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: { userId: user.id, plan },
  });

  // Save payment record
  const paymentId = crypto.randomUUID();
  await db.insert(payments).values({
    id: paymentId,
    userId: user.id,
    razorpayOrderId: order.id,
    amount: planConfig.amount,
    plan,
    status: "created",
  });

  return NextResponse.json({
    orderId: order.id,
    amount: planConfig.amount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
