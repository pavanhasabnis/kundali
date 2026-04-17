"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { SANGRAH_CATEGORIES, type SangrahItem } from "@/lib/sangrah-types";
import { JsonLd, breadcrumbSchema, serviceSchema } from "@/components/json-ld";

interface Props {
  items: SangrahItem[];
  counts: Record<string, number>;
}

export default function SangrahPageClient({ items, counts }: Props) {
  const { t, lang } = useLang();
  const [search, setSearch] = useState("");

  const totalCount = items.length;

  const filteredCategories = SANGRAH_CATEGORIES.filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.labelMr.includes(q) ||
      cat.labelEn.toLowerCase().includes(q) ||
      cat.description.includes(q) ||
      cat.descriptionEn.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "संग्रह — Devotional Content Library",
          description:
            "Complete collection of Hindu aartis, stotras, chalisas, mantras, vrat kathas, and daily prayers in Marathi and Sanskrit.",
          url: `https://bhaagyavedh.com/${lang}/sangrah`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `https://bhaagyavedh.com/${lang}` },
          { name: "Sangrah", url: `https://bhaagyavedh.com/${lang}/sangrah` },
        ])}
      />

      {/* Hero */}
      <section
        className="relative py-12 md:py-16 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t("संपूर्ण संग्रह", "Complete Sangrah", "सम्पूर्ण संग्रह")}
          </h1>
          <p className="text-white/70 text-base md:text-lg mb-6 max-w-2xl mx-auto">
            {t(
              "आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा, नित्य पठण आणि नामावली — सर्व एकाच ठिकाणी",
              "Aartis, Stotras, Chalisas, Mantras, Vrat Kathas, Daily Prayers & Namavalis — all in one place",
              "आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा, नित्य पाठ और नामावली — सब एक ही जगह"
            )}
          </p>
          <p className="text-[#d4a843] font-semibold text-lg">
            {totalCount}+ {t("श्लोक आणि मंत्र", "Shlokas & Mantras", "श्लोक और मंत्र")}
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("शोधा... (आरती, स्तोत्र, मंत्र)", "Search... (aarti, stotra, mantra)", "खोजें... (आरती, स्तोत्र, मंत्र)")}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4a843]/60 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/sangrah/${cat.id}`}
              className="group bg-white rounded-xl border-2 border-[#d4a843]/20 overflow-hidden hover:shadow-lg hover:border-[#d4a843]/50 transition-all duration-200"
            >
              <div
                className="h-24 flex items-center justify-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)",
                }}
              >
                <div>
                  <h2 className="text-white font-bold text-base leading-tight">
                    {t(cat.labelMr, cat.labelEn, cat.labelMr)}
                  </h2>
                  <p className="text-white/50 text-xs mt-0.5">
                    {counts[cat.id] || 0} {t("पठणे", "items", "पाठ")}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">
                  {t(cat.description, cat.descriptionEn, cat.description)}
                </p>
                <span className="inline-block mt-3 text-xs font-medium text-[#5c1a1a] group-hover:text-[#d4a843] transition">
                  {t("पहा →", "View →", "देखें →")}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {t("काहीही सापडले नाही", "No results found", "कुछ नहीं मिला")}
          </p>
        )}
      </section>

      {/* ─── Download Sangrah Block ─── */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}
        >
          <div className="px-6 md:px-10 pt-8 pb-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              {t("संग्रह PDF डाउनलोड", "Download Sangrah PDF", "संग्रह PDF डाउनलोड")}
            </h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              {t(
                "आरती, स्तोत्र, चालीसा, मंत्र — एका PDF मध्ये डाउनलोड करा. ऑफलाइन वाचनासाठी उत्तम.",
                "Download aartis, stotras, chalisas, mantras — in a single PDF. Perfect for offline reading.",
                "आरती, स्तोत्र, चालीसा, मंत्र — एक ही PDF में डाउनलोड करें. ऑफ़लाइन पठन के लिए उत्तम."
              )}
            </p>
          </div>

          {/* Category-wise download buttons */}
          <div className="px-6 md:px-10 pb-4">
            <p className="text-[#d4a843] text-xs font-semibold mb-3 text-center tracking-wider uppercase">
              {t("श्रेणीनुसार डाउनलोड", "Download by Category", "श्रेणीवार डाउनलोड")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {SANGRAH_CATEGORIES.map((cat) => {
                const count = counts[cat.id] || 0;
                if (count === 0) return null;
                return (
                  <Link
                    key={cat.id}
                    href={`/sangrah/download?category=${cat.id}`}
                    className="group flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4a843]/50 hover:bg-white/10 transition-all"
                  >
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium truncate group-hover:text-[#d4a843] transition">
                        {t(cat.labelMr, cat.labelEn, cat.labelMr)}
                      </p>
                      <p className="text-white/30 text-[10px]">
                        {count} {t("पठणे", "items")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Download All button */}
          <div className="px-6 md:px-10 pt-2 pb-8 text-center">
            <div className="inline-block w-16 h-px bg-white/10 mb-5" />
            <div>
              <Link
                href="/sangrah/download"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[#3d0c0c] transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #d4a843, #e5bc5a)" }}
              >
                {t("संपूर्ण संग्रह डाउनलोड करा", "Download Complete Sangrah", "सम्पूर्ण संग्रह डाउनलोड करें")}
                <span className="text-[#3d0c0c]/60 text-sm font-normal">({totalCount}+)</span>
              </Link>
              <p className="text-white/30 text-xs mt-3">
                {t("सर्व आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा, नित्य पठण एकाच PDF मध्ये", "All aartis, stotras, chalisas, mantras, vrat kathas, daily prayers in one PDF", "सभी आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा, नित्य पाठ एक ही PDF में")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access — Popular Items */}
      {items.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-[#3d0c0c] mb-5">
            {t("लोकप्रिय पठणे", "Popular Recitations", "लोकप्रिय पाठ")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items
              .filter((item) =>
                ["aarti-ganpati", "stotra-ramraksha", "chalisa-hanuman", "stotra-ganpati-atharvashirsha", "mantra-gayatri", "mantra-mahamrityunjay", "aarti-shankar", "aarti-vitthal", "aarti-saibaba"].includes(item.slug)
              )
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/sangrah/${item.category}/${item.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-sm transition group"
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}
                  >
                    {t(item.deityMr[0], item.deityEn[0], item.deityMr[0])}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#5c1a1a]">
                      {t(item.title, item.titleEn, item.title)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {t(
                        SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelMr || item.category,
                        SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelEn || item.category,
                        SANGRAH_CATEGORIES.find((c) => c.id === item.category)?.labelMr || item.category
                      )}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}
    </>
  );
}
