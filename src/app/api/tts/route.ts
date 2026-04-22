/**
 * Text-to-speech proxy.
 *
 * Primary: ElevenLabs Multilingual v2 — handles Marathi via the shared
 * multilingual model. Voice ID is per-workspace and set via env. Emits a
 * broadcast-quality MP3 at 44.1 kHz 128 kbps.
 *
 * Fallback: unofficial Google Translate TTS (dev/local use when ElevenLabs
 * creds are missing or the API is throttled).
 *
 * Caching: HTTP Cache-Control 1h so the browser doesn't re-fetch the same
 * scene text. Production cron pre-generates daily reels and stores the MP3
 * in S3; this endpoint stays on-demand for the live preview toggle.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EL_KEY = process.env.ELEVENLABS_API_KEY;
const EL_VOICE = process.env.ELEVENLABS_VOICE_ID;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") || "").slice(0, 1500);
  const langParam = (searchParams.get("lang") || "mr").toLowerCase();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  if (EL_KEY && EL_VOICE) {
    const out = await synthesizeElevenLabs(text);
    if (out) return out;
    // Fall through to Google on any ElevenLabs error so the UI keeps working.
  }

  return synthesizeGoogleFallback(text, langParam);
}

async function synthesizeElevenLabs(text: string): Promise<Response | null> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`;
  const body = {
    text,
    // eleven_multilingual_v2 renders Marathi/Hindi naturally. eleven_turbo_v2_5
    // is faster but loses some expressiveness — keep v2 for production quality.
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.45,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  };
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": EL_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const err = await r.text();
      console.error("elevenlabs tts failed", r.status, err.slice(0, 300));
      return null;
    }
    const buf = await r.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
        "X-TTS-Provider": "elevenlabs",
      },
    });
  } catch (e) {
    console.error("elevenlabs tts threw", e);
    return null;
  }
}

async function synthesizeGoogleFallback(text: string, lang: string): Promise<NextResponse> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.slice(0, 200))}&tl=${lang}&client=tw-ob`;
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
        "X-TTS-Provider": "google-fallback",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
