import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { travelPackages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET — public listing of active packages, optionally filtered by category
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const where = category
    ? and(eq(travelPackages.active, true), eq(travelPackages.category, category))
    : eq(travelPackages.active, true);
  const packages = await db.select().from(travelPackages).where(where).orderBy(travelPackages.createdAt);
  return NextResponse.json({ packages });
}
