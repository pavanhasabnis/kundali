import { pageMetaI18n, type Lang } from "@/lib/seo";
import AboutPageClient from "./about-client";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/about",
    mr: {
      title: "आमच्याबद्दल — Bhaagyavedh Marathi ज्योतिष प्लॅटफॉर्म",
      description:
        "भाग्यवेध (Bhaagyavedh) — पुण्यातील विश्वसनीय मराठी वैदिक ज्योतिष प्लॅटफॉर्म. कुंडली, गुण मिलान, पंचांग, तीर्थयात्रा सेवा. आमच्याबद्दल जाणून घ्या.",
      keywords: [
        "भाग्यवेध आमच्याबद्दल", "Bhaagyavedh मराठी", "वैदिक ज्योतिष पुणे",
        "मराठी ज्योतिष प्लॅटफॉर्म",
        "bhaagyavedh about", "pune astrology platform", "marathi jyotish",
        "about bhaagyavedh", "vedic astrology pune", "marathi astrology platform",
      ],
    },
    en: {
      title: "About Bhaagyavedh — Vedic Astrology Platform Pune | Marathi & English",
      description:
        "Learn about Bhaagyavedh — trusted Vedic astrology platform from Pune offering free kundli, rashifal, matching, panchang, and pilgrimage services in Marathi and English.",
      keywords: [
        "about bhaagyavedh", "vedic astrology pune", "marathi astrology platform",
        "pune jyotish",
        "bhaagyavedh marathi", "pune astrology platform", "marathi jyotish",
        "भाग्यवेध आमच्याबद्दल", "Bhaagyavedh मराठी",
      ],
    },
  });
}

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Bhaagyavedh — आमच्याबद्दल",
  url: "https://bhaagyavedh.com/about",
  description:
    "Bhaagyavedh (भाग्यवेध) is a Vedic astrology platform offering accurate kundli, rashifal, guna matching, panchang, muhurat, pooja and yatra services grounded in Parashara/Varahamihira tradition with NASA JPL astronomical data and Lahiri Ayanamsa.",
  inLanguage: ["mr", "en"],
  mainEntity: organizationSchema,
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://bhaagyavedh.com" },
        { name: "About", url: "https://bhaagyavedh.com/about" },
      ])} />
      <AboutPageClient />
    </>
  );
}
