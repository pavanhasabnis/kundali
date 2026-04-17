import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, kundlis, payments } from "@/lib/db/schema";
import { eq, count, sum } from "drizzle-orm";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, sessionUser.email),
  });
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsersResult] = await db.select({ count: count() }).from(users);
  const [premiumResult] = await db.select({ count: count() }).from(users).where(eq(users.plan, "premium"));
  const [kundlisResult] = await db.select({ count: count() }).from(kundlis);
  const [revenueResult] = await db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, "paid"));

  return NextResponse.json({
    totalUsers: totalUsersResult.count,
    premiumUsers: premiumResult.count,
    totalKundlis: kundlisResult.count,
    totalPayments: 0,
    revenue: Number(revenueResult.total) || 0,
  });
}
