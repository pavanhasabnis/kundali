/**
 * Regenerate ONLY per-rashi thumbnails for an existing rashifal-YYYY-MM-DD folder.
 * Visits /mr/preview/rashifal-thumbnail/<id>?date=YYYY-MM-DD and screenshots 1080x1920.
 *
 * Usage: npx tsx scripts/regen-thumbnails.ts [YYYY-MM-DD]
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const RASHIS = [
  { id: 0, slug: "mesh" }, { id: 1, slug: "vrushabh" }, { id: 2, slug: "mithun" },
  { id: 3, slug: "kark" }, { id: 4, slug: "simha" }, { id: 5, slug: "kanya" },
  { id: 6, slug: "tula" }, { id: 7, slug: "vrushchik" }, { id: 8, slug: "dhanu" },
  { id: 9, slug: "makar" }, { id: 10, slug: "kumbh" }, { id: 11, slug: "meen" },
];

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function main() {
  const dateStr = process.argv[2] || fmtDate(new Date());
  const outDir = path.join(os.homedir(), "Desktop", `rashifal-${dateStr}`);
  if (!fs.existsSync(outDir)) { console.error(`No folder: ${outDir}`); process.exit(1); }

  console.log(`Regenerating thumbnails in ${outDir}`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });

  for (const r of RASHIS) {
    const page = await ctx.newPage();
    const url = `http://localhost:6630/mr/preview/rashifal-thumbnail/${r.id}?date=${dateStr}&raw=1`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      // Strip Next.js dev overlay ("Issue" badge, portals, watchers).
      await page.addStyleTag({
        content: `
          nextjs-portal, [data-next-dev-overlay-parent],
          [data-nextjs-toast], [data-nextjs-dialog-overlay],
          [data-nextjs-dev-tools-button], #__next-build-watcher
          { display: none !important; visibility: hidden !important; }
        `,
      });
      await page.evaluate(`(() => {
        const sel = "nextjs-portal, [data-next-dev-overlay-parent], [data-nextjs-toast], [data-nextjs-dialog-overlay], [data-nextjs-dev-tools-button], #__next-build-watcher";
        document.querySelectorAll(sel).forEach(e => e.remove());
      })()`);
      await page.waitForTimeout(1500);
      const out = path.join(outDir, `${String(r.id).padStart(2, "0")}-${r.slug}-thumbnail.jpg`);
      await page.screenshot({ path: out, type: "jpeg", quality: 90, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
      console.log(`  ✓ ${r.slug}`);
    } catch (e) {
      console.log(`  ✗ ${r.slug} — ${e instanceof Error ? e.message : e}`);
    }
    await page.close();
  }

  await ctx.close();
  await browser.close();
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
