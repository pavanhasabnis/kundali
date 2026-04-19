"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { EnquiryPopup } from "@/components/enquiry-popup";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";

interface TravelPkg {
  id: string;
  titleMr: string;
  titleEn: string;
  category: string;
  imageUrl?: string;
  priceFrom?: number;
  duration?: string;
  featured: boolean;
}

const categories = [
  {
    value: "jyotirlinga",
    labelMr: "ज्योतिर्लिंग यात्रा", labelEn: "Jyotirlinga Yatra", labelHi: "ज्योतिर्लिंग यात्रा",
    descMr: "भारतातील १२ ज्योतिर्लिंगांचे पवित्र दर्शन — भगवान शिवाची सर्वात पवित्र स्थाने",
    descEn: "Sacred darshan of 12 Jyotirlingas across India — the holiest shrines of Lord Shiva",
    descHi: "भारत के १२ ज्योतिर्लिंगों का पवित्र दर्शन — भगवान शिव के सबसे पवित्र स्थान",
    icon: "🔱",
  },
  {
    value: "char_dham",
    labelMr: "चार धाम यात्रा", labelEn: "Char Dham Yatra", labelHi: "चार धाम यात्रा",
    descMr: "बद्रीनाथ, केदारनाथ, गंगोत्री, यमुनोत्री — हिमालयातील चार पवित्र धाम",
    descEn: "Badrinath, Kedarnath, Gangotri, Yamunotri — four sacred dhams in the Himalayas",
    descHi: "बद्रीनाथ, केदारनाथ, गंगोत्री, यमुनोत्री — हिमालय के चार पवित्र धाम",
    icon: "🏔️",
  },
  {
    value: "ashtavinayak",
    labelMr: "अष्टविनायक दर्शन", labelEn: "Ashtavinayak Tour", labelHi: "अष्टविनायक दर्शन",
    descMr: "महाराष्ट्रातील ८ पवित्र गणपती मंदिरे — मोरगाव ते रांजणगाव",
    descEn: "8 sacred Ganapati temples in Maharashtra — from Morgaon to Ranjangaon",
    descHi: "महाराष्ट्र के ८ पवित्र गणपति मंदिर — मोरगाँव से रांजणगाँव तक",
    icon: "🙏",
  },
  {
    value: "shakti_peeth",
    labelMr: "शक्तिपीठ दर्शन", labelEn: "Shakti Peeth Tour", labelHi: "शक्तिपीठ दर्शन",
    descMr: "देवी शक्तीची पवित्र स्थाने — कोल्हापूर, तुळजापूर, माहूर, सप्तश्रुंगी",
    descEn: "Sacred sites of Goddess Shakti — Kolhapur, Tuljapur, Mahur, Saptashrungi",
    descHi: "देवी शक्ति के पवित्र स्थान — कोल्हापुर, तुलजापुर, माहूर, सप्तश्रृंगी",
    icon: "🪷",
  },
  {
    value: "datta",
    labelMr: "दत्त यात्रा", labelEn: "Datta Yatra", labelHi: "दत्त यात्रा",
    descMr: "श्री दत्तात्रेयांची प्रमुख क्षेत्रे — गाणगापूर, नरसोबाची वाडी, औदुंबर",
    descEn: "Major Dattatreya shrines — Gangapur, Narsobachi Wadi, Audumbar",
    descHi: "श्री दत्तात्रेय के प्रमुख क्षेत्र — गाणगापुर, नरसोबाची वाडी, औदुंबर",
    icon: "🙏",
  },
  {
    value: "panch_kedar",
    labelMr: "पंच केदार यात्रा", labelEn: "Panch Kedar Yatra", labelHi: "पंच केदार यात्रा",
    descMr: "उत्तराखंडातील ५ प्राचीन शिव मंदिरे — हिमालयातील ट्रेकिंग अनुभव",
    descEn: "5 ancient Shiva temples in Uttarakhand — trekking experience in the Himalayas",
    descHi: "उत्तराखंड के ५ प्राचीन शिव मंदिर — हिमालय में ट्रेकिंग अनुभव",
    icon: "⛰️",
  },
  {
    value: "varanasi",
    labelMr: "काशी-प्रयागराज यात्रा", labelEn: "Varanasi-Prayagraj Yatra", labelHi: "काशी-प्रयागराज यात्रा",
    descMr: "काशी विश्वनाथ, गंगा आरती, प्रयागराज संगम आणि अयोध्या राम मंदिर",
    descEn: "Kashi Vishwanath, Ganga Aarti, Prayagraj Sangam and Ayodhya Ram Mandir",
    descHi: "काशी विश्वनाथ, गंगा आरती, प्रयागराज संगम और अयोध्या राम मंदिर",
    icon: "🪔",
  },
  {
    value: "rameshwaram",
    labelMr: "रामेश्वरम-मदुराई दर्शन", labelEn: "Rameshwaram-Madurai Tour", labelHi: "रामेश्वरम-मदुरै दर्शन",
    descMr: "रामेश्वरम ज्योतिर्लिंग, मदुराई मीनाक्षी मंदिर आणि कन्याकुमारी",
    descEn: "Rameshwaram Jyotirlinga, Madurai Meenakshi Temple and Kanyakumari",
    descHi: "रामेश्वरम ज्योतिर्लिंग, मदुरै मीनाक्षी मंदिर और कन्याकुमारी",
    icon: "🌊",
  },
  {
    value: "dwarka",
    labelMr: "द्वारका-सोमनाथ यात्रा", labelEn: "Dwarka-Somnath Yatra", labelHi: "द्वारका-सोमनाथ यात्रा",
    descMr: "भगवान श्रीकृष्णाची नगरी द्वारका आणि सोमनाथ ज्योतिर्लिंग दर्शन",
    descEn: "Lord Krishna's city Dwarka and Somnath Jyotirlinga darshan",
    descHi: "भगवान श्रीकृष्ण की नगरी द्वारका और सोमनाथ ज्योतिर्लिंग दर्शन",
    icon: "🏛️",
  },
  {
    value: "shirdi",
    labelMr: "शिर्डी-शनि शिंगणापूर दर्शन", labelEn: "Shirdi-Shani Shingnapur Tour", labelHi: "शिरडी-शनि शिंगणापुर दर्शन",
    descMr: "शिर्डी साईबाबा, शनि शिंगणापूर आणि नाशिक त्र्यंबकेश्वर दर्शन",
    descEn: "Shirdi Sai Baba, Shani Shingnapur and Nashik Trimbakeshwar darshan",
    descHi: "शिरडी साईबाबा, शनि शिंगणापुर और नासिक त्र्यंबकेश्वर दर्शन",
    icon: "🙏",
  },
  {
    value: "tirupati",
    labelMr: "तिरुपती दर्शन", labelEn: "Tirupati Darshan", labelHi: "तिरुपति दर्शन",
    descMr: "तिरुपती बालाजी (वेंकटेश्वर) दर्शन — VIP व्यवस्थेसह",
    descEn: "Tirupati Balaji (Venkateswara) darshan — with VIP arrangements",
    descHi: "तिरुपति बालाजी (वेंकटेश्वर) दर्शन — VIP व्यवस्था के साथ",
    icon: "⛩️",
  },
  {
    value: "pandharpur",
    labelMr: "पंढरपूर वारी", labelEn: "Pandharpur Wari", labelHi: "पंढरपुर वारी",
    descMr: "श्री विठ्ठल-रुक्मिणी दर्शन — आषाढी/कार्तिकी एकादशी विशेष",
    descEn: "Shri Vitthal-Rukmini darshan — Ashadhi/Kartiki Ekadashi specials",
    descHi: "श्री विट्ठल-रुक्मिणी दर्शन — आषाढी/कार्तिकी एकादशी विशेष",
    icon: "🚩",
  },
  {
    value: "local",
    labelMr: "स्थानिक दर्शन", labelEn: "Local Tours", labelHi: "स्थानीय दर्शन",
    descMr: "पुणे, मुंबई आणि आसपासच्या मंदिरांचे एकदिवसीय दौरे",
    descEn: "One-day tours of temples in Pune, Mumbai and nearby areas",
    descHi: "पुणे, मुंबई और आसपास के मंदिरों के एक दिवसीय दौरे",
    icon: "📍",
  },
  {
    value: "custom",
    labelMr: "सानुकूल तीर्थयात्रा", labelEn: "Custom Pilgrimage", labelHi: "कस्टम तीर्थयात्रा",
    descMr: "आपल्या आवडीनुसार खास यात्रा पॅकेज — कुटुंब, मित्रमंडळ किंवा ग्रुप",
    descEn: "Custom travel packages as per your preferences — family, friends or groups",
    descHi: "आपकी पसंद के अनुसार विशेष यात्रा पैकेज — परिवार, मित्रमंडल या ग्रुप",
    icon: "✨",
  },
];

