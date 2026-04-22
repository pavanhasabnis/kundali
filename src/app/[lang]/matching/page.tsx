import { pageMetaI18n, type Lang } from "@/lib/seo";
import MatchingPageClient from "./matching-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/matching",
    mr: {
      title: "गुण मिलान — 36 गुण कुंडली मेळ | Gun Milan Marathi",
      description:
        "विवाहासाठी 36 गुण कुंडली जुळवणी. अष्टकूट गुण मिलान — वर्ण, वश्य, तारा, योनी, ग्रह मैत्री, गण, भकूट, नाडी. Gun milan marathi, kundali matching online free.",
      keywords: [
        "गुण मिलान", "कुंडली मिलान", "कुंडली मेळ", "36 गुण कुंडली", "अष्टकूट",
        "मंगळ दोष", "नाडी दोष", "भकूट दोष", "विवाह कुंडली",
        "gun milan marathi", "gun milaan", "kundali matching marathi",
        "ashtakoot matching marathi", "mangal dosh marathi", "nadi dosh",
        "kundli matching", "gun milan", "36 gun milan", "ashtakoot",
        "marriage kundli matching",
      ],
    },
    en: {
      title: "Kundli Matching — 36 Gun Milan Ashtakoot",
      description:
        "Free 36 guna kundli matching. Ashtakoot — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi. Mangal & Nadi dosh check in Marathi + English.",
      keywords: [
        "kundli matching", "36 gun milan", "ashtakoot matching", "kundali matching free",
        "marriage matching vedic", "mangal dosh check", "nadi dosh",
        "gun milan marathi", "gun milaan", "kundali matching marathi", "ashtakoot marathi",
        "गुण मिलान", "कुंडली मिलान", "36 गुण कुंडली",
      ],
    },
    hi: {
      title: "गुण मिलान — ३६ गुण कुंडली मिलान | Gun Milan Hindi",
      description:
        "विवाह के लिए ३६ गुण कुंडली मिलान. अष्टकूट गुण मिलान — वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाड़ी. Gun milan hindi, kundali matching online free.",
      keywords: [
        "गुण मिलान", "कुंडली मिलान", "३६ गुण कुंडली", "अष्टकूट",
        "मंगल दोष", "नाड़ी दोष", "भकूट दोष", "विवाह कुंडली",
        "gun milan hindi", "kundali matching hindi", "ashtakoot matching hindi",
        "mangal dosh hindi", "nadi dosh hindi", "36 gun milan hindi",
        "marriage kundli matching hindi",
      ],
    },
  });
}

export default function MatchingPage() {
  return <MatchingPageClient />;
}
