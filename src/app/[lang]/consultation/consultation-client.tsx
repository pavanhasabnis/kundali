"use client";

import { useLang } from "@/lib/astrology/language-context";
import Link from "next/link";
import { useState } from "react";
import { EnquiryPopup } from "@/components/enquiry-popup";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";

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

export default function ConsultationPageClient() {
  const { t, lang } = useLang();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSubject, setPopupSubject] = useState("");

  const openEnquiry = (subject: string) => {
    setPopupSubject(subject);
    setPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={{
        ...serviceSchema({ name: "Vedic Astrology Consultation — ज्योतिष सल्ला", description: "Personal consultation with experienced Vedic astrologers for kundli reading, dosha analysis, career guidance, and marriage compatibility.", url: "https://bhaagyavedh.com/consultation" }),
        offers: { "@type": "Offer", price: "199", priceCurrency: "INR", availability: "https://schema.org/InStock" },
      }} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://bhaagyavedh.com" }, { name: "Consultation", url: "https://bhaagyavedh.com/consultation" }])} />
      <PageHero
        title={t("ज्योतिष सल्ला सेवा", "Astrology Consultation Services", "ज्योतिष परामर्श सेवाएँ")}
        subtitle={t(
          "अनुभवी वैदिक ज्योतिषांकडून वैयक्तिक सल्ला — फोन, व्हिडिओ कॉल किंवा प्रत्यक्ष भेटीद्वारे. प्रत्येक सल्ला तुमच्या कुंडलीवर आधारित.",
          "Personal consultation by experienced Vedic astrologers — phone, video, or in-person. Grounded in YOUR chart.",
          "अनुभवी वैदिक ज्योतिषियों से व्यक्तिगत परामर्श — आपकी कुंडली पर आधारित."
        )}
      >
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => openEnquiry(t("ज्योतिष सल्ला सेवा", "Astrology Consultation", "ज्योतिष परामर्श"))}
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
            {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
          </button>
        </div>
      </PageHero>

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
                    {t(s.nameMr, s.nameEn, s.nameMr)}
                  </h2>
                  {s.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#d4a843", color: "#1a0505" }}>
                      {t("लोकप्रिय", "Popular", "लोकप्रिय")}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: idx % 2 === 0 ? "rgba(212,168,67,0.6)" : "#8b6914" }}>
                  {s.duration} {t("मिनिटे", "minutes", "मिनट")} | {t("फोन / व्हिडिओ कॉल / भेट", "Phone / Video Call / Visit", "फ़ोन / वीडियो कॉल / भेंट")}
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
                {t("यात काय समाविष्ट आहे:", "What's Included:", "इसमें क्या शामिल है:")}
              </h3>
              <div className="space-y-2 mb-5">
                {(lang === "en" ? s.includesEn : s.includesMr).map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#d4a843" }} />
                    <p className="text-sm" style={{ color: "#4a3a2a" }}>{item}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(212,168,67,0.12)" }}>
                <button onClick={() => openEnquiry(t(s.nameMr, s.nameEn, s.nameMr))}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                  {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* How It Works */}
        <div className="mt-8 pt-8" style={{ borderTop: "2px solid rgba(212,168,67,0.15)" }}>
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#3d0c0c" }}>{t("कसे काम करते?", "How Does It Work?", "यह कैसे काम करता है?")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: "१", nE: "1", tMr: "सेवा निवडा", tEn: "Choose a Service", tHi: "सेवा चुनें", dMr: "वरील सेवांमधून तुम्हाला हवी ती निवडा आणि 'चौकशी करा' बटण दाबा.", dEn: "Select the service you need and click 'Enquire Now'.", dHi: "ऊपर की सेवाओं में से चुनें और 'पूछताछ करें' बटन दबाएँ." },
              { n: "२", nE: "2", tMr: "जन्म माहिती पाठवा", tEn: "Send Birth Details", tHi: "जन्म जानकारी भेजें", dMr: "तुमचे नाव, जन्म तारीख, वेळ आणि ठिकाण फॉर्ममध्ये भरा.", dEn: "Fill in your name, birth date, time and place in the form.", dHi: "अपना नाम, जन्म तिथि, समय और स्थान फ़ॉर्म में भरें." },
              { n: "३", nE: "3", tMr: "वेळ ठरवा", tEn: "Schedule Time", tHi: "समय तय करें", dMr: "सोयीच्या वेळी फोन / व्हिडिओ कॉल / भेट ठरवू.", dEn: "Schedule a call / visit at your convenient time.", dHi: "सुविधाजनक समय पर फ़ोन / वीडियो कॉल / भेंट तय करें." },
              { n: "४", nE: "4", tMr: "सल्ला मिळवा", tEn: "Get Consultation", tHi: "परामर्श पाएँ", dMr: "ज्योतिषी कुंडली समजावून सांगतील आणि उपाय सुचवतील.", dEn: "Astrologer will explain your chart and suggest remedies.", dHi: "ज्योतिषी कुंडली समझाकर बताएँगे और उपाय सुझाएँगे." },
            ].map((step, i) => (
              <div key={i} className="text-center p-4 bg-white rounded-xl border border-stone-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mx-auto mb-3"
                  style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>
                  {t(step.n, step.nE, step.n)}
                </div>
                <h4 className="text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t(step.tMr, step.tEn, step.tHi)}</h4>
                <p className="text-xs" style={{ color: "#6b5b3e" }}>{t(step.dMr, step.dEn, step.dHi)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 p-8 rounded-xl text-center" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
          <h3 className="text-xl font-bold text-white mb-2">{t("आजच सल्ला घ्या", "Get Consultation Today", "आज ही परामर्श लें")}</h3>
          <p className="text-sm mb-6" style={{ color: "rgba(255,248,231,0.5)" }}>
            {t("प्रथम तुमची मोफत कुंडली बनवा — मग सल्ल्यासाठी संपर्क करा", "First create your free kundli — then contact for consultation", "पहले अपनी मुफ्त कुंडली बनाएँ — फिर परामर्श के लिए सम्पर्क करें")}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => openEnquiry(t("ज्योतिष सल्ला सेवा", "Astrology Consultation", "ज्योतिष परामर्श"))}
              className="px-8 py-3 rounded-full font-semibold text-sm cursor-pointer"
              style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
              {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
            </button>
            <Link href="/kundli"
              className="px-8 py-3 rounded-full font-semibold text-sm"
              style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
              {t("मोफत कुंडली बनवा", "Create Free Kundli", "मुफ्त कुंडली बनाएँ")}
            </Link>
          </div>
        </div>
      </div>
      {/* FAQ Section for AEO/GEO */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <JsonLd data={faqSchema([
          { question: "How does an astrology consultation work?", answer: "You book a consultation slot, share your birth details (date, time, place), and connect with an experienced Vedic astrologer. The astrologer analyzes your birth chart, discusses your concerns (career, marriage, health, finances), identifies yogas and doshas, and provides personalized remedies and guidance." },
          { question: "What questions can I ask during a consultation?", answer: "You can ask about any life area — career prospects, marriage timing, business decisions, health concerns, financial planning, education, foreign travel, property matters, and relationship compatibility. The astrologer will analyze relevant houses and dashas in your chart to provide specific answers." },
          { question: "ज्योतिष सल्ला कसा चालतो?", answer: "तुम्ही सल्ला बुक करता, जन्म माहिती (तारीख, वेळ, ठिकाण) शेअर करता, आणि अनुभवी वैदिक ज्योतिषांशी संवाद करता. ज्योतिषी कुंडली विश्लेषण करतात, योग-दोष ओळखतात, आणि वैयक्तिक उपाय सांगतात." },
          { question: "Is an online astrology consultation as good as in-person?", answer: "Yes, the quality of astrological analysis depends on accurate birth details, not physical presence. Our astrologers provide the same thorough chart analysis online as they would in person. You can share your birth details digitally and discuss your questions via phone or video call." },
        ])} />
        <h2 className="text-xl font-bold mb-6" style={{ color: "#5c1a1a" }}>
          {t("ज्योतिष सल्ल्याबद्दल सामान्य प्रश्न", "Frequently Asked Questions", "ज्योतिष परामर्श के बारे में सामान्य प्रश्न")}
        </h2>
        <div className="space-y-4">
          {[
            { q: t("ज्योतिष सल्ला कसा चालतो?", "How does a consultation work?", "परामर्श कैसे काम करता है?"), a: t("सल्ला बुक करा, जन्म माहिती शेअर करा, अनुभवी ज्योतिषांशी बोला. ते कुंडली विश्लेषण करतात, योग-दोष ओळखतात, आणि वैयक्तिक उपाय सांगतात.", "Book a slot, share birth details, and connect with an expert astrologer who analyzes your chart, identifies yogas/doshas, and provides personalized remedies.", "परामर्श बुक करें, जन्म जानकारी साझा करें, अनुभवी ज्योतिषी से बात करें. वे कुंडली विश्लेषण करते हैं, योग-दोष पहचानते हैं, व्यक्तिगत उपाय सुझाते हैं.") },
            { q: t("कोणते प्रश्न विचारता येतात?", "What questions can I ask?", "कौन से प्रश्न पूछ सकते हैं?"), a: t("करिअर, लग्न, व्यवसाय, आरोग्य, आर्थिक, शिक्षण, परदेश प्रवास, संपत्ती — कोणत्याही विषयावर विचारा. ज्योतिषी संबंधित भावस्थान आणि दशांचे विश्लेषण करतात.", "Career, marriage, business, health, finances, education, foreign travel, property — ask about any area. The astrologer analyzes relevant houses and dashas.", "करियर, विवाह, व्यवसाय, स्वास्थ्य, वित्त, शिक्षा, विदेश यात्रा, संपत्ति — किसी भी विषय पर पूछें. ज्योतिषी संबंधित भाव और दशाओं का विश्लेषण करते हैं.") },
            { q: t("ऑनलाइन सल्ला चांगला आहे का?", "Is online consultation effective?", "ऑनलाइन परामर्श प्रभावी है?"), a: t("होय, ज्योतिष विश्लेषण अचूक जन्म माहितीवर अवलंबून आहे, प्रत्यक्ष उपस्थितीवर नव्हे. फोन किंवा व्हिडिओ कॉलवर तोच दर्जेदार सल्ला मिळतो.", "Yes, astrological analysis depends on accurate birth data, not physical presence. The same quality analysis is provided via phone or video call.", "हाँ, ज्योतिष विश्लेषण सटीक जन्म जानकारी पर निर्भर है, प्रत्यक्ष उपस्थिति पर नहीं. फ़ोन या वीडियो कॉल पर वही गुणवत्तापूर्ण परामर्श मिलता है.") },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-[#d4a843]/20 overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer font-semibold text-sm text-[#5c1a1a] hover:bg-[#d4a843]/5">{faq.q}</summary>
              <p className="px-5 pb-4 text-sm text-[#5c1a1a]/70 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} subject={popupSubject} />
    </div>
  );
}
