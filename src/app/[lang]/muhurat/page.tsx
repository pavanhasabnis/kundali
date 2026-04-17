import { pageMetaI18n, type Lang } from "@/lib/seo";
import MuhuratFinderPageClient from "./muhurat-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const year = new Date().getFullYear();
  return pageMetaI18n({
    lang: l,
    path: "/muhurat",
    mr: {
      title: `शुभ मुहूर्त ${year} — विवाह, गृहप्रवेश`,
      description: `विवाह मुहूर्त, गृहप्रवेश, वास्तुशांती, व्यापार शुभारंभ साठी शुभ तिथी. Shubh muhurat marathi ${year} — वैदिक पंचांग आधारित अचूक मुहूर्त.`,
      keywords: [
        "शुभ मुहूर्त", "विवाह मुहूर्त", "गृहप्रवेश मुहूर्त", "वास्तुशांती मुहूर्त",
        "व्यापार मुहूर्त", `लग्न मुहूर्त मराठी ${year}`,
        "shubh muhurat marathi", "vivah muhurat marathi", "gruhapravesh muhurat",
        "marriage muhurat marathi", "lagna muhurat",
        "shubh muhurat", "marriage muhurat", "griha pravesh muhurat", "auspicious time",
      ],
    },
    en: {
      title: `Shubh Muhurat ${year} — Marriage & Griha Pravesh`,
      description: `Find shubh muhurat for marriage, griha pravesh, vastushanti, business ${year}. Vivah muhurat marathi — Vedic panchang based tithi, nakshatra, yoga.`,
      keywords: [
        "shubh muhurat", "marriage muhurat", "griha pravesh muhurat", "vastushanti muhurat",
        `auspicious time ${year}`,
        "shubh muhurat marathi", "vivah muhurat marathi", "gruhapravesh marathi",
        "marriage muhurat marathi",
        "शुभ मुहूर्त", "विवाह मुहूर्त",
      ],
    },
  });
}

export default async function MuhuratPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const base = `https://bhaagyavedh.com/${lang}`;
  return (
    <>
      <JsonLd data={serviceSchema({
        name: "Shubh Muhurat Finder — शुभ मुहूर्त",
        description: "Find auspicious Vedic muhurat for marriage, griha pravesh, vastushanti, and business using panchang — tithi, nakshatra, yoga, karana.",
        url: `${base}/muhurat`,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: base },
        { name: "Muhurat", url: `${base}/muhurat` },
      ])} />
      <MuhuratFinderPageClient />
    </>
  );
}
