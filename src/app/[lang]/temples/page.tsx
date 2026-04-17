import { pageMetaI18n, type Lang } from "@/lib/seo";
import TemplesPageClient from "./temples-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/temples",
    mr: {
      title: "भारतातील प्रसिद्ध मंदिरे — दर्शन माहिती | Temples Guide Marathi | भाग्यवेध",
      description:
        "५०+ प्रसिद्ध हिंदू मंदिरांची माहिती — दर्शन वेळ, इतिहास, पोहोचण्याचा मार्ग. Famous mandir marathi, temples in india, hindu temple guide.",
      keywords: [
        "प्रसिद्ध मंदिरे", "हिंदू मंदिरे", "ज्योतिर्लिंग", "मंदिर दर्शन", "मंदिर माहिती मराठी",
        "famous mandir marathi", "hindu temples marathi", "jyotirlinga marathi",
        "temple guide marathi",
        "hindu temples", "famous mandir", "temple guide india", "jyotirlinga temples",
      ],
    },
    en: {
      title: "Famous Hindu Temples Guide — Darshan, History, Travel | Bhaagyavedh",
      description:
        "Comprehensive guide to 50+ famous Hindu temples in India. Darshan timings, history, how to reach. Marathi and English info for Jyotirlingas, Shakti Peeths, Divya Desams.",
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
