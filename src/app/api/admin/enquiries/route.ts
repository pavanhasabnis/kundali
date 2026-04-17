import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, contactEnquiries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

// GET — list all enquiries
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const all = await db.query.contactEnquiries.findMany({
    orderBy: (e, { desc }) => [desc(e.createdAt)],
  });

  return NextResponse.json({ enquiries: all });
}

// PATCH — mark as read/replied
export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status } = await req.json();
  if (!id || !["read", "replied", "unread"].includes(status)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  await db.update(contactEnquiries).set({ status }).where(eq(contactEnquiries.id, id));
  return NextResponse.json({ success: true });
}

// DELETE — delete enquiry
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db.delete(contactEnquiries).where(eq(contactEnquiries.id, id));
  return NextResponse.json({ success: true });
}
