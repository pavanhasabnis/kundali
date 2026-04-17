import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fal } from "@fal-ai/client";

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json({ error: "FAL_KEY not configured in .env.local" }, { status: 500 });
  }

  fal.config({ credentials: falKey });

  const { prompt } = await req.json();
  if (!prompt || prompt.trim().length < 5) {
    return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: `Professional travel photography, ${prompt}, beautiful landscape, high quality, 4K, vibrant colors, golden hour lighting`,
        image_size: "landscape_16_9",
        num_images: 1,
      },
    });

    const imageUrl = result.data?.images?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate image" }, { status: 500 });
  }
}
