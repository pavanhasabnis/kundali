"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { SANGRAH_CATEGORIES, type SangrahItem } from "@/lib/sangrah-types";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

type ViewMode = "devanagari" | "transliteration" | "both";

interface Chapter {
  number: number;
  title: string;
  content: string;
}

const MARATHI_NUMS: Record<string, number> = {
  "प्रथम": 1, "पहिला": 1, "दूसरा": 2, "दुसरा": 2, "दोन": 2,
  "तिसरा": 3, "तीन": 3, "चौथा": 4, "चार": 4,
  "पांचवा": 5, "पाचवा": 5, "पाच": 5,
};

function parseChapters(content: string): Chapter[] | null {
  // Pattern 1: ॥ अध्याय N ॥ (numeric, used in Gajanan Vijay etc.)
  const numericRegex = /॥\s*अध्याय\s*(\d+)\s*॥/g;
  const numericMatches = [...content.matchAll(numericRegex)];
  if (numericMatches.length >= 2) {
    const chapters: Chapter[] = [];
    for (let i = 0; i < numericMatches.length; i++) {
      const start = numericMatches[i].index! + numericMatches[i][0].length;
      const end = i < numericMatches.length - 1 ? numericMatches[i + 1].index! : content.length;
      const num = parseInt(numericMatches[i][1]);
      chapters.push({ number: num, title: `अध्याय ${num}`, content: content.slice(start, end).trim() });
    }
    return chapters;
  }

  // Pattern 2: "अध्याय दूसरा" / "प्रथम अध्याय" / "कथा अध्याय पांचवा" (Marathi ordinals)
  const ordinalRegex = /(?:॥\s*(?:प्रथम|पहिला)\s*अध्याय\s*॥|कथा\s+अध्याय\s+(?:दूसरा|दुसरा|तिसरा|चौथा|पांचवा|पाचवा|सहावा|सातवा|आठवा|नववा|दहावा))/g;
  const ordinalMatches = [...content.matchAll(ordinalRegex)];
  if (ordinalMatches.length >= 2) {
    const chapters: Chapter[] = [];
    for (let i = 0; i < ordinalMatches.length; i++) {
      const marker = ordinalMatches[i][0];
      const start = ordinalMatches[i].index!;
      const contentStart = start + marker.length;
      const end = i < ordinalMatches.length - 1 ? ordinalMatches[i + 1].index! : content.length;
      // Extract chapter number from marker
      let num = i + 1;
      for (const [word, n] of Object.entries(MARATHI_NUMS)) {
        if (marker.includes(word)) { num = n; break; }
      }
      // Clean: strip "समाप्त" lines at the end of chapter content
      let chContent = content.slice(contentStart, end).trim();
      chContent = chContent.replace(/॥\s*(?:इति\s+)?(?:प्रथमो|द्वितीयो|तृतीयो|चतुर्थो|पंचमो)(?:ऽ)?ध्याय:\s*समाप्त:?\s*॥/g, "").trim();
      chapters.push({ number: num, title: `अध्याय ${num}`, content: chContent });
    }
    return chapters;
  }

  return null;
}

interface Props {
  item: SangrahItem;
  categoryLabel: { mr: string; en: string };
}

/* ─── Print helper components ─── */
const PrintHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="print-page-header">
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src="/logos/navbar-dark-mr.svg" alt="भाग्यवेध" style={{ height: "28px", width: "auto" }} />
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ color: "#d4a843", fontSize: "11px", fontWeight: 700 }}>{title}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>{subtitle}</div>
    </div>
  </div>
);

const PrintFooter = () => (
  <div className="print-page-footer">
    <span style={{ color: "#d4a843", fontSize: "9px", fontWeight: 700, letterSpacing: "2px" }}>Bhaagyavedh</span>
    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>bhaagyavedh.com/sangrah</span>
  </div>
);

function PrintPage({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="print-page">
      <PrintHeader title={title} subtitle={subtitle} />
      <div className="print-page-content">{children}</div>
      <PrintFooter />
    </div>
  );
}

/** Estimate how many printed lines a source line takes */
function estimatePrintedLines(line: string, charsPerLine: number): number {
  if (!line.trim()) return 1;
  return Math.ceil(line.length / charsPerLine);
}

/** Split text to fit one printed A4 page. Adapts to verse vs prose. */
function splitForPrint(text: string, prose = false): string[] {
  const maxLines = prose ? 42 : 36;
  const charsPerLine = prose ? 80 : 55;
  const srcLines = text.split("\n");
  const pages: string[] = [];
  let current: string[] = [];
  let usedLines = 0;

  for (const line of srcLines) {
    const cost = estimatePrintedLines(line, charsPerLine);
    if (usedLines + cost > maxLines && current.length > 0) {
      pages.push(current.join("\n").trim());
      current = [];
      usedLines = 0;
    }
    current.push(line);
    usedLines += cost;
  }
  if (current.join("").trim()) pages.push(current.join("\n").trim());
  return pages;
}

