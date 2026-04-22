/**
 * record-single-reel.ts — capture ONE rashi reel for preview.
 * Usage: npx tsx scripts/record-single-reel.ts <id> [date]
 *   npx tsx scripts/record-single-reel.ts 10             # today
 *   npx tsx scripts/record-single-reel.ts 10 tomorrow    # tomorrow
 *   npx tsx scripts/record-single-reel.ts 10 2026-04-22  # specific date
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SLUGS = ["mesh","vrushabh","mithun","kark","simha","kanya","tula","vrushchik","dhanu","makar","kumbh","meen"];

async function main() {
  const id = parseInt(process.argv[2] ?? "10", 10);
  const dateArg = process.argv[3];
  const slug = SLUGS[id] ?? `rashi-${id}`;
  const OUT_DIR = "/tmp/reels";
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Recording rashi ${id} (${slug}) in raw mode...`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const ctx = await browser.newContext({
    // Render + record at 1080×1920 directly. deviceScaleFactor drove the
    // content to render at 360×640 with upscaled pixels; going native avoids
    // the tiny-reel-in-big-frame problem.
    viewport: { width: 1080, height: 1920 },
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1080, height: 1920 },
    },
  });
  const page = await ctx.newPage();

  // Force html+body to dark so the first frames are already the reel's
  // deep-maroon tone (kills white flash). Styles injected before the page
  // navigates — no flash of unstyled content.
  await page.addStyleTag({
    content: `html, body { background: #1a0505 !important; margin: 0 !important; padding: 0 !important; }`,
  }).catch(() => undefined);

  const dateQS = dateArg ? `&date=${encodeURIComponent(dateArg)}` : "";
  await page.goto(`http://localhost:6630/mr/preview/rashifal-video/${id}?raw=1${dateQS}`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  // Background + chrome hider injected after navigation (addStyleTag before
  // goto is a no-op). Runs after first paint but within the prologue buffer.
  await page.addStyleTag({
    content: `
      html, body { background: #1a0505 !important; margin: 0 !important; padding: 0 !important; }
      header, nav, footer, [class*="SiteBanner"], [class*="NavBar"], [class*="Footer"] { display: none !important; }
    `,
  });
  // Kill Next.js dev overlay — string-form evaluate to sidestep tsx helpers.
  await page.evaluate(`(() => {
    const sel = "nextjs-portal, [data-next-dev-overlay-parent], [data-nextjs-toast], [data-nextjs-dialog-overlay], #__next-build-watcher";
    const kill = () => { document.querySelectorAll(sel).forEach(e => e.remove()); };
    kill();
    setInterval(kill, 100);
  })()`);
  // Settle window — lets React hydrate, API respond, icons load,
  // framer-motion initialise. Then the in-app timeline's 3-sec prologue
  // gives the recorder enough headroom to trim chrome flash cleanly.
  await page.waitForTimeout(2000);
  // Full timeline + buffer (TOTAL is 37s in-app).
  await page.waitForTimeout(38000);

  const videoPath = await page.video()?.path();
  await page.close();
  await ctx.close();
  await browser.close();

  if (videoPath) {
    const tag = dateArg ? `-${dateArg.replace(/[^a-z0-9-]/gi, "")}` : "";
    const final = path.join(OUT_DIR, `preview-${slug}${tag}.webm`);
    fs.renameSync(videoPath, final);
    console.log(`✓ saved ${final}`);
    return final;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
