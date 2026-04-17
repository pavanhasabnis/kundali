import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/user — return current logged-in user's profile
export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, sessionUser.email),
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH /api/user — update profile fields
export async function PATCH(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updates: Partial<typeof users.$inferInsert> = {};

  if (body.name !== undefined) updates.name = body.name;
  if (body.phone !== undefined) updates.phone = body.phone;
  if (body.dateOfBirth !== undefined) updates.dateOfBirth = body.dateOfBirth;
  if (body.birthTime !== undefined) updates.birthTime = body.birthTime;
  if (body.birthPlace !== undefined) updates.birthPlace = body.birthPlace;
  if (body.language !== undefined) updates.language = body.language;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  updates.updatedAt = new Date().toISOString();

  await db.update(users).set(updates).where(eq(users.email, sessionUser.email));

  return NextResponse.json({ success: true });
}
