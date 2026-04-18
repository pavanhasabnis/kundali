import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") || "").slice(0, 200);
  const lang = searchParams.get("lang") || "mr";
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });
    if (!r.ok) return NextResponse.json({ error: "upstream failed", status: r.status }, { status: 502 });
    const buf = await r.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
