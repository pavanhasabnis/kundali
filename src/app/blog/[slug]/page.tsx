import type { Metadata } from "next";
import { getBlogPost } from "@/lib/blog-reader";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import BlogPostClient from "./blog-post-client";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  const title = post.seo?.metaTitle || post.titleEn;
  const description = post.seo?.metaDescription || post.summaryEn;
  const url = `${SITE_URL}/blog/${slug}`;
  const keywords = post.seo ? [...post.seo.keywords, ...(post.seo.keywordsMr || [])] : [];
  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.date,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return <BlogPostClient slug={slug} post={post} />;
}
