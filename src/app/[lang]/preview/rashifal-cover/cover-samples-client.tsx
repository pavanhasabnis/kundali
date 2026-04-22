"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getWeekBackground } from "@/lib/reel-backgrounds";

type RashiMeta = { id: number; mr: string; en: string; hi: string; symbol: string; icon: string };

const SERIF = `'Noto Serif Devanagari', 'Tiro Devanagari Marathi', Georgia, serif`;

const TODAY = new Date();
const MR_MONTHS = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
const DEV_DIGITS = ["०","१","२","३","४","५","६","७","८","९"];
const toDev = (n: number | string) => String(n).split("").map((c) => (/[0-9]/.test(c) ? DEV_DIGITS[+c] : c)).join("");
const DATE_STR = `${toDev(TODAY.getDate())} ${MR_MONTHS[TODAY.getMonth()]}`;

// Per-rashi element/lord/color — used for curated backdrop per sign.
// Keeps thumbnails looking distinct instead of generic.
const RASHI_META_EXT: Record<number, { element: "fire" | "earth" | "air" | "water"; lord: string; stars: [number, number][] }> = {
  0:  { element: "fire",  lord: "मंगळ",   stars: [[30,40],[50,35],[65,55],[55,70]] },       // Aries — ram horn arc
  1:  { element: "earth", lord: "शुक्र",   stars: [[25,50],[45,45],[60,55],[50,70],[35,65]] }, // Taurus — V head
  2:  { element: "air",   lord: "बुध",    stars: [[30,30],[30,70],[70,30],[70,70],[50,50]] },  // Gemini — twin pillars
  3:  { element: "water", lord: "चंद्र",  stars: [[30,55],[45,45],[60,50],[65,65],[50,70],[35,70]] }, // Cancer — crab
  4:  { element: "fire",  lord: "सूर्य",  stars: [[25,60],[40,50],[55,45],[70,55],[65,70],[45,75]] }, // Leo — sickle
  5:  { element: "earth", lord: "बुध",    stars: [[30,35],[40,50],[50,45],[55,60],[65,55],[70,70]] },
  6:  { element: "air",   lord: "शुक्र",   stars: [[30,45],[45,55],[55,55],[70,45],[50,70]] },
  7:  { element: "water", lord: "मंगळ",   stars: [[25,45],[40,55],[55,50],[65,40],[70,60],[60,70],[45,75]] },
  8:  { element: "fire",  lord: "गुरु",   stars: [[30,40],[45,55],[60,50],[70,35],[55,70]] },
  9:  { element: "earth", lord: "शनि",   stars: [[25,55],[40,45],[55,55],[65,70],[50,70]] },
  10: { element: "air",   lord: "शनि",   stars: [[30,40],[45,50],[55,45],[65,55],[50,70]] },
  11: { element: "water", lord: "गुरु",   stars: [[30,35],[45,50],[35,65],[60,35],[65,55],[50,70]] },
};

