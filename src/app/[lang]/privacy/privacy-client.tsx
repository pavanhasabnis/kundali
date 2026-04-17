"use client";

import { useLang } from "@/lib/astrology/language-context";

export default function PrivacyPageClient() {
  const { t } = useLang();

  const sections = [
    {
      titleMr: "माहिती संकलन",
      titleEn: "Data Collection",
      contentMr:
        "आम्ही खालील माहिती संकलित करतो: नाव, जन्मतारीख, जन्मवेळ, जन्मस्थळ (कुंडली गणनेसाठी), ई-मेल पत्ता, फोन नंबर (सल्लामसलतीसाठी). ही माहिती केवळ तुम्ही स्वेच्छेने दिल्यावरच संकलित केली जाते. जन्म तपशील केवळ वैदिक ज्योतिष गणनांसाठी (कुंडली, गुण मिलान, दशा इ.) वापरले जातात.",
      contentEn:
        "We collect the following information: name, date of birth, time of birth, place of birth (for kundli calculation), email address, and phone number (for consultation). This information is collected only when you voluntarily provide it. Birth details are used solely for Vedic astrology calculations (kundli, guna matching, dasha, etc.).",
    },
    {
      titleMr: "माहितीचा वापर",
      titleEn: "Usage of Information",
      contentMr:
        "तुमची माहिती खालील उद्देशांसाठी वापरली जाते: कुंडली तयार करणे आणि ज्योतिष गणना करणे, राशीफल आणि पंचांग सेवा प्रदान करणे, सल्लामसलत शेड्यूल करणे आणि संवाद साधणे, आमच्या सेवांमध्ये सुधारणा करणे. आम्ही तुमची वैयक्तिक माहिती कोणत्याही तृतीय पक्षाला विकत नाही किंवा व्यावसायिक हेतूने शेअर करत नाही.",
      contentEn:
        "Your information is used for the following purposes: generating kundli and performing astrology calculations, providing rashifal and panchang services, scheduling and communicating about consultations, and improving our services. We do not sell your personal information to any third party or share it for commercial purposes.",
    },
    {
      titleMr: "कुकीज",
      titleEn: "Cookies",
      contentMr:
        "आमची वेबसाइट भाषा प्राधान्य (मराठी/इंग्रजी) लक्षात ठेवण्यासाठी आणि वेबसाइटचा अनुभव सुधारण्यासाठी कुकीज वापरते. तुम्ही तुमच्या ब्राउझर सेटिंग्जमधून कुकीज बंद करू शकता, परंतु यामुळे काही वैशिष्ट्ये योग्यरित्या कार्य करणार नाहीत.",
      contentEn:
        "Our website uses cookies to remember your language preference (Marathi/English) and to improve the website experience. You can disable cookies through your browser settings, but this may cause some features to not function properly.",
    },
    {
      titleMr: "तृतीय पक्ष सेवा",
      titleEn: "Third-Party Services",
      contentMr:
        "आम्ही ज्योतिष गणनांसाठी विश्वसनीय API सेवा वापरतो. या सेवांना केवळ गणनेसाठी आवश्यक असलेली माहिती (जन्मतारीख, वेळ, स्थळ) पुरवली जाते. तुमची वैयक्तिक ओळख (नाव, ई-मेल, फोन) या सेवांसोबत शेअर केली जात नाही.",
      contentEn:
        "We use trusted API services for astrology calculations. Only the information necessary for calculations (date of birth, time, place) is shared with these services. Your personal identity (name, email, phone) is not shared with these services.",
    },
    {
      titleMr: "सुरक्षा",
      titleEn: "Security",
      contentMr:
        "आम्ही तुमच्या माहितीचे संरक्षण करण्यासाठी योग्य तांत्रिक उपाययोजना करतो. HTTPS एन्क्रिप्शन वापरले जाते. तथापि, इंटरनेटवरील कोणतीही डेटा ट्रान्समिशन १००% सुरक्षित नाही याची कृपया नोंद घ्या.",
      contentEn:
        "We take appropriate technical measures to protect your information. HTTPS encryption is used. However, please note that no data transmission over the internet is 100% secure.",
    },
    {
      titleMr: "धोरणातील बदल",
      titleEn: "Changes to This Policy",
      contentMr:
        "आम्ही वेळोवेळी या गोपनीयता धोरणात बदल करू शकतो. कोणतेही महत्त्वपूर्ण बदल झाल्यास आम्ही वेबसाइटवर सूचना प्रकाशित करू. या पृष्ठावर नियमितपणे भेट देऊन अद्ययावत धोरण तपासण्याची शिफारस केली जाते.",
      contentEn:
        "We may update this privacy policy from time to time. If there are any significant changes, we will publish a notice on the website. We recommend visiting this page periodically to check the updated policy.",
    },
  ];

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
            {t("गोपनीयता धोरण", "Privacy Policy", "गोपनीयता नीति")}
          </h1>
          <p className="text-[#5c1a1a]/70 mt-2 text-sm">
            {t(
              "भाग्यवेध — तुमच्या माहितीची काळजी आम्हाला आहे",
              "Bhaagyavedh — We care about your data privacy",
              "भाग्यवेध — हम आपकी जानकारी की परवाह करते हैं"
            )}
          </p>
          <p className="text-[#5c1a1a]/50 mt-1 text-xs">
            {t("शेवटचे अद्ययावत: एप्रिल २०२६", "Last updated: April 2026", "अंतिम अद्यतन: अप्रैल २०२६")}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl border border-[#d4a843]/20 p-6 shadow-sm mb-6">
          <p className="text-sm text-[#5c1a1a]/80 leading-relaxed">
            {t(
              "भाग्यवेध (\"आम्ही\") तुमच्या गोपनीयतेचा आदर करतो. हे गोपनीयता धोरण आमच्या वेबसाइट आणि सेवा वापरताना तुमची माहिती कशी संकलित, वापरली आणि संरक्षित केली जाते हे स्पष्ट करते.",
              "Bhaagyavedh (\"we\") respects your privacy. This privacy policy explains how your information is collected, used, and protected when you use our website and services.",
              "भाग्यवेध (\"हम\") आपकी गोपनीयता का सम्मान करते हैं. यह गोपनीयता नीति बताती है कि हमारी वेबसाइट और सेवाओं का उपयोग करते समय आपकी जानकारी कैसे एकत्र, उपयोग और संरक्षित की जाती है."
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

        {/* Contact for Privacy */}
        <div className="mt-8 bg-[#FFF8E7] rounded-xl border border-[#d4a843]/30 p-6 text-center">
          <p className="text-sm text-[#3d0c0c] font-medium">
            {t(
              "गोपनीयतेबद्दल प्रश्न असल्यास आमच्याशी संपर्क साधा:",
              "For privacy-related questions, contact us:",
              "गोपनीयता से सम्बंधित प्रश्नों के लिए हमसे सम्पर्क करें:"
            )}
          </p>
          <p className="text-sm text-[#5c1a1a]/70 mt-1">info@bhaagyavedh.com</p>
        </div>
      </div>
    </div>
  );
}
