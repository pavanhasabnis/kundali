import { pageMetaI18n, type Lang } from "@/lib/seo";
import PrashnaClient from "./prashna-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/prashna",
    mr: {
      title: "प्रश्न कुंडली — Prashna Kundli मराठी",
      description:
        "तुमच्या मनातील प्रश्न विचारा आणि आत्ताच्या ग्रहस्थितीवरून उत्तर मिळवा. पारंपरिक प्रश्न ज्योतिष (होरारी).",
      keywords: [
        "प्रश्न कुंडली", "प्रश्न ज्योतिष", "horary", "prashna kundli",
        "प्रश्न शास्त्र", "होरारी कुंडली",
      ],
    },
    en: {
      title: "Prashna Kundli — Horary Question Chart | Bhaagyavedh",
      description:
        "Ask a question and get an answer from the current planetary positions. Traditional Prashna (horary) astrology.",
      keywords: [
        "prashna kundli", "horary astrology", "question chart",
        "yes no astrology", "prashna jyotish",
      ],
    },
    hi: {
      title: "प्रश्न कुंडली — Prashna Kundali हिंदी",
      description:
        "अपना प्रश्न पूछें और वर्तमान ग्रह स्थिति से उत्तर पाएँ. पारंपरिक प्रश्न ज्योतिष (होरारी).",
      keywords: [
        "प्रश्न कुंडली", "प्रश्न ज्योतिष", "होरारी", "prashna kundli hindi",
      ],
    },
  });
}

export default function PrashnaPage() {
  return <PrashnaClient />;
}
