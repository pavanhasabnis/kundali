"use client";

import { useLang } from "@/lib/astrology/language-context";

export default function DisclaimerPageClient() {
  const { t } = useLang();

  const sections = [
    {
      titleMr: "ज्योतिष भविष्यवाणी मार्गदर्शनासाठी आहे",
      titleEn: "Astrology Predictions Are for Guidance Only",
      contentMr:
        "या वेबसाइटवर दिलेली ज्योतिष माहिती, कुंडली, राशीफल, पंचांग आणि इतर सेवा केवळ मार्गदर्शनासाठी आहेत. ही माहिती वैद्यकीय, कायदेशीर, आर्थिक किंवा व्यावसायिक सल्ल्याचा पर्याय नाही. महत्त्वपूर्ण निर्णयांसाठी संबंधित क्षेत्रातील तज्ञांचा सल्ला घ्या.",
      contentEn:
        "The astrology information, kundli, rashifal, panchang, and other services provided on this website are for guidance purposes only. This information is not a substitute for medical, legal, financial, or professional advice. Please consult relevant professionals for important decisions.",
    },
    {
      titleMr: "वैदिक ज्योतिष पद्धती",
      titleEn: "Vedic Astrology Methods",
      contentMr:
        "आमच्या गणना पारंपरिक वैदिक ज्योतिष पद्धतींवर आधारित आहेत. ग्रह स्थिती, दशा गणना, योग आणि दोष विश्लेषण — हे सर्व प्राचीन भारतीय ज्योतिष शास्त्रानुसार केले जाते. तथापि, वेगवेगळ्या ज्योतिष पद्धतींनुसार परिणाम भिन्न असू शकतात.",
      contentEn:
        "Our calculations are based on traditional Vedic astrology methods. Planetary positions, dasha calculations, yoga and dosha analysis — all are performed according to ancient Indian astrology. However, results may vary depending on different astrological methods and interpretations.",
    },
    {
      titleMr: "गणनांची अचूकता",
      titleEn: "Accuracy of Calculations",
      contentMr:
        "आम्ही अचूक गणना करण्यासाठी सर्वतोपरी प्रयत्न करतो, परंतु कम्प्युटर-आधारित गणनांमध्ये थोडा फरक असू शकतो. जन्मवेळेतील अगदी लहान फरक देखील कुंडलीतील लग्न आणि भाव बदलू शकतो. शक्य तितकी अचूक जन्मवेळ दिल्यास सर्वोत्तम परिणाम मिळतात.",
      contentEn:
        "We make every effort to ensure accurate calculations, but computer-based calculations may have slight variations. Even a small difference in birth time can change the ascendant and house positions in the chart. Providing the most accurate birth time possible will yield the best results.",
    },
    {
      titleMr: "व्यावसायिक सल्ला घ्या",
      titleEn: "Consult Professionals",
      contentMr:
        "आरोग्य, विवाह, करिअर, आर्थिक गुंतवणूक, कायदेशीर बाबी किंवा इतर महत्त्वपूर्ण जीवन निर्णयांसाठी कृपया संबंधित क्षेत्रातील प्रमाणित व्यावसायिकांचा सल्ला घ्या. ज्योतिष हे एक मार्गदर्शन साधन आहे, अंतिम निर्णय नाही.",
      contentEn:
        "For health, marriage, career, financial investment, legal matters, or other important life decisions, please consult certified professionals in the relevant field. Astrology is a guidance tool, not the final decision maker.",
    },
    {
      titleMr: "सल्लामसलत सेवा",
      titleEn: "Consultation Services",
      contentMr:
        "आमच्या ज्योतिषांकडून दिलेला सल्ला त्यांच्या ज्ञानावर आणि अनुभवावर आधारित आहे. वेगवेगळ्या ज्योतिषांचे मत भिन्न असू शकते. सल्ल्यानुसार कृती करणे किंवा न करणे हा पूर्णपणे तुमचा निर्णय आहे.",
      contentEn:
        "Advice given by our astrologers is based on their knowledge and experience. Different astrologers may have different opinions. Whether to act on the advice or not is entirely your decision.",
    },
    {
      titleMr: "उपाय आणि शिफारसी",
      titleEn: "Remedies and Recommendations",
      contentMr:
        "सुचवलेले उपाय (मंत्र, दान, रत्न, पूजा इ.) पारंपरिक वैदिक पद्धतींवर आधारित आहेत. या उपायांचे परिणाम वैयक्तिक श्रद्धा आणि विश्वासावर अवलंबून आहेत. आम्ही कोणत्याही विशिष्ट परिणामाची हमी देत नाही.",
      contentEn:
        "Suggested remedies (mantras, donations, gemstones, pujas, etc.) are based on traditional Vedic practices. The results of these remedies depend on individual faith and belief. We do not guarantee any specific outcomes.",
    },
  ];

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
            {t("अस्वीकरण", "Disclaimer", "अस्वीकरण")}
          </h1>
          <p className="text-[#5c1a1a]/70 mt-2 text-sm">
            {t(
              "भाग्यवेध — कृपया आमच्या सेवा वापरण्यापूर्वी हे वाचा",
              "Bhaagyavedh — Please read this before using our services",
              "भाग्यवेध — कृपया हमारी सेवाओं का उपयोग करने से पहले इसे पढ़ें"
            )}
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-[#FFF8E7] rounded-xl border border-[#d4a843]/30 p-6 mb-6">
          <p className="text-sm text-[#3d0c0c] font-medium leading-relaxed">
            {t(
              "⚠ महत्त्वाची सूचना: या वेबसाइटवरील सर्व ज्योतिष सेवा आणि माहिती केवळ मार्गदर्शन आणि शैक्षणिक उद्देशांसाठी आहे. कोणत्याही महत्त्वपूर्ण निर्णयासाठी कृपया तज्ञांचा सल्ला घ्या.",
              "Important Notice: All astrology services and information on this website are for guidance and educational purposes only. Please consult experts for any important decisions.",
              "⚠ महत्वपूर्ण सूचना: इस वेबसाइट की सभी ज्योतिष सेवाएँ और जानकारी केवल मार्गदर्शन और शैक्षिक उद्देश्यों के लिए है. किसी भी महत्वपूर्ण निर्णय के लिए कृपया विशेषज्ञों से परामर्श लें."
            )}
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
                {t(section.titleMr, section.titleEn, section.titleMr)}
              </h2>
              <p className="text-sm text-[#5c1a1a]/80 leading-relaxed">
                {t(section.contentMr, section.contentEn, section.contentMr)}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#5c1a1a]/50">
            {t(
              "या वेबसाइटचा वापर करून तुम्ही वरील अस्वीकरण स्वीकारता.",
              "By using this website, you accept the above disclaimer.",
              "इस वेबसाइट का उपयोग करके आप उपरोक्त अस्वीकरण स्वीकार करते हैं."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
