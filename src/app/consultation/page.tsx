import { pageMeta } from "@/lib/seo";
import ConsultationPageClient from "./consultation-client";

export const metadata = pageMeta({
  title: "Online Astrology Consultation — ज्योतिष सल्ला | Expert Vedic Astrologer",
  description:
    "Personal consultation with experienced Vedic astrologers for kundli reading, marriage matching, career guidance, muhurat selection and more. Phone, video call or in-person. ज्योतिष सल्ला सेवा.",
  path: "/consultation",
  keywords: [
    "astrology consultation online",
    "jyotish consultation",
    "ज्योतिष सल्ला",
    "online astrologer",
    "vedic astrology consultation",
  ],
});

export default function ConsultationPage() {
  return <ConsultationPageClient />;
}
