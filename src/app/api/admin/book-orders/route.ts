import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, bookOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function isAdmin() {
  const s = await getSessionUser();
  if (!s?.email) return false;
  const u = await db.query.users.findFirst({ where: eq(users.email, s.email) });
  return u?.role === "admin";
}

// GET /api/admin/book-orders — list all orders with user info
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const orders = await db.query.bookOrders.findMany({
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  // Enrich with user name/email
  const userIds = Array.from(new Set(orders.map(o => o.userId)));
  const usersList = await Promise.all(
    userIds.map(id => db.query.users.findFirst({ where: eq(users.id, id) }))
  );
  const userMap = new Map<string, { name: string; email: string; plan: string | null }>();
  usersList.forEach(u => { if (u) userMap.set(u.id, { name: u.name, email: u.email, plan: u.plan ?? null }); });

  return NextResponse.json({
    orders: orders.map(o => ({
      ...o,
      user: userMap.get(o.userId) ?? null,
    })),
  });
}
