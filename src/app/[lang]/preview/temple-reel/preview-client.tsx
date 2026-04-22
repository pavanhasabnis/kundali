"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// ─── Scene manifest (Trimbakeshwar katha) ─────────────────────────────
// Timings derived from real Sarvam Advait audio durations (+0.3s fade gap).
type SceneId = "hook" | "intro" | "katha" | "architecture" | "rituals" | "kumbh" | "cta";

type Scene = {
  id: SceneId;
  start: number;
  end: number;
  image: string;
  audio: string;
  kenBurns: "zoom-in" | "zoom-out" | "pan-left" | "pan-right";
  titleMr: string;
  narrationMr: string;
  captionMr: string;
};

// Timings match actual Sarvam Roopa pace-1.0 durations + 0.3s fade gap.
const SCENES: Scene[] = [
  {
    id: "hook",
    start: 0,
    end: 11.1,
    image: "/temple-art/trimbakeshwar/hook.png",
    audio: "/temple-audio/trimbakeshwar/hook.wav",
    kenBurns: "zoom-in",
    titleMr: "त्र्यंबकेश्वर",
    narrationMr: "महाराष्ट्रातील नाशिक जिल्ह्यात, ब्रह्मगिरी पर्वताच्या कुशीत वसलेले, बारा ज्योतिर्लिंगांपैकी एक त्र्यंबकेश्वर मंदिर, हे अत्यंत पवित्र आणि महत्त्वाचे तीर्थक्षेत्र आहे.",
    captionMr: "बारा ज्योतिर्लिंगांपैकी एक",
  },
  {
    id: "intro",
    start: 11.1,
    end: 23.2,
    image: "/temple-art/trimbakeshwar/intro.png",
    audio: "/temple-audio/trimbakeshwar/intro.wav",
    kenBurns: "pan-right",
    titleMr: "त्रिगुणात्मक रूप",
    narrationMr: "त्र्यंबकेश्वर मंदिर, जिथे शिवलिंग तीन मुखांनी, म्हणजे ब्रह्मा, विष्णू आणि महेश यांच्या त्रिगुणात्मक रूपात प्रकट झाले आहे. असे स्वरूप असलेले हे एकमेव ज्योतिर्लिंग मानले जाते.",
    captionMr: "त्रिमुखी शिवलिंग — एकमेव",
  },
  {
    id: "katha",
    start: 23.2,
    end: 38.3,
    image: "/temple-art/trimbakeshwar/katha.png",
    audio: "/temple-audio/trimbakeshwar/katha.wav",
    kenBurns: "zoom-in",
    titleMr: "गौतम ऋषींची कथा",
    narrationMr: "महर्षी गौतमांनी येथे अनेक वर्षे कठोर तपश्चर्या केली. त्यांच्या प्रार्थनेने प्रसन्न होऊन भगवान शिव स्वतः येथे अवतरले. गंगा ब्रह्मगिरी पर्वतावरून गोदावरीच्या रूपाने पृथ्वीवर अवतरली, आणि त्रिगुणात्मक शिवलिंग स्वयंभू स्वरूपात प्रकट झाले.",
    captionMr: "ब्रह्मगिरी · गंगेचे उगमस्थान",
  },
  {
    id: "architecture",
    start: 38.3,
    end: 52.9,
    image: "/temple-art/trimbakeshwar/architecture.png",
    audio: "/temple-audio/trimbakeshwar/architecture.wav",
    kenBurns: "pan-left",
    titleMr: "मंदिराचे स्थापत्य",
    narrationMr: "काळ्या पाषाणात कोरलेले हे हेमाडपंती शैलीतील भव्य मंदिर तेराव्या शतकातील स्थापत्यकलेचा अप्रतिम नमुना आहे. मुख्य शिखर सुमारे सत्तर फूट उंच असून, गर्भगृहात त्रिमुखी शिवलिंग विराजमान आहे.",
    captionMr: "हेमाडपंती · १३ वे शतक · ७० फूट शिखर",
  },
  {
    id: "rituals",
    start: 52.9,
    end: 62.2,
    image: "/temple-art/trimbakeshwar/rituals.png",
    audio: "/temple-audio/trimbakeshwar/rituals.wav",
    kenBurns: "zoom-out",
    titleMr: "पूजा आणि उत्सव",
    narrationMr: "महाशिवरात्री, त्रिपुरारी पौर्णिमा आणि श्रावण महिन्यात येथे लाखो भक्त दर्शनासाठी येतात. पहाटे होणारी त्रिकाल पूजा आणि रुद्राभिषेक विशेष महत्त्वाचे मानले जातात.",
    captionMr: "त्रिकाल पूजा · रुद्राभिषेक",
  },
  {
    id: "kumbh",
    start: 62.2,
    end: 70.1,
    image: "/temple-art/trimbakeshwar/kumbh.png",
    audio: "/temple-audio/trimbakeshwar/kumbh.wav",
    kenBurns: "zoom-in",
    titleMr: "सिंहस्थ कुंभमेळा",
    narrationMr: "दर बारा वर्षांनी येथे सिंहस्थ कुंभमेळा भरतो. गोदावरीच्या तीरावर कोट्यवधी भाविक स्नान आणि दर्शनासाठी येतात.",
    captionMr: "दर १२ वर्षांनी · गोदावरी तीर",
  },
  {
    id: "cta",
    start: 70.1,
    end: 79.0,
    image: "/temple-art/trimbakeshwar/cta.png",
    audio: "/temple-audio/trimbakeshwar/cta.wav",
    kenBurns: "zoom-out",
    titleMr: "दर्शनाला या",
    narrationMr: "त्र्यंबकेश्वरची संपूर्ण माहिती, दर्शन वेळा, यात्रा मार्गदर्शन - भाग्यवेध डॉट कॉमवर उपलब्ध आहे.",
    captionMr: "bhaagyavedh.com",
  },
];

