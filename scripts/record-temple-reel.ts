/**
 * record-temple-reel.ts — capture temple katha reel as mp4 on Desktop.
 *
 * Usage:
 *   npx tsx scripts/record-temple-reel.ts trimbakeshwar
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const TOTAL_SEC = 79.0;            // must match TOTAL in preview-client.tsx
const PLAYBACK_START_DELAY = 1.5;  // raw mode auto-plays after 1.5s
const SETTLE = 2.0;                // extra time for hydration + audio preload
const TAIL_BUFFER = 1.5;           // trailing buffer after reel ends

// Scene audio tracks (must mirror preview-client SCENES start times in seconds).
const AUDIO_TRACKS: { file: string; startSec: number }[] = [
  { file: "hook.wav",          startSec: 0 },
  { file: "intro.wav",         startSec: 11.1 },
  { file: "katha.wav",         startSec: 23.2 },
  { file: "architecture.wav",  startSec: 38.3 },
  { file: "rituals.wav",       startSec: 52.9 },
  { file: "kumbh.wav",         startSec: 62.2 },
  { file: "cta.wav",           startSec: 70.1 },
];

async function ffmpeg(args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
    p.on("error", reject);
    p.on("exit", (code) => resolve(code ?? 1));
  });
}

async function main() {
  const templeId = process.argv[2] ?? "trimbakeshwar";
  const OUT_DIR = "/tmp/temple-reels";
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n── Recording ${templeId} katha reel (1080×1920) ──`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required", "--disable-web-security"],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: OUT_DIR, size: { width: 1080, height: 1920 } },
  });
  const page = await ctx.newPage();

  // Dark pre-paint styling — no white flash.
  await page.addStyleTag({
    content: `html, body { background: #1a0505 !important; margin: 0 !important; padding: 0 !important; }`,
  }).catch(() => undefined);

  await page.goto(`http://localhost:6630/mr/preview/temple-reel?raw=1`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  // Hide Next.js dev overlay + any residual chrome.
  await page.addStyleTag({
    content: `
      html, body { background: #1a0505 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
      header, nav, footer, [class*="SiteBanner"], [class*="NavBar"], [class*="Footer"] { display: none !important; }
    `,
  });
  await page.evaluate(`(() => {
    const sel = "nextjs-portal, [data-next-dev-overlay-parent], [data-nextjs-toast], [data-nextjs-dialog-overlay], #__next-build-watcher";
    const kill = () => { document.querySelectorAll(sel).forEach(e => e.remove()); };
    kill();
    setInterval(kill, 100);
  })()`);

  await page.waitForTimeout(SETTLE * 1000);
  // Full reel + auto-play delay + trailing buffer.
  await page.waitForTimeout((PLAYBACK_START_DELAY + TOTAL_SEC + TAIL_BUFFER) * 1000);

  const videoPath = await page.video()?.path();
  await page.close();
  await ctx.close();
  await browser.close();

  if (!videoPath) {
    console.error("No video recorded.");
    process.exit(1);
  }

  const webm = path.join(OUT_DIR, `${templeId}-raw.webm`);
  fs.renameSync(videoPath, webm);
  console.log(`✓ webm captured → ${webm}`);

  // ── Convert webm → mp4 with muxed Sarvam narration per scene ──────
  const desktopMp4 = path.join(os.homedir(), "Desktop", `${templeId}-katha-reel.mp4`);
  const trimStart = SETTLE + PLAYBACK_START_DELAY;  // trim settle + auto-play delay from video
  const audioDir = path.join(process.cwd(), "public", "temple-audio", templeId);

  // Build filter_complex: adelay each wav to its scene.start then amix.
  const audioInputs: string[] = [];
  const filterParts: string[] = [];
  AUDIO_TRACKS.forEach((tr, i) => {
    const full = path.join(audioDir, tr.file);
    if (!fs.existsSync(full)) throw new Error(`Missing audio: ${full}`);
    audioInputs.push("-i", full);
    const ms = Math.round(tr.startSec * 1000);
    filterParts.push(`[${i + 1}:a]adelay=${ms}|${ms}[a${i + 1}]`);
  });
  const labels = AUDIO_TRACKS.map((_, i) => `[a${i + 1}]`).join("");
  const filterComplex = `${filterParts.join(";")};${labels}amix=inputs=${AUDIO_TRACKS.length}:duration=longest:normalize=0[aout]`;

  console.log(`→ ffmpeg: webm→mp4 + mux ${AUDIO_TRACKS.length} audio tracks (trim ${trimStart}s lead)...`);

  // NOTE: -ss BEFORE -i video = input seek (trims video only, audio timeline untouched).
  // -t applies to output duration. This keeps Sarvam audio clips aligned to scene starts.
  const code = await ffmpeg([
    "-y",
    "-ss", trimStart.toString(),
    "-i", webm,
    ...audioInputs,
    "-filter_complex", filterComplex,
    "-map", "0:v",
    "-map", "[aout]",
    "-t", TOTAL_SEC.toString(),
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "44100",
    "-movflags", "+faststart",
    desktopMp4,
  ]);

  if (code !== 0) {
    console.error(`ffmpeg exited ${code}`);
    process.exit(code);
  }

  const size = fs.statSync(desktopMp4).size;
  console.log(`\n✓ mp4 ready → ${desktopMp4}  (${(size / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
