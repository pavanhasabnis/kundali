import { NextRequest, NextResponse } from "next/server";
import { getAllSangrahItems } from "@/lib/sangrah-reader";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || undefined;
  const items = getAllSangrahItems(category);
  return NextResponse.json(items);
}
