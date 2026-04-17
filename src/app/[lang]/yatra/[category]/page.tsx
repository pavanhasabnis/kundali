import { pageMetaI18n, type Lang } from "@/lib/seo";
import YatraCategoryPageClient from "./yatra-category-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

const CATEGORY_META: Record<string, { mrName: string; enName: string; mrDesc: string; enDesc: string; mrKeys: string[]; enKeys: string[] }> = {
  jyotirlinga: {
    mrName: "१२ ज्योतिर्लिंग यात्रा",
    enName: "12 Jyotirlinga Yatra",
    mrDesc: "१२ ज्योतिर्लिंग दर्शन यात्रा पॅकेज — सोमनाथ, महाकालेश्वर, काशी विश्वनाथ, केदारनाथ, रामेश्वरम आणि अधिक. Jyotirlinga yatra marathi pune.",
    enDesc: "12 Jyotirlinga darshan yatra package from Pune — Somnath, Mahakaleshwar, Kashi Vishwanath, Kedarnath, Rameshwaram and more. Complete arrangements.",
    mrKeys: ["१२ ज्योतिर्लिंग यात्रा", "ज्योतिर्लिंग दर्शन", "jyotirlinga yatra marathi", "12 jyotirlinga darshan", "jyotirlinga package pune", "jyotirlinga tour"],
    enKeys: ["12 jyotirlinga yatra", "jyotirlinga tour", "jyotirlinga darshan package", "jyotirlinga yatra marathi", "ज्योतिर्लिंग यात्रा"],
  },
  "char-dham": {
    mrName: "चारधाम यात्रा",
    enName: "Char Dham Yatra",
    mrDesc: "चारधाम यात्रा — बद्रीनाथ, केदारनाथ, गंगोत्री, यमुनोत्री दर्शन पॅकेज. Char dham yatra marathi pune, उत्तराखंड तीर्थयात्रा.",
    enDesc: "Char Dham yatra package — Badrinath, Kedarnath, Gangotri, Yamunotri darshan. Uttarakhand pilgrimage tour from Pune with full arrangements.",
    mrKeys: ["चारधाम यात्रा", "बद्रीनाथ केदारनाथ यात्रा", "char dham marathi", "char dham yatra package", "uttarakhand yatra marathi"],
    enKeys: ["char dham yatra", "badrinath kedarnath tour", "uttarakhand pilgrimage", "char dham package", "char dham marathi"],
  },
  ashtavinayak: {
    mrName: "अष्टविनायक यात्रा",
    enName: "Ashtavinayak Yatra",
    mrDesc: "अष्टविनायक ८ गणपती दर्शन यात्रा पॅकेज. मोरगाव, थेऊर, सिद्धटेक, रांजणगाव, ओझर, लेण्याद्री, महड, पाली. Ashtavinayak yatra marathi pune.",
    enDesc: "Ashtavinayak 8 Ganpati darshan yatra package — Morgaon, Theur, Siddhatek, Ranjangaon, Ozar, Lenyadri, Mahad, Pali. Maharashtra pilgrimage.",
    mrKeys: ["अष्टविनायक यात्रा", "८ गणपती दर्शन", "अष्टविनायक पॅकेज", "ashtavinayak yatra marathi", "ashtavinayak package pune", "8 ganpati darshan", "morgaon ganpati", "siddhatek"],
    enKeys: ["ashtavinayak yatra", "8 ganesh temples", "ashtavinayak tour package", "morgaon ganpati", "siddhatek", "ashtavinayak yatra marathi", "अष्टविनायक यात्रा"],
  },
  "shakti-peeth": {
    mrName: "शक्तिपीठ यात्रा",
    enName: "Shakti Peeth Yatra",
    mrDesc: "५१ शक्तिपीठ दर्शन यात्रा पॅकेज. देवी मंदिरे, कामाख्या, तुळजापूर, माहुर, वैष्णोदेवी. Shakti peeth yatra marathi pune.",
    enDesc: "51 Shakti Peeth darshan yatra package — Devi temples, Kamakhya, Tuljapur, Mahur, Vaishno Devi. Pilgrimage tour in Marathi from Pune.",
    mrKeys: ["शक्तिपीठ यात्रा", "५१ शक्तिपीठ", "देवी दर्शन यात्रा", "shakti peeth yatra marathi", "shakti peeth tour", "51 shakti peeth"],
    enKeys: ["shakti peeth yatra", "51 shakti peeth", "devi temples tour", "kamakhya yatra", "shakti peeth yatra marathi", "शक्तिपीठ यात्रा"],
  },
  "panch-prayag": {
    mrName: "पंचप्रयाग यात्रा",
    enName: "Panch Prayag Yatra",
    mrDesc: "पंचप्रयाग यात्रा — विष्णुप्रयाग, नंदप्रयाग, कर्णप्रयाग, रुद्रप्रयाग, देवप्रयाग. गंगा संगम दर्शन पॅकेज. Panch prayag yatra marathi.",
    enDesc: "Panch Prayag yatra — Vishnuprayag, Nandaprayag, Karnaprayag, Rudraprayag, Devprayag. Ganga sangam darshan package. Uttarakhand pilgrimage.",
    mrKeys: ["पंचप्रयाग यात्रा", "गंगा संगम यात्रा", "panch prayag yatra marathi", "uttarakhand yatra", "ganga sangam darshan"],
    enKeys: ["panch prayag yatra", "ganga sangam", "uttarakhand pilgrimage", "panch prayag marathi", "पंचप्रयाग यात्रा"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang, category } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const cat = CATEGORY_META[category];
  if (!cat) {
    return pageMetaI18n({
      lang: l,
      path: `/yatra/${category}`,
      mr: { title: "यात्रा पॅकेज | भाग्यवेध", description: "तीर्थयात्रा पॅकेज", keywords: ["तीर्थयात्रा"] },
      en: { title: "Yatra Packages | Bhaagyavedh", description: "Pilgrimage packages", keywords: ["yatra"] },
    });
  }
  return pageMetaI18n({
    lang: l,
    path: `/yatra/${category}`,
    mr: {
      title: `${cat.mrName} — दर्शन पॅकेज पुणे`,
      description: cat.mrDesc,
      keywords: cat.mrKeys,
    },
    en: {
      title: `${cat.enName} — Pilgrimage Tour | Bhaagyavedh`,
      description: cat.enDesc,
      keywords: cat.enKeys,
    },
  });
}

export default async function YatraCategoryPage({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang, category } = await params;
  const cat = CATEGORY_META[category];
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/yatra/${category}`;
  return (
    <>
      {cat && (
        <>
          <JsonLd data={serviceSchema({
            name: `${cat.enName} — ${cat.mrName}`,
            description: cat.enDesc,
            url,
          })} />
          <JsonLd data={breadcrumbSchema([
            { name: "Home", url: base },
            { name: "Yatra", url: `${base}/yatra` },
            { name: cat.enName, url },
          ])} />
        </>
      )}
      <YatraCategoryPageClient />
    </>
  );
}
