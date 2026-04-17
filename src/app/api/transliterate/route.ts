import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text") || "";
  if (!text.trim()) return NextResponse.json({ result: "" });

  try {
    // Split into words and transliterate each separately
    const words = text.trim().split(/\s+/);
    const results: string[] = [];

    for (const word of words) {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=mr-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`;
      const res = await fetch(url);
      const data = await res.json();

      if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]?.[0]) {
        results.push(data[1][0][1][0]);
      } else {
        results.push(word);
      }
    }

    return NextResponse.json({ result: results.join(" ") });
  } catch {
    return NextResponse.json({ result: text });
  }
}
