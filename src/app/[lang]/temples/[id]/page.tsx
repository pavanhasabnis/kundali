import { getTempleData } from "@/lib/blog-reader";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import TempleDetailClient from "./temple-detail-client";

interface Props { params: Promise<{ lang: string; id: string }> }

export async function generateMetadata({ params }: Props) {
  const { lang, id } = await params;
  const post = getTempleData(id);
  if (!post) return { title: "Temple Not Found" };
  const l: Lang = lang === "en" ? "en" : "mr";

  const nameMr = post.title;
  const nameEn = post.titleEn;
  const descMr = (post.summary || `${nameMr} मंदिर दर्शन, इतिहास, पोहोचण्याचा मार्ग आणि संपूर्ण माहिती.`).substring(0, 160);
  const descEn = (post.summaryEn || `Complete ${nameEn} temple guide — darshan timings, history, significance, how to reach.`).substring(0, 160);

  return pageMetaI18n({
    lang: l,
    path: `/temples/${id}`,
    ogType: "article",
    mr: {
      title: `${nameMr} मंदिर — दर्शन वेळ, इतिहास | ${nameEn} Temple Marathi | भाग्यवेध`,
      description: descMr,
      keywords: [
        `${nameMr} मंदिर`, `${nameMr} दर्शन`, `${nameMr} मंदिर माहिती`,
        `${nameMr} इतिहास`, `${nameMr} पोहोचण्याचा मार्ग`,
        `${nameEn} temple marathi`, `${nameEn} mandir marathi`,
        `${nameEn} temple`, `${nameEn} darshan`, `${nameEn} history`,
        "hindu temple", "मंदिर माहिती", "temple guide marathi",
      ],
    },
    en: {
      title: `${nameEn} Temple — Darshan Timings, History, How to Reach | Bhaagyavedh`,
      description: descEn,
      keywords: [
        `${nameEn} temple`, `${nameEn} darshan`, `${nameEn} history`,
        `${nameEn} timings`, `${nameEn} how to reach`,
        `${nameEn} temple marathi`, `${nameEn} mandir marathi`,
        "hindu temple guide", `${nameMr} मंदिर`,
        "famous temples india", "temple tour",
      ],
    },
  });
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
