import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

// GET — get all settings (public for banner; admin for all)
export async function GET() {
  const all = await db.query.siteSettings.findMany();
  const map = Object.fromEntries(all.map((s) => [s.key, s.value]));
  return NextResponse.json({ settings: map });
}

// POST — upsert settings (admin only)
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { settings } = await req.json() as { settings: Record<string, string> };

  for (const [key, value] of Object.entries(settings)) {
    const existing = await db.query.siteSettings.findFirst({ where: eq(siteSettings.key, key) });
    if (existing) {
      await db.update(siteSettings).set({ value, updatedAt: new Date().toISOString() }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }
  }

  return NextResponse.json({ success: true });
}
