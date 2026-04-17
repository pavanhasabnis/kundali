import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, kundlis } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const allKundlis = await db.query.kundlis.findMany({
    orderBy: (k, { desc }) => [desc(k.createdAt)],
  });

  // Attach user names
  const allUsers = await db.query.users.findMany();
  const userMap = Object.fromEntries(allUsers.map((u) => [u.id, u.name]));

  const enriched = allKundlis.map((k) => ({
    ...k,
    userName: userMap[k.userId] || "Unknown",
    resultJson: undefined, // don't send heavy data
  }));

  return NextResponse.json({ kundlis: enriched });
}

export async function DELETE(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { ids } = await req.json();
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  await db.delete(kundlis).where(inArray(kundlis.id, ids));

  return NextResponse.json({ success: true, deleted: ids.length });
}
