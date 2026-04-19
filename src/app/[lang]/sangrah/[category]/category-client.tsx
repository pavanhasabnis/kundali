"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { SANGRAH_CATEGORIES, type SangrahItem } from "@/lib/sangrah-types";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";

interface CategoryInfo {
  id: string;
  labelMr: string;
  labelEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
}

interface Props {
  category: CategoryInfo;
  items: SangrahItem[];
}

export default function CategoryPageClient({ category, items }: Props) {
  const { t, lang } = useLang();
  const [search, setSearch] = useState("");
  const [selectedDeity, setSelectedDeity] = useState<string>("all");

  // Get unique deities for filter
  const deities = Array.from(
    new Map(items.map((item) => [item.deity, { id: item.deity, mr: item.deityMr, en: item.deityEn }])).values()
  );

  const filtered = items.filter((item) => {
    const matchesDeity = selectedDeity === "all" || item.deity === selectedDeity;
    if (!search.trim()) return matchesDeity;
    const q = search.toLowerCase();
    return (
      matchesDeity &&
      (item.title.includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.deityMr.includes(q) ||
        item.deityEn.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q)))
    );
  });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `https://bhaagyavedh.com/${lang}` },
          { name: "Sangrah", url: `https://bhaagyavedh.com/${lang}/sangrah` },
          { name: category.labelEn, url: `https://bhaagyavedh.com/${lang}/sangrah/${category.id}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category.labelEn} — ${category.labelMr}`,
          description: category.descriptionEn,
          url: `https://bhaagyavedh.com/${lang}/sangrah/${category.id}`,
          numberOfItems: items.length,
          inLanguage: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN",
          publisher: { "@type": "Organization", name: "Bhaagyavedh" },
        }}
      />

      {/* Hero */}
      <PageHero
        backHref={`/${lang}/sangrah`}
        backLabel={t("संग्रह", "Sangrah", "संग्रह")}
        title={t(category.labelMr, category.labelEn, category.labelMr)}
        date={`${items.length} ${t("पठणे उपलब्ध", "items available", "पाठ उपलब्ध")}`}
      >
        <div className="mt-5 max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("नावाने शोधा...", "Search by name...", "नाम से खोजें...")}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4a843]/60 text-sm"
          />
        </div>
      </PageHero>

      {/* Deity Filters */}
      {deities.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDeity("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                selectedDeity === "all"
                  ? "bg-[#5c1a1a] text-white border-[#5c1a1a]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#d4a843]/40"
              }`}
            >
              {t("सर्व", "All", "सभी")} ({items.length})
            </button>
            {deities.map((deity) => {
              const count = items.filter((i) => i.deity === deity.id).length;
              return (
                <button
                  key={deity.id}
                  onClick={() => setSelectedDeity(deity.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    selectedDeity === deity.id
                      ? "bg-[#5c1a1a] text-white border-[#5c1a1a]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#d4a843]/40"
                  }`}
                >
                  {t(deity.mr, deity.en, deity.mr)} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Items Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/sangrah/${item.category}/${item.slug}`}
              className="group bg-white rounded-xl border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)",
                }}
              >
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-[#d4a843] shrink-0">
                  {t(item.deityMr[0], item.deityEn[0], item.deityMr[0])}
                </span>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#d4a843] transition">
                    {t(item.title, item.titleEn, item.title)}
                  </h3>
                  <p className="text-white/50 text-xs">
                    {t(item.deityMr, item.deityEn, item.deityMr)}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-gray-500 text-xs line-clamp-2">
                  {t(item.content, item.transliteration, item.content).slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-[#5c1a1a] font-medium group-hover:text-[#d4a843] transition">
                    {t("वाचा →", "Read →", "पढ़ें →")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {t("काहीही सापडले नाही", "No results found", "कुछ नहीं मिला")}
          </p>
        )}
      </section>
    </>
  );
}
