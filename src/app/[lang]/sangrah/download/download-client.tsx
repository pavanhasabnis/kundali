"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { SANGRAH_CATEGORIES, type SangrahItem } from "@/lib/sangrah-types";

/* ─── Print helper components (same as detail page) ─── */
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

function estimatePrintedLines(line: string, charsPerLine: number): number {
  if (!line.trim()) return 1;
  return Math.ceil(line.length / charsPerLine);
}

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

function isProse(content: string): boolean {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return false;
  const avgLen = lines.reduce((s, l) => s + l.length, 0) / lines.length;
  return avgLen > 100;
}

export default function DownloadClient() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const category = searchParams.get("category"); // null = all
  const [items, setItems] = useState<SangrahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const categoryInfo = category
    ? SANGRAH_CATEGORIES.find((c) => c.id === category)
    : null;

  const collectionTitle = categoryInfo
    ? t(categoryInfo.labelMr, categoryInfo.labelEn, categoryInfo.labelMr)
    : t("संपूर्ण संग्रह", "Complete Sangrah", "सम्पूर्ण संग्रह");

  useEffect(() => {
    const url = category
      ? `/api/sangrah/items?category=${encodeURIComponent(category)}`
      : "/api/sangrah/items";
    fetch(url)
      .then((r) => r.json())
      .then((data: SangrahItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [category]);

  const handlePrint = () => {
    const prev = document.title;
    document.title = `${collectionTitle} | Bhaagyavedh`;
    window.print();
    document.title = prev;
  };

  // Group items by category for the "all" download
  const grouped = useMemo(() => {
    const map = new Map<string, SangrahItem[]>();
    for (const item of items) {
      const existing = map.get(item.category) || [];
      existing.push(item);
      map.set(item.category, existing);
    }
    // Sort by SANGRAH_CATEGORIES order
    const ordered: { cat: (typeof SANGRAH_CATEGORIES)[number]; items: SangrahItem[] }[] = [];
    for (const cat of SANGRAH_CATEGORIES) {
      const catItems = map.get(cat.id);
      if (catItems && catItems.length > 0) {
        ordered.push({ cat, items: catItems });
      }
    }
    return ordered;
  }, [items]);

  // Prepare all print pages for all items
  const allPrintData = useMemo(() => {
    return items.map((item) => {
      const prose = isProse(item.content);
      const pages = splitForPrint(item.content, prose);
      return { item, pages, prose };
    });
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8E7" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#d4a843] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5c1a1a] font-medium">{t("संग्रह तयार होत आहे...", "Preparing sangrah...", "संग्रह तैयार हो रहा है...")}</p>
          <p className="text-[#5c1a1a]/50 text-sm mt-1">{t("कृपया प्रतीक्षा करा", "Please wait", "कृपया प्रतीक्षा करें")}</p>
        </div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8E7" }}>
        <div className="text-center">
          <p className="text-[#5c1a1a] font-medium mb-4">{t("काहीतरी चूक झाली", "Something went wrong", "कुछ गलत हुआ")}</p>
          <Link href="/sangrah" className="text-[#d4a843] hover:underline text-sm">
            {t("संग्रह पृष्ठावर परत जा", "Go back to Sangrah", "संग्रह पृष्ठ पर वापस जाएँ")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══ Browser UI ═══ */}
      <div className="no-print">
        <section
          className="py-10 md:py-14 text-center"
          style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}
        >
          <div className="max-w-3xl mx-auto px-4">
            <Link href="/sangrah" className="inline-block text-white/50 hover:text-[#d4a843] text-sm mb-4 transition">
              ← {t("संग्रह", "Sangrah", "संग्रह")}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{collectionTitle}</h1>
            <p className="text-white/60 text-sm mb-6">
              {items.length} {t("पठणे तयार आहेत डाउनलोडसाठी", "items ready for download", "पाठ डाउनलोड के लिए तैयार")}
            </p>
            <button
              onClick={handlePrint}
              className="px-8 py-3 rounded-xl font-semibold text-[#3d0c0c] transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #d4a843, #e5bc5a)" }}
            >
              {t("PDF डाउनलोड करा", "Download as PDF", "PDF डाउनलोड करें")}
            </button>
            <p className="text-white/40 text-xs mt-3">
              {t(
                "\"Save as PDF\" निवडा प्रिंट डायलॉगमध्ये",
                "Select \"Save as PDF\" in the print dialog"
              )}
            </p>
          </div>
        </section>

        {/* Table of Contents preview */}
        <section className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold text-[#3d0c0c] mb-4">{t("अनुक्रमणिका", "Table of Contents", "अनुक्रमणिका")}</h2>
          {grouped.map(({ cat, items: catItems }) => (
            <div key={cat.id} className="mb-5">
              <h3 className="text-sm font-semibold text-[#d4a843] mb-2">
                {t(cat.labelMr, cat.labelEn, cat.labelMr)}
                <span className="text-xs text-gray-400 font-normal">({catItems.length})</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-1 pl-6">
                {catItems.map((item) => (
                  <p key={item.slug} className="text-sm text-gray-600 py-0.5">
                    {t(item.title, item.titleEn, item.title)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <div className="text-center pb-10">
          <button
            onClick={handlePrint}
            className="px-8 py-3 rounded-xl font-semibold text-[#3d0c0c] transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #d4a843, #e5bc5a)" }}
          >
            {t("PDF डाउनलोड करा", "Download as PDF", "PDF डाउनलोड करें")}
          </button>
        </div>
      </div>

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
            <div style={{ color: "#d4a843", fontSize: "13px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>
              Bhaagyavedh
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#3d0c0c", marginBottom: "8px", lineHeight: 1.3 }}>
              {categoryInfo ? t(categoryInfo.labelMr, categoryInfo.labelEn, categoryInfo.labelMr) : "संपूर्ण संग्रह"}
            </h1>
            <p style={{ fontSize: "18px", color: "#5c1a1a", marginBottom: "24px" }}>
              {categoryInfo ? t(categoryInfo.descriptionEn, categoryInfo.descriptionEn, categoryInfo.descriptionEn) : "Complete Devotional Collection"}
            </p>
            <div style={{ width: "60px", height: "3px", background: "#d4a843", borderRadius: "2px", margin: "0 auto 24px" }} />
            <p style={{ fontSize: "14px", color: "#888" }}>
              {items.length} {category ? t("पठणे", "items", "पाठ") : t("आरती, स्तोत्र, चालीसा, मंत्र आणि बरेच काही", "Aartis, Stotras, Chalisas, Mantras & more", "आरती, स्तोत्र, चालीसा, मंत्र और बहुत कुछ")}
            </p>
            <div style={{ marginTop: "48px", fontSize: "11px", color: "#999" }}>
              ॥ श्री गणेशाय नमः ॥
            </div>
          </div>
          <PrintFooter />
        </div>

        {/* Table of Contents page(s) */}
        {(() => {
          const tocEntries: { catLabel: string; items: { title: string; titleEn: string }[] }[] = grouped.map(({ cat, items: catItems }) => ({
            catLabel: `${cat.labelMr} — ${cat.labelEn}`,
            items: catItems.map((i) => ({ title: i.title, titleEn: i.titleEn })),
          }));

          // Split TOC into pages (~40 lines per page)
          const tocPages: React.ReactNode[] = [];
          let currentLines: React.ReactNode[] = [];
          let lineCount = 0;
          const MAX_TOC_LINES = 38;
          let entryIndex = 0;

          for (const entry of tocEntries) {
            // Category heading takes 2 lines
            if (lineCount + 2 + entry.items.length > MAX_TOC_LINES && currentLines.length > 0) {
              tocPages.push(<div key={`toc-${tocPages.length}`}>{currentLines}</div>);
              currentLines = [];
              lineCount = 0;
            }

            currentLines.push(
              <div key={`cat-${entryIndex}`} style={{ marginTop: lineCount > 0 ? "14px" : "0", marginBottom: "6px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#d4a843" }}>{entry.catLabel}</div>
              </div>
            );
            lineCount += 2;

            for (const item of entry.items) {
              if (lineCount >= MAX_TOC_LINES) {
                tocPages.push(<div key={`toc-${tocPages.length}`}>{currentLines}</div>);
                currentLines = [];
                lineCount = 0;
              }
              currentLines.push(
                <div key={`item-${entryIndex}-${item.title}`} style={{ fontSize: "11px", color: "#444", padding: "2px 0 2px 16px", borderBottom: "1px dotted #eee" }}>
                  {item.title} <span style={{ color: "#999" }}>— {item.titleEn}</span>
                </div>
              );
              lineCount += 1;
            }
            entryIndex++;
          }
          if (currentLines.length > 0) {
            tocPages.push(<div key={`toc-${tocPages.length}`}>{currentLines}</div>);
          }

          return tocPages.map((content, i) => (
            <PrintPage
              key={`toc-page-${i}`}
              title={t("अनुक्रमणिका", "Table of Contents", "अनुक्रमणिका")}
              subtitle={tocPages.length > 1 ? `${i + 1}/${tocPages.length}` : ""}
            >
              {i === 0 && (
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#3d0c0c", marginBottom: "14px", borderBottom: "2px solid #d4a843", paddingBottom: "6px", display: "inline-block" }}>
                  {t("अनुक्रमणिका", "Table of Contents", "अनुक्रमणिका")}
                </h2>
              )}
              {content}
            </PrintPage>
          ));
        })()}

        {/* All items content */}
        {allPrintData.map(({ item, pages, prose }, itemIdx) => (
          <div key={item.slug}>
            {/* Item title page (separator) */}
            <div className="print-page">
              <PrintHeader
                title={t(
                  SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelMr || "",
                  SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelEn || ""
                )}
                subtitle={`${itemIdx + 1} / ${items.length}`}
              />
              <div className="print-page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ color: "#d4a843", fontSize: "12px", fontWeight: 500, marginBottom: "12px" }}>
                  {t(
                    SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelMr || "",
                    SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelEn || ""
                  )}
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#3d0c0c", marginBottom: "6px", lineHeight: 1.3 }}>
                  {item.title}
                </h2>
                <p style={{ fontSize: "16px", color: "#5c1a1a", marginBottom: "16px" }}>
                  {item.titleEn}
                </p>
                <div style={{ width: "40px", height: "2px", background: "#d4a843", borderRadius: "2px", margin: "0 auto 16px" }} />
                <p style={{ fontSize: "12px", color: "#888" }}>
                  {t(item.deityMr, item.deityEn, item.deityMr)}
                </p>
              </div>
              <PrintFooter />
            </div>

            {/* Content pages */}
            {pages.map((text, pageIdx) => (
              <PrintPage
                key={`${item.slug}-p${pageIdx}`}
                title={item.title}
                subtitle={pages.length > 1 ? `${item.titleEn} — ${pageIdx + 1}/${pages.length}` : item.titleEn}
              >
                <div style={{ whiteSpace: "pre-line", lineHeight: prose ? 1.7 : 1.9, fontSize: "14px", color: "#3d0c0c", textAlign: prose ? "left" : "center" }}>
                  {text}
                </div>
              </PrintPage>
            ))}
          </div>
        ))}

        {/* Final page */}
        <div className="print-page">
          <PrintHeader title="Bhaagyavedh" subtitle="bhaagyavedh.com" />
          <div className="print-page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ width: "40px", height: "2px", background: "#d4a843", borderRadius: "2px", margin: "0 auto 24px" }} />
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#3d0c0c", marginBottom: "8px" }}>
              ॥ इति शुभम् ॥
            </h2>
            <p style={{ fontSize: "13px", color: "#888", marginTop: "12px" }}>
              {t("भाग्यवेध — वैदिक ज्योतिष आणि भक्ती संग्रह", "Bhaagyavedh — Vedic Astrology & Devotional Collection", "भाग्यवेध — वैदिक ज्योतिष और भक्ति संग्रह")}
            </p>
            <p style={{ fontSize: "11px", color: "#bbb", marginTop: "8px" }}>
              bhaagyavedh.com
            </p>
          </div>
          <PrintFooter />
        </div>
      </div>
    </>
  );
}
