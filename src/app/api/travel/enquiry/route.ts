import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { travelEnquiries } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email || !body.phone) {
    return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
  }

  const id = `te_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.insert(travelEnquiries).values({
    id,
    packageId: body.packageId || null,
    packageTitle: body.packageTitle || "",
    name: body.name,
    email: body.email,
    phone: body.phone,
    travelDate: body.travelDate || null,
    travelers: body.travelers ? Number(body.travelers) : 1,
    message: body.message || "",
  });

  return NextResponse.json({ success: true, id });
}
