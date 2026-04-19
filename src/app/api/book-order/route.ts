import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, kundlis, bookOrders } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getBookPriceForUser } from "@/lib/book-pricing";

// GET /api/book-order — list current user's orders
export async function GET() {
  const session = await getSessionUser();
  if (!session?.email) return NextResponse.json({ orders: [] }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.email, session.email) });
  if (!user) return NextResponse.json({ orders: [] }, { status: 404 });

  const orders = await db.query.bookOrders.findMany({
    where: eq(bookOrders.userId, user.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  // Has user already claimed this year (for Plus free allotment)?
  const yearStart = `${new Date().getUTCFullYear()}-01-01T00:00:00.000Z`;
  const freeClaimsThisYear = orders.filter(
    o => o.amountPaid === 0 && o.planAtOrder === "plus" && o.createdAt >= yearStart && o.status !== "cancelled"
  ).length;

  return NextResponse.json({
    orders,
    plan: user.plan,
    freeClaimsThisYear,
    freeClaimAvailable: user.plan === "plus" && freeClaimsThisYear === 0,
  });
}

// POST /api/book-order — create new order
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.email, session.email) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const {
    kundliId, recipientName, addressLine1, addressLine2, city, state, pin, phone,
    razorpayPaymentId,
  } = body;

  if (!kundliId || !recipientName || !addressLine1 || !city || !state || !pin || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!/^[1-9]\d{5}$/.test(pin)) {
    return NextResponse.json({ error: "Invalid PIN code" }, { status: 400 });
  }

  // Verify kundli belongs to user
  const kundli = await db.query.kundlis.findFirst({
    where: and(eq(kundlis.id, kundliId), eq(kundlis.userId, user.id)),
  });
  if (!kundli) return NextResponse.json({ error: "Kundli not found" }, { status: 404 });

  const plan = user.plan ?? "free";
  const { amount: amountPaid } = await getBookPriceForUser(user.id, plan);

  // Non-free orders must include razorpayPaymentId
  if (amountPaid > 0 && !razorpayPaymentId) {
    return NextResponse.json({ error: "Payment required for this plan" }, { status: 402 });
  }

  const orderId = crypto.randomUUID();
  await db.insert(bookOrders).values({
    id: orderId,
    userId: user.id,
    kundliId: kundli.id,
    kundliName: kundli.name,
    recipientName,
    addressLine1,
    addressLine2: addressLine2 ?? null,
    city,
    state,
    pin,
    phone,
    planAtOrder: plan,
    amountPaid,
    razorpayPaymentId: razorpayPaymentId ?? null,
    status: "pending",
  });

  return NextResponse.json({ success: true, orderId, amountPaid, status: "pending" });
}
