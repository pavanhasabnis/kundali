import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) {
    return NextResponse.json({ authorized: false });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, sessionUser.email),
  });

  return NextResponse.json({ authorized: user?.role === "admin" });
}
