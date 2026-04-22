/**
 * Generate complete Instagram package for all 12 rashis:
 * - MP4 video (1080x1920) — LLM content rendered via reel preview
 * - Thumbnail (divider-bold-preview.jpg copied)
 * - Caption .txt file (hook + rashi name + LLM overall + 5 hashtags + CTA)
 *
 * Output: ~/Desktop/rashifal-YYYY-MM-DD/
 *
 * Prereq: dev server at localhost:6630, daily_rashifal DB populated for date.
 *
 * Usage:
 *   npx tsx scripts/generate-rashifal-package.ts [YYYY-MM-DD]
 *   (default: today IST)
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import Database from "better-sqlite3";

const RASHIS: { id: number; slug: string; mr: string; en: string }[] = [
  { id: 0, slug: "mesh", mr: "मेष", en: "Aries" },
  { id: 1, slug: "vrushabh", mr: "वृषभ", en: "Taurus" },
  { id: 2, slug: "mithun", mr: "मिथुन", en: "Gemini" },
  { id: 3, slug: "kark", mr: "कर्क", en: "Cancer" },
  { id: 4, slug: "simha", mr: "सिंह", en: "Leo" },
  { id: 5, slug: "kanya", mr: "कन्या", en: "Virgo" },
  { id: 6, slug: "tula", mr: "तुला", en: "Libra" },
  { id: 7, slug: "vrushchik", mr: "वृश्चिक", en: "Scorpio" },
  { id: 8, slug: "dhanu", mr: "धनु", en: "Sagittarius" },
  { id: 9, slug: "makar", mr: "मकर", en: "Capricorn" },
  { id: 10, slug: "kumbh", mr: "कुंभ", en: "Aquarius" },
  { id: 11, slug: "meen", mr: "मीन", en: "Pisces" },
];

const BASE_URL = "http://localhost:6630/mr/preview/rashifal-video";
const THUMBNAIL = "/Users/nehahasabnis/Desktop/divider-bold-preview.jpg";
const DURATION_MS = 38000; // 37s timeline + 1s safety

// Marathi Instagram hashtags — exactly 5 per reel.
// Devanagari written character-by-character to avoid matra corruption.
const HASHTAGS: string[] = [
  "#\u0930\u093e\u0936\u0940\u092d\u0935\u093f\u0937\u094d\u092f",          // #राशीभविष्य
  "#\u092e\u0930\u093e\u0920\u0940\u0930\u093e\u0936\u0940\u092d\u0935\u093f\u0937\u094d\u092f", // #मराठीराशीभविष्य
  "#\u0926\u0948\u0928\u093f\u0915\u0930\u093e\u0936\u0940\u092b\u0932",    // #दैनिकराशीफल
  "#marathihoroscope",
  "#bhaagyavedh",
];

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateMr(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
  return `${d} ${months[m - 1]} ${y}`;
}

function buildCaption(
  rashiMr: string,
  rashiEn: string,
  dateStr: string,
  overall: string,
  luckyColor: string,
  luckyNumber: number,
  rating: number,
): string {
  const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);
  const dateMr = formatDateMr(dateStr);
  return `${rashiMr} राशी — आजचे राशीभविष्य
${dateMr}

${stars}

${overall}

🎨 शुभ रंग: ${luckyColor}
🔢 शुभ अंक: ${luckyNumber}

पूर्ण भविष्य वाचा — bhaagyavedh.com
.
.
.
${HASHTAGS.join(" ")}`;
}

async function captureThumbnail(rashiId: number, dateStr: string, outPath: string): Promise<boolean> {
  try {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
    const page = await ctx.newPage();
    await page.goto(
      `http://localhost:6630/mr/preview/rashifal-thumbnail/${rashiId}?date=${dateStr}&raw=1`,
      { waitUntil: "networkidle", timeout: 30000 },
    );
    await page.waitForTimeout(1500); // let SVG + fonts render
    await page.screenshot({ path: outPath, type: "jpeg", quality: 90 });
    await page.close();
    await ctx.close();
    await browser.close();
    return true;
  } catch {
    return false;
  }
}

async function recordReel(id: number, slug: string, dateStr: string, outDir: string): Promise<string | null> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: outDir, size: { width: 1080, height: 1920 } },
  });
  const page = await ctx.newPage();
  await page.addStyleTag({
    content: `html, body { background: #1a0505 !important; margin: 0 !important; padding: 0 !important; }`,
  }).catch(() => undefined);

  const url = `${BASE_URL}/${id}?raw=1&date=${dateStr}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  await page.addStyleTag({
    content: `
      html, body { background: #1a0505 !important; margin: 0 !important; padding: 0 !important; }
      header, nav, footer, [class*="SiteBanner"], [class*="NavBar"], [class*="Footer"] { display: none !important; }
      nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay], #__next-build-watcher { display: none !important; }
    `,
  });
  await page.evaluate(`(() => {
    const sel = "nextjs-portal, [data-next-dev-overlay-parent], [data-nextjs-toast], [data-nextjs-dialog-overlay], #__next-build-watcher";
    const kill = () => { document.querySelectorAll(sel).forEach(e => e.remove()); };
    kill(); setInterval(kill, 100);
  })()`);

  await page.waitForTimeout(2000);
  await page.waitForTimeout(DURATION_MS);

  const webmPath = await page.video()?.path();
  await page.close();
  await ctx.close();
  await browser.close();

  if (!webmPath) return null;
  const finalWebm = path.join(outDir, `${String(id).padStart(2, "0")}-${slug}.webm`);
  fs.renameSync(webmPath, finalWebm);
  return finalWebm;
}

function webmToMp4(webm: string, mp4: string): boolean {
  const { execSync } = require("node:child_process");
  try {
    execSync(`ffmpeg -y -i "${webm}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${mp4}"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// Extract rashi-name scene frame (~3s in) as thumbnail. Shows rashi icon +
// name prominently — ideal for Instagram feed preview.
function extractThumbnail(mp4: string, thumb: string): boolean {
  const { execSync } = require("node:child_process");
  try {
    execSync(`ffmpeg -y -ss 00:00:03 -i "${mp4}" -frames:v 1 -q:v 2 "${thumb}"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const dateStr = process.argv[2] || fmtDate(new Date());
  const outDir = path.join(os.homedir(), "Desktop", `rashifal-${dateStr}`);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating Instagram package for ${dateStr}`);
  console.log(`Output: ${outDir}\n`);

  if (!fs.existsSync(THUMBNAIL)) {
    console.error(`⚠ Thumbnail not found: ${THUMBNAIL}`);
    process.exit(1);
  }

  // Verify DB has all 12 rashis for this date
  const sqlite = new Database(path.join(process.cwd(), "data", "app.db"));
  const rows = sqlite.prepare(
    "SELECT rashi_id, overall, lucky_color, lucky_number, rating FROM daily_rashifal WHERE date = ?"
  ).all(dateStr) as Array<{ rashi_id: number; overall: string; lucky_color: string; lucky_number: number; rating: number }>;
  sqlite.close();

  if (rows.length < 12) {
    console.error(`⚠ DB has only ${rows.length}/12 rashis for ${dateStr}. Run generate-daily-rashifal.ts first.`);
    process.exit(1);
  }
  const byRashi = new Map(rows.map((r) => [r.rashi_id, r]));

  let success = 0, failed = 0;
  const combinedCaptions: string[] = [];

  for (const r of RASHIS) {
    const row = byRashi.get(r.id);
    if (!row) { console.log(`✗ ${r.id} ${r.slug} — no DB row`); failed++; continue; }

    console.log(`\n→ ${r.mr} (${r.slug})`);

    // 1. Record video
    const webm = await recordReel(r.id, r.slug, dateStr, outDir);
    if (!webm) { console.log(`  ✗ video failed`); failed++; continue; }
    const mb = (fs.statSync(webm).size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ webm ${mb} MB`);

    // 2. Convert to MP4 (Instagram preferred)
    const mp4 = webm.replace(/\.webm$/, ".mp4");
    if (webmToMp4(webm, mp4)) {
      fs.unlinkSync(webm); // drop webm after mp4 made
      const mb4 = (fs.statSync(mp4).size / 1024 / 1024).toFixed(2);
      console.log(`  ✓ mp4 ${mb4} MB`);
    } else {
      console.log(`  ⚠ ffmpeg not found — keeping webm`);
    }

    // 3. Thumbnail — screenshot per-rashi thumbnail route (big logo, date, rashi name).
    const thumbPath = path.join(outDir, `${String(r.id).padStart(2, "0")}-${r.slug}-thumbnail.jpg`);
    const ok = await captureThumbnail(r.id, dateStr, thumbPath);
    if (ok) console.log(`  ✓ thumbnail (per-rashi)`);
    else {
      fs.copyFileSync(THUMBNAIL, thumbPath);
      console.log(`  ⚠ thumbnail (fallback)`);
    }

    // 4. Caption
    const caption = buildCaption(r.mr, r.en, dateStr, row.overall, row.lucky_color, row.lucky_number, row.rating);
    const capPath = path.join(outDir, `${String(r.id).padStart(2, "0")}-${r.slug}-caption.txt`);
    fs.writeFileSync(capPath, caption, "utf-8");
    console.log(`  ✓ caption`);

    combinedCaptions.push(
      `════════════ ${String(r.id + 1).padStart(2, "0")}. ${r.mr} (${r.en}) ════════════\n` +
      `Video: ${String(r.id).padStart(2, "0")}-${r.slug}.mp4\n` +
      `Thumbnail: ${String(r.id).padStart(2, "0")}-${r.slug}-thumbnail.jpg\n\n` +
      caption,
    );

    success++;
  }

  // Combined single file for all captions
  const combinedPath = path.join(outDir, "ALL-CAPTIONS.txt");
  fs.writeFileSync(
    combinedPath,
    `Rashifal Instagram Package — ${dateStr}\n\n` +
    combinedCaptions.join("\n\n\n"),
    "utf-8",
  );
  console.log(`\n✓ Combined captions: ${combinedPath}`);

  console.log(`\n── Done ──`);
  console.log(`Success: ${success}/12`);
  console.log(`Failed:  ${failed}/12`);
  console.log(`Output:  ${outDir}`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
