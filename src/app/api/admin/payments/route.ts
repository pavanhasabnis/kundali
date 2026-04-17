import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const allPayments = await db.query.payments.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  // Attach user emails
  const allUsers = await db.query.users.findMany();
  const userMap = Object.fromEntries(allUsers.map((u) => [u.id, { name: u.name, email: u.email }]));

  const enriched = allPayments.map((p) => ({
    ...p,
    userName: userMap[p.userId]?.name || "Unknown",
    userEmail: userMap[p.userId]?.email || "",
  }));

  return NextResponse.json({ payments: enriched });
}