export default function CoverSamplesClient({
  rashiId,
  rashiMeta,
  rashiList,
}: {
  rashiId: number;
  rashiMeta: RashiMeta;
  rashiList: RashiMeta[];
}) {
  const bg = getWeekBackground();
  const ext = RASHI_META_EXT[rashiId];
  const searchParams = useSearchParams();
  const isRaw = searchParams.get("raw") === "1";
  const rawStyle = searchParams.get("style");

  const samples = [
    { id: "temple-script", label: "1. Temple Script",   comp: <TempleScript bg={bg} meta={rashiMeta} /> },
    { id: "divider-bold",  label: "2. Divider Bold",    comp: <DividerBold bg={bg} meta={rashiMeta} /> },
    { id: "ornament-hook", label: "3. Ornament + Hook", comp: <OrnamentHook bg={bg} meta={rashiMeta} /> },
  ];

  // Raw mode — renders a single style at true 1080×1920 for Playwright capture.
  // URL: ?raw=1&style=<id>&rashi=<n>. raw=1 strips site chrome via ChromeOrRaw.
  if (isRaw && rawStyle) {
    const picked = samples.find((s) => s.id === rawStyle);
    if (picked) {
      return (
        <div style={{ width: 1080, height: 1920, position: "relative", background: "#000", margin: 0, overflow: "hidden", containerType: "inline-size" }}>
          <div style={{ position: "absolute", inset: 0 }}>{picked.comp}</div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#3d0c0c]">Rashifal Thumbnail Samples — {rashiMeta.mr} ({rashiMeta.en})</h1>
            <p className="text-xs text-stone-500 mt-1">
              3 final styles · 9:16 @ 1080×1920 · weekly theme: <code className="bg-stone-100 px-1 rounded">{bg.label}</code>
            </p>
          </div>
          <Link href="/mr/preview/reel-backgrounds" className="text-xs text-[#d4a843] hover:underline">
            ← bg themes
          </Link>
        </header>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {rashiList.map((r) => (
            <Link
              key={r.id}
              href={`?rashi=${r.id}`}
              className={`px-2.5 py-1 rounded-full text-xs border ${
                r.id === rashiId
                  ? "bg-[#3d0c0c] text-white border-[#3d0c0c]"
                  : "bg-white text-stone-600 border-stone-200 hover:border-[#d4a843]"
              }`}
            >
              <span className="mr-1">{r.symbol}</span>{r.mr}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {samples.map((s) => (
            <div key={s.id} className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-[#3d0c0c]">{s.label}</div>
              <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: "9 / 16", containerType: "inline-size" }}>
                {s.comp}
              </div>
              <code className="text-[10px] text-stone-400">{s.id}</code>
            </div>
          ))}
        </div>

        <section className="mt-10 bg-white rounded-xl border border-stone-200 p-4 text-xs text-stone-600">
          <h2 className="text-sm font-bold text-[#3d0c0c] mb-2">Design notes</h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>No cartoon zodiac icons. Unicode symbol ({rashiMeta.symbol}) used only as small decorative mark or hidden entirely.</li>
            <li>Typography-first — rashi name is the hero, not a side element.</li>
            <li>Each style distinct: script flow, constellation, stamp, graphic divider, ornamental.</li>
            <li>All Devanagari renders without letter-spacing (conjunct-safe).</li>
            <li>Per-rashi constellation points from real zodiac star pattern.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Style 1: Temple Script — vertical calligraphic mantra layout
 * ═══════════════════════════════════════════════════════════════════ */
function TempleScript({ bg, meta }: { bg: ReturnType<typeof getWeekBackground>; meta: RashiMeta }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg.gradient }}>
      <BrandBadge bg={bg} />

      {/* Ornamental top frame */}
      <div className="absolute top-[7%] left-[10%] right-[10%] flex items-center gap-2 z-10">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${bg.accentGold}, transparent)` }} />
        <span style={{ color: bg.accentGold, fontSize: 16 }}>❋</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${bg.accentGold}, transparent)` }} />
      </div>

      {/* Mantra "॥ श्री ॥" invocation */}
      <div className="absolute top-[11%] left-0 right-0 text-center z-10">
        <div className="font-bold" style={{ color: bg.accentGold, fontFamily: SERIF, fontSize: "6cqw" }}>
          ॥ श्री ॥
        </div>
      </div>

      {/* Giant centered rashi name — typography hero */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
        <div
          className="text-white font-bold leading-none"
          style={{
            fontFamily: SERIF,
            fontSize: "26cqw",
            textShadow: `0 0 40px ${bg.accentGold}77, 0 6px 16px rgba(0,0,0,0.6)`,
            letterSpacing: "-0.01em",
          }}
        >
          {meta.mr}
        </div>
        {/* Subtle gold underline ornament */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px w-12" style={{ background: bg.accentGold }} />
          <span style={{ color: bg.accentGold, fontSize: 14 }}>◈</span>
          <div className="h-px w-12" style={{ background: bg.accentGold }} />
        </div>
        <div className="font-semibold" style={{ color: bg.accentGold, fontFamily: SERIF, fontSize: "5cqw", marginTop: "2cqw" }}>
          राशीभविष्य
        </div>
      </div>

      {/* Bottom date plate */}
      <div className="absolute bottom-[8%] left-0 right-0 text-center z-10">
        <div
          className="inline-flex items-center rounded-sm"
          style={{ background: `${bg.accentGold}`, color: "#1a0505", padding: "1.5cqw 4cqw", gap: "2cqw" }}
        >
          <span style={{ fontSize: "4cqw" }}>✦</span>
          <span className="font-bold" style={{ fontFamily: SERIF, fontSize: "5.5cqw" }}>{DATE_STR}</span>
          <span style={{ fontSize: "4cqw" }}>✦</span>
        </div>
      </div>

      {/* Ornamental bottom frame */}
      <div className="absolute bottom-[4%] left-[10%] right-[10%] flex items-center gap-2 z-10">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${bg.accentGold}, transparent)` }} />
        <span style={{ color: bg.accentGold, fontSize: 12 }}>❋</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${bg.accentGold}, transparent)` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Style 2: Constellation — stars connected by thin gold lines
 * ═══════════════════════════════════════════════════════════════════ */
function Constellation({
  bg,
  meta,
  ext,
}: {
  bg: ReturnType<typeof getWeekBackground>;
  meta: RashiMeta;
  ext: { stars: [number, number][] };
}) {
  const { stars } = ext;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg.gradient }}>
      <BrandBadge bg={bg} />

      {/* Top subtitle */}
      <div className="absolute top-[10%] left-0 right-0 text-center z-10">
        <div className="text-xs font-semibold" style={{ color: bg.accentGold, fontFamily: SERIF }}>
          ॥ आजचे राशीभविष्य ॥
        </div>
      </div>

      {/* Constellation in middle 60% */}
      <svg
        className="absolute z-10"
        style={{ top: "22%", left: "8%", width: "84%", height: "38%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Connect lines */}
        {stars.slice(0, -1).map((p, i) => {
          const next = stars[i + 1];
          return (
            <line
              key={i}
              x1={p[0]}
              y1={p[1]}
              x2={next[0]}
              y2={next[1]}
              stroke={bg.accentGold}
              strokeWidth="0.3"
              strokeDasharray="1 1.5"
              opacity="0.6"
            />
          );
        })}
        {/* Stars */}
        {stars.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="2.5" fill={bg.accentGold} opacity="0.15" />
            <circle cx={p[0]} cy={p[1]} r="1" fill={bg.accentGold} />
          </g>
        ))}
      </svg>

      {/* Rashi symbol as small glyph watermark behind stars */}
      <div
        className="absolute text-[10rem] font-black select-none z-0"
        style={{
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          color: bg.accentGold,
          opacity: 0.08,
          fontFamily: SERIF,
          lineHeight: 1,
        }}
      >
        {meta.symbol}
      </div>

      {/* Rashi name block bottom-half */}
      <div className="absolute bottom-[15%] left-0 right-0 text-center z-10">
        <div
          className="text-white font-bold leading-none"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.5rem, 18vw, 6rem)",
            textShadow: `0 0 30px ${bg.accentGold}55`,
          }}
        >
          {meta.mr}
        </div>
        <div className="mt-2 text-base" style={{ color: bg.accentGold, fontFamily: "Georgia, serif", letterSpacing: "0.25em" }}>
          {meta.en.toUpperCase()}
        </div>
      </div>

      {/* Bottom date */}
      <div className="absolute bottom-[6%] left-0 right-0 text-center z-10">
        <div className="text-sm font-semibold" style={{ color: bg.accentGold, fontFamily: SERIF }}>
          {DATE_STR}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Style 3: Stamp & Seal — rashi name inside circular wax-seal ornament
 * ═══════════════════════════════════════════════════════════════════ */
