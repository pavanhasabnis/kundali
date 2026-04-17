import type { Metadata } from "next";
import { getTempleData } from "@/lib/blog-reader";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import TempleDetailClient from "./temple-detail-client";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getTempleData(id);
  if (!post) {
    return { title: "Temple Not Found" };
  }
  const title = `${post.titleEn} — Temple Guide`;
  const description = post.summaryEn?.substring(0, 160) || `Complete guide to ${post.titleEn} — darshan timings, significance, how to reach, and travel info.`;
  const url = `${SITE_URL}/temples/${id}`;
  return {
    title,
    description,
    keywords: `${post.titleEn}, ${post.title}, temple, मंदिर, darshan, timings, significance`,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
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

export default async function TempleDetailPage({ params }: Props) {
  const { id } = await params;
  const post = getTempleData(id);
  const temple = post ? {
    nameMr: post.title,
    nameEn: post.titleEn,
    deityMr: "",
    deityEn: "",
    icon: "🛕",
    locationMr: "",
    locationEn: "",
    descMr: post.summary,
    descEn: post.summaryEn,
    significanceMr: "",
    significanceEn: "",
    timingsMr: "",
    timingsEn: "",
    specialMr: "",
    specialEn: "",
    detailMr: post.content,
    detailEn: post.contentEn,
    category: "",
  } : null;
  return <TempleDetailClient id={id} temple={temple} />;
}
