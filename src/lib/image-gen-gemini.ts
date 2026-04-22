/**
 * Google Gemini / Imagen image generation wrapper.
 *
 * Tries two paths in order:
 *   1. Imagen 4 / 3 via Google AI Studio REST (best quality for illustrations).
 *   2. Gemini 2.5 Flash native image gen (fallback if Imagen unavailable).
 *
 * Env: GEMINI_API_KEY
 */

export interface GenImageOptions {
  prompt: string;
  aspectRatio?: "1:1" | "9:16" | "16:9" | "3:4" | "4:3";
  model?: string;                // override default
  negativePrompt?: string;
  sampleCount?: number;          // default 1
}

export interface GenImageResult {
  bytes: Buffer;
  mimeType: string;
  model: string;                 // which model actually produced it
}

const IMAGEN_MODELS = [
  "imagen-4.0-generate-preview-06-06",
  "imagen-4.0-generate-001",
  "imagen-3.0-generate-002",
];

const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
  "gemini-2.0-flash-exp-image-generation",
];

export async function generateImage(opts: GenImageOptions): Promise<GenImageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const aspect = opts.aspectRatio ?? "9:16";
  const errors: string[] = [];

  // ── Path 1: Imagen REST (best for illustration) ─────────────────────
  const modelsToTry = opts.model ? [opts.model] : IMAGEN_MODELS;
  for (const model of modelsToTry) {
    try {
      const res = await tryImagen(apiKey, model, opts.prompt, aspect, opts.negativePrompt, opts.sampleCount ?? 1);
      if (res) return { ...res, model };
    } catch (e) {
      errors.push(`${model}: ${(e as Error).message.slice(0, 150)}`);
    }
  }

  // ── Path 2: Gemini native image gen ────────────────────────────────
  for (const model of GEMINI_IMAGE_MODELS) {
    try {
      const res = await tryGeminiImage(apiKey, model, opts.prompt);
      if (res) return { ...res, model };
    } catch (e) {
      errors.push(`${model}: ${(e as Error).message.slice(0, 150)}`);
    }
  }

  throw new Error(`All image gen models failed:\n${errors.join("\n")}`);
}

// ── Imagen REST ──────────────────────────────────────────────────────
async function tryImagen(
  apiKey: string,
  model: string,
  prompt: string,
  aspectRatio: string,
  negativePrompt?: string,
  sampleCount = 1,
): Promise<{ bytes: Buffer; mimeType: string } | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;
  const body = {
    instances: [{ prompt }],
    parameters: {
      sampleCount,
      aspectRatio,
      ...(negativePrompt ? { negativePrompt } : {}),
      personGeneration: "allow_adult",
      safetyFilterLevel: "block_only_high",
    },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`HTTP ${r.status}: ${t.slice(0, 200)}`);
  }
  const json = (await r.json()) as {
    predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>;
  };
  const pred = json.predictions?.[0];
  if (!pred?.bytesBase64Encoded) return null;
  return {
    bytes: Buffer.from(pred.bytesBase64Encoded, "base64"),
    mimeType: pred.mimeType ?? "image/png",
  };
}

// ── Gemini native image gen ──────────────────────────────────────────
async function tryGeminiImage(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<{ bytes: Buffer; mimeType: string } | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`HTTP ${r.status}: ${t.slice(0, 200)}`);
  }
  const json = (await r.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
    }>;
  };
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const inline = p.inlineData;
    if (inline?.data && inline.mimeType?.startsWith("image/")) {
      return { bytes: Buffer.from(inline.data, "base64"), mimeType: inline.mimeType };
    }
  }
  return null;
}

// ── Save helper ──────────────────────────────────────────────────────
export async function saveImage(result: GenImageResult, filePath: string): Promise<void> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, result.bytes);
}
