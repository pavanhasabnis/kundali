import { pageMetaI18n, type Lang } from "@/lib/seo";
import ContactPageClient from "./contact-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/contact",
    mr: {
      title: "संपर्क — भाग्यवेध पुणे | Contact Marathi | भाग्यवेध",
      description:
        "भाग्यवेध पुणे — संपर्क करा ज्योतिष, पूजा, तीर्थयात्रा बुकिंगसाठी. फोन, ईमेल, पत्ता. Contact Bhaagyavedh Pune.",
      keywords: [
        "भाग्यवेध संपर्क", "पुणे ज्योतिषी संपर्क", "Bhaagyavedh पुणे",
        "bhaagyavedh contact", "pune astrologer contact",
        "contact bhaagyavedh", "pune astrology contact",
      ],
    },
    en: {
      title: "Contact Bhaagyavedh — Astrology & Pooja Services Pune | Bhaagyavedh",
      description:
        "Contact Bhaagyavedh Pune for astrology consultation, pooja services, yatra bookings. Phone, email, address in Kothrud, Pune.",
      keywords: [
        "contact bhaagyavedh", "pune astrology contact", "kothrud astrology",
        "pooja booking pune",
        "bhaagyavedh contact", "pune astrologer contact",
        "भाग्यवेध संपर्क", "पुणे ज्योतिषी",
      ],
    },
  });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
