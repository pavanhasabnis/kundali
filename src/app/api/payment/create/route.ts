import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";
import { getBookPriceForUser } from "@/lib/book-pricing";
import { getTier, type BillingCycle, type Plan } from "@/lib/pricing";

type PaidPlan = Exclude<Plan, "free">;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  book: "Bound Kundli Book",
};

const VALID_PLANS: PaidPlan[] = ["starter", "premium", "plus", "family"];

function isPaidPlan(v: unknown): v is PaidPlan {
  return typeof v === "string" && (VALID_PLANS as string[]).includes(v);
}
const VALID_CYCLES: BillingCycle[] = ["monthly", "yearly", "onetime"];

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
  const { plan, cycle, product } = body as {
    plan?: Plan;
    cycle?: BillingCycle;
    product?: string;
  };

  let amount: number;
  let description: string;
  let tag: string;

  if (product) {
    const desc = PRODUCT_DESCRIPTIONS[product];
    if (!desc) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    if (product === "book") {
      const price = await getBookPriceForUser(user.id, user.plan);
      if (price.amount === 0) {
        return NextResponse.json(
          { error: "Product is free for your plan — use claim flow" },
          { status: 400 },
        );
      }
      amount = price.amount;
    } else {
      return NextResponse.json({ error: "Unsupported product" }, { status: 400 });
    }
    description = desc;
    tag = `product:${product}`;
  } else {
    if (!isPaidPlan(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    // Default cycle: starter is onetime, others default to monthly.
    const resolvedCycle: BillingCycle =
      cycle && VALID_CYCLES.includes(cycle)
        ? cycle
        : plan === "starter"
          ? "onetime"
          : "monthly";

    // Starter is always onetime — reject incompatible combos.
    if (plan === "starter" && resolvedCycle !== "onetime") {
      return NextResponse.json(
        { error: "Starter plan is one-time only" },
        { status: 400 },
      );
    }
    if (plan !== "starter" && resolvedCycle === "onetime") {
      return NextResponse.json(
        { error: `${plan} plan requires monthly or yearly cycle` },
        { status: 400 },
      );
    }

    const tier = getTier(plan, resolvedCycle);
    if (!tier) {
      return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
    }
    amount = tier.amount;
    description = tier.description;
    tag = tier.tag;
  }

  /* ─── Starter ₹99 credit ─────────────────────────────────────
   * Fulfils the "₹99 credited on upgrade" promise on /pricing.
   *
   * Eligible when all four are true:
   *  - current order is for a paid subscription (premium/plus, not starter/product)
   *  - user is currently on the starter plan
   *  - starter pass is still active (planExpiresAt in the future)
   *  - credit has never been applied before (one-shot flag)
   *
   * The deduction persists in payments.discountAmount so verify/webhook
   * can flip starterCreditApplied=1 exactly when the charge succeeds. */
  const STARTER_CREDIT_PAISE = 9900;
  let discount = 0;
  if (
    !product &&
    (tag === "premium" || tag === "premium_yearly" || tag === "plus" || tag === "plus_yearly") &&
    user.plan === "starter" &&
    !user.starterCreditApplied &&
    user.planExpiresAt &&
    new Date(user.planExpiresAt).getTime() > Date.now()
  ) {
    discount = Math.min(STARTER_CREDIT_PAISE, amount - 100); // never charge below ₹1
    amount = amount - discount;
    description = `${description} (₹99 Starter credit applied)`;
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: { userId: user.id, tag, discount: String(discount) },
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
    discountAmount: discount,
  });

  return NextResponse.json({
    orderId: order.id,
    amount,
    discount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    description,
    tag,
  });
}
