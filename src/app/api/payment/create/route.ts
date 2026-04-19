import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";
import { getBookPriceForUser } from "@/lib/book-pricing";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS: Record<string, { amount: number; description: string }> = {
  premium: { amount: 59900, description: "Premium Monthly - ₹599" },
  plus:    { amount: 149900, description: "Premium Plus Monthly - ₹1499" },
};

// One-time products. Book pricing computed via getBookPriceForUser (checks Plus free-claim usage).
const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  book: "Bound Kundli Book",
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

  const body = await req.json();
  const { plan, product } = body;

  let amount: number;
  let description: string;
  let tag: string;

  if (product) {
    const desc = PRODUCT_DESCRIPTIONS[product];
    if (!desc) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    if (product === "book") {
      const price = await getBookPriceForUser(user.id, user.plan);
      if (price.amount === 0) return NextResponse.json({ error: "Product is free for your plan — use claim flow" }, { status: 400 });
      amount = price.amount;
    } else {
      return NextResponse.json({ error: "Unsupported product" }, { status: 400 });
    }
    description = desc;
    tag = `product:${product}`;
  } else {
    const planConfig = PLANS[plan];
    if (!planConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    amount = planConfig.amount;
    description = planConfig.description;
    tag = plan;
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: { userId: user.id, tag },
  });

  // Save payment record (plan col stores tag; covers subscription + product)
  const paymentId = crypto.randomUUID();
  await db.insert(payments).values({
    id: paymentId,
    userId: user.id,
    razorpayOrderId: order.id,
    amount,
    plan: tag,
    status: "created",
  });

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    description,
  });
}
