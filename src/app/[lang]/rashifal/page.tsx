import { pageMetaI18n, type Lang } from "@/lib/seo";
import RashifalPageClient from "./rashifal-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  const today = new Date();
  const dateEn = today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const dateMr = today.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" });

  return pageMetaI18n({
    lang: l,
    path: "/rashifal",
    mr: {
      title: `आजचे राशीभविष्य — 12 राशी | Aajcha Rashifal`,
      description: `आजचे राशीभविष्य ${dateMr} — मेष ते मीन सर्व 12 राशींचे दैनिक राशीफल. Aajcha rashi bhavishya marathi, ग्रह गोचरावर आधारित अचूक भविष्य.`,
      keywords: [
        "आजचे राशीभविष्य", "दैनिक राशीफल", "12 राशी भविष्य", "राशी भविष्य मराठी",
        "aajcha rashifal", "ajjcha rashi bhavishya", "aaj cha rashi bhavishya",
        "daily rashifal marathi", "rashi bhavishya today",
        "daily horoscope", "today horoscope", "12 zodiac signs horoscope",
      ],
    },
    en: {
      title: `Today's Horoscope — All 12 Zodiac Signs | Bhaagyavedh`,
      description: `Daily horoscope ${dateEn} for all 12 zodiac signs in Marathi & English. Aajcha rashi bhavishya based on real Vedic planetary transits — career, love, health.`,
      keywords: [
        "daily horoscope", "today horoscope", "12 zodiac horoscope", "daily rashifal",
        "vedic horoscope", "horoscope today",
        "aajcha rashifal", "ajjcha rashi bhavishya", "rashi bhavishya marathi",
        "daily rashifal marathi",
        "आजचे राशीभविष्य", "दैनिक राशीफल",
      ],
    },
  });
}

export const dynamic = "force-dynamic";

export default function RashifalPage() {
  return <RashifalPageClient />;
}
