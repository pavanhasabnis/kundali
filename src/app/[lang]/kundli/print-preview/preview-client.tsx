"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────
// A4 proportions (96dpi): 794 × 1123. We scale to fit side-by-side.
// Header 40px, Footer 28px (flex-shrink:0). Content fills the rest.
// Purpose of this route: LAYOUT-ONLY mockup. Real chart SVG + real
// data remain in kundli-result-client.tsx. Do NOT ship as is.
// ─────────────────────────────────────────────────────────────────

type PlanetRow = { name: string; rashi: string; house: number; dignity: string; retro?: boolean };

const SAMPLE_PLANETS: PlanetRow[] = [
  { name: "सूर्य", rashi: "कर्क", house: 5, dignity: "मित्र" },
  { name: "चंद्र", rashi: "कुंभ", house: 12, dignity: "सम" },
  { name: "मंगळ", rashi: "मीन", house: 1, dignity: "मित्र" },
  { name: "बुध", rashi: "कर्क", house: 5, dignity: "शत्रु" },
  { name: "गुरु", rashi: "कर्क", house: 5, dignity: "उच्च" },
  { name: "शुक्र", rashi: "कर्क", house: 5, dignity: "सम" },
  { name: "शनि", rashi: "मकर", house: 11, dignity: "स्व", retro: true },
  { name: "राहु", rashi: "सिंह", house: 6, dignity: "मित्र", retro: true },
  { name: "केतु", rashi: "कुंभ", house: 12, dignity: "मित्र", retro: true },
];

// Simple placeholder chart (diamond frame only — not real planet placement)
function ChartPlaceholder({ size = 260, title }: { size?: number; title: string }) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg viewBox="0 0 400 400" width={size} height={size} style={{ background: "#fafaf8", border: "2px solid #8b2c2c" }}>
        <rect x="0" y="0" width="400" height="400" fill="none" stroke="#8b2c2c" strokeWidth="2" />
        <line x1="0" y1="0" x2="400" y2="400" stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="#8b2c2c" strokeWidth="1.5" />
        <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#8b2c2c" strokeWidth="1.5" />
        <text x="200" y="210" textAnchor="middle" fontSize="14" fontWeight="700" fill="#8b2c2c">{title}</text>
        <text x="200" y="230" textAnchor="middle" fontSize="10" fill="#999">(chart SVG)</text>
      </svg>
    </div>
  );
}

function A4Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#5c1a1a", marginBottom: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</div>
      <div style={{ width: 480, height: 678, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #ddd", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a, #3d0c0c)", padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #d4a843", flexShrink: 0, minHeight: "28px" }}>
      <span style={{ color: "#d4a843", fontSize: "9px", fontWeight: 700 }}>भाग्यवेध</span>
      <span style={{ color: "#d4a843", fontSize: "8px", opacity: 0.5 }}>॥ श्री गणेशाय नमः ॥</span>
    </div>
  );
}

function PageFooter() {
  return (
    <div style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", padding: "4px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, marginTop: "auto", minHeight: "20px" }}>
      <span style={{ color: "#d4a843", fontSize: "7px", fontWeight: 700, letterSpacing: "1px" }}>Bhaagyavedh</span>
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "6px" }}>bhaagyavedh.com</span>
    </div>
  );
}

