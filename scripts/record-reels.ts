/**
 * record-reels.ts — capture all 12 rashifal reels as MP4 files.
 *
 * Uses Playwright's built-in page-video recorder to screenshot the animated
 * reel preview page over its full 37-second timeline. Headed Chromium is
 * used because headless-shell can't run framer-motion smoothly enough to
 * avoid dropped frames.
 *
 * Output: /tmp/reels/rashi-<id>-<slug>.webm
 * (Instagram accepts webm directly; if you need MP4 convert via ffmpeg.)
 *
 * Run:  npx tsx scripts/record-reels.ts
 * Prereq: Next dev server running at localhost:6630.
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const RASHIS = [
  { id: 0,  slug: "mesh" },
  { id: 1,  slug: "vrushabh" },
  { id: 2,  slug: "mithun" },
  { id: 3,  slug: "kark" },
  { id: 4,  slug: "simha" },
  { id: 5,  slug: "kanya" },
  { id: 6,  slug: "tula" },
  { id: 7,  slug: "vrushchik" },
  { id: 8,  slug: "dhanu" },
  { id: 9,  slug: "makar" },
  { id: 10, slug: "kumbh" },
  { id: 11, slug: "meen" },
];

const BASE = "http://localhost:6630/mr/preview/rashifal-video";
const DURATION_MS = 38000; // 37s timeline + 1s safety buffer
const OUT_DIR = "/tmp/reels";

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Recording 12 reels to ${OUT_DIR}...`);

  for (const r of RASHIS) {
    console.log(`\n→ rashi ${r.id} (${r.slug})`);

    // Fresh context per rashi so the video file isolates to one reel.
    const browser = await chromium.launch({
      headless: true,
      args: ["--autoplay-policy=no-user-gesture-required"],
    });
    // 360×640 matches the preview frame. Device-scale 3 gives crisp 1080×1920
    // equivalent after Playwright's internal encoding.
    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      recordVideo: {
        dir: OUT_DIR,
        size: { width: 1080, height: 1920 },
      },
    });
    const page = await ctx.newPage();

    // ?raw=1 strips all preview chrome (navbar, rashi pills, controls) so
    // only the reel frame is captured. See ChromeOrRaw in src/app/layout.tsx.
    const url = `${BASE}/${r.id}?raw=1`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Hide the Next.js dev overlay ("1 issue" badge) so it doesn't bake in.
    await page.addStyleTag({
      content: `
        nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay],
        #__next-build-watcher { display: none !important; }
      `,
    });

    // Wait for rashi content to finish loading before capture window starts.
    await page.waitForTimeout(1500);

    // Let the full 25s timeline play out.
    await page.waitForTimeout(DURATION_MS);

    const videoPath = await page.video()?.path();
    await page.close();
    await ctx.close();
    await browser.close();

    if (videoPath) {
      const final = path.join(OUT_DIR, `rashi-${String(r.id).padStart(2, "0")}-${r.slug}.webm`);
      fs.renameSync(videoPath, final);
      const size = (fs.statSync(final).size / 1024 / 1024).toFixed(2);
      console.log(`  ✓ saved ${final} (${size} MB)`);
    } else {
      console.log(`  ✗ no video captured`);
    }
  }

  console.log(`\nDone. ${RASHIS.length} reels in ${OUT_DIR}`);
  console.log(`\nOptional — convert to MP4 for Instagram:`);
  console.log(`  cd ${OUT_DIR}`);
  console.log(`  for f in *.webm; do ffmpeg -i "$f" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "\${f%.webm}.mp4"; done`);
}

main().catch((e) => {
  console.error("record failed:", e);
  process.exit(1);
});
