import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, travelPackages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

// GET — list all packages
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const packages = await db.select().from(travelPackages).orderBy(travelPackages.createdAt);
  return NextResponse.json({ packages });
}

// POST — create package
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const id = `tp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.insert(travelPackages).values({
    id,
    titleMr: body.titleMr || "",
    titleEn: body.titleEn || "",
    descriptionMr: body.descriptionMr || "",
    descriptionEn: body.descriptionEn || "",
    category: body.category || "custom",
    duration: body.duration || "",
    priceFrom: body.priceFrom ? Number(body.priceFrom) : null,
    priceTo: body.priceTo ? Number(body.priceTo) : null,
    inclusions: body.inclusions || "[]",
    itineraryMr: body.itineraryMr || "",
    itineraryEn: body.itineraryEn || "",
    highlights: body.highlights || "[]",
    imageUrl: body.imageUrl || "",
    locationMr: body.locationMr || "",
    locationEn: body.locationEn || "",
    active: body.active !== false,
    featured: body.featured === true,
  });
  return NextResponse.json({ success: true, id });
}

// PUT — update package
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.update(travelPackages).set({
    titleMr: body.titleMr,
    titleEn: body.titleEn,
    descriptionMr: body.descriptionMr,
    descriptionEn: body.descriptionEn,
    category: body.category,
    duration: body.duration,
    priceFrom: body.priceFrom ? Number(body.priceFrom) : null,
    priceTo: body.priceTo ? Number(body.priceTo) : null,
    inclusions: body.inclusions,
    itineraryMr: body.itineraryMr,
    itineraryEn: body.itineraryEn,
    highlights: body.highlights,
    imageUrl: body.imageUrl,
    locationMr: body.locationMr,
    locationEn: body.locationEn,
    active: body.active,
    featured: body.featured,
    updatedAt: new Date().toISOString(),
  }).where(eq(travelPackages.id, body.id));
  return NextResponse.json({ success: true });
}

// DELETE — remove package
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(travelPackages).where(eq(travelPackages.id, id));
  return NextResponse.json({ success: true });
}
