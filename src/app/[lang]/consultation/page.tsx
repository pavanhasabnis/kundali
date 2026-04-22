import { pageMetaI18n, type Lang } from "@/lib/seo";
import ConsultationPageClient from "./consultation-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/consultation",
    mr: {
      title: "ज्योतिष सल्ला — वैदिक ज्योतिष तज्ञांशी संपर्क | Astrology Consultation Marathi",
      description:
        "अनुभवी वैदिक ज्योतिष तज्ञांकडून कुंडली विश्लेषण, दशा, उपाय यांचा सल्ला घ्या. Jyotish salla marathi pune. फोन, व्हिडिओ सल्ला उपलब्ध.",
      keywords: [
        "ज्योतिष सल्ला", "कुंडली सल्ला", "दशा सल्ला", "वैदिक ज्योतिष तज्ञ",
        "पुणे ज्योतिषी", "ज्योतिषी मराठी",
        "jyotish salla marathi", "astrologer marathi", "kundli consultation marathi",
        "pune jyotishi",
        "astrology consultation", "vedic astrologer online", "online jyotish consultation",
      ],
    },
    en: {
      title: "Astrology Consultation — Vedic Jyotish in Marathi & English",
      description:
        "Get personalized Vedic astrology consultation from experienced jyotish experts. Kundli analysis, dasha reading, remedies. Jyotish salla marathi in Pune — phone or video.",
      keywords: [
        "astrology consultation", "vedic astrologer online", "jyotish consultation",
        "kundli consultation", "online astrologer",
        "jyotish salla marathi", "astrologer marathi", "pune jyotishi",
        "ज्योतिष सल्ला", "वैदिक ज्योतिष तज्ञ",
      ],
    },
  });
}

export default function ConsultationPage() {
  return <ConsultationPageClient />;
}