export default function YatraPageClient() {
  const { t, lang } = useLang();
  const [packages, setPackages] = useState<TravelPkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    fetch("/api/travel")
      .then((r) => r.json())
      .then((d) => setPackages(d.packages || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = packages.filter((p) => p.featured);
  const countByCategory = (cat: string) => packages.filter((p) => p.category === cat).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={serviceSchema({ name: "Religious Yatra Packages — धार्मिक यात्रा", description: "Guided pilgrimage tours — Jyotirlinga Darshan, Char Dham Yatra, Ashtavinayak Tour, Shakti Peeth and more from Pune.", url: `https://bhaagyavedh.com/${lang}/yatra` })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `https://bhaagyavedh.com/${lang}` }, { name: "Yatra", url: `https://bhaagyavedh.com/${lang}/yatra` }])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "१२ ज्योतिर्लिंग यात्रा किती दिवसांची असते?", acceptedAnswer: { "@type": "Answer", text: "संपूर्ण १२ ज्योतिर्लिंग दर्शन यात्रा साधारण १२ ते १६ दिवसांची असते. भाग्यवेध विभाजित पॅकेज ८-१० दिवसांत उत्तर भारत व ५-७ दिवसांत दक्षिण भारत ज्योतिर्लिंग पूर्ण करते." } },
          { "@type": "Question", name: "How many days is the Jyotirlinga Yatra?", acceptedAnswer: { "@type": "Answer", text: "The complete 12 Jyotirlinga darshan yatra typically takes 12–16 days. Bhaagyavedh offers split packages — 8–10 days for North India Jyotirlingas and 5–7 days for South India." } },
          { "@type": "Question", name: "Char Dham यात्रा पॅकेज मध्ये काय समाविष्ट आहे?", acceptedAnswer: { "@type": "Answer", text: "चारधाम पॅकेज मध्ये यमुनोत्री, गंगोत्री, केदारनाथ व बद्रीनाथ दर्शन, निवास, भोजन, प्रवास, अनुभवी गाइड व हेलिकॉप्टर सुविधा (पर्यायी) समाविष्ट आहे." } },
          { "@type": "Question", name: "What is included in Char Dham Yatra package?", acceptedAnswer: { "@type": "Answer", text: "The Char Dham package covers darshan at Yamunotri, Gangotri, Kedarnath, and Badrinath with accommodation, meals, transport, guide, and optional helicopter service." } },
          { "@type": "Question", name: "अष्टविनायक यात्रा पुण्यातून किती दिवसांची आहे?", acceptedAnswer: { "@type": "Answer", text: "अष्टविनायक यात्रा पुण्यातून २ ते ३ दिवसांची असते. सर्व ८ गणपती मंदिरे (मोरगाव, थेऊर, सिद्धटेक, रांजणगाव, ओझर, लेण्याद्री, महड, पाली) दर्शन पूर्ण होते." } },
        ],
      }} />
      <PageHero
        title={t("धार्मिक यात्रा सेवा", "Religious Travel Services", "धार्मिक यात्रा सेवाएँ")}
        subtitle={t(
          "तीर्थक्षेत्रांना भेट द्या — ज्योतिर्लिंग, चारधाम, अष्टविनायक आणि अनेक पवित्र स्थळांची यात्रा आमच्यासोबत करा.",
          "Visit sacred destinations — Jyotirlinga, Char Dham, Ashtavinayak and more holy pilgrimages with us.",
          "तीर्थक्षेत्रों की यात्रा — ज्योतिर्लिंग, चार धाम, अष्टविनायक और कई पवित्र स्थल."
        )}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">

        {/* Featured Packages */}
        {!loading && featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#3d0c0c] mb-6">{t("विशेष पॅकेजेस", "Featured Packages", "विशेष पैकेज")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((pkg) => {
                const cat = categories.find((c) => c.value === pkg.category);
                return (
                  <Link key={pkg.id} href={`/yatra/${pkg.category.replace(/_/g, "-")}`}
                    className="bg-white rounded-xl border-2 border-[#d4a843]/30 overflow-hidden hover:shadow-lg transition group">
                    <div className="h-28 flex items-center justify-center relative px-4" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                      <h3 className="text-lg font-bold text-[#d4a843] text-center leading-tight">{t(pkg.titleMr, pkg.titleEn, pkg.titleMr)}</h3>
                      {pkg.priceFrom && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(212,168,67,0.9)", color: "#1a0505" }}>
                          ₹{pkg.priceFrom.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-[#d4a843] font-medium mb-0.5">{cat ? t(cat.labelMr, cat.labelEn, cat.labelHi) : pkg.category}</p>
                      <h3 className="font-bold text-[#3d0c0c] text-sm">{t(pkg.titleMr, pkg.titleEn, pkg.titleMr)}</h3>
                      <div className="flex items-center justify-between mt-2">
                        {pkg.duration && <span className="text-xs text-[#5c1a1a]/40">{pkg.duration}</span>}
                        <span className="text-xs text-[#d4a843] font-medium">{t("पहा", "View", "देखें")} &rarr;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Category Cards */}
        <h2 className="text-xl font-bold text-[#3d0c0c] mb-6">{t("यात्रा श्रेणी", "Yatra Categories", "यात्रा श्रेणियाँ")}</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#d4a843]/30 border-t-[#3d0c0c] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const count = countByCategory(cat.value);
              return (
                <Link key={cat.value} href={`/yatra/${cat.value.replace(/_/g, "-")}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#d4a843]/40 transition group">
                  <div className="h-28 flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                    <div className="text-center">
                      <h3 className="font-bold text-[#d4a843] text-base leading-tight">{t(cat.labelMr, cat.labelEn, cat.labelHi)}</h3>
                      <p className="text-white/40 text-[10px] mt-1">{count} {t("पॅकेजेस", "packages", "पैकेज")}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#5c1a1a]/60 leading-relaxed">{t(cat.descMr, cat.descEn, cat.descHi)}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-[#3d0c0c]">{count} {t("पॅकेजेस उपलब्ध", "packages available", "पैकेज उपलब्ध")}</span>
                      <span className="text-xs text-[#d4a843] font-medium">{t("पहा", "Explore", "देखें")} &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Custom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl border border-gray-200 p-8 sm:p-12">
          <h3 className="text-lg font-bold text-[#3d0c0c] mb-2">
            {t("सानुकूल यात्रा हवी आहे?", "Need a Custom Pilgrimage?", "कस्टम यात्रा चाहिए?")}
          </h3>
          <p className="text-sm text-[#5c1a1a]/50 max-w-md mx-auto mb-4">
            {t(
              "आपल्या आवडीनुसार खास यात्रा पॅकेज तयार करू — आमच्याशी संपर्क साधा",
              "We will create a special travel package as per your preferences — contact us",
              "आपकी पसंद के अनुसार विशेष यात्रा पैकेज बनाएँगे — हमसे सम्पर्क करें"
            )}
          </p>
          <button onClick={() => setPopupOpen(true)}
            className="inline-block px-8 py-3 rounded-lg bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition text-sm cursor-pointer">
            {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
          </button>
        </div>
      </div>
      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} subject={t("यात्रा चौकशी", "Yatra Enquiry", "यात्रा पूछताछ")} />
    </div>
  );
}
