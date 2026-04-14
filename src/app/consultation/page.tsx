"use client";

import { useLang } from "@/lib/astrology/language-context";
import Link from "next/link";

const SERVICES = [
  {
    id: "kundli-reading",
    nameMr: "विस्तृत कुंडली वाचन",
    nameEn: "Detailed Kundli Reading",
    icon: "☉",
    duration: "60",
    popular: true,
    descMr: "अनुभवी वैदिक ज्योतिषांकडून तुमच्या संपूर्ण जन्मकुंडलीचे सविस्तर विश्लेषण. हे फक्त कम्प्युटर जनरेटेड रिपोर्ट नाही — ज्योतिषी स्वतः तुमची कुंडली वाचतात आणि तुमच्या प्रश्नांची उत्तरे देतात.",
    descEn: "Complete birth chart analysis by experienced Vedic astrologer. This is not just a computer-generated report — the astrologer personally reads your chart and answers your questions.",
    includesMr: [
      "संपूर्ण ग्रह बल विश्लेषण (९ ग्रह)",
      "योग विश्लेषण — राजयोग, गजकेसरी, बुधादित्य इ.",
      "दोष विश्लेषण — मंगळ दोष, कालसर्प, साडेसाती, पितृ दोष",
      "चालू महादशा + अंतर्दशा फल",
      "पुढील ५ वर्षांचे भविष्य",
      "वैयक्तिक उपाय — देवता, मंत्र, दान",
      "तुमच्या प्रश्नांची उत्तरे",
    ],
    includesEn: [
      "Complete planetary strength analysis (9 planets)",
      "Yoga analysis — Raj Yoga, Gajakesari, Budhaditya etc.",
      "Dosha analysis — Mangal, Kaal Sarp, Sade Sati, Pitra",
      "Current Mahadasha + Antardasha results",
      "Next 5 years prediction",
      "Personalized remedies — deity, mantra, donation",
      "Answers to your questions",
    ],
  },
  {
    id: "marriage-matching",
    nameMr: "विवाह जुळणी सल्ला",
    nameEn: "Marriage Matching Consultation",
    icon: "☯",
    duration: "45",
    popular: true,
    descMr: "फक्त गुण मिलान पुरेसे नाही — अनुभवी ज्योतिषी दोन्ही कुंडल्या सविस्तर पाहतात. दशा सुसंगतता, मंगळ दोष, नवमांश तुलना, भावी वैवाहिक जीवन आणि उपाय.",
    descEn: "Guna milan alone is not enough — experienced astrologer analyzes both charts in detail. Dasha compatibility, Mangal Dosha, Navamsha comparison, future married life & remedies.",
    includesMr: [
      "दोन्ही कुंडल्यांचे सविस्तर विश्लेषण",
      "अष्टकूट ३६ गुण मिलान + स्पष्टीकरण",
      "मंगळ दोष तपासणी (दोन्ही कुंडल्या)",
      "दशा सुसंगतता — विवाहानंतरचा काळ कसा राहील",
      "नवमांश (D9) कुंडली तुलना — विवाह सुख",
      "विवाह मुहूर्त सल्ला",
      "दोष असल्यास उपाय",
    ],
    includesEn: [
      "Detailed analysis of both charts",
      "Ashtakoot 36 Guna Milan + explanation",
      "Mangal Dosha check (both charts)",
      "Dasha compatibility — post-marriage period",
      "Navamsha (D9) comparison — marriage happiness",
      "Marriage muhurat advice",
      "Remedies if doshas present",
    ],
  },
  {
    id: "career-guidance",
    nameMr: "करिअर मार्गदर्शन",
    nameEn: "Career Guidance",
    icon: "✦",
    duration: "45",
    popular: false,
    descMr: "कुंडलीतील १०वा भाव, दशमांश (D10) कुंडली, दशा आणि गोचर पाहून तुमच्या करिअरबद्दल सविस्तर मार्गदर्शन. नोकरी किंवा व्यवसाय? कधी बदल करावा? कोणते क्षेत्र योग्य?",
    descEn: "Detailed career guidance based on 10th house, Dashamsha (D10) chart, dasha & transits. Job or business? When to switch? Which field is right?",
    includesMr: [
      "१०वा भाव + दशमांश कुंडली विश्लेषण",
      "कोणते क्षेत्र तुमच्यासाठी योग्य",
      "नोकरी vs व्यवसाय — कुंडलीनुसार सल्ला",
      "नोकरी बदलाचा योग्य काळ",
      "पदोन्नती / वाढीचा काळ",
      "व्यवसाय शुभारंभ मुहूर्त",
      "आर्थिक भविष्य — पुढील ३ वर्षे",
    ],
    includesEn: [
      "10th house + Dashamsha chart analysis",
      "Which field is right for you",
      "Job vs Business — advice per kundli",
      "Right time for job change",
      "Promotion / growth period",
      "Business start muhurat",
      "Financial forecast — next 3 years",
    ],
  },
  {
    id: "muhurat-selection",
    nameMr: "शुभ मुहूर्त निवड",
    nameEn: "Muhurat Selection",
    icon: "☽",
    duration: "30",
    popular: false,
    descMr: "कोणत्याही शुभ कार्यासाठी तुमच्या कुंडलीनुसार अचूक मुहूर्त निवड. फक्त पंचांगानुसार नाही — तुमच्या दशा, ग्रह स्थिती पाहून वैयक्तिक मुहूर्त.",
    descEn: "Precise muhurat selection per YOUR kundli for any auspicious event. Not just panchang-based — personalized muhurat considering your dasha & planetary positions.",
    includesMr: [
      "वास्तुशांती मुहूर्त",
      "गृहप्रवेश मुहूर्त",
      "विवाह मुहूर्त",
      "व्यापार शुभारंभ मुहूर्त",
      "वाहन / सोने खरेदी मुहूर्त",
      "नामकरण मुहूर्त",
      "तुमच्या कुंडलीनुसार वैयक्तिक निवड",
    ],
    includesEn: [
      "Vastushanti muhurat",
      "Gruhapravesh muhurat",
      "Marriage muhurat",
      "Business start muhurat",
      "Vehicle / gold purchase muhurat",
      "Naming ceremony muhurat",
      "Personalized selection per your kundli",
    ],
  },
  {
    id: "annual-prediction",
    nameMr: "वार्षिक भविष्य",
    nameEn: "Annual Prediction",
    icon: "⊛",
    duration: "60",
    popular: true,
    descMr: "पुढील संपूर्ण वर्षाचे सविस्तर भविष्य. दशा-अंतर्दशा, ग्रह गोचर, महिन्यानुसार करिअर, आर्थिक, आरोग्य आणि नातेसंबंध भविष्य.",
    descEn: "Detailed prediction for the entire upcoming year. Dasha-Antardasha, planetary transits, month-wise career, finance, health & relationship forecast.",
    includesMr: [
      "महिन्यानुसार सविस्तर भविष्य (१२ महिने)",
      "करिअर — पदोन्नती, बदल, नवीन संधी",
      "आर्थिक — उत्पन्न, खर्च, गुंतवणूक",
      "आरोग्य — सावधगिरी कधी घ्यावी",
      "नातेसंबंध — विवाह, कुटुंब, मित्र",
      "शुभ + अशुभ काळ ओळखणे",
      "वर्षभरासाठी उपाय",
    ],
    includesEn: [
      "Month-wise detailed prediction (12 months)",
      "Career — promotions, changes, new opportunities",
      "Finance — income, expenses, investments",
      "Health — when to be careful",
      "Relationships — marriage, family, friends",
      "Identifying good + bad periods",
      "Remedies for the entire year",
    ],
  },
  {
    id: "sade-sati",
    nameMr: "साडेसाती / दशा मार्गदर्शन",
    nameEn: "Sade Sati / Dasha Guidance",
    icon: "♄",
    duration: "45",
    popular: false,
    descMr: "शनि साडेसाती किंवा कठीण दशा चालू असल्यास — त्रास कमी करण्यासाठी विशेष उपाय, पूजा, मंत्र, दान आणि दैनिक आचरण.",
    descEn: "During Saturn's Sade Sati or difficult dasha — special remedies, pujas, mantras, donations & daily practices to reduce troubles.",
    includesMr: [
      "साडेसाती कोणत्या टप्प्यात आहे (उदय/शिखर/अस्त)",
      "चालू दशा-अंतर्दशा विश्लेषण",
      "कोणत्या क्षेत्रात त्रास होईल",
      "शनि शांती पूजा विधी",
      "दैनिक मंत्र जप (विशिष्ट मंत्र)",
      "दान — कोणाला, कधी, काय द्यावे",
      "दैनिक आचरण — काय करावे, काय टाळावे",
    ],
    includesEn: [
      "Which phase of Sade Sati (rising/peak/setting)",
      "Current Dasha-Antardasha analysis",
      "Which areas will face troubles",
      "Shani Shanti puja procedure",
      "Daily mantra chanting (specific mantras)",
      "Donations — to whom, when, what to give",
      "Daily practices — what to do, what to avoid",
    ],
  },
  {
    id: "vastu",
    nameMr: "वास्तु सल्ला",
    nameEn: "Vastu Consultation",
    icon: "⌂",
    duration: "60",
    popular: false,
    descMr: "घर किंवा कार्यालयाचे वास्तु विश्लेषण. नकाशा पाठवा किंवा प्रत्यक्ष भेट द्या. दिशा, रंग, बदल, उपाय — सर्व सविस्तर.",
    descEn: "Home or office vastu analysis. Send floor plan or schedule a visit. Directions, colors, changes, remedies — all in detail.",
    includesMr: [
      "घर / कार्यालयाचे संपूर्ण वास्तु विश्लेषण",
      "दिशानुसार खोल्यांची तपासणी",
      "स्वयंपाकघर, शयनगृह, पूजाघर — योग्य दिशा",
      "रंग सल्ला — कोणत्या भिंतीला कोणता रंग",
      "वास्तु दोष असल्यास उपाय (तोडफोड न करता)",
      "नवीन घर / कार्यालय खरेदीसाठी मार्गदर्शन",
      "गृहप्रवेश मुहूर्त",
    ],
    includesEn: [
      "Complete Vastu analysis of home / office",
      "Room-wise direction check",
      "Kitchen, bedroom, puja room — correct directions",
      "Color advice — which wall, which color",
      "Remedies for vastu defects (without demolition)",
      "Guidance for new home / office purchase",
      "Gruhapravesh muhurat",
    ],
  },
  {
    id: "business",
    nameMr: "व्यवसाय ज्योतिष",
    nameEn: "Business Astrology",
    icon: "₹",
    duration: "60",
    popular: false,
    descMr: "व्यवसायाचे नाव, भागीदारी, शुभारंभ मुहूर्त, आर्थिक भविष्य — कुंडलीनुसार व्यवसाय मार्गदर्शन.",
    descEn: "Business name, partnership, launch muhurat, financial forecast — business guidance per kundli.",
    includesMr: [
      "व्यवसायाचे नाव — कुंडलीनुसार अक्षर निवड",
      "भागीदारी जुळणी — दोन्ही कुंडल्या तपासणे",
      "व्यवसाय शुभारंभ मुहूर्त",
      "कोणत्या प्रकारचा व्यवसाय योग्य",
      "आर्थिक भविष्य — नफा/तोटा काळ",
      "विस्तार — कधी करावा, कधी थांबावे",
      "व्यवसायातील अडचणींसाठी उपाय",
    ],
    includesEn: [
      "Business name — letter selection per kundli",
      "Partnership matching — checking both charts",
      "Business launch muhurat",
      "Which type of business is right",
      "Financial forecast — profit/loss periods",
      "Expansion — when to grow, when to hold",
      "Remedies for business obstacles",
    ],
  },
  {
    id: "health",
    nameMr: "आरोग्य ज्योतिष",
    nameEn: "Health Astrology",
    icon: "✚",
    duration: "45",
    popular: false,
    descMr: "कुंडलीतील ६वा, ८वा भाव आणि ग्रहांच्या स्थितीनुसार आरोग्य समस्या, कमकुवत अवयव, प्रतिबंधात्मक उपाय.",
    descEn: "Health issues based on 6th, 8th house & planetary positions — weak organs, preventive remedies.",
    includesMr: [
      "आरोग्यावर परिणाम करणारे ग्रह ओळखणे",
      "कमकुवत अवयव / शरीर भाग",
      "कोणत्या काळात आरोग्य सावधगिरी घ्यावी",
      "दशा / गोचरानुसार आरोग्य भविष्य",
      "आयुर्वेदिक उपचार सल्ला (ज्योतिषानुसार)",
      "प्रतिबंधात्मक उपाय — मंत्र, दान",
      "आरोग्य सुधारणा पूजा विधी",
    ],
    includesEn: [
      "Identify planets affecting health",
      "Weak organs / body parts",
      "When to be cautious about health",
      "Health forecast per dasha / transits",
      "Ayurvedic treatment advice (per astrology)",
      "Preventive remedies — mantras, donations",
      "Health improvement puja procedure",
    ],
  },
];

