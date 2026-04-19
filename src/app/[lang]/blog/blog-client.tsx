"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";

interface BlogPostSummary {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  date: string;
  category: string;
  categoryEn: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "राशीफल": "#d4a843",
  "पंचांग": "#2d6b2d",
  "ज्योतिष ज्ञान": "#6366f1",
  "उपाय": "#b91c1c",
  "सण-उत्सव": "#ea580c",
};

const POSTS_PER_PAGE = 10;

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (lang === "mr") {
    const months = ["जाने", "फेब्रु", "मार्च", "एप्रि", "मे", "जून", "जुलै", "ऑग", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  if (lang === "hi") {
    const months = ["जन", "फर", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogPageClient({ initialPosts }: { initialPosts: BlogPostSummary[] }) {
  const { t, lang } = useLang();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(initialPosts.length / POSTS_PER_PAGE);
  const posts = initialPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `https://bhaagyavedh.com/${lang}` }, { name: "Blog", url: `https://bhaagyavedh.com/${lang}/blog` }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "Bhaagyavedh Astrology Blog — ज्योतिष ब्लॉग", url: `https://bhaagyavedh.com/${lang}/blog`, description: "Daily Vedic astrology articles in Marathi & English — rashifal, panchang, festivals, remedies.", inLanguage: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN", publisher: { "@type": "Organization", name: "Bhaagyavedh" } }} />
      <PageHero
        title={t("दैनिक ज्योतिष लेख", "Daily Astrology Blog", "दैनिक ज्योतिष ब्लॉग")}
        subtitle={t("दररोज नवीन ज्योतिष लेख, राशीफल विश्लेषण आणि वैदिक ज्ञान", "Daily astrology articles, rashifal analysis and Vedic knowledge", "प्रतिदिन नए ज्योतिष लेख, राशिफल विश्लेषण और वैदिक ज्ञान")}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {posts.length > 0 ? (
          <>
            {/* Blog Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#d4a843]/30 transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: CATEGORY_COLORS[post.category] || "#6b7280" }}
                      >
                        {t(post.category, post.categoryEn, post.category)}
                      </span>
                      <span className="text-xs text-stone-400">
                        {formatDate(post.date, lang)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mb-1.5" style={{ color: "#3d0c0c" }}>
                      {t(post.title, post.titleEn, post.title)}
                    </h2>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {t(post.summary, post.summaryEn, post.summary)}
                    </p>
                    <p className="text-xs font-semibold mt-3" style={{ color: "#d4a843" }}>
                      {t("पुढे वाचा →", "Read more →", "आगे पढ़ें →")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-30"
                  style={{ background: "#FFF3D6", color: "#3d0c0c" }}
                >
                  {t("← मागील", "← Prev", "← पिछला")}
                </button>
                <span className="text-sm text-stone-500">
                  {t(`पृष्ठ ${page} / ${totalPages}`, `Page ${page} / ${totalPages}`, `पृष्ठ ${page} / ${totalPages}`)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-30"
                  style={{ background: "#FFF3D6", color: "#3d0c0c" }}
                >
                  {t("पुढील →", "Next →", "अगला →")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg font-semibold text-stone-700 mb-2">
              {t("लवकरच लेख येत आहेत!", "Articles coming soon!", "जल्द ही लेख आएँगे!")}
            </p>
            <p className="text-sm text-stone-500">
              {t("दररोज नवीन ज्योतिष लेख स्वयंचलितपणे प्रकाशित होतील.", "New astrology articles will be published automatically every day.", "प्रतिदिन नए ज्योतिष लेख स्वचालित रूप से प्रकाशित होंगे.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