function PlanetTable({ planets, fontSize = 8 }: { planets: PlanetRow[]; fontSize?: number }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: `${fontSize}px` }}>
      <thead>
        <tr style={{ background: "#3d0c0c", color: "#d4a843" }}>
          <th style={{ padding: "3px 5px", textAlign: "left", fontSize: `${fontSize - 1}px`, fontWeight: 600 }}>ग्रह</th>
          <th style={{ padding: "3px 5px", textAlign: "left", fontSize: `${fontSize - 1}px`, fontWeight: 600 }}>राशी</th>
          <th style={{ padding: "3px 5px", textAlign: "center", fontSize: `${fontSize - 1}px`, fontWeight: 600 }}>भाव</th>
          <th style={{ padding: "3px 5px", textAlign: "left", fontSize: `${fontSize - 1}px`, fontWeight: 600 }}>स्थिती</th>
        </tr>
      </thead>
      <tbody>
        {planets.map((p, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7" }}>
            <td style={{ padding: "3px 5px", fontWeight: 600, color: "#3d0c0c" }}>{p.name}{p.retro ? " (व)" : ""}</td>
            <td style={{ padding: "3px 5px", color: "#3d0c0c" }}>{p.rashi}</td>
            <td style={{ padding: "3px 5px", textAlign: "center", fontWeight: 600, color: "#3d0c0c" }}>{p.house}</td>
            <td style={{ padding: "3px 5px", color: "#3d0c0c" }}>{p.dignity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InterpBox({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 6px 6px 0", padding: "8px 10px", marginTop: "8px" }}>
      <div style={{ fontSize: "8px", color: "#8b6b4a", fontWeight: 600, marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "9px", color: "#3d0c0c", lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

// ─── CURRENT (BEFORE) ─────────────────────────────────────────────
function CurrentEmptyDChart() {
  return (
    <A4Frame label="BEFORE — D2 (Hora) current production">
      <PageHeader />
      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>होरा (D2) — संपत्ती</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ChartPlaceholder size={240} title="D2" />
        </div>
        <div style={{ marginTop: "8px", textAlign: "center", fontSize: "9px", color: "#c62828", padding: "8px", background: "#fce4ec", borderRadius: "4px" }}>
          ⚠ ~70% blank space below
        </div>
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── FIX A — chart left + sig right, full-width planet table + house-wise below ──
function FixA_DChart() {
  const houseBuckets: Record<number, PlanetRow[]> = {};
  SAMPLE_PLANETS.forEach(p => { (houseBuckets[p.house] = houseBuckets[p.house] || []).push(p); });
  const occupied = Object.entries(houseBuckets).sort((a, b) => Number(a[0]) - Number(b[0]));

  return (
    <A4Frame label="AFTER (Fix A) — chart + full-width planet table + house-wise row">
      <PageHeader />
      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1c1917", marginBottom: "2px" }}>होरा (D2) — संपत्ती</h2>
        <div style={{ fontSize: "8px", color: "#8b6b4a", marginBottom: "8px" }}>
          संपत्ती, द्रव्य सुख आणि आर्थिक भाग्य — सूर्य/चंद्र होरा वर्गीकरण.
        </div>

        {/* 2-col: chart left, significance right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "start", marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ChartPlaceholder size={180} title="D2" />
          </div>
          <div>
            <InterpBox label="होरा (D2) — महत्त्व" text="संपत्ती, द्रव्य सुख आणि आर्थिक भाग्य. सूर्य होरा → पैसा कमावण्याचा पुरुषार्थ. चंद्र होरा → आर्थिक स्थैर्य आणि बचत." />
          </div>
        </div>

        {/* Full-width planet table */}
        <div style={{ fontSize: "8px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", marginBottom: "3px", paddingBottom: "2px", borderBottom: "1px solid #f5efe0" }}>
          ग्रह स्थानं — होरा (D2)
        </div>
        <PlanetTable planets={SAMPLE_PLANETS} fontSize={8} />

        {/* House-wise distribution */}
        <div style={{ fontSize: "8px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", marginTop: "10px", marginBottom: "3px", paddingBottom: "2px", borderBottom: "1px solid #f5efe0" }}>
          भावनिहाय स्थान
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
          {occupied.map(([h, list]) => (
            <div key={h} style={{ fontSize: "8px", background: "#FFFDF5", border: "1px solid #f5efe0", borderLeft: "2px solid #d4a843", borderRadius: "3px", padding: "4px 6px" }}>
              <strong style={{ color: "#5c1a1a" }}>भाव {h}:</strong>{" "}
              <span style={{ color: "#3d0c0c" }}>{list.map(p => p.name + (p.retro ? " (व)" : "")).join(", ")}</span>
            </div>
          ))}
        </div>
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── FIX B — 2-col chart + interpretation ─────────────────────────
function FixB_LagnaChart() {
  return (
    <A4Frame label="AFTER (Fix B) — 2-col: chart left, interpretation right">
      <PageHeader />
      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>लग्न कुंडली</h2>
          <ChartPlaceholder size={200} title="D1" />
          <div style={{ marginTop: "10px" }}>
            <div style={{ fontSize: "8px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", marginBottom: "3px" }}>ग्रह स्थानं</div>
            <PlanetTable planets={SAMPLE_PLANETS.slice(0, 6)} fontSize={7} />
          </div>
        </div>
        <div>
          <InterpBox label="लग्न राशी" text="मीन — गुरु स्वामित्व. अंतर्ज्ञानी, कलात्मक, आध्यात्मिक, दयाळू." />
          <InterpBox label="लग्नेश स्थिती" text="गुरु (लग्नेश) भाव 5 मध्ये, कर्क राशीत. उच्च स्थितीत बलवान." />
          <InterpBox label="मंगळिक स्थिती" text="मंगळ दोष नाही. विवाह संबंधात कोणताही अडथळा नाही." />
          <InterpBox label="साडेसाती" text="उदय (पहिला चरण) — आर्थिक ताण, मानसिक अस्वस्थता शक्य. धैर्य ठेवा." />
        </div>
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── Current Lagna (before) ───────────────────────────────────────
function CurrentLagnaChart() {
  return (
    <A4Frame label="BEFORE — लग्न कुंडली current production">
      <PageHeader />
      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>लग्न कुंडली</h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <ChartPlaceholder size={220} title="D1" />
        </div>
        <InterpBox label="लग्न राशी" text="मीन — गुरु स्वामित्व. अंतर्ज्ञानी, कलात्मक, आध्यात्मिक, दयाळू." />
        <InterpBox label="लग्नेश स्थिती" text="गुरु (लग्नेश) भाव 5 मध्ये, कर्क राशीत." />
        <InterpBox label="मंगळिक स्थिती" text="मंगळ दोष नाही." />
        <InterpBox label="साडेसाती" text="उदय — आर्थिक ताण शक्य." />
        <div style={{ marginTop: "12px", textAlign: "center", fontSize: "9px", color: "#c62828", padding: "6px", background: "#fce4ec", borderRadius: "4px" }}>
          ⚠ ~35% blank bottom
        </div>
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── Current quick-facts (before) ─────────────────────────────────
function CurrentQuickFacts() {
  return (
    <A4Frame label="BEFORE — दोष स्थिती + शुभ माहिती">
      <PageHeader />
      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden" }}>
        <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", marginBottom: "6px" }}>दोष स्थिती</h2>
        {["मांगलिक दोष (मंगळ दोष) — अनुपस्थित", "कालसर्प दोष — अनुपस्थित", "साडेसाती — चालू, उदय (पहिला चरण)", "पितृ दोष — अनुपस्थित"].map((txt, i) => (
          <div key={i} style={{ fontSize: "9px", padding: "4px 0", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{txt}</div>
        ))}
        <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", margin: "12px 0 6px" }}>शुभ माहिती</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "6px" }}>
          {[["रत्न", "पुष्कराज"], ["रंग", "पिवळा"], ["अंक", "३"]].map(([l, v], i) => (
            <div key={i} style={{ border: "1px solid #d4a843", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "7px", color: "#8b6b4a" }}>{l}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#3d0c0c" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
          {[["वार", "गुरुवार"], ["दिशा", "ईशान्य"], ["धातू", "सोने"]].map(([l, v], i) => (
            <div key={i} style={{ border: "1px solid #d4a843", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "7px", color: "#8b6b4a" }}>{l}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#3d0c0c" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px", textAlign: "center", fontSize: "9px", color: "#c62828", padding: "6px", background: "#fce4ec", borderRadius: "4px" }}>
          ⚠ ~60% blank bottom
        </div>
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── Ganesha SVG — seated idol (traditional line-art) ─────────────
function GaneshaSeatedSVG({ size = 150 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Halo / prabhavali */}
      <circle cx="100" cy="105" r="92" fill="#FFFDF5" stroke="#8B0000" strokeWidth="1.5" />
      <circle cx="100" cy="105" r="88" fill="none" stroke="#8B0000" strokeWidth="0.6" strokeDasharray="2,2" />
      {/* Sun rays behind */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const x1 = 100 + Math.cos(a) * 88;
        const y1 = 105 + Math.sin(a) * 88;
        const x2 = 100 + Math.cos(a) * 94;
        const y2 = 105 + Math.sin(a) * 94;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8B0000" strokeWidth="0.8" />;
      })}

      <g fill="none" stroke="#8B0000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Crown/mukuta */}
        <path d="M70 50 L75 30 L85 45 L90 25 L100 45 L110 25 L115 45 L125 30 L130 50 Z" fill="#8B0000" />
        <circle cx="100" cy="22" r="3" fill="#8B0000" />
        <line x1="100" y1="14" x2="100" y2="20" strokeWidth="1.2" />

        {/* Head outline (large elephant head) */}
        <path d="M65 55 Q55 75 60 95 Q65 115 85 120" />
        <path d="M135 55 Q145 75 140 95 Q135 115 115 120" />
        <path d="M65 55 Q85 45 100 48 Q115 45 135 55" />

        {/* Large ears */}
        <path d="M60 65 Q35 70 30 90 Q30 110 50 115 Q60 115 62 105" fill="#FFF8E7" />
        <path d="M140 65 Q165 70 170 90 Q170 110 150 115 Q140 115 138 105" fill="#FFF8E7" />
        {/* Ear inner curves */}
        <path d="M55 75 Q45 88 48 102" strokeWidth="0.8" />
        <path d="M145 75 Q155 88 152 102" strokeWidth="0.8" />

        {/* Eyes */}
        <ellipse cx="82" cy="75" rx="3" ry="2" fill="#8B0000" />
        <ellipse cx="118" cy="75" rx="3" ry="2" fill="#8B0000" />
        <path d="M78 72 Q82 70 86 72" strokeWidth="0.8" />
        <path d="M114 72 Q118 70 122 72" strokeWidth="0.8" />

        {/* Tilak on forehead */}
        <path d="M95 58 L100 50 L105 58" strokeWidth="1" fill="#8B0000" />
        <circle cx="100" cy="62" r="1.5" fill="#8B0000" />

        {/* Trunk — curves to left with modak */}
        <path d="M100 85 Q95 100 90 110 Q82 120 75 118 Q70 115 74 108" strokeWidth="2" />
        {/* Tusks */}
        <path d="M88 92 Q85 98 82 96" strokeWidth="1.2" fill="#FFFDF5" />
        <path d="M112 92 Q115 98 118 96" strokeWidth="1.2" fill="#FFFDF5" />

        {/* Modak in trunk */}
        <circle cx="73" cy="110" r="4" fill="#d4a843" stroke="#8B0000" />
        <path d="M70 107 L73 103 L76 107" strokeWidth="0.8" />

        {/* Body (round belly) */}
        <path d="M70 120 Q55 145 60 175 Q75 195 100 195 Q125 195 140 175 Q145 145 130 120" fill="#FFFDF5" />
        <ellipse cx="100" cy="160" rx="30" ry="22" fill="none" strokeWidth="0.8" />

        {/* Arms — 4 */}
        {/* Upper right (ankush/hook) */}
        <path d="M125 120 Q145 115 155 100" strokeWidth="2" />
        <path d="M155 100 L160 88 M157 95 Q162 92 164 96" strokeWidth="1.2" />
        {/* Upper left (pasha/noose) */}
        <path d="M75 120 Q55 115 45 100" strokeWidth="2" />
        <circle cx="42" cy="93" r="5" strokeWidth="1.2" />
        {/* Lower right (modak bowl / varada mudra) */}
        <path d="M135 155 Q150 160 155 170" strokeWidth="2" />
        <circle cx="157" cy="173" r="4" fill="#d4a843" strokeWidth="0.8" />
        {/* Lower left (abhaya mudra) */}
        <path d="M65 155 Q50 160 45 170" strokeWidth="2" />
        <path d="M42 167 L42 175 M38 170 L46 170" strokeWidth="1.2" />

        {/* Crossed legs (padmasana) */}
        <path d="M70 190 Q85 205 100 200 Q115 205 130 190" strokeWidth="1.6" />
        <path d="M80 195 Q100 208 120 195" strokeWidth="1" />

        {/* Necklace */}
        <path d="M80 115 Q100 125 120 115" strokeWidth="1" />
        <circle cx="100" cy="122" r="2" fill="#d4a843" strokeWidth="0.6" />

        {/* Mushak (mouse) at bottom-right */}
        <ellipse cx="150" cy="200" rx="7" ry="4" fill="#8B0000" />
        <circle cx="145" cy="199" r="1" fill="#FFF8E7" />
        <path d="M143 197 L140 194 M143 201 L140 204" strokeWidth="0.8" />

        {/* Lotus base */}
        <path d="M50 200 Q75 215 100 210 Q125 215 150 200 Q140 220 100 222 Q60 220 50 200 Z" fill="#FFF8E7" strokeWidth="1" />
        <path d="M60 205 Q70 210 75 205 M80 208 Q90 213 95 208 M105 208 Q115 213 120 208 M125 205 Q135 210 140 205" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

// ─── Ganesha medallion (smaller head only for top) ────────────────
function GaneshaMedallionSVG({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FFFDF5" stroke="#8B0000" strokeWidth="2" />
      <g fill="none" stroke="#8B0000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Crown */}
        <path d="M34 28 L38 18 L44 26 L50 16 L56 26 L62 18 L66 28 Z" fill="#8B0000" />
        {/* Head */}
        <path d="M30 35 Q25 55 35 70 Q50 80 65 70 Q75 55 70 35" />
        {/* Ears */}
        <path d="M28 38 Q16 45 18 60 Q22 68 32 65" fill="#FFF8E7" />
        <path d="M72 38 Q84 45 82 60 Q78 68 68 65" fill="#FFF8E7" />
        {/* Eyes */}
        <circle cx="40" cy="45" r="1.5" fill="#8B0000" />
        <circle cx="60" cy="45" r="1.5" fill="#8B0000" />
        {/* Tilak */}
        <path d="M47 36 L50 30 L53 36" fill="#8B0000" />
        {/* Trunk */}
        <path d="M50 52 Q46 62 42 68 Q38 72 35 70" strokeWidth="1.8" />
        {/* Tusks */}
        <path d="M44 56 Q42 60 40 58" strokeWidth="0.8" />
        <path d="M56 56 Q58 60 60 58" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

// ─── Corner rosette ───────────────────────────────────────────────
function CornerRosette({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <g fill="none" stroke="#8B0000" strokeWidth="1">
        <circle cx="20" cy="20" r="14" />
        <circle cx="20" cy="20" r="9" />
        <circle cx="20" cy="20" r="4" fill="#8B0000" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          const x1 = 20 + Math.cos(a) * 9;
          const y1 = 20 + Math.sin(a) * 9;
          const x2 = 20 + Math.cos(a) * 14;
          const y2 = 20 + Math.sin(a) * 14;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {/* outer diamond */}
        <polygon points="20,2 38,20 20,38 2,20" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

// ─── Side paisley motif (repeating on border) ─────────────────────
function PaisleyStrip({ vertical = false, length = 500 }: { vertical?: boolean; length?: number }) {
  const count = Math.floor(length / 24);
  return (
    <svg
      viewBox={vertical ? `0 0 24 ${count * 24}` : `0 0 ${count * 24} 24`}
      width={vertical ? 24 : length}
      height={vertical ? length : 24}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const offset = i * 24;
        return (
          <g key={i} transform={vertical ? `translate(0, ${offset})` : `translate(${offset}, 0)`}>
            <g fill="none" stroke="#8B0000" strokeWidth="0.9">
              {/* small paisley / lotus motif in 24x24 */}
              <path d="M12 4 Q6 10 8 16 Q12 22 16 16 Q18 10 12 4 Z" fill="#8B0000" fillOpacity="0.15" />
              <circle cx="12" cy="12" r="2" fill="#8B0000" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Traditional Front Cover (janma patrika) ──────────────────────
function TraditionalCover() {
  return (
    <A4Frame label="NEW — Traditional Janma Patrika Cover">
      {/* NO header/footer on cover page — full-bleed traditional design */}
      <div style={{ flex: 1, padding: "0", background: "#FFF8E7", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Outer double border */}
        <div style={{
          position: "absolute", inset: "8px",
          border: "2px solid #8B0000",
          pointerEvents: "none",
          zIndex: 1,
        }} />
        <div style={{
          position: "absolute", inset: "14px",
          border: "1px solid #8B0000",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Paisley side strips */}
        <div style={{ position: "absolute", top: "24px", left: "24px", pointerEvents: "none", zIndex: 1 }}>
          <PaisleyStrip vertical length={620} />
        </div>
        <div style={{ position: "absolute", top: "24px", right: "24px", pointerEvents: "none", zIndex: 1 }}>
          <PaisleyStrip vertical length={620} />
        </div>
        <div style={{ position: "absolute", top: "24px", left: "48px", right: "48px", pointerEvents: "none", zIndex: 1 }}>
          <PaisleyStrip length={380} />
        </div>
        <div style={{ position: "absolute", bottom: "24px", left: "48px", right: "48px", pointerEvents: "none", zIndex: 1 }}>
          <PaisleyStrip length={380} />
        </div>

        {/* Inner frame (inside paisley) */}
        <div style={{
          position: "absolute", top: "56px", bottom: "56px", left: "56px", right: "56px",
          border: "1.5px solid #8B0000",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Corner rosettes */}
        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2, background: "#FFF8E7", padding: "2px" }}>
          <CornerRosette size={28} />
        </div>
        <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2, background: "#FFF8E7", padding: "2px" }}>
          <CornerRosette size={28} />
        </div>
        <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 2, background: "#FFF8E7", padding: "2px" }}>
          <CornerRosette size={28} />
        </div>
        <div style={{ position: "absolute", bottom: "20px", right: "20px", zIndex: 2, background: "#FFF8E7", padding: "2px" }}>
          <CornerRosette size={28} />
        </div>

        {/* Actual content */}
        <div style={{ position: "relative", zIndex: 3, padding: "68px 70px 44px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, textAlign: "center" }}>
          {/* Medallion (top Ganesha) — real public-domain line-art */}
          <div style={{
            marginBottom: "8px",
            width: 58, height: 58, borderRadius: "50%",
            border: "2px solid #8B0000",
            background: "#FFFDF5",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img
              src="/images/kundli/ganesha-classic.svg"
              alt="Ganesha"
              style={{
                width: "44px", height: "44px",
                filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)",
              }}
            />
          </div>

          {/* Invocation */}
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#8B0000", marginBottom: "5px", letterSpacing: "1px" }}>
            ॥ अथ श्रीगणेशाय नमः ॥
          </div>

          {/* Shloka */}
          <div style={{ fontSize: "7px", color: "#8B0000", lineHeight: 1.55, marginBottom: "10px", fontStyle: "italic" }}>
            गजवदनमचिन्त्यं तीक्ष्णदृष्टं गणेशं,<br/>
            बृहत्तुरम्यमेशं भूतराजं पुराणम्।<br/>
            अमरवरसुपूज्यं रक्तवर्णं धरेशं,<br/>
            पशुपतिसुतमीशं विघ्नराजं नमामि॥
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: "9px", fontWeight: 600, color: "#8B0000", letterSpacing: "3px", marginBottom: "2px" }}>
            सम्पूर्ण षडवर्गीय
          </div>

          {/* Big title */}
          <div style={{
            fontSize: "36px", fontWeight: 900, color: "#8B0000",
            letterSpacing: "2px",
            marginBottom: "10px",
            fontFamily: "serif",
            textShadow: "1px 1px 0 #d4a843",
          }}>
            जन्म पत्रिका
          </div>

          {/* Center seated Ganesha — real public-domain line-art */}
          <div style={{
            marginBottom: "10px",
            width: 110, height: 110, borderRadius: "50%",
            border: "2.5px solid #8B0000",
            background: "radial-gradient(circle, #FFFDF5 0%, #FFF8E7 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img
              src="/images/kundli/ganesha-classic.svg"
              alt="Lord Ganesha"
              style={{
                width: "90px", height: "90px",
                filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)",
              }}
            />
          </div>

          {/* Field sections */}
          <div style={{ width: "100%", maxWidth: "360px", textAlign: "left" }}>
            {[
              {
                title: "जातक माहिती",
                rows: [
                  ["जातकाचे नाव", "पावन हसबनीस"],
                  ["जन्मतारीख", "१ जानेवारी २०००"],
                  ["जन्मवेळ", "१०:३० AM"],
                  ["जन्मस्थळ", "पुणे, महाराष्ट्र"],
                ],
              },
              {
                title: "पंचांग",
                rows: [
                  ["तिथी", "पौर्णिमा"],
                  ["वार", "शनिवार"],
                  ["नक्षत्र", "रोहिणी — चरण ३"],
                  ["योग", "वैधृती"],
                  ["करण", "विष्टी"],
                ],
              },
              {
                title: "ज्योतिष सार",
                rows: [
                  ["जन्म राशी (चंद्र)", "वृषभ — स्वामी शुक्र"],
                  ["जन्म लग्न", "मकर — स्वामी शनि"],
                  ["नाडी", "मध्य"],
                  ["गण", "मानव"],
                  ["योनी", "सर्प"],
                  ["वर्ण", "वैश्य"],
                  ["अयनांश", "२४°१०'"],
                ],
              },
            ].map((section, si) => (
              <div key={si} style={{ marginBottom: si < 2 ? "6px" : "0" }}>
                <div style={{
                  fontSize: "8px", fontWeight: 700, color: "#d4a843",
                  background: "#8B0000",
                  padding: "2px 8px",
                  letterSpacing: "2px",
                  textAlign: "center",
                  marginBottom: "2px",
                }}>
                  {section.title}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "10px" }}>
                  {section.rows.map(([label, value], i) => (
                    <div key={i} style={{ display: "flex", borderBottom: "1px dotted #8B0000", padding: "2px 0", fontSize: "7.5px" }}>
                      <span style={{ color: "#8B0000", fontWeight: 700, minWidth: "72px" }}>{label}</span>
                      <span style={{ color: "#3d0c0c", flex: 1 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-center page number */}
        <div style={{ position: "relative", zIndex: 3, textAlign: "center", paddingBottom: "32px", fontSize: "9px", color: "#8B0000", fontWeight: 700 }}>
          ॥ १ ॥
        </div>
      </div>
    </A4Frame>
  );
}

// ─── Current cover (BEFORE) ──────────────────────────────────────
function CurrentCover() {
  return (
    <A4Frame label="BEFORE — current cover page">
      <PageHeader />
      <div style={{ flex: 1, padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: "14px", color: "#8b6b4a", marginBottom: "8px" }}>॥ श्री गणेशाय नमः ॥</div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#3d0c0c", marginBottom: "18px" }}>कुंडली</h1>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#5c1a1a", marginBottom: "30px" }}>पावन हसबनीस</div>
        <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 2 }}>
          <div>जन्मतारीख: 1 जानेवारी 2000</div>
          <div>जन्मवेळ: 10:30 AM</div>
          <div>जन्मस्थळ: पुणे, महाराष्ट्र</div>
        </div>
        <div style={{ marginTop: "auto", fontSize: "9px", color: "#c62828", padding: "6px 10px", background: "#fce4ec", borderRadius: "4px" }}>
          ⚠ plain — not traditional format
        </div>
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── Fix D — Dense quick-facts + inline doshas ────────────────────
function FixD_QuickFacts() {
  return (
    <A4Frame label="AFTER (Fix D) — inline doshas + 6-col pill row + filler stats">
      <PageHeader />
      <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden" }}>
        <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", marginBottom: "6px" }}>दोष स्थिती</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
          {[
            ["मांगलिक", "अनुपस्थित", "#2e7d32"],
            ["कालसर्प", "अनुपस्थित", "#2e7d32"],
            ["साडेसाती", "चालू — उदय", "#c62828"],
            ["पितृ दोष", "अनुपस्थित", "#2e7d32"],
          ].map(([n, v, c], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px", background: "#FFFDF5", border: "1px solid #f5efe0", borderLeft: `3px solid ${c}`, fontSize: "9px" }}>
              <span style={{ fontWeight: 600, color: "#3d0c0c" }}>{n}</span>
              <span style={{ color: c as string, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", margin: "8px 0 6px" }}>शुभ माहिती</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", marginBottom: "10px" }}>
          {[["रत्न", "पुष्कराज"], ["रंग", "पिवळा"], ["अंक", "३"], ["वार", "गुरुवार"], ["दिशा", "ईशान्य"], ["धातू", "सोने"]].map(([l, v], i) => (
            <div key={i} style={{ border: "1px solid #d4a843", borderRadius: "6px", padding: "6px 2px", textAlign: "center", background: "#FFFDF5" }}>
              <div style={{ fontSize: "6px", color: "#8b6b4a", letterSpacing: "1px" }}>{l}</div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#3d0c0c" }}>{v}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#d4a843", letterSpacing: "1px", margin: "8px 0 6px" }}>नक्षत्र तपशील</h2>
        <PlanetTable planets={SAMPLE_PLANETS} fontSize={8} />

        <InterpBox label="वर्तमान दशा" text="शनि दशा (२०१९ — २०३८), अंतर्दशा: शनि-केतु. कठोर परिश्रम काळ." />
      </div>
      <PageFooter />
    </A4Frame>
  );
}

// ─── Main UI ──────────────────────────────────────────────────────
export default function PrintPreviewClient() {
  const [tab, setTab] = useState<"cover" | "empty" | "lagna" | "quick">("cover");

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f0", padding: "20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#3d0c0c", marginBottom: "6px" }}>PDF Print Preview — Layout Mockup</h1>
        <p style={{ fontSize: "12px", color: "#5c1a1a", marginBottom: "16px" }}>
          Pages scaled ~60% (A4 real). Header/footer/page-break kept identical to production. Only content density changes.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            ["cover", "Traditional Cover"],
            ["empty", "Empty D-Chart (D2)"],
            ["lagna", "Chart + Interpretation"],
            ["quick", "Quick-Facts Page"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k as "cover" | "empty" | "lagna" | "quick")}
              style={{
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "1px solid #d4a843",
                background: tab === k ? "#3d0c0c" : "white",
                color: tab === k ? "#d4a843" : "#3d0c0c",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Side-by-side A4 pages */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
          {tab === "cover" && (
            <>
              <CurrentCover />
              <TraditionalCover />
            </>
          )}
          {tab === "empty" && (
            <>
              <CurrentEmptyDChart />
              <FixA_DChart />
            </>
          )}
          {tab === "lagna" && (
            <>
              <CurrentLagnaChart />
              <FixB_LagnaChart />
            </>
          )}
          {tab === "quick" && (
            <>
              <CurrentQuickFacts />
              <FixD_QuickFacts />
            </>
          )}
        </div>

        {/* Decision checklist */}
        <div style={{ marginTop: "28px", background: "white", border: "1px solid #d4a843", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#3d0c0c", marginBottom: "8px" }}>Decision Checklist</h3>
          <ul style={{ fontSize: "12px", color: "#3d0c0c", lineHeight: 1.8, paddingLeft: "18px" }}>
            <li><strong>Fix A (empty D-chart fill)</strong> — biggest blank-space kill. 8+ D-chart pages affected (D2, D3, D4, D16, D30, D27, D40, D45, D60).</li>
            <li><strong>Fix B (2-col chart+analysis)</strong> — applies to Lagna/Chandra/Navamsha/Saptamsha/Dashamsha etc. (~5 pages).</li>
            <li><strong>Fix D (dense quick-facts)</strong> — dosh/shubh page tightening. ~1 page per person.</li>
          </ul>
          <p style={{ fontSize: "11px", color: "#8b6b4a", marginTop: "10px", fontStyle: "italic" }}>
            Production untouched. Header/footer/page-break structure identical. Only inside-`.print-page-content` layout changes.
          </p>
        </div>
      </div>
    </div>
  );
}
