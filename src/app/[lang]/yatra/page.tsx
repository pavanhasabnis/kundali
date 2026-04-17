import { pageMetaI18n, type Lang } from "@/lib/seo";
import YatraPageClient from "./yatra-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/yatra",
    mr: {
      title: "तीर्थयात्रा पॅकेज — ज्योतिर्लिंग, चारधाम, अष्टविनायक",
      description:
        "पुणे मधून तीर्थयात्रा पॅकेज — १२ ज्योतिर्लिंग, चारधाम, अष्टविनायक, शक्तिपीठ, पंचप्रयाग. Yatra package marathi — प्रवास, गाइड, भोजन सर्व समाविष्ट.",
      keywords: [
        "तीर्थयात्रा", "ज्योतिर्लिंग यात्रा", "चारधाम यात्रा", "अष्टविनायक यात्रा",
        "शक्तिपीठ यात्रा", "पंचप्रयाग यात्रा", "यात्रा पॅकेज पुणे",
        "yatra package marathi", "jyotirlinga yatra marathi", "char dham marathi",
        "ashtavinayak yatra marathi",
        "pilgrimage tour", "jyotirlinga darshan", "char dham yatra", "ashtavinayak yatra",
      ],
    },
    en: {
      title: "Pilgrimage Packages — Jyotirlinga, Char Dham | Bhaagyavedh",
      description:
        "Guided pilgrimage packages from Pune — 12 Jyotirlinga, Char Dham, Ashtavinayak, Shakti Peeth, Panch Prayag. Yatra marathi with full travel arrangements.",
      keywords: [
        "pilgrimage tour", "jyotirlinga yatra", "char dham yatra", "ashtavinayak yatra",
        "shakti peeth yatra", "pilgrimage pune",
        "yatra package marathi", "jyotirlinga yatra marathi", "char dham marathi",
        "तीर्थयात्रा", "ज्योतिर्लिंग यात्रा", "अष्टविनायक यात्रा",
      ],
    },
  });
}

export default function YatraPage() {
  return <YatraPageClient />;
}
