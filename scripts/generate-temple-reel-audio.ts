/**
 * Generate temple reel scene audio via Sarvam AI (Advait voice).
 *
 * Usage:
 *   tsx scripts/generate-temple-reel-audio.ts trimbakeshwar
 */

import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

import fs from "node:fs/promises";
import { sarvamTTS, saveSarvamAudio } from "../src/lib/tts-sarvam";

type Scene = { id: string; narrationMr: string; pace?: number };

// ─── Trimbakeshwar scene manifest (must mirror preview-client.tsx) ──────
const TRIMBAKESHWAR_SCENES: Scene[] = [
  {
    id: "hook",
    narrationMr: "महाराष्ट्रातील नाशिक जिल्ह्यात, ब्रह्मगिरी पर्वताच्या कुशीत वसलेले, बारा ज्योतिर्लिंगांपैकी एक त्र्यंबकेश्वर मंदिर, हे अत्यंत पवित्र आणि महत्त्वाचे तीर्थक्षेत्र आहे.",
  },
  {
    id: "intro",
    narrationMr: "त्र्यंबकेश्वर मंदिर, जिथे शिवलिंग तीन मुखांनी, म्हणजे ब्रह्मा, विष्णू आणि महेश यांच्या त्रिगुणात्मक रूपात प्रकट झाले आहे. असे स्वरूप असलेले हे एकमेव ज्योतिर्लिंग मानले जाते.",
  },
  {
    id: "katha",
    narrationMr: "महर्षी गौतमांनी येथे अनेक वर्षे कठोर तपश्चर्या केली. त्यांच्या प्रार्थनेने प्रसन्न होऊन भगवान शिव स्वतः येथे अवतरले. गंगा ब्रह्मगिरी पर्वतावरून गोदावरीच्या रूपाने पृथ्वीवर अवतरली, आणि त्रिगुणात्मक शिवलिंग स्वयंभू स्वरूपात प्रकट झाले.",
  },
  {
    id: "architecture",
    narrationMr: "काळ्या पाषाणात कोरलेले हे हेमाडपंती शैलीतील भव्य मंदिर तेराव्या शतकातील स्थापत्यकलेचा अप्रतिम नमुना आहे. मुख्य शिखर सुमारे सत्तर फूट उंच असून, गर्भगृहात त्रिमुखी शिवलिंग विराजमान आहे.",
    pace: 0.9,
  },
  {
    id: "rituals",
    narrationMr: "महाशिवरात्री, त्रिपुरारी पौर्णिमा आणि श्रावण महिन्यात येथे लाखो भक्त दर्शनासाठी येतात. पहाटे होणारी त्रिकाल पूजा आणि रुद्राभिषेक विशेष महत्त्वाचे मानले जातात.",
  },
  {
    id: "kumbh",
    narrationMr: "दर बारा वर्षांनी येथे सिंहस्थ कुंभमेळा भरतो. गोदावरीच्या तीरावर कोट्यवधी भाविक स्नान आणि दर्शनासाठी येतात.",
  },
  {
    id: "cta",
    narrationMr: "त्र्यंबकेश्वरची संपूर्ण माहिती, दर्शन वेळा, यात्रा मार्गदर्शन - भाग्यवेध डॉट कॉमवर उपलब्ध आहे.",
  },
];

const TEMPLES: Record<string, Scene[]> = {
  trimbakeshwar: TRIMBAKESHWAR_SCENES,
};

async function main() {
  const templeId = process.argv[2];
  if (!templeId) {
    console.error("Usage: tsx scripts/generate-temple-reel-audio.ts <templeId>");
    process.exit(1);
  }
  const scenes = TEMPLES[templeId];
  if (!scenes) {
    console.error(`No scenes defined for temple: ${templeId}`);
    process.exit(1);
  }

  if (!process.env.SARVAM_API_KEY) {
    console.error("SARVAM_API_KEY not set");
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "public", "temple-audio", templeId);
  await fs.mkdir(outDir, { recursive: true });

  const manifest: { scene: string; file: string; durationSec: number; text: string }[] = [];

  for (const scene of scenes) {
    process.stdout.write(`→ ${scene.id}... `);
    const result = await sarvamTTS({
      text: scene.narrationMr,
      language: "mr-IN",
      speaker: "roopa",
      pace: scene.pace ?? 1.0,
      loudness: 1.2,
      sampleRate: 22050,
      model: "bulbul:v3",
    });
    const file = `${scene.id}.wav`;
    await saveSarvamAudio(result.audioBase64, path.join(outDir, file));
    manifest.push({
      scene: scene.id,
      file,
      durationSec: Math.round(result.durationSec * 10) / 10,
      text: scene.narrationMr,
    });
    console.log(`✓ ${result.durationSec.toFixed(1)}s (${(result.bytes / 1024).toFixed(0)} KB)`);
  }

  await fs.writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify({ templeId, speaker: "roopa", model: "bulbul:v3", pace: 1.0, scenes: manifest }, null, 2),
  );

  console.log(`\n✓ Saved ${scenes.length} clips + manifest to ${outDir}`);
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
