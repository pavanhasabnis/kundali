import { pageMetaI18n, type Lang } from "@/lib/seo";
import PrivacyPageClient from "./privacy-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/privacy",
    mr: {
      title: "गोपनीयता धोरण — Privacy Policy Marathi | भाग्यवेध",
      description:
        "भाग्यवेध गोपनीयता धोरण — आपल्या डेटाची सुरक्षा आणि वापरण्याविषयी माहिती. Privacy policy marathi.",
      keywords: ["गोपनीयता धोरण", "privacy policy marathi", "bhaagyavedh privacy"],
    },
    en: {
      title: "Privacy Policy — Bhaagyavedh",
      description:
        "Bhaagyavedh privacy policy — how we collect, use, and protect your data. Available in Marathi and English.",
      keywords: ["privacy policy", "data protection", "bhaagyavedh privacy"],
    },
  });
}

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