export default function ConsultationPage() {
  const { t, lang } = useLang();

  return (
    <div className="bg-[#FAFAF8]">
      {/* Hero */}
      <div className="text-white text-center py-14 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0505, #3d0c0c, #5c1a1a)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23d4a843' stroke-width='0.4'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        <div className="relative z-10">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(212,168,67,0.5)" }}>{t("वेंकटेश ज्योतिष", "Venkatesh Astrology")}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t("ज्योतिष सल्ला सेवा", "Astrology Consultation Services")}</h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,248,231,0.6)" }}>
            {t(
              "अनुभवी वैदिक ज्योतिषांकडून वैयक्तिक सल्ला — फोन, व्हिडिओ कॉल किंवा प्रत्यक्ष भेटीद्वारे. प्रत्येक सल्ला तुमच्या कुंडलीवर आधारित — कोणतीही टेम्पलेट उत्तरे नाहीत.",
              "Personal consultation by experienced Vedic astrologers — via phone, video call or in-person. Every consultation is based on YOUR chart — no template answers."
            )}
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
              {t("WhatsApp वर संपर्क करा", "Contact on WhatsApp")}
            </a>
            <a href="tel:+91XXXXXXXXXX"
              className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
              {t("फोन करा", "Call Now")}
            </a>
          </div>
        </div>
      </div>

      {/* Services — 2x2 Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s, idx) => (
          <div key={s.id} id={s.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">

            {/* Service Header */}
            <div className="flex items-center gap-4 p-5" style={{ background: idx % 2 === 0 ? "linear-gradient(135deg, #3d0c0c, #5c1a1a)" : "#FFF8E7" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                style={idx % 2 === 0 ? { background: "rgba(212,168,67,0.15)", color: "#d4a843" } : { background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold" style={{ color: idx % 2 === 0 ? "#fff" : "#3d0c0c" }}>
                    {t(s.nameMr, s.nameEn)}
                  </h2>
                  {s.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#d4a843", color: "#1a0505" }}>
                      {t("लोकप्रिय", "Popular")}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: idx % 2 === 0 ? "rgba(212,168,67,0.6)" : "#8b6914" }}>
                  {s.duration} {t("मिनिटे", "minutes")} | {t("फोन / व्हिडिओ कॉल / भेट", "Phone / Video Call / Visit")}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-5">
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#4a3a2a" }}>
                {t(s.descMr, s.descEn)}
              </p>

              {/* What's Included */}
              <h3 className="text-sm font-bold mb-3" style={{ color: "#5c1a1a" }}>
                {t("यात काय समाविष्ट आहे:", "What's Included:")}
              </h3>
              <div className="space-y-2 mb-5">
                {(lang === "mr" ? s.includesMr : s.includesEn).map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#d4a843" }} />
                    <p className="text-sm" style={{ color: "#4a3a2a" }}>{item}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(212,168,67,0.12)" }}>
                <a href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(t(`नमस्कार, मला "${s.nameMr}" सेवेबद्दल माहिती हवी आहे.`, `Hello, I want to know about "${s.nameEn}" service.`))}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                  {t("WhatsApp वर बुक करा", "Book on WhatsApp")}
                </a>
                <a href="tel:+91XXXXXXXXXX" className="text-sm font-semibold" style={{ color: "#5c1a1a" }}>
                  {t("किंवा फोन करा →", "or Call →")}
                </a>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* How It Works */}
        <div className="mt-8 pt-8" style={{ borderTop: "2px solid rgba(212,168,67,0.15)" }}>
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#3d0c0c" }}>{t("कसे काम करते?", "How Does It Work?")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: "१", nE: "1", tMr: "सेवा निवडा", tEn: "Choose a Service", dMr: "वरील सेवांमधून तुम्हाला हवी ती निवडा आणि 'WhatsApp वर बुक करा' बटण दाबा.", dEn: "Select the service you need and click 'Book on WhatsApp'." },
              { n: "२", nE: "2", tMr: "जन्म माहिती पाठवा", tEn: "Send Birth Details", dMr: "तुमचे नाव, जन्म तारीख, वेळ आणि ठिकाण WhatsApp वर पाठवा.", dEn: "Send your name, birth date, time and place on WhatsApp." },
              { n: "३", nE: "3", tMr: "वेळ ठरवा", tEn: "Schedule Time", dMr: "सोयीच्या वेळी फोन / व्हिडिओ कॉल / भेट ठरवू.", dEn: "Schedule a call / visit at your convenient time." },
              { n: "४", nE: "4", tMr: "सल्ला मिळवा", tEn: "Get Consultation", dMr: "ज्योतिषी कुंडली समजावून सांगतील आणि उपाय सुचवतील.", dEn: "Astrologer will explain your chart and suggest remedies." },
            ].map((step, i) => (
              <div key={i} className="text-center p-4 bg-white rounded-xl border border-stone-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mx-auto mb-3"
                  style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>
                  {t(step.n, step.nE)}
                </div>
                <h4 className="text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t(step.tMr, step.tEn)}</h4>
                <p className="text-xs" style={{ color: "#6b5b3e" }}>{t(step.dMr, step.dEn)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 p-8 rounded-xl text-center" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
          <h3 className="text-xl font-bold text-white mb-2">{t("आजच सल्ला घ्या", "Get Consultation Today")}</h3>
          <p className="text-sm mb-6" style={{ color: "rgba(255,248,231,0.5)" }}>
            {t("प्रथम तुमची मोफत कुंडली बनवा — मग सल्ल्यासाठी संपर्क करा", "First create your free kundli — then contact for consultation")}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 rounded-full font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
              {t("WhatsApp वर संपर्क", "Contact on WhatsApp")}
            </a>
            <Link href="/kundli"
              className="px-8 py-3 rounded-full font-semibold text-sm"
              style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
              {t("मोफत कुंडली बनवा", "Create Free Kundli")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
