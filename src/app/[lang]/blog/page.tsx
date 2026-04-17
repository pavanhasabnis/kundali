import { pageMeta } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/blog-reader";
import BlogPageClient from "./blog-client";

export const metadata = pageMeta({
  title: "Vedic Astrology Blog — ज्योतिष ब्लॉग | Daily Horoscope Articles & Guides",
  description: "Read daily Vedic astrology articles, horoscope guides, kundli tips, rashifal insights, panchang explanations, and spiritual knowledge in Marathi and English.",
  path: "/blog",
  keywords: ["astrology blog", "vedic astrology articles", "horoscope guide", "ज्योतिष ब्लॉग", "kundli tips", "rashifal guide", "daily horoscope articles"],
});

export default function BlogPage() {
  const allPosts = getAllBlogPosts().map(({ slug, title, titleEn, summary, summaryEn, date, category, categoryEn }) => ({
    slug, title, titleEn, summary, summaryEn, date, category, categoryEn,
  }));
  return <BlogPageClient initialPosts={allPosts} />;
}
