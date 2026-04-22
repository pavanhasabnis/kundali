import { getBlogPost } from "@/lib/blog-reader";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import BlogPostClient from "./blog-post-client";

interface Props { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";

  const titleMr = post.title;
  const titleEn = post.titleEn;
  const descMr = (post.summary || post.titleMr || titleMr).substring(0, 160);
  const descEn = (post.seo?.metaDescription || post.summaryEn || titleEn).substring(0, 160);
  const tagsEn = post.seo?.keywords || [];
  const tagsMr = post.seo?.keywordsMr || [];

  return pageMetaI18n({
    lang: l,
    path: `/blog/${slug}`,
    ogType: "article",
    mr: {
      title: `${titleMr} — ${titleEn}`,
      description: descMr,
      keywords: [
        ...tagsMr,
        ...tagsEn,
        "मराठी ज्योतिष ब्लॉग", "ज्योतिष लेख",
        "astrology blog marathi", "vedic blog",
      ],
    },
    en: {
      title: `${post.seo?.metaTitle || titleEn} — ${titleMr}`,
      description: descEn,
      keywords: [
        ...tagsEn,
        ...tagsMr,
        "astrology blog", "vedic astrology article",
        "marathi astrology blog", "astrology article marathi",
      ],
    },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return <BlogPostClient slug={slug} post={post} />;
}
