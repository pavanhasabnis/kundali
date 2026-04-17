import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { kundlis, users } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

const FREE_KUNDLI_LIMIT = 1;

// GET /api/user/kundlis — list saved kundlis
export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, sessionUser.email),
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const savedKundlis = await db.query.kundlis.findMany({
    where: eq(kundlis.userId, user.id),
    orderBy: (k, { desc }) => [desc(k.createdAt)],
  });

  return NextResponse.json({ kundlis: savedKundlis });
}

// POST /api/user/kundlis — save a new kundli
export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, sessionUser.email),
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check kundli limit for free plan
  const kundliCount = await db.select({ value: count() }).from(kundlis).where(eq(kundlis.userId, user.id));
  const currentCount = kundliCount[0]?.value || 0;

  if (user.role !== "admin" && user.plan === "free" && currentCount >= FREE_KUNDLI_LIMIT) {
    return NextResponse.json(
      { error: "Free plan limit reached. Upgrade to premium for unlimited kundlis.", limitReached: true },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, dateOfBirth, birthTime, birthPlace, latitude, longitude, resultJson } = body;

  if (!name || !dateOfBirth || !birthTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(kundlis).values({
    id,
    userId: user.id,
    name,
    dateOfBirth,
    birthTime,
    birthPlace,
    latitude,
    longitude,
    resultJson: resultJson ? JSON.stringify(resultJson) : null,
  });

  return NextResponse.json({ id, success: true });
}
