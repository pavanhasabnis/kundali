/**
 * Generate scene illustrations for temple reel via Google Imagen / Gemini.
 *
 * Usage:
 *   tsx scripts/generate-temple-illustrations.ts trimbakeshwar
 *   tsx scripts/generate-temple-illustrations.ts trimbakeshwar --only katha   # single scene
 */

import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { generateImage, saveImage } from "../src/lib/image-gen-gemini";

type Scene = { id: string; prompt: string };

// Consistent devotional illustration style suffix appended to each prompt.
const STYLE =
  "Style: cinematic devotional illustration, warm gold-saffron palette, Indian temple mural aesthetic, painterly Mughal miniature influence, subtle film grain, vertical 9:16 composition, no text, no watermark, no logos.";

const TRIMBAKESHWAR_PROMPTS: Scene[] = [
  {
    id: "hook",
    prompt: `Wide cinematic vertical shot of ancient stone Trimbakeshwar Shiva temple with towering curvilinear shikhara spire, nestled at base of misty Brahmagiri mountains in Nashik Maharashtra, warm golden morning light breaking over peaks, few devotees walking toward entrance, devotional mystical mood. ${STYLE}`,
  },
  {
    id: "intro",
    prompt: `Close-up sacred Shiva jyotirlinga with three carved divine faces (trimukha — Brahma, Vishnu, Shiva), water flowing gently over the lingam from a copper kalash, fresh yellow bel-patra leaves and marigold offerings, flickering oil lamps casting warm glow, ancient stone sanctum background, deeply devotional mystical atmosphere. ${STYLE}`,
  },
  {
    id: "katha",
    prompt: `Ancient Indian sage Gautam Rishi in deep meditation on mountain summit, long white beard, saffron robes, hands in prayer posture, sacred Ganga river descending from celestial sky as luminous golden-white water, transforming into Godavari river below, Brahmagiri peak in background, divine light rays, Shiva lingam emerging from rock, mystical devotional illustration. ${STYLE}`,
  },
  {
    id: "architecture",
    prompt: `Detailed close-up of black basalt stone Hemadpanthi architecture of Trimbakeshwar temple, intricate carved pillars with floral motifs, towering shikhara spire with ornate tiers, 13th century Nagara style Indian temple, golden kalash finial at top, soft afternoon sunlight highlighting stone detail, clear blue sky. ${STYLE}`,
  },
  {
    id: "rituals",
    prompt: `Hindu priest in saffron silk dhoti performing aarti with a circular brass thali holding many small oil lamp flames, standing before stone Shiva lingam wreathed in marigold garlands, fragrant incense smoke rising, bronze bells hanging, temple interior lit by oil lamps, worshippers bowing with folded hands, devotional ritual atmosphere. ${STYLE}`,
  },
  {
    id: "kumbh",
    prompt: `Aerial vertical view of massive Simhastha Kumbh Mela gathering at Godavari river ghats near Trimbakeshwar, tens of thousands of sadhus and devotees in white, saffron and orange robes bathing in the sacred river, colorful tents along banks, early morning golden light with mist rising from water, devotional festival energy. ${STYLE}`,
  },
  {
    id: "cta",
    prompt: `Cinematic wide vertical shot of Trimbakeshwar temple silhouetted against a spectacular warm sunset sky with saffron and purple clouds, a few devotees walking toward the entrance with lit oil lamps, soft god-rays, peaceful spiritual closing moment. ${STYLE}`,
  },
];

const TEMPLES: Record<string, Scene[]> = {
  trimbakeshwar: TRIMBAKESHWAR_PROMPTS,
};

async function main() {
  const args = process.argv.slice(2);
  const templeId = args[0];
  const onlyIdx = args.indexOf("--only");
  const onlyScene = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  if (!templeId) {
    console.error("Usage: tsx scripts/generate-temple-illustrations.ts <templeId> [--only sceneId]");
    process.exit(1);
  }
  const prompts = TEMPLES[templeId];
  if (!prompts) {
    console.error(`No prompts for temple: ${templeId}`);
    process.exit(1);
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not set");
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "public", "temple-art", templeId);
  const scenes = onlyScene ? prompts.filter((s) => s.id === onlyScene) : prompts;
  if (scenes.length === 0) {
    console.error(`No scenes matched.`);
    process.exit(1);
  }

  console.log(`\n── Generating ${scenes.length} illustrations for ${templeId} ──`);
  const results: { scene: string; file: string; model: string; bytes: number }[] = [];

  for (const s of scenes) {
    process.stdout.write(`→ ${s.id}... `);
    try {
      const res = await generateImage({ prompt: s.prompt, aspectRatio: "9:16" });
      const ext = res.mimeType === "image/jpeg" ? "jpg" : "png";
      const file = `${s.id}.${ext}`;
      await saveImage(res, path.join(outDir, file));
      results.push({ scene: s.id, file, model: res.model, bytes: res.bytes.length });
      console.log(`✓ ${res.model} (${Math.round(res.bytes.length / 1024)} KB)`);
    } catch (e) {
      console.log(`✗ ${(e as Error).message.slice(0, 200)}`);
    }
  }

  // Manifest (merge with existing if single-scene update)
  const fs = await import("node:fs/promises");
  const manifestPath = path.join(outDir, "manifest.json");
  let existing: Record<string, unknown> = { templeId, scenes: [] as unknown[] };
  try {
    existing = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  } catch { /* ignore */ }
  const scenesArr = (existing.scenes as { scene: string }[] | undefined) ?? [];
  for (const r of results) {
    const idx = scenesArr.findIndex((x) => x.scene === r.scene);
    if (idx >= 0) scenesArr[idx] = r;
    else scenesArr.push(r);
  }
  existing.scenes = scenesArr;
  await fs.writeFile(manifestPath, JSON.stringify(existing, null, 2));

  console.log(`\n✓ Saved ${results.length}/${scenes.length} to ${outDir}`);
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
