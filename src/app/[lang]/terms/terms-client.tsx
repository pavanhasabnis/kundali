"use client";

import { useLang } from "@/lib/astrology/language-context";

export default function TermsPageClient() {
  const { t } = useLang();

  const sections = [
    {
      titleMr: "सेवांचा स्वीकार",
      titleEn: "Acceptance of Terms",
      contentMr:
        "भाग्यवेध वेबसाइट आणि सेवा वापरून तुम्ही या अटी व शर्ती स्वीकारता. या अटी स्वीकार नसल्यास कृपया आमच्या सेवा वापरू नका. आम्ही वेळोवेळी या अटींमध्ये बदल करू शकतो, आणि अद्ययावत अटी वेबसाइटवर प्रकाशित केल्या जातील.",
      contentEn:
        "By using the Bhaagyavedh website and services, you accept these terms and conditions. If you do not accept these terms, please do not use our services. We may modify these terms from time to time, and updated terms will be published on the website.",
    },
    {
      titleMr: "मोफत सेवा",
      titleEn: "Free Services",
      contentMr:
        "खालील सेवा सध्या मोफत उपलब्ध आहेत: कुंडली (जन्मकुंडली) तयार करणे, राशीफल (दैनिक, साप्ताहिक, मासिक), पंचांग (दैनिक तिथी, नक्षत्र, योग, करण), वैदिक कॅलेंडर, गुण मिलान, मुहूर्त माहिती, आणि ग्रह स्थिती. या सेवा \"जशा आहेत तशा\" (as-is) पुरवल्या जातात. आम्ही या मोफत सेवा कोणत्याही वेळी बदलण्याचा किंवा बंद करण्याचा अधिकार राखून ठेवतो.",
      contentEn:
        "The following services are currently available for free: Kundli (birth chart) generation, Rashifal (daily, weekly, monthly horoscope), Panchang (daily tithi, nakshatra, yoga, karana), Vedic Calendar, Guna Matching, Muhurat information, and Planetary Positions. These services are provided \"as-is.\" We reserve the right to modify or discontinue these free services at any time.",
    },
    {
      titleMr: "सशुल्क सल्लामसलत सेवा",
      titleEn: "Paid Consultation Services",
      contentMr:
        "ज्योतिष सल्लामसलत सेवा सशुल्क आहेत. शुल्क सल्लामसलत पृष्ठावर स्पष्टपणे दर्शवले आहे. सल्लामसलत शेड्यूल केल्यावर तुम्ही त्या शुल्कास सहमत होता. सल्लामसलत ऑनलाइन (व्हिडिओ कॉल) किंवा फोनवर होते.",
      contentEn:
        "Astrology consultation services are paid. Fees are clearly displayed on the consultation page. By scheduling a consultation, you agree to the stated fees. Consultations are conducted online (video call) or over the phone.",
    },
    {
      titleMr: "रद्दीकरण आणि परतावा",
      titleEn: "Cancellation and Refund",
      contentMr:
        "सल्लामसलतीच्या २४ तास आधी रद्द केल्यास पूर्ण परतावा दिला जाईल. २४ तासांच्या आत रद्द केल्यास ५०% रक्कम कापली जाईल. सल्लामसलत न घेता (no-show) अनुपस्थित राहिल्यास कोणताही परतावा दिला जाणार नाही. परतावा मूळ पेमेंट पद्धतीद्वारे ७-१० कार्यदिवसांत केला जाईल.",
      contentEn:
        "Full refund will be provided if cancelled 24 hours before the consultation. 50% will be deducted for cancellations within 24 hours. No refund will be provided for no-shows. Refunds will be processed to the original payment method within 7-10 business days.",
    },
    {
      titleMr: "वापरकर्त्याच्या जबाबदाऱ्या",
      titleEn: "User Responsibilities",
      contentMr:
        "तुम्ही अचूक जन्म माहिती देणे आवश्यक आहे — चुकीच्या माहितीमुळे अचूक गणना शक्य नाही. वेबसाइटचा गैरवापर, स्वयंचलित डेटा स्क्रॅपिंग, किंवा सेवांचे पुनर्वितरण करण्यास मनाई आहे. सल्लामसलतीमध्ये अनुचित वर्तन केल्यास सेवा नाकारण्याचा अधिकार आम्हाला आहे.",
      contentEn:
        "You must provide accurate birth information — accurate calculations are not possible with incorrect information. Misuse of the website, automated data scraping, or redistribution of services is prohibited. We reserve the right to refuse service for inappropriate behavior during consultation.",
    },
    {
      titleMr: "बौद्धिक संपदा",
      titleEn: "Intellectual Property",
      contentMr:
        "या वेबसाइटवरील सर्व सामग्री — मजकूर, डिझाइन, कोड, लोगो — भाग्यवेधची मालमत्ता आहे. लेखी परवानगीशिवाय कोणत्याही सामग्रीची कॉपी, पुनर्मुद्रण किंवा व्यावसायिक वापर करण्यास मनाई आहे.",
      contentEn:
        "All content on this website — text, design, code, logo — is the property of Bhaagyavedh. Copying, reprinting, or commercial use of any content without written permission is prohibited.",
    },
    {
      titleMr: "मर्यादित दायित्व",
      titleEn: "Limitation of Liability",
      contentMr:
        "भाग्यवेध ज्योतिष अंदाज किंवा सल्ल्याच्या आधारे घेतलेल्या कोणत्याही निर्णयाच्या परिणामांसाठी जबाबदार नाही. आमच्या सेवा मार्गदर्शनासाठी आहेत आणि कोणत्याही विशिष्ट परिणामाची हमी दिली जात नाही.",
      contentEn:
        "Bhaagyavedh is not responsible for the consequences of any decisions made based on astrological predictions or advice. Our services are for guidance only, and no specific outcomes are guaranteed.",
    },
    {
      titleMr: "लागू कायदा",
      titleEn: "Governing Law",
      contentMr:
        "या अटी व शर्ती भारतीय कायद्यांनुसार नियंत्रित केल्या जातात. कोणताही विवाद पुणे, महाराष्ट्र येथील न्यायालयांच्या अधिकार क्षेत्रात सोडवला जाईल.",
      contentEn:
        "These terms and conditions are governed by the laws of India. Any disputes shall be resolved under the jurisdiction of the courts in Pune, Maharashtra.",
    },
  ];

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
            {t("अटी व शर्ती", "Terms & Conditions")}
          </h1>
          <p className="text-[#5c1a1a]/70 mt-2 text-sm">
            {t(
              "भाग्यवेध — सेवा वापराच्या अटी",
              "Bhaagyavedh — Terms of Service"
            )}
          </p>
          <p className="text-[#5c1a1a]/50 mt-1 text-xs">
            {t("शेवटचे अद्ययावत: एप्रिल २०२६", "Last updated: April 2026")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#d4a843]/20 p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#3d0c0c] mb-3 flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}
                >
                  {i + 1}
                </span>
                {t(section.titleMr, section.titleEn)}
              </h2>
              <p className="text-sm text-[#5c1a1a]/80 leading-relaxed">
                {t(section.contentMr, section.contentEn)}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-[#FFF8E7] rounded-xl border border-[#d4a843]/30 p-6 text-center">
          <p className="text-sm text-[#3d0c0c] font-medium">
            {t(
              "या अटींबद्दल प्रश्न असल्यास आमच्याशी संपर्क साधा:",
              "For questions about these terms, contact us:"
            )}
          </p>
          <p className="text-sm text-[#5c1a1a]/70 mt-1">info@bhaagyavedh.com</p>
        </div>

        {/* Acceptance Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#5c1a1a]/50">
            {t(
              "या वेबसाइटचा वापर करून तुम्ही वरील सर्व अटी व शर्ती स्वीकारता.",
              "By using this website, you accept all the above terms and conditions."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