const TOTAL = 79.0;
const DEV_NUM = ["१","२","३","४","५","६","७"];

// ─── Ken-burns CSS ────────────────────────────────────────────────────
function kenBurnsStyle(type: Scene["kenBurns"], active: boolean, duration: number) {
  const base: React.CSSProperties = {
    transition: active ? `transform ${duration}s linear` : "transform 0.3s ease",
    willChange: "transform",
  };
  if (!active) return { ...base, transform: "scale(1) translate(0,0)" };
  switch (type) {
    case "zoom-in":   return { ...base, transform: "scale(1.20) translate(0,-3%)" };
    case "zoom-out":  return { ...base, transform: "scale(1.04) translate(0,0)" };
    case "pan-right": return { ...base, transform: "scale(1.18) translate(-5%,0)" };
    case "pan-left":  return { ...base, transform: "scale(1.18) translate(5%,0)" };
  }
}



// ─── Single reel scene (rendered at 1080×1920 internally, scaled to fit parent) ──
function ReelFrame({ scene, playing, t }: { scene: Scene; playing: boolean; t: number }) {
  const sceneDur = scene.end - scene.start;
  const sceneT = Math.max(0, Math.min(sceneDur, t - scene.start));
  const active = playing && t >= scene.start && t < scene.end;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setScale(w / 1080);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#1a0808", fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1920,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Hero image with ken-burns */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src={scene.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", ...kenBurnsStyle(scene.kenBurns, active, sceneDur) }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center 40%, transparent 45%, rgba(40,10,4,0.45) 80%, rgba(20,4,0,0.85) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              mixBlendMode: "overlay",
              background: "linear-gradient(180deg, rgba(244,208,111,0.10), rgba(184,131,44,0.18))",
            }}
          />
        </div>

        {/* Brand chip top */}
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, zIndex: 30, textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "16px 40px",
              borderRadius: 80,
              background: "linear-gradient(180deg, #3d0c0c 0%, #1a0606 100%)",
              color: "#f4d06f",
              border: "3px solid #d4a843",
              fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
              fontSize: 38,
              fontWeight: 600,
              letterSpacing: "0.08em",
              boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
              textShadow: "0 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            भाग्यवेध · कथा
          </span>
        </div>

        {/* Scene title + caption — BOTTOM stack */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 100,
            zIndex: 30,
            textAlign: "center",
            opacity: active && sceneT > 0.2 ? 1 : 0,
            transform: `translateY(${active && sceneT > 0.2 ? 0 : 30}px)`,
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "36px 60px",
              borderRadius: 22,
              background: "linear-gradient(180deg, rgba(26,6,4,0.9), rgba(61,12,12,0.95))",
              border: "2px solid rgba(212,168,67,0.6)",
              boxShadow: "0 16px 50px rgba(0,0,0,0.65)",
            }}
          >
            <div style={{ color: "#f4d06f", fontSize: 86, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1.15, fontFamily: "'Tiro Devanagari Marathi', serif", textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>
              {scene.titleMr}
            </div>
            <div
              style={{
                color: "#f4d06fcc",
                fontSize: 32,
                letterSpacing: "0.15em",
                marginTop: 18,
                fontFamily: "'Tiro Devanagari Marathi', serif",
              }}
            >
              {scene.captionMr}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Instagram thumbnail card ─────────────────────────────────────────
function ThumbnailCard() {
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ width: 320, aspectRatio: "1080/1920", background: "#1a0808" }}>
      <img src="/temples/trimbakeshwar/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center 35%, transparent 35%, rgba(30,5,0,0.7) 75%, rgba(10,2,0,0.95) 100%)" }} />
      <div className="absolute inset-0 mix-blend-overlay" style={{ background: "linear-gradient(180deg, rgba(244,208,111,0.12), rgba(184,131,44,0.3))" }} />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 3px #d4a843, inset 0 0 0 4px #3d0c0c, inset 0 0 0 8px #d4a843aa" }} />
      <div className="absolute top-6 left-0 right-0 text-center">
        <span className="inline-block px-3 py-0.5 rounded-full text-[9px] tracking-[0.3em] uppercase" style={{ background: "rgba(212,168,67,0.18)", color: "#f4d06f", border: "1px solid rgba(212,168,67,0.5)" }}>
          भाग्यवेध · कथा
        </span>
      </div>
      <div className="absolute top-[30%] left-0 right-0 text-center px-4">
        <div style={{ fontSize: 44, color: "#f4d06f", fontWeight: 700, lineHeight: 1, textShadow: "0 4px 20px rgba(0,0,0,0.9)", fontFamily: "'Tiro Devanagari Marathi', serif" }}>
          त्र्यंबकेश्वर
        </div>
        <div style={{ fontSize: 14, color: "#f4d06fcc", marginTop: 10, letterSpacing: "0.15em", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          बारा ज्योतिर्लिंगांपैकी एक
        </div>
      </div>
      <div className="absolute bottom-5 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: "rgba(26,6,4,0.8)", border: "1px solid rgba(212,168,67,0.5)" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="#f4d06f"><path d="M1 0 L9 5 L1 10 Z" /></svg>
          <span style={{ color: "#f4d06f", fontSize: 11, letterSpacing: "0.15em" }}>कथा पहा</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main preview page ────────────────────────────────────────────────
export default function TempleReelPreviewClient() {
  const searchParams = useSearchParams();
  const raw = searchParams?.get("raw") === "1";
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [muted, setMuted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const lastActiveScene = useRef<string | null>(null);

  // Auto-play when in raw capture mode after a short settle delay.
  useEffect(() => {
    if (!raw) return;
    const id = setTimeout(() => {
      setT(0);
      setPlaying(true);
    }, 1500);
    return () => clearTimeout(id);
  }, [raw]);

  const currentScene = useMemo(
    () => SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[Math.min(SCENES.length - 1, Math.floor(t / 6))] ?? SCENES[0],
    [t]
  );

  // Play/stop audio on scene change
  useEffect(() => {
    if (!playing) {
      Object.values(audioRefs.current).forEach((a) => { if (a) { a.pause(); a.currentTime = 0; } });
      lastActiveScene.current = null;
      return;
    }
    const sc = SCENES.find((s) => t >= s.start && t < s.end);
    if (!sc) return;
    if (lastActiveScene.current === sc.id) return;
    // Stop previous
    Object.values(audioRefs.current).forEach((a) => { if (a) { a.pause(); a.currentTime = 0; } });
    const audio = audioRefs.current[sc.id];
    if (audio && !muted) {
      audio.currentTime = Math.max(0, t - sc.start);
      audio.volume = muted ? 0 : 1;
      audio.play().catch(() => {});
    }
    lastActiveScene.current = sc.id;
  }, [t, playing, muted]);

  // Master ticker
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - t * 1000;
    const tick = () => {
      const elapsed = (performance.now() - (startRef.current ?? 0)) / 1000;
      if (elapsed >= TOTAL) {
        setT(TOTAL);
        setPlaying(false);
        Object.values(audioRefs.current).forEach((a) => a?.pause());
        return;
      }
      setT(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const restart = () => { setT(0); setPlaying(true); };

  // ── Raw capture mode: full-bleed 1080x1920 reel only, auto-plays ────
  if (raw) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a0505",
          overflow: "hidden",
          position: "fixed",
          inset: 0,
        }}
      >
        {SCENES.map((s) => (
          <audio
            key={s.id}
            ref={(el) => { audioRefs.current[s.id] = el; }}
            src={s.audio}
            preload="auto"
          />
        ))}
        <div style={{ width: "100%", height: "100%" }}>
          <ReelFrame scene={currentScene} playing={playing} t={t} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: "linear-gradient(180deg, #f5ebd8 0%, #e8d9b6 100%)",
        backgroundImage: "radial-gradient(circle at 20% 10%, rgba(212,168,67,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 90%, rgba(139,42,42,0.06) 0%, transparent 40%)",
      }}
    >
      {/* Preload audio */}
      {SCENES.map((s) => (
        <audio
          key={s.id}
          ref={(el) => { audioRefs.current[s.id] = el; }}
          src={s.audio}
          preload="auto"
          muted={muted}
        />
      ))}

      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 rounded-full text-[11px] tracking-[0.3em] uppercase mb-3" style={{ background: "#3d0c0c", color: "#f4d06f", border: "1px solid #d4a843" }}>
            Preview · Temple Reel · Interactive Katha
          </div>
          <h1 style={{ fontFamily: "'Tiro Devanagari Marathi', serif", fontSize: 42, color: "#3d0c0c", fontWeight: 700, letterSpacing: "0.01em" }}>
            त्र्यंबकेश्वर · कथा रील
          </h1>
          <p style={{ color: "#8a5a1c", fontSize: 14, marginTop: 8, letterSpacing: "0.05em" }}>
            1080 × 1920 · {TOTAL.toFixed(1)}s · Sarvam Roopa voice (pace 1.0) · {SCENES.length} interactive scenes
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Phone frame */}
          <div className="sticky top-8">
            <div
              className="relative mx-auto"
              style={{
                width: 320, aspectRatio: "1080/1920",
                background: "#0a0404", borderRadius: 28, padding: 8,
                boxShadow: "0 30px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.25)",
              }}
            >
              <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 22 }}>
                <ReelFrame scene={currentScene} playing={playing} t={t} />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              <button
                onClick={() => (playing ? setPlaying(false) : restart())}
                className="px-5 py-2 rounded-full text-sm font-medium"
                style={{ background: "#3d0c0c", color: "#f4d06f", border: "1px solid #d4a843" }}
              >
                {playing ? "⏸ Pause" : t >= TOTAL ? "↻ Replay" : "▶ Play"}
              </button>
              <button
                onClick={() => { setT(0); setPlaying(false); }}
                className="px-4 py-2 rounded-full text-sm"
                style={{ background: "transparent", color: "#3d0c0c", border: "1px solid #8a5a1c" }}
              >
                Reset
              </button>
              <button
                onClick={() => setMuted((m) => !m)}
                className="px-4 py-2 rounded-full text-sm"
                style={{ background: muted ? "#8a2a2a" : "transparent", color: muted ? "#f4d06f" : "#3d0c0c", border: "1px solid #8a5a1c" }}
                title="Toggle narration audio"
              >
                {muted ? "🔇 Unmute" : "🔊 Audio On"}
              </button>
              <span style={{ color: "#8a5a1c", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                {t.toFixed(1)}s / {TOTAL}s
              </span>
            </div>

            <div className="mt-3 mx-auto" style={{ width: 320 }}>
              <input
                type="range"
                min={0}
                max={TOTAL}
                step={0.1}
                value={t}
                onChange={(e) => { setT(parseFloat(e.target.value)); setPlaying(false); }}
                className="w-full"
                style={{ accentColor: "#8a2a2a" }}
              />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "#8a5a1c" }}>
                {SCENES.map((s) => (<span key={s.id}>{s.id}</span>))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h2 style={{ fontSize: 20, color: "#3d0c0c", fontWeight: 700, marginBottom: 16, fontFamily: "'Tiro Devanagari Marathi', serif" }}>
              कथा दृश्य — Storyboard (tap to jump)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {SCENES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setT(s.start); setPlaying(true); }}
                  className="text-left group"
                  style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "9/16", borderRadius: 8, border: "2px solid #8a5a1c", boxShadow: "inset 0 0 0 1px #d4a84388, 0 4px 12px rgba(0,0,0,0.15)" }}
                  >
                    <img src={s.image} alt={s.titleMr} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(26,6,4,0.8) 100%)" }} />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px]" style={{ background: "rgba(26,6,4,0.85)", color: "#f4d06f", border: "1px solid #d4a84366" }}>
                      दृश्य {DEV_NUM[i]}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px]" style={{ background: "rgba(26,6,4,0.85)", color: "#f4d06f" }}>
                      {(s.end - s.start).toFixed(1)}s
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div style={{ color: "#f4d06f", fontSize: 13, fontWeight: 600, fontFamily: "'Tiro Devanagari Marathi', serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                        {s.titleMr}
                      </div>
                      <div style={{ color: "#f4d06fbb", fontSize: 10, marginTop: 2, letterSpacing: "0.1em" }}>
                        {s.captionMr}
                      </div>
                    </div>
                    <div className="absolute top-9 right-2 px-1.5 py-0.5 rounded text-[8px]" style={{ background: "rgba(26,6,4,0.85)", color: "#f4d06fcc", letterSpacing: "0.1em" }}>
                      Imagen 4
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#3d0c0c", marginTop: 8, lineHeight: 1.5 }}>
                    {s.narrationMr}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10">
              <h2 style={{ fontSize: 20, color: "#3d0c0c", fontWeight: 700, marginBottom: 16, fontFamily: "'Tiro Devanagari Marathi', serif" }}>
                Instagram Feed Thumbnail
              </h2>
              <div className="flex items-start gap-6 flex-wrap">
                <ThumbnailCard />
                <div className="flex-1 min-w-[260px]" style={{ color: "#3d0c0c" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>AI-generated scene illustrations</div>
                  <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 16 }}>
                    <li>All 7 scene backgrounds via <b>Google Imagen 4</b> (vertical 9:16)</li>
                    <li>Consistent prompt style — cinematic devotional mural aesthetic</li>
                    <li>Each image matches narration content (sage + Ganga, arti + priest, kumbh crowd, etc.)</li>
                    <li>Ken-burns zoom/pan adds cinematic motion</li>
                    <li>Voice-only narration — Sarvam Roopa, Bulbul v3, pace 1.0</li>
                    <li>Regenerate single scene: <code>tsx scripts/generate-temple-illustrations.ts trimbakeshwar --only katha</code></li>
                  </ul>
                  <div style={{ fontSize: 11, color: "#8a5a1c", marginTop: 14, fontStyle: "italic" }}>
                    Images: public/temple-art/trimbakeshwar/*.png (Imagen 4 · 9:16)<br/>
                    Audio:  public/temple-audio/trimbakeshwar/*.wav (Bulbul v3 · Roopa · pace 1.0)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 rounded-lg" style={{ background: "rgba(61,12,12,0.04)", border: "1px dashed #8a5a1c66" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#3d0c0c", marginBottom: 8 }}>
                Why this differs from daily rashi reels
              </div>
              <ul style={{ fontSize: 12, color: "#5c1a1a", lineHeight: 1.9, paddingLeft: 16 }}>
                <li><b>Daily rashi</b> = cosmic gradient + data cards (info-dense)</li>
                <li><b>Temple katha</b> = parchment + gold + manuscript scroll (story-dense)</li>
                <li>Photo = subject — UI frames it, never covers temple</li>
                <li>Single narration scroll + symbolic overlay per scene</li>
                <li>Word reveal synced to voice → reader follows narrator</li>
                <li>Ken-burns slow pan/zoom → cinematic, contemplative</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
