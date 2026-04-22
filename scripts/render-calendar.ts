/**
 * render-calendar.ts — capture the monthly calendar card as a 1080×1350 PNG.
 *
 * Usage:
 *   npx tsx scripts/render-calendar.ts 2026 4   → April 2026
 *   npx tsx scripts/render-calendar.ts           → current IST month
 *
 * Output: /tmp/calendar-YYYY-MM.png (Instagram feed 4:5 ratio).
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const year = parseInt(process.argv[2] ?? String(nowIST.getUTCFullYear()), 10);
  const month = parseInt(process.argv[3] ?? String(nowIST.getUTCMonth() + 1), 10);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 } });
  const page = await ctx.newPage();

  const url = `http://localhost:6630/mr/preview/monthly-calendar-image?month=${month}&year=${year}&raw=1`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  // Ensure all <img> tags (logo SVG, icons) have finished loading before
  // the screenshot. networkidle catches the fetch but not decode.
  await page.waitForFunction(`(() => {
    const imgs = Array.from(document.images);
    return imgs.length === 0 || imgs.every(i => i.complete && i.naturalWidth > 0);
  })()`, { timeout: 10000 }).catch(() => undefined);
  await page.addStyleTag({
    content: `
      header, nav, footer, [class*="SiteBanner"], [class*="NavBar"], [class*="Footer"] {
        display: none !important;
      }
    `,
  });
  await page.evaluate(`(() => {
    const sel = "nextjs-portal, [data-next-dev-overlay-parent], #__next-build-watcher";
    document.querySelectorAll(sel).forEach(e => e.remove());
  })()`);

  // Wait for calendar API + render.
  await page.waitForTimeout(2000);

  const out = `/tmp/calendar-${year}-${String(month).padStart(2, "0")}.png`;
  await page.screenshot({ path: out, fullPage: false, type: "png" });

  await page.close();
  await ctx.close();
  await browser.close();

  const size = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`✓ saved ${out} (${size} KB)`);
  return out;
}

main().catch((e) => { console.error(e); process.exit(1); });