function StampSeal({
  bg,
  meta,
  ext,
}: {
  bg: ReturnType<typeof getWeekBackground>;
  meta: RashiMeta;
  ext: { lord: string };
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg.gradient }}>
      <BrandBadge bg={bg} />

      {/* Top brand line */}
      <div className="absolute top-[10%] left-0 right-0 text-center z-10">
        <div className="text-xs font-semibold" style={{ color: bg.accentGold, fontFamily: SERIF }}>
          ॥ भाग्यवेध ॥ {DATE_STR}
        </div>
      </div>

      {/* Circular seal — center */}
      <div
        className="absolute flex items-center justify-center z-10"
        style={{ top: "22%", left: "10%", width: "80%", aspectRatio: "1" }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px]" style={{ borderColor: bg.accentGold }} />
        {/* Inner ring */}
        <div className="absolute inset-[8%] rounded-full border" style={{ borderColor: `${bg.accentGold}99`, borderStyle: "dashed" }} />
        {/* Innermost gold fill circle */}
        <div
          className="absolute inset-[15%] rounded-full flex flex-col items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${bg.accentGold}25 0%, transparent 70%)`,
          }}
        >
          <div
            className="text-white font-bold leading-none"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(3rem, 20vw, 7rem)",
              textShadow: `0 0 30px ${bg.accentGold}aa`,
            }}
          >
            {meta.mr}
          </div>
          <div className="mt-2 text-sm font-semibold" style={{ color: bg.accentGold, fontFamily: SERIF }}>
            राशी
          </div>
        </div>
        {/* 4 ornamental points N/S/E/W */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2"
            style={{
              width: 10,
              height: 10,
              transform: `rotate(${deg}deg) translateY(-51%) translate(-50%, -50%)`,
              transformOrigin: "0 0",
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: bg.accentGold,
                boxShadow: `0 0 10px ${bg.accentGold}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom hook */}
      <div className="absolute bottom-[10%] left-0 right-0 text-center z-10 px-6">
        <div className="text-white text-lg font-bold" style={{ fontFamily: SERIF, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
          आजचे राशीभविष्य
        </div>
        <div className="mt-1 text-sm" style={{ color: bg.accentGold, fontFamily: SERIF }}>
          स्वामी ग्रह · {ext.lord}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Style 4: Divider Bold — icon framed in gold ring, name hero below
 * ═══════════════════════════════════════════════════════════════════ */
function DividerBold({ bg, meta }: { bg: ReturnType<typeof getWeekBackground>; meta: RashiMeta }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg.gradient }}>
      <BrandBadge bg={bg} />

      {/* Top heading block — date + 2-line title, larger for date prominence */}
      <div className="absolute left-0 right-0 text-center px-6 z-10" style={{ top: "12%" }}>
        <div
          className="font-bold"
          style={{ color: bg.accentGold, fontFamily: SERIF, fontSize: "6cqw", marginBottom: "4cqw" }}
        >
          ॥ {DATE_STR} ॥
        </div>
        <div
          className="text-white font-bold"
          style={{ fontFamily: SERIF, fontSize: "11cqw", lineHeight: 1.05, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
        >
          आजचे
          <br />
          राशीभविष्य
        </div>
      </div>

      {/* Icon in gold ring — pushed below 2-line heading with safe gap */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10"
        style={{ top: "calc(38% + 17px)", width: "42%", aspectRatio: "1" }}
      >
        {/* Outer gold ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `3px solid ${bg.accentGold}`,
            boxShadow: `0 0 30px ${bg.accentGold}66, inset 0 0 20px ${bg.accentGold}22`,
          }}
        />
        {/* Inner dashed ring */}
        <div
          className="absolute inset-[8%] rounded-full"
          style={{ border: `1px dashed ${bg.accentGold}aa` }}
        />
        {/* Inner gold glow disc */}
        <div
          className="absolute inset-[14%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${bg.accentGold}33 0%, ${bg.accentGold}11 60%, transparent 100%)`,
          }}
        />
        {/* Rashi icon (cartoon SVG) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.icon}
          alt={meta.mr}
          style={{
            width: "62%",
            height: "62%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 18px ${bg.accentGold}cc) drop-shadow(0 4px 8px rgba(0,0,0,0.4))`,
            position: "relative",
            zIndex: 2,
          }}
        />
        {/* 4 compass dots */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2"
            style={{
              width: 8,
              height: 8,
              transform: `rotate(${deg}deg) translateY(-52%) translate(-50%, -50%)`,
              transformOrigin: "0 0",
              borderRadius: "50%",
              background: bg.accentGold,
              boxShadow: `0 0 8px ${bg.accentGold}`,
            }}
          />
        ))}
      </div>

      {/* Rashi name hero — centered bottom, no ARIES caption */}
      <div className="absolute left-0 right-0 text-center z-10 px-4" style={{ bottom: "calc(6% - 28px)" }}>
        <div
          className="text-white font-bold leading-none"
          style={{
            fontFamily: SERIF,
            fontSize: "26cqw",
            textShadow: `0 0 40px ${bg.accentGold}88, 0 4px 12px rgba(0,0,0,0.6)`,
          }}
        >
          {meta.mr}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Style 5: Ornament + Hook — corner frames, icon medallion, curiosity Q
 * ═══════════════════════════════════════════════════════════════════ */
