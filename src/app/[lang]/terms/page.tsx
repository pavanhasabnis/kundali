import { pageMetaI18n, type Lang } from "@/lib/seo";
import TermsPageClient from "./terms-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/terms",
    mr: {
      title: "अटी व शर्ती — Terms Marathi | भाग्यवेध",
      description: "भाग्यवेध अटी व शर्ती — वेबसाइट वापर नियम. Terms and conditions marathi.",
      keywords: ["अटी व शर्ती", "terms marathi", "bhaagyavedh terms"],
    },
    en: {
      title: "Terms and Conditions — Bhaagyavedh",
      description: "Bhaagyavedh terms and conditions for website usage. Available in Marathi and English.",
      keywords: ["terms and conditions", "terms of service", "bhaagyavedh terms"],
    },
  });
}

export default function TermsPage() {
  return <TermsPageClient />;
}
