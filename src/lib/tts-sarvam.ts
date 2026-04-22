/**
 * Sarvam AI Bulbul v2 TTS wrapper.
 * Marathi/Hindi storytelling voices — Advait (contemporary storyteller male).
 *
 * Docs: https://docs.sarvam.ai/api-reference-docs/text-to-speech
 */

export type SarvamSpeaker =
  | "advait"    // Male — contemporary storytelling (preferred for katha)
  | "aditya"    // Male — captivating stories/audiobooks
  | "ashutosh"  // Male — traditional Hindi narration
  | "roopa"     // Female — gentle audiobook
  | "tanya"     // Female — friendly modern
  | "abhilash"
  | "anushka"
  | "manisha"
  | "vidya"
  | "arya"
  | "karun"
  | "hitesh";

export type SarvamLang = "mr-IN" | "hi-IN" | "en-IN" | "bn-IN" | "gu-IN" | "kn-IN" | "ml-IN" | "od-IN" | "pa-IN" | "ta-IN" | "te-IN";

export interface SarvamOptions {
  text: string;
  language?: SarvamLang;      // default mr-IN
  speaker?: SarvamSpeaker;    // default from env (advait)
  pitch?: number;             // -0.75 to 0.75 (0 = natural)
  pace?: number;              // 0.5 to 2.0 (1.0 = normal, 1.25 = energetic)
  loudness?: number;          // 0.3 to 3.0 (1.0 = normal)
  sampleRate?: 8000 | 16000 | 22050 | 24000;
  model?: string;             // bulbul:v2
}

export interface SarvamResult {
  audioBase64: string;        // wav data
  durationSec: number;        // estimated from bytes
  bytes: number;
}

const SARVAM_ENDPOINT = "https://api.sarvam.ai/text-to-speech";

export async function sarvamTTS(opts: SarvamOptions): Promise<SarvamResult> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error("SARVAM_API_KEY not set");

  const model = opts.model ?? process.env.SARVAM_MODEL ?? "bulbul:v3";
  const isV3 = model.startsWith("bulbul:v3");

  const body: Record<string, unknown> = {
    inputs: [opts.text],
    target_language_code: opts.language ?? "mr-IN",
    speaker: opts.speaker ?? (process.env.SARVAM_VOICE as SarvamSpeaker) ?? "advait",
    pace: opts.pace ?? 1.0,
    speech_sample_rate: opts.sampleRate ?? 22050,
    enable_preprocessing: true,
    model,
  };
  // Bulbul v3 doesn't accept pitch/loudness; v2 does.
  if (!isV3) {
    body.pitch = opts.pitch ?? 0;
    body.loudness = opts.loudness ?? 1.2;
  }

  const r = await fetch(SARVAM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Sarvam TTS ${r.status}: ${txt.slice(0, 300)}`);
  }

  const json = await r.json() as { audios?: string[] };
  const b64 = json.audios?.[0];
  if (!b64) throw new Error(`Sarvam TTS: no audio in response — ${JSON.stringify(json).slice(0, 200)}`);

  // Rough duration estimate from base64 length (WAV 22050Hz mono 16-bit)
  const bytes = Math.floor(b64.length * 3 / 4);
  const durationSec = Math.max(0.5, (bytes - 44) / (22050 * 2));

  return { audioBase64: b64, durationSec, bytes };
}

/** Save base64 WAV to file. */
export async function saveSarvamAudio(b64: string, filePath: string): Promise<void> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(b64, "base64"));
}
