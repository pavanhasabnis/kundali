/**
 * Generate Instagram package for today's panchang:
 * - MP4 video (1080x1920) of panchang reel
 * - Thumbnail (frame at 3s — shows date + panchang headline)
 * - Caption file with panchang summary + 5 hashtags
 *
 * Output: ~/Desktop/panchang-YYYY-MM-DD/
 *
 * Prereq: dev server at localhost:6630.
 *
 * Usage:
 *   npx tsx scripts/generate-panchang-package.ts [YYYY-MM-DD]
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

const BASE_URL = "http://localhost:6630/mr/panchang-reel-preview";
const PANCHANG_API = "http://localhost:6630/api/panchang";
const DURATION_MS = 38000;

// 5 hashtags for Instagram — Devanagari written char-by-char to avoid corruption.
const HASHTAGS: string[] = [
  "#\u092a\u0902\u091a\u093e\u0902\u0917",                             // #पंचांग
  "#\u092e\u0930\u093e\u0920\u0940\u092a\u0902\u091a\u093e\u0902\u0917", // #मराठीपंचांग
  "#\u0926\u0948\u0928\u093f\u0915\u092a\u0902\u091a\u093e\u0902\u0917", // #दैनिकपंचांग
  "#marathipanchang",
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

interface Panchang {
  day: string; tithi: string; paksha: string; nakshatra: string;
  yoga: string; karana: string; rahuKaal: string; gulikaKaal?: string;
  yamaganda?: string; masa: string; moonRashi: string; sunRashi: string;
  sunrise: string; sunset: string;
}

async function fetchPanchang(dateStr: string): Promise<Panchang> {
  const url = `${PANCHANG_API}?date=${dateStr}&lat=18.5204&lng=73.8567&tz=5.5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`panchang API ${res.status}`);
  return (await res.json()) as Panchang;
}

function buildCaption(dateStr: string, p: Panchang): string {
  const dateMr = formatDateMr(dateStr);
  return `आजचे पंचांग
${dateMr} · ${p.day}

📅 तिथी: ${p.paksha} ${p.tithi}
🌙 नक्षत्र: ${p.nakshatra}
✨ योग: ${p.yoga}
🔱 करण: ${p.karana}
🌞 सूर्योदय: ${p.sunrise}   🌅 सूर्यास्त: ${p.sunset}

⚠️ राहुकाळ: ${p.rahuKaal}${p.gulikaKaal ? `
⚠️ गुलिक काळ: ${p.gulikaKaal}` : ""}${p.yamaganda ? `
⚠️ यमगंड: ${p.yamaganda}` : ""}

संपूर्ण पंचांग पहा — bhaagyavedh.com
.
.
.
${HASHTAGS.join(" ")}`;
}

async function recordReel(outDir: string, dateStr: string): Promise<string | null> {
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

  // ?wait=1 keeps timeline paused until __startPanchangReel() fires. Ensures
  // scene animations are all captured — no mid-fetch frame skipping.
  await page.goto(`${BASE_URL}?raw=1&wait=1`, { waitUntil: "networkidle", timeout: 30000 });

  await page.addStyleTag({
    content: `
      html, body { background: #0a2b28 !important; margin: 0 !important; padding: 0 !important; }
      header, nav, footer, [class*="SiteBanner"], [class*="NavBar"], [class*="Footer"] { display: none !important; }
      nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay],
      [data-next-dev-overlay-parent], [data-nextjs-dev-tools-button],
      #__next-build-watcher { display: none !important; }
    `,
  });
  await page.evaluate(`(() => {
    const sel = "nextjs-portal, [data-next-dev-overlay-parent], [data-nextjs-toast], [data-nextjs-dialog-overlay], [data-nextjs-dev-tools-button], #__next-build-watcher";
    const kill = () => document.querySelectorAll(sel).forEach(e => e.remove());
    kill(); setInterval(kill, 100);
  })()`);

  // Wait for panchang data fetch + render. window.__startPanchangReel only
  // installed after waitForSignal effect mounts (after hydration).
  await page.waitForFunction(
    () => typeof (window as unknown as { __startPanchangReel?: () => void }).__startPanchangReel === "function",
    { timeout: 20000 },
  );
  await page.waitForTimeout(500); // let initial paint settle

  // Fire start signal — RAF begins at recorded t=~0.
  await page.evaluate(() => {
    (window as unknown as { __startPanchangReel: () => void }).__startPanchangReel();
  });

  await page.waitForTimeout(DURATION_MS);

  const webmPath = await page.video()?.path();
  await page.close();
  await ctx.close();
  await browser.close();

  if (!webmPath) return null;
  const finalWebm = path.join(outDir, `panchang-${dateStr}.webm`);
  fs.renameSync(webmPath, finalWebm);
  return finalWebm;
}

function webmToMp4(webm: string, mp4: string): boolean {
  try {
    execSync(`ffmpeg -y -i "${webm}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${mp4}"`, { stdio: "pipe" });
    return true;
  } catch { return false; }
}

// Thumbnail at t=12s — past recorder prologue (~3-5s pre-signal) + hook scene.
// Lands in nakshatra scene (7-11s timeline = ~12-16s video) with full content.
function extractThumbnail(mp4: string, thumb: string): boolean {
  try {
    execSync(`ffmpeg -y -ss 00:00:12 -i "${mp4}" -frames:v 1 -q:v 2 "${thumb}"`, { stdio: "pipe" });
    return true;
  } catch { return false; }
}

async function main() {
  const dateStr = process.argv[2] || fmtDate(new Date());
  const outDir = path.join(os.homedir(), "Desktop", `panchang-${dateStr}`);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating panchang Instagram package for ${dateStr}`);
  console.log(`Output: ${outDir}\n`);

  // 1. Fetch panchang data for caption
  console.log("→ fetching panchang data...");
  const panchang = await fetchPanchang(dateStr);
  console.log(`  ✓ ${panchang.paksha} ${panchang.tithi} · ${panchang.nakshatra}`);

  // 2. Record reel
  console.log("→ recording reel (~40s)...");
  const webm = await recordReel(outDir, dateStr);
  if (!webm) { console.error("✗ recording failed"); process.exit(1); }
  const mb = (fs.statSync(webm).size / 1024 / 1024).toFixed(2);
  console.log(`  ✓ webm ${mb} MB`);

  // 3. Convert to MP4
  const mp4 = webm.replace(/\.webm$/, ".mp4");
  if (webmToMp4(webm, mp4)) {
    fs.unlinkSync(webm);
    const mb4 = (fs.statSync(mp4).size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ mp4 ${mb4} MB`);
  } else {
    console.log("  ⚠ ffmpeg missing — keeping webm");
  }

  // 4. Thumbnail from frame 3s (date + tithi scene)
  const thumb = path.join(outDir, `panchang-${dateStr}-thumbnail.jpg`);
  if (fs.existsSync(mp4) && extractThumbnail(mp4, thumb)) {
    console.log("  ✓ thumbnail (from video 3s)");
  } else {
    console.log("  ⚠ thumbnail extraction failed");
  }

  // 5. Caption
  const caption = buildCaption(dateStr, panchang);
  const capPath = path.join(outDir, `panchang-${dateStr}-caption.txt`);
  fs.writeFileSync(capPath, caption, "utf-8");
  console.log(`  ✓ caption`);

  console.log(`\n── Done ──`);
  console.log(`Output: ${outDir}`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
