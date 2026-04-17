import { pageMetaI18n, type Lang } from "@/lib/seo";
import TemplesPageClient from "./temples-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/temples",
    mr: {
      title: "भारतातील प्रसिद्ध मंदिरे — दर्शन मार्गदर्शक",
      description:
        "५०+ प्रसिद्ध हिंदू मंदिरांची मराठी माहिती — दर्शन वेळ, इतिहास, पोहोचण्याचा मार्ग, निवास. Famous mandir marathi, jyotirlinga, शक्तिपीठ, अष्टविनायक.",
      keywords: [
        "प्रसिद्ध मंदिरे", "हिंदू मंदिरे", "ज्योतिर्लिंग", "मंदिर दर्शन", "मंदिर माहिती मराठी",
        "famous mandir marathi", "hindu temples marathi", "jyotirlinga marathi",
        "temple guide marathi",
        "hindu temples", "famous mandir", "temple guide india", "jyotirlinga temples",
      ],
    },
    en: {
      title: "Famous Hindu Temples Guide — Darshan & Travel | Bhaagyavedh",
      description:
        "Guide to 50+ famous Hindu temples in India — darshan timings, history, how to reach. Jyotirlingas, Shakti Peeths, Divya Desams with Marathi & English info.",
      keywords: [
        "hindu temples", "famous mandir india", "temple guide", "jyotirlinga temples",
        "shakti peeth", "divya desam",
        "famous mandir marathi", "hindu temples marathi", "jyotirlinga marathi",
        "हिंदू मंदिरे", "प्रसिद्ध मंदिरे", "ज्योतिर्लिंग",
      ],
    },
  });
}

export default function TemplesPage() {
  return <TemplesPageClient />;
}
