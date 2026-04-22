"use client";

/**
 * Monthly calendar card — 1080×1350 (Instagram feed 4:5) PNG generator.
 *
 * Usage: /mr/preview/monthly-calendar-image?month=4&year=2026&raw=1
 *   - raw=1 strips chrome for Playwright screenshot
 *   - month: 1-12 (default: current IST month)
 *   - year: 4-digit (default: current IST year)
 *
 * Data source: /api/calendar — panchang-calculated tithi, nakshatra and
 * festival markers. Designed as a single share-ready image for Instagram
 * pinned posts.
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Festival { name: string; nameMr: string; type: string; }
interface CalendarDay {
  date: string;
  day: number;
  dayOfWeek: number;
  dayName: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  rahuKaal: string;
  gulikaKaal: string;
  yamaganda: string;
  sunrise: string;
  sunset: string;
  moonRashi: string;
  festivals: Festival[];
}
interface CalendarResponse {
  year: number;
  month: number;
  daysInMonth: number;
  firstDayOfWeek: number;
  days: CalendarDay[];
}

const MONTHS_MR = [
  "जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून",
  "जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर",
];
const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS_MR = ["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"];

/** Convert ASCII digits to Devanagari numerals (० १ २ ३ ४ ५ ६ ७ ८ ९). */
function toDev(input: string | number): string {
  const map = "०१२३४५६७८९";
  return String(input).replace(/\d/g, (c) => map[parseInt(c, 10)]);
}

// Festival colours tuned for the cream-paper background. Deep jewel tones
// pop against #FAFAF8/tan card bg while staying readable at small sizes.
const FESTIVAL_COLORS = {
  major:      "#3d0c0c",
  national:   "#b8580a",
  state:      "#1e5d85",
  ekadashi:   "#6e2a87",
  vrat:       "#b8336a",
  observance: "#5d5d5d",
  minor:      "#6b5b3e",
};

