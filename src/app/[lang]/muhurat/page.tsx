import { pageMeta } from "@/lib/seo";
import MuhuratFinderPageClient from "./muhurat-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

export const metadata = pageMeta({
  title: "Shubh Muhurat Finder — शुभ मुहूर्त | Marriage, Griha Pravesh & Auspicious Times",
  description: "Find shubh muhurat for marriage, griha pravesh, vastushanti, and business. Search auspicious dates based on Vedic panchang calculations.",
  path: "/muhurat",
  keywords: ["shubh muhurat", "auspicious time", "muhurat today", "शुभ मुहूर्त", "marriage muhurat", "griha pravesh muhurat"],
});

export default function MuhuratPage() {
  return (
    <>
      <JsonLd data={serviceSchema({
        name: "Shubh Muhurat Finder — शुभ मुहूर्त",
        description: "Find auspicious Vedic muhurat for marriage, griha pravesh, vastushanti, and business using panchang — tithi, nakshatra, yoga, karana.",
        url: "https://bhaagyavedh.com/muhurat",
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://bhaagyavedh.com" },
        { name: "Muhurat", url: "https://bhaagyavedh.com/muhurat" },
      ])} />
      <MuhuratFinderPageClient />
    </>
  );
}
