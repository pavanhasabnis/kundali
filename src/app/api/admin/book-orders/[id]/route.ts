import { NextRequest, NextResponse } from "next/server";
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

const ALLOWED_STATUS = ["pending", "printing", "shipped", "delivered", "cancelled"];

// PATCH — update order status, tracking, notes
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, string | null> = {};

  if (body.status && ALLOWED_STATUS.includes(body.status)) {
    updates.status = body.status;
    if (body.status === "shipped" && !body.shippedAt) updates.shippedAt = new Date().toISOString();
    if (body.status === "delivered" && !body.deliveredAt) updates.deliveredAt = new Date().toISOString();
  }
  if (typeof body.trackingNumber === "string") updates.trackingNumber = body.trackingNumber;
  if (typeof body.courier === "string") updates.courier = body.courier;
  if (typeof body.adminNotes === "string") updates.adminNotes = body.adminNotes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  updates.updatedAt = new Date().toISOString();
  await db.update(bookOrders).set(updates).where(eq(bookOrders.id, id));

  return NextResponse.json({ success: true });
}