function OrnamentHook({ bg, meta }: { bg: ReturnType<typeof getWeekBackground>; meta: RashiMeta }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg.gradient }}>
      <BrandBadge bg={bg} />

      {/* Top: rashi name hero — no ♈ symbol, no ARIES */}
      <div className="absolute left-0 right-0 text-center z-10 px-4" style={{ top: "10%" }}>
        <div
          className="font-bold"
          style={{ color: bg.accentGold, fontFamily: SERIF, fontSize: "6cqw", marginBottom: "4cqw" }}
        >
          ॥ {DATE_STR} ॥
        </div>
        <div
          className="text-white font-bold leading-none"
          style={{
            fontFamily: SERIF,
            fontSize: "12cqw",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {meta.mr} राशी
        </div>
      </div>

      {/* Icon medallion — smaller so hook text has room below */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10"
        style={{ top: "calc(30% + 10px)", width: "32%", aspectRatio: "1" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${bg.accentGold}`,
            background: `radial-gradient(circle, ${bg.accentGold}22 0%, transparent 70%)`,
            boxShadow: `0 0 25px ${bg.accentGold}55`,
          }}
        />
        <div
          className="absolute inset-[8%] rounded-full"
          style={{ border: `1px dashed ${bg.accentGold}88` }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.icon}
          alt={meta.mr}
          style={{
            width: "72%",
            height: "72%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 14px ${bg.accentGold}cc)`,
          }}
        />
      </div>

      {/* Hook text — sits below icon, above date CTA, no overlap */}
      <div className="absolute left-0 right-0 text-center px-4 z-10" style={{ top: "60%" }}>
        <div
          className="text-white font-black leading-[1.1]"
          style={{
            fontFamily: SERIF,
            fontSize: "9cqw",
            textShadow: `0 0 25px ${bg.accentGold}77, 0 3px 8px rgba(0,0,0,0.6)`,
          }}
        >
          आज <span style={{ color: bg.accentGold }}>शुभ</span> की{" "}
          <span style={{ color: bg.accentGold }}>अशुभ?</span>
        </div>
      </div>

      {/* Date CTA bottom */}
      <div className="absolute bottom-[9%] left-0 right-0 text-center z-10">
        <div
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-sm font-bold"
          style={{ background: bg.accentGold, color: "#1a0505", fontFamily: SERIF }}
        >
          <span style={{ fontSize: 12 }}>▶</span>
          <span>पहा · {DATE_STR}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared ─── */

function BrandBadge({ bg }: { bg: ReturnType<typeof getWeekBackground> }) {
  return (
    <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
        style={{ background: `linear-gradient(135deg, ${bg.accentGold}, ${bg.accentGold}cc)`, color: "#3d0c0c" }}
      >
        भा
      </div>
      <span className="text-[10px] font-semibold" style={{ color: bg.accentGold, fontFamily: SERIF }}>
        भाग्यवेध
      </span>
    </div>
  );
}

function CornerOrnaments({ color }: { color: string }) {
  const corner = (cls: string) => (
    <div className={`absolute ${cls} w-8 h-8 z-10`}>
      <div className="absolute inset-0" style={{
        borderTop: `2px solid ${color}`,
        borderLeft: `2px solid ${color}`,
      }} />
    </div>
  );

  return (
    <>
      <div className="absolute top-[5%] left-[5%] w-10 h-10 z-10">
        <div className="absolute inset-0" style={{ borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      </div>
      <div className="absolute top-[5%] right-[5%] w-10 h-10 z-10">
        <div className="absolute inset-0" style={{ borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      </div>
      <div className="absolute bottom-[5%] left-[5%] w-10 h-10 z-10">
        <div className="absolute inset-0" style={{ borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      </div>
      <div className="absolute bottom-[5%] right-[5%] w-10 h-10 z-10">
        <div className="absolute inset-0" style={{ borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      </div>
      {/* suppress unused warning */}
      <span className="hidden">{corner("")}</span>
    </>
  );
}
