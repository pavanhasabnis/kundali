import { pageMetaI18n, type Lang } from "@/lib/seo";
import SaptahikClient from "./saptahik-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/rashifal/saptahik",
    mr: {
      title: "साप्ताहिक राशिभविष्य — 12 राशी | Weekly Rashifal Marathi",
      description: "साप्ताहिक राशीभविष्य — मेष ते मीन सर्व १२ राशींचे आठवडाभराचे भविष्य. ग्रहगोचर आधारित weekly rashifal marathi.",
      keywords: [
        "साप्ताहिक राशिभविष्य", "weekly rashifal marathi", "साप्ताहिक राशीफल",
        "या आठवड्याचे राशिभविष्य", "weekly horoscope marathi",
      ],
    },
    en: {
      title: "Weekly Rashifal — 12 Zodiac Signs",
      description: "Weekly horoscope for all 12 zodiac signs based on real planetary transits. Marathi weekly rashifal covering career, love, health.",
      keywords: [
        "weekly rashifal marathi", "weekly horoscope 12 signs", "saptahik rashifal",
        "weekly vedic horoscope", "weekly rashi bhavishya",
      ],
    },
    hi: {
      title: "साप्ताहिक राशिफल — १२ राशियाँ | Weekly Rashifal Hindi",
      description: "साप्ताहिक राशिफल — मेष से मीन तक सभी १२ राशियों का सप्ताह भर का भविष्य. ग्रह गोचर आधारित weekly rashifal.",
      keywords: ["साप्ताहिक राशिफल", "weekly rashifal hindi", "साप्ताहिक राशि भविष्य"],
    },
  });
}

export const dynamic = "force-dynamic";

export default function SaptahikPage() { return <SaptahikClient />; }