export default function SangrahDetailClient({ item, categoryLabel }: Props) {
  const { t } = useLang();
  const [viewMode, setViewMode] = useState<ViewMode>("devanagari");
  const [fontSize, setFontSize] = useState(18);
  const [showMeaning, setShowMeaning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [showChapterList, setShowChapterList] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const chapters = useMemo(() => parseChapters(item.content), [item.content]);
  const hasChapters = chapters && chapters.length > 1;

  const handleChapterChange = (index: number) => {
    setActiveChapter(index);
    setShowChapterList(false);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    const url = `https://bhaagyavedh.com/sangrah/${item.category}/${item.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.titleEn, url });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const prev = document.title;
    document.title = `${item.title} — ${item.titleEn} | Bhaagyavedh`;
    window.print();
    document.title = prev;
  };

  const displayContent = hasChapters ? chapters[activeChapter].content : item.content;

  // Detect if content is verse-style (short lines) vs prose (long paragraphs)
  // Verse: avg line length < 60 chars; Prose: avg line > 100 chars
  const isProse = useMemo(() => {
    const lines = item.content.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) return false;
    const avgLen = lines.reduce((s, l) => s + l.length, 0) / lines.length;
    return avgLen > 100;
  }, [item.content]);

  // Prepare print pages — full content split into pages
  const fullContentForPrint = useMemo(() => {
    if (hasChapters) {
      return chapters.flatMap((ch) => {
        const pages = splitForPrint(ch.content, isProse);
        return pages.map((p, i) => ({
          text: p,
          label: t("अध्याय", "Ch.") + " " + ch.number + (pages.length > 1 ? ` (${i + 1}/${pages.length})` : ""),
        }));
      });
    }
    const pages = splitForPrint(item.content, isProse);
    return pages.map((p, i) => ({ text: p, label: pages.length > 1 ? `${i + 1}/${pages.length}` : "" }));
  }, [item.content, chapters, hasChapters, t]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://bhaagyavedh.com" },
          { name: "Sangrah", url: "https://bhaagyavedh.com/sangrah" },
          { name: categoryLabel.en, url: `https://bhaagyavedh.com/sangrah/${item.category}` },
          { name: item.titleEn, url: `https://bhaagyavedh.com/sangrah/${item.category}/${item.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${item.titleEn} — ${item.title}`,
          description: `${item.titleEn} — ${item.title}. Complete Sanskrit text with Marathi transliteration and English meaning.`,
          url: `https://bhaagyavedh.com/sangrah/${item.category}/${item.slug}`,
          image: "https://bhaagyavedh.com/logos/og-image.png",
          inLanguage: ["sa", "mr", "en"],
          articleSection: categoryLabel.en,
          keywords: [item.deityEn, item.title, item.titleEn, "Sanskrit", "stotra", "mantra", "aarti"].join(", "),
          about: { "@type": "Thing", name: item.deityEn },
          datePublished: "2024-01-01",
          dateModified: new Date().toISOString().split("T")[0],
          author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
          publisher: {
            "@type": "Organization",
            name: "Bhaagyavedh",
            url: "https://bhaagyavedh.com",
            logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://bhaagyavedh.com/sangrah/${item.category}/${item.slug}` },
        }}
      />

      {/* ═══ Browser UI (hidden when printing) ═══ */}
      <div className="no-print">

      {/* Header */}
      <section
        className="relative py-8 md:py-12 text-center"
        style={{
          background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href={`/sangrah/${item.category}`}
            className="inline-block text-white/50 hover:text-[#d4a843] text-sm mb-3 transition"
          >
            ← {t(categoryLabel.mr, categoryLabel.en)}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {t(item.title, item.titleEn)}
          </h1>
          <p className="text-white/50 text-sm">
            {t(item.deityMr, item.deityEn)} • {t(categoryLabel.mr, categoryLabel.en)}
          </p>
          {hasChapters && (
            <p className="text-[#d4a843] text-sm mt-2 font-medium">
              {chapters.length} {t("अध्याय", "Chapters")}
            </p>
          )}
        </div>
      </section>

      {/* Chapter Navigation — only for multi-chapter content */}
      {hasChapters && (
        <div className="sticky top-0 z-20 bg-white border-b border-[#d4a843]/20 shadow-sm">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-2 py-2.5">
              {/* Prev button */}
              <button
                onClick={() => handleChapterChange(Math.max(0, activeChapter - 1))}
                disabled={activeChapter === 0}
                className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 text-sm hover:border-[#d4a843] transition flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {/* Chapter selector dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => setShowChapterList(!showChapterList)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#5c1a1a]/5 border border-[#d4a843]/20 text-sm font-medium text-[#3d0c0c] hover:border-[#d4a843]/50 transition"
                >
                  <span>
                    {t("अध्याय", "Chapter")} {chapters[activeChapter].number}
                    <span className="text-gray-400 font-normal ml-2 text-xs">
                      / {chapters.length}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">{showChapterList ? "▲" : "▼"}</span>
                </button>

                {/* Dropdown */}
                {showChapterList && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#d4a843]/30 rounded-xl shadow-lg max-h-72 overflow-y-auto z-30">
                    {chapters.map((ch, i) => (
                      <button
                        key={ch.number}
                        onClick={() => handleChapterChange(i)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#5c1a1a]/5 border-b border-gray-50 last:border-0 ${
                          i === activeChapter
                            ? "bg-[#5c1a1a] text-white hover:bg-[#5c1a1a]"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="font-medium">
                          {t("अध्याय", "Chapter")} {ch.number}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Next button */}
              <button
                onClick={() => handleChapterChange(Math.min(chapters.length - 1, activeChapter + 1))}
                disabled={activeChapter === chapters.length - 1}
                className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 text-sm hover:border-[#d4a843] transition flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="max-w-3xl mx-auto px-4 py-4" ref={contentRef}>
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* View mode */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
            {(
              [
                { id: "devanagari", label: "देवनागरी" },
                { id: "transliteration", label: "Roman" },
                { id: "both", label: t("दोन्ही", "Both") },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-3 py-1.5 transition ${
                  viewMode === mode.id
                    ? "bg-[#5c1a1a] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 text-sm hover:border-[#d4a843] transition flex items-center justify-center"
            >
              A-
            </button>
            <span className="text-xs text-gray-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(28, s + 2))}
              className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 text-sm hover:border-[#d4a843] transition flex items-center justify-center"
            >
              A+
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowMeaning((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                showMeaning
                  ? "bg-[#5c1a1a] text-white border-[#5c1a1a]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#d4a843]/40"
              }`}
            >
              {t("अर्थ", "Meaning")}
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-[#d4a843]/40 transition"
            >
              {copied ? "✓" : t("शेअर", "Share")}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-[#d4a843]/20"
              style={{ background: "rgba(212,168,67,0.15)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" }}
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-10">
        {/* Chapter title badge */}
        {hasChapters && (
          <div className="mb-3 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-[#5c1a1a] bg-[#d4a843]/10 border border-[#d4a843]/20">
              {t("अध्याय", "Chapter")} {chapters[activeChapter].number}
            </span>
          </div>
        )}

        <div
          className="bg-white rounded-xl border border-[#d4a843]/20 p-5 md:p-8 shadow-sm"
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Devanagari */}
          {(viewMode === "devanagari" || viewMode === "both") && (
            <div className={`whitespace-pre-line leading-relaxed text-[#3d0c0c] ${isProse ? "text-left" : "text-center"}`}>
              {displayContent}
            </div>
          )}

          {/* Separator */}
          {viewMode === "both" && (
            <hr className="my-6 border-[#d4a843]/20" />
          )}

          {/* Transliteration */}
          {(viewMode === "transliteration" || viewMode === "both") && (
            <div className={`whitespace-pre-line leading-relaxed text-gray-700 italic ${isProse ? "text-left" : "text-center"}`}>
              {hasChapters
                ? t(
                    "या ग्रंथाचे transliteration उपलब्ध नाही. कृपया देवनागरी मध्ये वाचा.",
                    "Transliteration is not available for this granth. Please read in Devanagari."
                  )
                : item.transliteration}
            </div>
          )}
        </div>

        {/* Chapter Prev/Next at bottom */}
        {hasChapters && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => handleChapterChange(Math.max(0, activeChapter - 1))}
              disabled={activeChapter === 0}
              className="flex-1 py-3 rounded-xl text-sm font-medium border border-[#d4a843]/20 bg-white hover:border-[#d4a843]/50 hover:bg-[#5c1a1a]/5 transition disabled:opacity-30 disabled:cursor-not-allowed text-[#5c1a1a]"
            >
              ← {t("मागील अध्याय", "Previous Chapter")}
            </button>
            <button
              onClick={() => handleChapterChange(Math.min(chapters.length - 1, activeChapter + 1))}
              disabled={activeChapter === chapters.length - 1}
              className="flex-1 py-3 rounded-xl text-sm font-medium border border-[#d4a843]/20 bg-white hover:border-[#d4a843]/50 hover:bg-[#5c1a1a]/5 transition disabled:opacity-30 disabled:cursor-not-allowed text-[#5c1a1a]"
            >
              {t("पुढील अध्याय", "Next Chapter")} →
            </button>
          </div>
        )}

        {/* Meaning */}
        {showMeaning && (
          <div className="mt-5 bg-amber-50/50 rounded-xl border border-[#d4a843]/20 p-5 md:p-8">
            <h2 className="text-lg font-bold text-[#3d0c0c] mb-3">
              {t("अर्थ", "Meaning")}
            </h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {t(item.meaningMr, item.meaningEn)}
            </div>
          </div>
        )}

        {/* Benefits */}
        {(item.benefits || item.benefitsEn) && (
          <div className="mt-5 bg-green-50/50 rounded-xl border border-green-200/40 p-5 md:p-8">
            <h2 className="text-lg font-bold text-[#3d0c0c] mb-3">
              {t("फायदे", "Benefits")}
            </h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {t(item.benefits, item.benefitsEn)}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href={`/sangrah/${item.category}`}
            className="text-sm text-[#5c1a1a] hover:text-[#d4a843] transition font-medium"
          >
            ← {t(`सर्व ${categoryLabel.mr}`, `All ${categoryLabel.en}`)}
          </Link>
          <Link
            href="/sangrah"
            className="text-sm text-[#5c1a1a] hover:text-[#d4a843] transition font-medium"
          >
            {t("संपूर्ण संग्रह", "Full Sangrah")}
          </Link>
        </div>
      </div>

      </div>{/* end no-print */}

      {/* ═══ Print-only layout ═══ */}
      <div className="print-only">
        {/* Cover page */}
        <div className="print-page">
          <div className="print-page-header" style={{ borderBottom: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/navbar-dark-mr.svg" alt="भाग्यवेध" style={{ height: "32px", width: "auto" }} />
            </div>
          </div>
          <div className="print-page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ marginBottom: "12px", color: "#d4a843", fontSize: "14px", fontWeight: 500 }}>
              {t(categoryLabel.mr, categoryLabel.en)}
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#3d0c0c", marginBottom: "8px", lineHeight: 1.3 }}>
              {item.title}
            </h1>
            <p style={{ fontSize: "18px", color: "#5c1a1a", marginBottom: "24px" }}>
              {item.titleEn}
            </p>
            <div style={{ width: "60px", height: "3px", background: "#d4a843", borderRadius: "2px", margin: "0 auto 24px" }} />
            <p style={{ fontSize: "14px", color: "#666" }}>
              {t(item.deityMr, item.deityEn)}
            </p>
            {hasChapters && (
              <p style={{ fontSize: "13px", color: "#d4a843", marginTop: "12px" }}>
                {chapters.length} {t("अध्याय", "Chapters")}
              </p>
            )}
            <div style={{ marginTop: "48px", fontSize: "11px", color: "#999" }}>
              ॥ श्री गणेशाय नमः ॥
            </div>
          </div>
          <PrintFooter />
        </div>

        {/* Content pages */}
        {fullContentForPrint.map((page, i) => (
          <PrintPage
            key={i}
            title={item.title}
            subtitle={page.label ? `${item.titleEn} — ${page.label}` : item.titleEn}
          >
            <div style={{ whiteSpace: "pre-line", lineHeight: isProse ? 1.7 : 1.9, fontSize: "14px", color: "#3d0c0c", textAlign: isProse ? "left" : "center" }}>
              {page.text}
            </div>
          </PrintPage>
        ))}

        {/* Meaning & Benefits page (if available) */}
        {(item.meaningMr || item.benefits) && (
          <PrintPage title={item.title} subtitle={`${item.titleEn} — ${t("अर्थ व फायदे", "Meaning & Benefits")}`}>
            {item.meaningMr && (
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#3d0c0c", marginBottom: "8px", borderBottom: "2px solid #d4a843", paddingBottom: "4px", display: "inline-block" }}>
                  {t("अर्थ", "Meaning")}
                </h2>
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.7, fontSize: "12px", color: "#444", marginTop: "8px" }}>
                  {t(item.meaningMr, item.meaningEn)}
                </div>
              </div>
            )}
            {item.benefits && (
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#3d0c0c", marginBottom: "8px", borderBottom: "2px solid #2d7a2d", paddingBottom: "4px", display: "inline-block" }}>
                  {t("फायदे", "Benefits")}
                </h2>
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.7, fontSize: "12px", color: "#444", marginTop: "8px" }}>
                  {t(item.benefits, item.benefitsEn)}
                </div>
              </div>
            )}
          </PrintPage>
        )}
      </div>
    </>
  );
}
