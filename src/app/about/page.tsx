import { pageMeta } from "@/lib/seo";
import AboutPageClient from "./about-client";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/components/json-ld";

export const metadata = pageMeta({
  title: "About Us — आमच्याबद्दल | Bhaagyavedh",
  description:
    "Bhaagyavedh — India's trusted Vedic astrology platform. Accurate kundli generation, guna matching, panchang, rashifal, divine sangrah and pilgrimage yatra services. भाग्यवेध — वैदिक ज्योतिष आणि तीर्थयात्रा.",
  path: "/about",
  keywords: ["about bhaagyavedh", "vedic astrology platform", "भाग्यवेध", "आमच्याबद्दल", "kundli", "jyotish"],
});

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
