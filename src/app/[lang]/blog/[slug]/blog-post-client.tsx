"use client";

import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/components/json-ld";

interface BlogFaq {
  questionMr: string;
  questionEn: string;
  answerMr: string;
  answerEn: string;
}

interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  keywordsMr: string[];
}

interface BlogPost {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  date: string;
  category: string;
  categoryEn: string;
  content: string;
  contentEn: string;
  seo?: BlogSeo;
  faq?: BlogFaq[];
}

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (lang === "mr") {
    const months = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPostClient({ slug, post }: { slug: string; post: BlogPost | null }) {
  const { t, lang } = useLang();

  if (!post) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen py-20 text-center">
        <p className="text-xl font-bold text-stone-700">{t("लेख सापडला नाही", "Post not found")}</p>
        <Link href="/blog" className="text-sm mt-4 inline-block font-semibold" style={{ color: "#d4a843" }}>
          {t("← सर्व लेख पहा", "← Back to all posts")}
        </Link>
      </div>
    );
  }

  const content = t(post.content, post.contentEn);

  // Dynamic SEO meta tags
  const seoTitle = post.seo?.metaTitle || t(post.title, post.titleEn);
  const seoDesc = post.seo?.metaDescription || t(post.summary, post.summaryEn);
  const seoKeywords = post.seo ? [...post.seo.keywords, ...(post.seo.keywordsMr || [])].join(", ") : "";
  const postUrl = `https://bhaagyavedh.com/${lang}/blog/${slug}`;

  // Build FAQ schema from post data
  const faqItems = post.faq?.map(f => ({
    question: t(f.questionMr, f.questionEn),
    answer: t(f.answerMr, f.answerEn),
  })) || [];

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-6">
      {/* JSON-LD Structured Data */}
      <JsonLd data={articleSchema({ title: seoTitle, description: seoDesc, url: postUrl, datePublished: post.date, inLanguage: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `https://bhaagyavedh.com/${lang}` }, { name: "Blog", url: `https://bhaagyavedh.com/${lang}/blog` }, { name: t(post.title, post.titleEn), url: postUrl }])} />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back link */}
        <Link href="/blog" className="text-xs font-semibold mb-6 inline-block" style={{ color: "#d4a843" }}>
          {t("← सर्व लेख", "← All posts")}
        </Link>

        <article className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 pb-4" style={{ borderBottom: "1px solid #e5e0d5" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#d4a843" }}>
                {t(post.category, post.categoryEn)}
              </span>
              <span className="text-xs text-stone-400">
                {formatDate(post.date, lang)}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight" style={{ color: "#3d0c0c" }}>
              {t(post.title, post.titleEn)}
            </h1>
            <p className="text-sm text-stone-500 mt-2">
              {t(post.summary, post.summaryEn)}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 prose prose-stone prose-sm max-w-none">
            {content.split("\n\n").map((para, i) => {
              // Heading
              if (para.startsWith("## ")) {
                return <h2 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: "#5c1a1a" }}>{para.slice(3)}</h2>;
              }
              if (para.startsWith("### ")) {
                return <h3 key={i} className="text-base font-bold mt-4 mb-1.5" style={{ color: "#3d0c0c" }}>{para.slice(4)}</h3>;
              }
              // Bullet list
              if (para.includes("\n- ")) {
                const lines = para.split("\n");
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1 my-3">
                    {lines.map((line, j) => (
                      <li key={j} className="text-sm text-stone-700">{line.replace(/^- /, "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="text-sm text-stone-700 leading-relaxed mb-3">{para}</p>;
            })}
          </div>

          {/* Footer */}
          <div className="p-6 text-center" style={{ borderTop: "1px solid #e5e0d5", background: "#f5efe0" }}>
            <p className="text-xs text-stone-500">
              {t("भाग्यवेध — दररोज नवीन ज्योतिष ज्ञान", "Bhaagyavedh — Daily Vedic knowledge")}
            </p>
          </div>
        </article>

        {/* FAQ Section — auto-generated for AEO/GEO */}
        {post.faq && post.faq.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#5c1a1a" }}>
              {t("सामान्य प्रश्न", "Frequently Asked Questions")}
            </h2>
            <div className="space-y-3">
              {post.faq.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl border border-[#d4a843]/20 overflow-hidden">
                  <summary className="px-5 py-4 cursor-pointer font-semibold text-sm text-[#5c1a1a] hover:bg-[#d4a843]/5">
                    {t(faq.questionMr, faq.questionEn)}
                  </summary>
                  <p className="px-5 pb-4 text-sm text-[#5c1a1a]/70 leading-relaxed">
                    {t(faq.answerMr, faq.answerEn)}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* SEO Keywords display for GEO */}
        {post.seo?.keywords && (
          <div className="mt-6 flex flex-wrap gap-2">
            {[...post.seo.keywords.slice(0, 8), ...(post.seo.keywordsMr?.slice(0, 4) || [])].map((kw, i) => (
              <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-[#d4a843]/10 text-[#5c1a1a]/60">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
