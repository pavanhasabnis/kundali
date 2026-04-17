import { pageMetaI18n, type Lang } from "@/lib/seo";
import PoojaServicesPageClient from "./pooja-services-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/pooja-services",
    mr: {
      title: "पूजा सेवा पुणे — ग्रह शांती, वास्तुशांती, नवग्रह",
      description:
        "पुण्यात पूजा, पाठ, होम सेवा — ग्रह शांती, नवग्रह पूजा, वास्तुशांती, सत्यनारायण, महामृत्युंजय जप. Pooja services marathi pune — अनुभवी गुरुजी.",
      keywords: [
        "पूजा सेवा पुणे", "ग्रह शांती पूजा", "नवग्रह पूजा", "वास्तुशांती पूजा",
        "सत्यनारायण पूजा", "महामृत्युंजय जप", "मंगळ शांती",
        "pooja services pune", "pooja marathi", "navgraha pooja marathi",
        "vastushanti marathi", "satyanarayan pooja",
        "pooja services", "pooja online booking", "vedic pooja", "brahmin pooja pune",
      ],
    },
    en: {
      title: "Pooja Services Pune — Graha Shanti, Vastushanti",
      description:
        "Book authentic Vedic pooja in Pune — graha shanti, navagraha pooja, vastushanti, satyanarayan, mahamrityunjay jap. Experienced brahmin gurujis.",
      keywords: [
        "pooja services pune", "graha shanti pooja", "navagraha pooja", "vastushanti",
        "satyanarayan pooja", "mahamrityunjay jap",
        "pooja marathi", "navgraha pooja marathi", "vastushanti marathi",
        "पूजा सेवा पुणे", "ग्रह शांती पूजा", "नवग्रह पूजा",
      ],
    },
  });
}

export default function PoojaServicesPage() {
  return <PoojaServicesPageClient />;
}
