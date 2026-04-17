import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, travelEnquiries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

// GET — list all travel enquiries
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const enquiries = await db.select().from(travelEnquiries).orderBy(travelEnquiries.createdAt);
  return NextResponse.json({ enquiries: enquiries.reverse() });
}

// PATCH — update status
export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await db.update(travelEnquiries).set({ status }).where(eq(travelEnquiries.id, id));
  return NextResponse.json({ success: true });
}

// DELETE
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(travelEnquiries).where(eq(travelEnquiries.id, id));
  return NextResponse.json({ success: true });
}
