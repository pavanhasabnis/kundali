"use client";

import { useSearchParams } from "next/navigation";

const MONTHS_MR = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];

function toDevanagariNumber(n: number): string {
  return String(n).replace(/\d/g, (d) => "०१२३४५६७८९"[Number(d)]);
}

export default function ThumbnailClient({
  rashiId,
  rashiMr,
  rashiSlug,
}: {
  rashiId: number;
  rashiMr: string;
  rashiSlug: string;
}) {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  // Default: today IST
  const now = dateParam
    ? (() => { const [y, m, d] = dateParam.split("-").map(Number); return new Date(y, m - 1, d); })()
    : new Date(Date.now() + 5.5 * 3600 * 1000);
  const day = now.getUTCDate ? (dateParam ? now.getDate() : now.getUTCDate()) : now.getDate();
  const monthIdx = dateParam ? now.getMonth() : now.getUTCMonth();

  const dateMr = `॥ ${toDevanagariNumber(day)} ${MONTHS_MR[monthIdx]} ॥`;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: "linear-gradient(180deg, #0a2b28 0%, #082421 50%, #061b1a 100%)",
        fontFamily: "'Tiro Devanagari Marathi', 'Noto Sans Devanagari', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 60px",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Brand mark top-left */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 50,
          fontSize: 22,
          color: "#d4a843",
          fontWeight: 700,
          letterSpacing: "2px",
          opacity: 0.9,
        }}
      >
        भाग्यवेध
      </div>

      {/* Top block — date + title */}
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <div
          style={{
            fontSize: 52,
            color: "#d4a843",
            marginBottom: 40,
            letterSpacing: "1px",
          }}
        >
          {dateMr}
        </div>
        <div
          style={{
            fontSize: 110,
            color: "#ffffff",
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          आजचे
          <br />
          राशीभविष्य
        </div>
      </div>

      {/* Rashi icon — LARGE, centered */}
      <div
        style={{
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 168, 67, 0.18) 0%, rgba(212, 168, 67, 0.05) 60%, transparent 100%)",
          border: "3px solid rgba(212, 168, 67, 0.55)",
          boxShadow: "0 0 100px rgba(212, 168, 67, 0.35), inset 0 0 80px rgba(212, 168, 67, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "30px 0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/rashi-gold/${rashiSlug}.svg`}
          alt={rashiMr}
          style={{
            width: 420,
            height: 420,
            filter: "drop-shadow(0 0 30px rgba(245, 197, 67, 0.7))",
          }}
        />
      </div>

      {/* Bottom — rashi name */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontSize: 200,
            color: "#ffffff",
            fontWeight: 900,
            letterSpacing: "4px",
            lineHeight: 1,
            textShadow: "0 0 60px rgba(245, 230, 184, 0.4), 0 0 30px rgba(212, 168, 67, 0.3)",
          }}
        >
          {rashiMr}
        </div>
      </div>
    </div>
  );
}
