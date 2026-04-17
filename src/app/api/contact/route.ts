import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactEnquiries } from "@/lib/db/schema";

// POST — submit contact form (public)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(contactEnquiries).values({
    id,
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  });

  return NextResponse.json({ success: true });
}
