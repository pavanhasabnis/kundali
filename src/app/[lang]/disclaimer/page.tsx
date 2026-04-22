import { pageMetaI18n, type Lang } from "@/lib/seo";
import DisclaimerPageClient from "./disclaimer-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/disclaimer",
    mr: {
      title: "अस्वीकरण — Disclaimer Marathi",
      description: "भाग्यवेध अस्वीकरण — ज्योतिष हे मार्गदर्शनासाठी आहे, अंतिम निर्णयासाठी नाही.",
      keywords: ["अस्वीकरण", "disclaimer marathi", "bhaagyavedh disclaimer"],
    },
    en: {
      title: "Disclaimer",
      description: "Bhaagyavedh disclaimer — astrology is for guidance, not final decisions. Available in Marathi and English.",
      keywords: ["disclaimer", "astrology disclaimer", "bhaagyavedh disclaimer"],
    },
  });
}

export default function DisclaimerPage() {
  return <DisclaimerPageClient />;
}