/** Retained for future use but not currently invoked — Option A ships
 *  typography-only calendar cells. Keep in case we reintroduce symbols. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function festivalIcon(nameMr: string, type: string): string {
  const n = nameMr;

  // ─── Shiva-associated (specific trident/mahadev markers) ───
  if (/शिवरात्र|महाशिवरात्र|प्रदोष|शंकर/.test(n)) return "🔱";
  if (/नाग\s?पंचमी/.test(n)) return "🐍";

  // ─── Vishnu & avatars ───
  if (/एकादशी/.test(n)) return "🪷";
  if (/राम\s?नवमी|रामनवमी/.test(n)) return "🏹";
  if (/कृष्ण\s?जन्म|जन्माष्टमी|गोकुळाष्टमी/.test(n)) return "🪈";
  if (/नरसिंह|वामन|परशुराम|वराह|मत्स्य|कूर्म/.test(n)) return "🕉️";

  // ─── Ganesha ───
  if (/गणेश|विनायक|सिद्धिविनायक/.test(n)) return "🐘";
  if (/संकष्टी|चतुर्थी/.test(n)) return "🐘";

  // ─── Devi ───
  if (/नवरात्र|दुर्गा|लक्ष्मी\s?पूजन|अष्टमी\s?नवरात्र/.test(n)) return "🌺";

  // ─── Bhakti / Hanuman / sages ───
  if (/हनुमान/.test(n)) return "🪔";
  if (/शंकराचार्य|व्यास|दत्त/.test(n)) return "🕉️";

  // ─── Festivals of colour / celebration ───
  if (/होळी|होली|रंग\s?पंचमी/.test(n)) return "🎨";
  if (/दिवाळी|दीपावली|लक्ष्मीपूजन/.test(n)) return "🪔";
  if (/दसरा|विजयादशमी/.test(n)) return "⚔️";
  if (/गुढी|गुडी\s?पाडवा/.test(n)) return "🏵️";
  if (/रक्षा\s?बंधन|राखी/.test(n)) return "🪢";
  if (/संक्रांत/.test(n)) return "🪁";

  // ─── Auspicious days ───
  if (/अक्षय|तृतीया/.test(n)) return "🌟";
  if (/धनतेरस/.test(n)) return "💎";

  // ─── Reformer jayantis (Buddhist / social / educational) ───
  if (/आंबेडकर|अंबेडकर/.test(n)) return "☸️";
  if (/फुले|जोतिबा|सावित्रीबाई/.test(n)) return "📖";

  // ─── Regional new years ───
  if (/पुथंडू|विशू|बोइशाख|नववर्ष/.test(n)) return "🌅";
  if (/वैशाखी|बैसाखी/.test(n)) return "🌾";

  // ─── Christian ───
  if (/गुड\s?फ्रायडे|फ्रायडे/.test(n)) return "✝️";
  if (/ईस्टर/.test(n)) return "🕊️";

  // ─── Generic jayanti (any unmatched saint/leader birthday) ───
  if (/जयंती/.test(n)) return "🕉️";

  // ─── Type fallbacks ───
  switch (type) {
    case "ekadashi": return "🪷";
    case "vrat":     return "🪔";
    case "national": return "🎗️";
    case "state":    return "🌟";
    case "major":    return "🕉️";
    case "observance": return "✨";
    default:         return "🕉️";
  }
}

export default function CalendarImageClient() {
  const searchParams = useSearchParams();
  const isRaw = searchParams.get("raw") === "1";
  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const month = parseInt(searchParams.get("month") ?? String(now.getUTCMonth() + 1), 10);
  const year = parseInt(searchParams.get("year") ?? String(now.getUTCFullYear()), 10);

  const [data, setData] = useState<CalendarResponse | null>(null);

  useEffect(() => {
    fetch(`/api/calendar?month=${month}&year=${year}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [month, year]);

  // Convert 1-indexed Sunday-first dayOfWeek to grid offset
  const firstOffset = data ? data.firstDayOfWeek : 0;
  const totalCells = data ? Math.ceil((firstOffset + data.daysInMonth) / 7) * 7 : 35;

  // Pick top festivals to spotlight in the bottom strip (3-5 most notable)
  const spotlight = data
    ? data.days
        .flatMap((d) => d.festivals
          .filter((f) => ["major", "national", "ekadashi"].includes(f.type))
          .map((f) => ({ day: d.day, f })))
        .slice(0, 6)
    : [];

  const Card = (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: "#FAFAF8",
        color: "#3d0c0c",
        fontFamily: "Georgia, 'Noto Sans Devanagari', serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ─── Dark brown header band ─── */}
      <div style={{
        background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #2e0707 100%)",
        padding: "28px 40px 24px",
        position: "relative",
        borderBottom: "4px solid #d4a843",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Ganesha icon — same asset used across print-kundli, shop, and
              result pages so the calendar brand-matches other Bhaagyavedh
              deliverables. Wrapped in a cream-circle seal so the line-art
              reads on the dark maroon header and feels like a ceremonial
              mudra / sticker. */}
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #fff9ea 0%, #fce9b4 70%, #e5c87a 100%)",
            border: "3px solid #d4a843",
            boxShadow: "0 0 0 2px rgba(245,197,67,0.25), 0 4px 14px rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/kundli/ganesha-classic.svg"
              alt="श्री गणेश"
              style={{
                width: 96, height: 96,
                // Rich maroon tint — same as print-kundli palette, pops
                // against the cream seal.
                filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)",
              }}
            />
          </div>

          {/* Brand + tagline */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 36, color: "#f5c543", fontWeight: 700, letterSpacing: 1, lineHeight: 1 }}>
              भाग्यवेध
            </div>
            <div style={{ fontSize: 14, color: "#d4a843", marginTop: 6, fontWeight: 500, opacity: 0.9 }}>
              मराठी हिंदू दिनदर्शिका
            </div>
          </div>

          {/* Month + year block, right-aligned */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: "white", lineHeight: 1 }}>
              {MONTHS_MR[month - 1]}
            </div>
            <div style={{ fontSize: 32, color: "#d4a843", fontWeight: 700, marginTop: 4, lineHeight: 1 }}>
              {toDev(year)}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Inner padding wrapper ─── */}
      <div style={{ padding: "20px 36px 0", position: "relative" }}>
      {/* Subtle decorative border ring around body */}
      <div style={{
        position: "absolute", inset: "0 16px 16px 16px", top: 0,
        border: "1px solid #e5d5b5", borderRadius: 12,
        pointerEvents: "none",
      }} />

      {/* Weekday header */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
        marginTop: 12, position: "relative", zIndex: 2,
      }}>
        {WEEKDAYS_MR.map((d, i) => (
          <div key={i} style={{
            textAlign: "center", fontSize: 15, fontWeight: 700,
            color: i === 0 ? "#b8336a" : "#3d0c0c",
            padding: "8px 0",
            background: "#3d0c0c",
            color2: "white",
            borderRadius: "6px 6px 0 0",
          }}>
            <span style={{ color: i === 0 ? "#f5c543" : "#d4a843" }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
        marginTop: 4, position: "relative", zIndex: 2,
      }}>
        {Array.from({ length: totalCells }).map((_, idx) => {
          const dayNum = idx - firstOffset + 1;
          const day = data && dayNum >= 1 && dayNum <= data.daysInMonth
            ? data.days[dayNum - 1]
            : null;
          const isSunday = idx % 7 === 0;
          const topFestival = day?.festivals[0];
          const festColor = topFestival ? FESTIVAL_COLORS[topFestival.type as keyof typeof FESTIVAL_COLORS] ?? "#3d0c0c" : null;
          return (
            <div key={idx} style={{
              height: 116,
              background: day ? "#ffffff" : "transparent",
              border: day ? "1px solid #e5d5b5" : "none",
              borderTop: day && topFestival ? `3px solid ${festColor}` : day ? "1px solid #e5d5b5" : "none",
              borderRadius: 6,
              padding: "6px 7px",
              position: "relative",
              overflow: "hidden",
              boxShadow: day ? "0 1px 2px rgba(61,12,12,0.04)" : "none",
            }}>
              {day && (
                <>
                  {/* Date number in Devanagari */}
                  <div style={{
                    fontSize: 22, fontWeight: 700,
                    color: isSunday ? "#b8336a" : "#3d0c0c",
                    lineHeight: 1,
                  }}>{toDev(day.day)}</div>
                  {/* Tithi */}
                  <div style={{
                    fontSize: 9.5, color: "#8c6a1d",
                    marginTop: 3, lineHeight: 1.1, fontWeight: 600,
                  }}>
                    {day.tithi}
                  </div>
                  {/* Nakshatra */}
                  <div style={{
                    fontSize: 9, color: "#6b5b3e",
                    marginTop: 2, lineHeight: 1.1,
                  }}>
                    {day.nakshatra?.slice(0, 12) ?? ""}
                  </div>
                  {/* Festival name */}
                  {topFestival && (
                    <div style={{
                      position: "absolute", bottom: 4, left: 6, right: 6,
                      fontSize: 9, fontWeight: 700,
                      color: festColor ?? "#3d0c0c",
                      lineHeight: 1.15,
                    }}>
                      {topFestival.nameMr.length > 22 ? topFestival.nameMr.slice(0, 21) + "…" : topFestival.nameMr}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Festival spotlight */}
      {spotlight.length > 0 && (
        <div style={{
          marginTop: 16, position: "relative", zIndex: 2,
          background: "#ffffff", borderRadius: 10, padding: 14,
          border: "1px solid #e5d5b5",
          boxShadow: "0 2px 6px rgba(61,12,12,0.06)",
        }}>
          <div style={{
            color: "#d4a843", fontSize: 13, letterSpacing: 0,
            marginBottom: 10, fontWeight: 700,
          }}>या महिन्यातील प्रमुख सण</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {spotlight.map((s, i) => {
              const c = FESTIVAL_COLORS[s.f.type as keyof typeof FESTIVAL_COLORS] ?? "#3d0c0c";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    minWidth: 48, height: 48, borderRadius: 10,
                    background: "linear-gradient(135deg, #f5c543, #d4a843)",
                    color: "#3d0c0c", fontWeight: 700, fontSize: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #8c6a1d",
                  }}>{toDev(s.day)}</div>
                  <div style={{
                    fontSize: 11.5, color: c, lineHeight: 1.2, fontWeight: 700,
                    borderLeft: `3px solid ${c}`, paddingLeft: 8,
                  }}>
                    {s.f.nameMr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      </div>{/* /inner padding wrapper */}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 28, left: 0, right: 0,
        textAlign: "center", zIndex: 2,
      }}>
        <div style={{ color: "#d4a843", fontSize: 13, letterSpacing: 2, fontWeight: 600 }}>
          bhaagyavedh.com
        </div>
        <div style={{ color: "#8c6a1d", fontSize: 11, letterSpacing: 0, marginTop: 3 }}>
          दररोज पंचांग · राशीभविष्य · मुहूर्त
        </div>
      </div>
    </div>
  );

  if (isRaw) {
    return (
      <div style={{
        width: 1080, height: 1350, margin: 0, padding: 0, overflow: "hidden",
        background: "#000",
      }}>{Card}</div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f1", padding: 32 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, color: "#3d0c0c", marginBottom: 8 }}>
          Calendar Image Preview — {MONTHS_MR[month - 1]} {year}
        </h1>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          1080×1350 (Instagram feed 4:5) — add <code>?raw=1</code> for recorder
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{Card}</div>
      </div>
    </div>
  );
}
