import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, kundlis, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

// PATCH — update user role or plan
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, string> = {};

  if (body.role && ["user", "admin"].includes(body.role)) updates.role = body.role;
  if (body.plan && ["free", "premium", "one_time"].includes(body.plan)) updates.plan = body.plan;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  updates.updatedAt = new Date().toISOString();
  await db.update(users).set(updates).where(eq(users.id, id));

  return NextResponse.json({ success: true });
}

// DELETE — delete user and their data
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  // Delete related records first
  await db.delete(kundlis).where(eq(kundlis.userId, id));
  await db.delete(payments).where(eq(payments.userId, id));
  await db.delete(users).where(eq(users.id, id));

  return NextResponse.json({ success: true });
}
