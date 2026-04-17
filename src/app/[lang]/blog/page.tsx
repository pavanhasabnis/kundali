import { pageMetaI18n, type Lang } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/blog-reader";
import BlogPageClient from "./blog-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/blog",
    mr: {
      title: "दैनिक ब्लॉग — ज्योतिष, सण, व्रत लेख मराठी",
      description:
        "दैनिक मराठी ज्योतिष ब्लॉग — राशीभविष्य लेख, सण महत्व, व्रत कथा, ज्योतिष उपाय, पंचांग विशेष. Marathi astrology blog, वैदिक लेख पुणे.",
      keywords: [
        "मराठी ज्योतिष ब्लॉग", "राशीभविष्य लेख", "सण माहिती मराठी", "व्रत कथा",
        "ज्योतिष उपाय लेख",
        "astrology blog marathi", "marathi jyotish blog", "rashi bhavishya articles",
        "astrology blog", "vedic blog", "daily astrology articles",
      ],
    },
    en: {
      title: "Astrology Blog — Marathi Vedic Articles | Bhaagyavedh",
      description:
        "Daily Marathi astrology blog — Vedic articles on horoscope, festivals, vrat katha, remedies, panchang. Read authentic Jyotish content in Marathi & English.",
      keywords: [
        "astrology blog", "vedic astrology articles", "daily astrology",
        "festival articles", "astrology remedies",
        "astrology blog marathi", "marathi jyotish blog",
        "मराठी ज्योतिष ब्लॉग", "राशीभविष्य लेख",
      ],
    },
  });
}

export default function BlogPage() {
  const allPosts = getAllBlogPosts().map(({ slug, title, titleEn, summary, summaryEn, date, category, categoryEn }) => ({
    slug, title, titleEn, summary, summaryEn, date, category, categoryEn,
  }));
  return <BlogPageClient initialPosts={allPosts} />;
}
