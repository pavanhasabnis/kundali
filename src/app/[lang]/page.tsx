import HomePageClient from "./home-client";
import { pageMetaI18n, type Lang } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/",
    mr: {
      title: "भाग्यवेध — मोफत कुंडली, राशीफल, पंचांग | Vedic Astrology Marathi",
      description:
        "मोफत जन्म कुंडली, आजचे राशीभविष्य, गुण मिलान, पंचांग, शुभ मुहूर्त आणि तीर्थयात्रा सेवा. Aajcha rashifal, mofat kundli, panchang Marathi. भाग्यवेध वर वैदिक ज्योतिष.",
      keywords: [
        "मोफत कुंडली", "जन्म कुंडली", "आजचे राशीभविष्य", "पंचांग आज", "गुण मिलान", "मुहूर्त",
        "तीर्थयात्रा", "मराठी ज्योतिष",
        "mofat kundli", "aajcha rashifal", "ajjcha rashi bhavishya", "panchang marathi",
        "gun milan marathi", "muhurat marathi", "bhaagyavedh", "vedic astrology marathi", "pune astrology",
      ],
    },
    en: {
      title: "Bhaagyavedh — Free Kundli, Horoscope, Panchang | Vedic Astrology",
      description:
        "Free janam kundli maker, daily horoscope, Ashtakoot matching, panchang, shubh muhurat, and pilgrimage services. Aajcha rashifal marathi, mofat kundali. Trusted Vedic astrology from Pune.",
      keywords: [
        "free kundli online", "janam kundli maker", "daily horoscope", "kundli matching",
        "panchang today", "shubh muhurat", "vedic astrology",
        "mofat kundli", "aajcha rashifal", "janam kundali marathi", "gun milan",
        "bhaagyavedh", "marathi horoscope",
        "आजचे राशीभविष्य", "मोफत कुंडली",
      ],
    },
  });
}

export default function HomePage() {
  return <HomePageClient />;
}
