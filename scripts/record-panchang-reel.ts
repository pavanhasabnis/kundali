/**
 * record-panchang-reel.ts — capture today's panchang reel as webm.
 *
 * Uses Playwright page-video recorder over the full scene timeline.
 * Output: /tmp/reels/panchang-YYYY-MM-DD.webm
 *
 * Run:  npx tsx scripts/record-panchang-reel.ts
 * Prereq: Next dev server running at localhost:6630.
 *
 * MP4 conversion (trim 3s prologue):
 *   ffmpeg -i panchang-YYYY-MM-DD.webm -ss 3 -c:v libx264 -pix_fmt yuv420p \
 *          -movflags +faststart panchang-YYYY-MM-DD.mp4
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:6630/mr/panchang-reel-preview";
const DURATION_MS = 38000; // 37s timeline + 1s safety
const OUT_DIR = "/tmp/reels";

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const today = new Date();
  const dateSlug = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  console.log(`Recording panchang reel for ${dateSlug}...`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: OUT_DIR, size: { width: 1080, height: 1920 } },
  });
  const page = await ctx.newPage();

  const url = `${BASE}?raw=1`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  // Hide Next.js dev overlay
  await page.addStyleTag({
    content: `nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay],
              #__next-build-watcher { display: none !important; }`,
  });

  // Wait for panchang fetch + first paint
  await page.waitForTimeout(1500);

  // Let full 37s timeline play
  await page.waitForTimeout(DURATION_MS);

  const videoPath = await page.video()?.path();
  await page.close();
  await ctx.close();
  await browser.close();

  if (videoPath) {
    const final = path.join(OUT_DIR, `panchang-${dateSlug}.webm`);
    fs.renameSync(videoPath, final);
    const size = (fs.statSync(final).size / 1024 / 1024).toFixed(2);
    console.log(`✓ saved ${final} (${size} MB)`);
    console.log(`\nConvert to MP4:`);
    console.log(`  ffmpeg -i ${final} -ss 3 -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${final.replace(".webm", ".mp4")}`);
  } else {
    console.error("✗ no video captured");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("record failed:", e);
  process.exit(1);
});
