"use client";

import { useMemo } from "react";
import { BACKGROUNDS, getIsoWeek, getWeekRange, type ReelBackground } from "@/lib/reel-backgrounds";

const TODAY = new Date();
const THIS_YEAR = TODAY.getFullYear();
const CURRENT_WEEK = getIsoWeek(TODAY);

const MR_MONTHS = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];

function fmt(d: Date) {
  return `${d.getUTCDate()} ${MR_MONTHS[d.getUTCMonth()]}`;
}

export default function BgPreviewClient() {
  const weeks = useMemo(() => {
    return BACKGROUNDS.map((bg, idx) => {
      const weekNum = idx + 1;
      const range = getWeekRange(weekNum, THIS_YEAR);
      return { bg, weekNum, range, isCurrent: weekNum === CURRENT_WEEK };
    });
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-[#3d0c0c]">Reel Backgrounds — Weekly Rotation</h1>
          <p className="text-xs text-stone-500 mt-1">
            {BACKGROUNDS.length} themes · 1 per ISO week · full-year rotation · festival-aligned (Holi, Gudi Padwa, Guru Purnima, Ganesh, Navratri, Diwali).
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {weeks.map(({ bg, weekNum, range, isCurrent }) => (
            <WeekCard
              key={bg.id}
              bg={bg}
              weekNum={weekNum}
              rangeLabel={`${fmt(range.start)} – ${fmt(range.end)}`}
              isCurrent={isCurrent}
            />
          ))}
        </div>

        <section className="mt-10 bg-white rounded-xl border border-stone-200 p-4 text-xs text-stone-600">
          <h2 className="text-sm font-bold text-[#3d0c0c] mb-2">How it works</h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>All 12 rashi reels in same week share same background.</li>
            <li>Week number = ISO week. Rotates 1 → N → 1 across {BACKGROUNDS.length} themes.</li>
            <li>To add theme: append to <code className="bg-stone-100 px-1 rounded">src/lib/reel-backgrounds.ts</code> <code className="bg-stone-100 px-1 rounded">BACKGROUNDS</code> array.</li>
            <li>Force theme in reel preview: <code className="bg-stone-100 px-1 rounded">/mr/preview/rashifal-video/0?bg=midnight-blue</code> (after integration).</li>
          </ul>
        </section>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function WeekCard({
  bg,
  weekNum,
  rangeLabel,
  isCurrent,
}: {
  bg: ReelBackground;
  weekNum: number;
  rangeLabel: string;
  isCurrent: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold ${isCurrent ? "text-[#d4a843]" : "text-stone-500"}`}>
          WEEK {weekNum}
          {isCurrent && <span className="ml-1 px-1.5 py-0.5 rounded bg-[#d4a843] text-[#3d0c0c]">NOW</span>}
        </span>
        <span className="text-[10px] text-stone-400">{rangeLabel}</span>
      </div>

      <div
        className="relative rounded-xl overflow-hidden shadow-md"
        style={{
          aspectRatio: "9 / 16",
          background: bg.gradient,
        }}
      >
        <StarsLayer opacity={bg.starOpacity} color={bg.starColor} />

        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[#3d0c0c] font-bold text-[9px]"
            style={{ background: `linear-gradient(135deg, ${bg.accentGold}, ${bg.accentGold}cc)` }}
          >
            भा
          </div>
          <span className="text-[9px] font-semibold" style={{ color: bg.accentGold }}>भाग्यवेध</span>
        </div>

        <div className="absolute bottom-3 left-0 right-0 px-3 text-center z-10">
          <div className="text-[9px] tracking-widest uppercase mb-0.5" style={{ color: bg.accentGold }}>
            आजचे
          </div>
          <div className="text-white text-sm font-bold">राशीभविष्य</div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
          <div className="h-full w-1/3" style={{ background: bg.accentGold }} />
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-semibold text-[#3d0c0c]">{bg.label}</span>
        <code className="text-[10px] text-stone-400">{bg.id}</code>
      </div>
    </div>
  );
}

function StarsLayer({ opacity, color }: { opacity: number; color: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 25 }).map(() => ({
        w: Math.random() * 2 + 0.5,
        top: Math.random() * 100,
        left: Math.random() * 100,
        o: Math.random() * 0.8 + 0.2,
        d: 8 + Math.random() * 8,
        delay: Math.random() * 6,
      })),
    [],
  );

  return (
    <div className="absolute inset-0" style={{ opacity }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.w,
            height: s.w,
            top: `${s.top}%`,
            left: `${s.left}%`,
            background: color,
            opacity: s.o,
            animation: `twinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
