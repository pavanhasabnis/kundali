/**
 * generate-captions.ts — produce one Instagram caption per rashi and bundle
 * them in a single text file for copy-paste.
 *
 * Pulls today's transit data from /api/rashifal (lucky + rating), then uses
 * the human-curated prose from src/lib/curated-rashifal.ts so the caption
 * matches the video exactly. Output: /tmp/reels/captions.txt
 */

import fs from "node:fs";
import path from "node:path";
import { CURATED } from "../src/lib/curated-rashifal";

const RASHIS = [
  { id: 0,  mr: "मेष",    en: "Aries",       slug: "mesh" },
  { id: 1,  mr: "वृषभ",   en: "Taurus",      slug: "vrushabh" },
  { id: 2,  mr: "मिथुन",  en: "Gemini",      slug: "mithun" },
  { id: 3,  mr: "कर्क",   en: "Cancer",      slug: "kark" },
  { id: 4,  mr: "सिंह",   en: "Leo",         slug: "simha" },
  { id: 5,  mr: "कन्या",  en: "Virgo",       slug: "kanya" },
  { id: 6,  mr: "तुला",   en: "Libra",       slug: "tula" },
  { id: 7,  mr: "वृश्चिक", en: "Scorpio",     slug: "vrushchik" },
  { id: 8,  mr: "धनु",    en: "Sagittarius", slug: "dhanu" },
  { id: 9,  mr: "मकर",    en: "Capricorn",   slug: "makar" },
  { id: 10, mr: "कुंभ",   en: "Aquarius",    slug: "kumbh" },
  { id: 11, mr: "मीन",    en: "Pisces",      slug: "meen" },
];

const MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];

async function main() {
  // Pull today's API data for rating + lucky color + number.
  const res = await fetch("http://localhost:6630/api/rashifal?rashi=all");
  const data = await res.json();
  const today = new Date();
  const dateStr = `${today.getDate()} ${MONTHS_MR[today.getMonth()]} ${today.getFullYear()}`;

  const blocks: string[] = [];

  for (const r of RASHIS) {
    const live = data.predictions.find((p: { rashiMr: string }) => p.rashiMr === r.mr);
    const rating = live?.rating ?? 3;
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const luckyColor = live?.luckyColor?.mr ?? "-";
    const luckyNum = live?.luckyNumber ?? "-";

    const curated = CURATED[r.id];
    const overall = curated?.overall.mr ?? live?.overall?.mr ?? "";
    const career = curated?.career.mr ?? live?.career?.mr ?? "";
    const love = curated?.love.mr ?? live?.love?.mr ?? "";
    const health = curated?.health.mr ?? live?.health?.mr ?? "";

    // Trim each section to ~2 sentences to keep caption under Instagram's
    // 2,200 char limit — still leaves room for hashtags.
    const trim = (s: string, n = 280) => {
      const clean = s.trim();
      return clean.length > n ? clean.slice(0, n).split(".").slice(0, -1).join(".") + "." : clean;
    };

    const caption = `आजचे राशीभविष्य — ${r.mr} (${r.en}) | ${dateStr}

रेटिंग: ${stars}

${trim(overall)}

💼 करिअर — ${trim(career, 180)}

❤️ प्रेम / कुटुंब — ${trim(love, 160)}

🩺 आरोग्य — ${trim(health, 160)}

✨ शुभ रंग: ${luckyColor} · शुभ अंक: ${luckyNum}

पूर्ण भविष्य पहा 👉 bhaagyavedh.com/mr/rashifal/${r.slug}

#मराठी_राशीभविष्य #${r.mr}_राशी #आजचे_राशीभविष्य #दैनिक_राशीफल #ज्योतिष #वैदिकज्योतिष #भाग्यवेध #Bhaagyavedh #MarathiAstrology #DailyHoroscope #${r.en} #Vedic #Panchang #Maharashtra #Pune #Mumbai`;

    blocks.push(caption);
  }

  const out = blocks.map((c, i) => {
    return `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📱 Reel ${String(i).padStart(2,"0")} — ${RASHIS[i].mr} (${RASHIS[i].en})\n   File: rashi-${String(i).padStart(2,"0")}-${RASHIS[i].slug}.mp4\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${c}\n`;
  }).join("\n");

  const OUT = path.join("/tmp/reels", "captions.txt");
  fs.writeFileSync(OUT, out, "utf-8");
  console.log(`✓ wrote ${OUT}`);
  console.log(`  ${blocks.length} captions · ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
