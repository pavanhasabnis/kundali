import { chromium } from "playwright";

const STYLES = ["temple-script", "divider-bold", "ornament-hook"];
const DESKTOP = "/Users/nehahasabnis/Desktop";

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const style of STYLES) {
    const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.addStyleTag({ content: `html, body { margin:0; padding:0; background:#000; overflow:hidden; }` }).catch(() => undefined);
    const url = `http://localhost:6630/mr/preview/rashifal-cover?rashi=0&raw=1&style=${style}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.addStyleTag({
      content: `nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay], #__next-build-watcher { display: none !important; }`,
    });
    await page.waitForTimeout(1200);
    const out = `${DESKTOP}/${style}-preview.jpg`;
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1920 }, quality: 92, type: "jpeg" });
    console.log(`saved: ${out}`);
    await page.close();
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
