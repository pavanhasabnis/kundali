import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// DEV ONLY — creates a test user and returns a session cookie
// Remove this route before production deployment
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { role } = await req.json().catch(() => ({ role: "user" }));
  const isAdmin = role === "admin";

  const email = isAdmin ? "admin@bhaagyavedh.dev" : "user@bhaagyavedh.dev";
  const name = isAdmin ? "Admin Dev" : "Test User";

  // Upsert test user
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  let userId: string;
  if (existing) {
    userId = existing.id;
    await db.update(users).set({ role: isAdmin ? "admin" : "user", updatedAt: new Date().toISOString() }).where(eq(users.id, existing.id));
  } else {
    userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      name,
      email,
      role: isAdmin ? "admin" : "user",
      plan: isAdmin ? "premium" : "free",
      provider: "dev",
    });
  }

  // Set a simple dev session cookie
  const response = NextResponse.json({ success: true, userId, email, role: isAdmin ? "admin" : "user" });
  response.cookies.set("dev-session", JSON.stringify({ id: userId, email, name, role: isAdmin ? "admin" : "user", plan: isAdmin ? "premium" : "free" }), {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
