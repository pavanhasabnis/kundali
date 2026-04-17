"use client";

import { useLang } from "@/lib/astrology/language-context";
import Link from "next/link";

export default function AboutPageClient() {
  const { t, lang } = useLang();
  const showEn = lang === "en";

  return (
    <div className="bg-[#FAFAF8]">

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 40%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-[#d4a843]/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full border border-[#d4a843]/5" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-[#d4a843]/60 text-xs font-semibold tracking-[0.25em] uppercase mb-6">
            {t("वैदिक ज्योतिष आणि तीर्थयात्रा", "Vedic Astrology & Divine Journeys", "वैदिक ज्योतिष और तीर्थयात्रा")}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#d4a843] mb-5 leading-tight">
            {t("भाग्यवेध — आमच्याबद्दल", "About Bhaagyavedh", "भाग्यवेध — हमारे बारे में")}
          </h1>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            {t(
              "प्राचीन भारतीय ज्योतिष शास्त्राला आधुनिक तंत्रज्ञानाच्या माध्यमातून प्रत्येक मराठी व्यक्तीपर्यंत पोहोचवणारा विश्वासार्ह मंच. अचूक गणना, शास्त्रशुद्ध विश्लेषण आणि सांस्कृतिक जतन — हे आमचे ध्येय आहे.",
              "A trusted platform bringing ancient Indian Jyotish Shastra to every individual through modern technology. Accurate calculations, authentic analysis and cultural preservation — that is our purpose."
            )}
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#d4a843]/30" />
            <span className="text-[#d4a843]/30 text-[11px] tracking-wider">॥ श्री गणेशाय नमः ॥</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#d4a843]/30" />
          </div>
        </div>
      </section>

      {/* ═══ Our Story ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
              {t("आमची कहाणी", "Our Story", "हमारी कहानी")}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4a843] to-[#b8922e] mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#d4a843]/15 shadow-sm p-8 sm:p-10">
              <div className="space-y-5 text-[#5c1a1a]/75 text-sm sm:text-[15px] leading-[1.85]">
                <p>
                  {t(
                    "भारतीय संस्कृतीत ज्योतिष शास्त्राला हजारो वर्षांचा इतिहास आहे. वेद, उपनिषदे आणि सिद्धांत ग्रंथांमध्ये ग्रह-नक्षत्रांच्या गतीचे सूक्ष्म वर्णन आहे. महर्षी पराशर, वराहमिहिर, आर्यभट्ट यांनी या शास्त्राची पायाभरणी केली. परंतु कालांतराने हे ज्ञान काही मोजक्या विद्वानांपुरतेच मर्यादित राहिले. सामान्य माणसाला स्वतःची कुंडली समजून घेणे, दशा-अंतर्दशांचा अर्थ जाणून घेणे — हे अत्यंत कठीण बनले.",
                    "Astrology in Indian culture has a history spanning thousands of years. The Vedas, Upanishads and Siddhanta texts contain precise descriptions of planetary movements. Sages like Maharishi Parashara, Varahamihira and Aryabhata laid the foundation of this science. However, over time, this knowledge became limited to a select few scholars. For an ordinary person, understanding their own birth chart or comprehending the meaning of dashas and antardashas became extremely difficult."
                  )}
                </p>
                <p>
                  {t(
                    "भाग्यवेधची सुरुवात याच समस्येतून झाली. महाराष्ट्रातील गावांमध्ये, छोट्या शहरांमध्ये लोकांना विश्वासार्ह ज्योतिष सेवा उपलब्ध नाहीत. अनेक वेबसाइट्स इंग्रजीमध्ये आहेत, अनेक अशुद्ध गणना करतात, आणि बहुतांश ठिकाणी व्यावसायिक हेतू प्रामुख्याने दिसतो. आम्हाला वेगळे काहीतरी करायचे होते — मराठी भाषेत, शास्त्रशुद्ध गणनांसह, पूर्णपणे विनामूल्य आणि विश्वासार्ह अशी सेवा.",
                    "Bhaagyavedh was born from this very problem. In villages and small towns of Maharashtra, people lacked access to reliable astrology services. Many websites are in English, many perform inaccurate calculations, and most are driven primarily by commercial motives. We wanted to do something different — a service in Marathi, with scientifically accurate calculations, completely free and trustworthy."
                  )}
                </p>
                <p>
                  {t(
                    "आज भाग्यवेध हे केवळ एक ज्योतिष मंच नाही तर भारतीय संस्कृती, परंपरा आणि अध्यात्म यांचे डिजिटल जतन करणारे एक व्यासपीठ आहे. ९०हून अधिक भक्ती रचना — आरत्या, स्तोत्रे, चालीसा, मंत्र, व्रत कथा — या सर्वांचे संकलन, तीर्थयात्रा मार्गदर्शन, मंदिर माहिती आणि पंचांग सेवा यांच्या माध्यमातून आम्ही परंपरा जिवंत ठेवतो.",
                    "Today, Bhaagyavedh is not merely an astrology platform but a digital preservation of Indian culture, tradition and spirituality. With a collection of over 90 devotional compositions — aartis, stotras, chalisas, mantras, vrat kathas — along with pilgrimage guidance, temple information and panchang services, we keep traditions alive."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="relative" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { vMr: "९०+", vEn: "90+", lMr: "भक्ती संग्रह", lEn: "Devotional Items" },
              { vMr: "५००+", vEn: "500+", lMr: "गावे व शहरे", lEn: "Towns & Cities" },
              { vMr: "२७", vEn: "27", lMr: "नक्षत्र गणना", lEn: "Nakshatra Calculations" },
              { vMr: "१२०", vEn: "120", lMr: "वर्षे दशा विश्लेषण", lEn: "Years Dasha Analysis" },
            ].map((s, i) => (
              <div key={i} className="py-2">
                <div className="text-3xl sm:text-4xl font-bold text-[#d4a843] tracking-tight">{!showEn ? s.vMr : s.vEn}</div>
                <div className="text-white/35 text-xs sm:text-sm mt-1.5 font-medium">{!showEn ? s.lMr : s.lEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ What We Offer ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
              {t("आमच्या सेवा", "What We Offer", "हमारी सेवाएँ")}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4a843] to-[#b8922e] mx-auto mt-3 rounded-full" />
            <p className="text-[#5c1a1a]/50 text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
              {t(
                "वैदिक ज्योतिषापासून तीर्थयात्रा आणि भक्ती संग्रहापर्यंत — सर्व सेवा एकाच ठिकाणी, मराठी आणि इंग्रजी दोन्ही भाषांमध्ये उपलब्ध.",
                "From Vedic astrology to pilgrimage guidance and devotional collections — all services under one roof, available in both Marathi and English."
              )}
            </p>
          </div>

          {/* Row 1: Two featured cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {[
              {
                num: "01", titleMr: "जन्मकुंडली निर्मिती", titleEn: "Janam Kundli Generation",
                descMr: "अचूक खगोलीय गणना आणि लाहिरी अयनांश वापरून अचूक जन्मकुंडली. लग्न राशी, चंद्र राशी, ग्रह स्थिती, विंशोत्तरी दशा-अंतर्दशा, योग-दोष विश्लेषण, भाव फल आणि उपाय — सर्वकाही एका क्लिकमध्ये. PDF डाउनलोड सुविधा.",
                descEn: "Accurate birth charts using precise astronomical calculations and Lahiri Ayanamsa. Lagna rashi, Moon sign, planetary positions, Vimshottari Dasha-Antardasha, Yoga-Dosha analysis, Bhava predictions and remedies — all in a single click. PDF download enabled.",
                link: "/kundli",
              },
              {
                num: "02", titleMr: "अष्टकूट गुण मिलान", titleEn: "Ashtakoot Guna Matching",
                descMr: "वर-वधूंच्या कुंडलींचे अष्टकूट पद्धतीने मिलान. वर्ण, वश्य, तारा, योनी, ग्रहमैत्री, गण, भकूट आणि नाडी — आठ कूटांचे विस्तृत विश्लेषण. ३६ गुणांपैकी गुण मिलान, दोष आणि उपाय — सविस्तर अहवाल.",
                descEn: "Ashtakoot method matching for marriage compatibility. Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi — all eight kootas analyzed. Guna score out of 36, doshas and remedies — detailed report.",
                link: "/matching",
              },
            ].map((s) => (
              <Link key={s.num} href={s.link} className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:border-[#d4a843]/25 hover:shadow-lg transition-all overflow-hidden">
                <span className="absolute top-5 right-6 text-[48px] font-bold text-[#3d0c0c]/[0.03] leading-none select-none">{s.num}</span>
                <div className="text-[10px] font-bold text-[#d4a843] tracking-[0.2em] uppercase mb-3">{t("सेवा", "Service", "सेवा")} {s.num}</div>
                <h3 className="font-bold text-[#3d0c0c] text-base mb-3 group-hover:text-[#5c1a1a] transition">{!showEn ? s.titleMr : s.titleEn}</h3>
                <p className="text-[#5c1a1a]/55 text-[13px] leading-[1.85]">{!showEn ? s.descMr : s.descEn}</p>
                <div className="mt-4 pt-3 border-t border-gray-50 text-[#d4a843]/60 text-xs font-medium group-hover:text-[#d4a843] transition">{t("अधिक पहा", "Learn more", "और जानें")} →</div>
              </Link>
            ))}
          </div>

          {/* Row 2: Three compact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
            {[
              {
                num: "03", titleMr: "पंचांग आणि मुहूर्त", titleEn: "Panchang & Muhurat",
                descMr: "दैनंदिन तिथी, नक्षत्र, योग, करण, राहूकाल. गृहप्रवेश, विवाह, व्यापार यासाठी शुभ मुहूर्त. मराठी दिनदर्शिका.",
                descEn: "Daily tithi, nakshatra, yoga, karana, Rahu kaal. Auspicious muhurat for griha pravesh, marriage, business. Marathi calendar.",
                link: "/panchang",
              },
              {
                num: "04", titleMr: "राशीफल", titleEn: "Rashifal",
                descMr: "सर्व १२ राशींसाठी दैनिक, साप्ताहिक आणि मासिक भविष्यवाणी. करिअर, आरोग्य, आर्थिक, प्रेम — गोचर आधारित विश्लेषण.",
                descEn: "Daily, weekly and monthly predictions for all 12 zodiac signs. Career, health, finance, love — transit-based analysis.",
                link: "/rashifal",
              },
              {
                num: "05", titleMr: "ग्रह स्थिती", titleEn: "Planetary Positions",
                descMr: "नवग्रहांची सध्याची अचूक स्थिती — राशी, नक्षत्र, वक्री/मार्गी. गोचराचा तुमच्या राशीवरील प्रभाव.",
                descEn: "Current precise positions of all nine planets — rashi, nakshatra, retrograde/direct. Transit impact on your sign.",
                link: "/graha-sthiti",
              },
            ].map((s) => (
              <Link key={s.num} href={s.link} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#d4a843]/25 hover:shadow-lg transition-all relative overflow-hidden">
                <span className="absolute top-4 right-5 text-[40px] font-bold text-[#3d0c0c]/[0.03] leading-none select-none">{s.num}</span>
                <div className="text-[10px] font-bold text-[#d4a843] tracking-[0.2em] uppercase mb-2">{s.num}</div>
                <h3 className="font-bold text-[#3d0c0c] text-[14px] mb-2 group-hover:text-[#5c1a1a] transition">{!showEn ? s.titleMr : s.titleEn}</h3>
                <p className="text-[#5c1a1a]/50 text-[12px] leading-[1.8]">{!showEn ? s.descMr : s.descEn}</p>
              </Link>
            ))}
          </div>

          {/* Row 3: Wide highlight card */}
          <Link href="/sangrah" className="group block relative mb-5 rounded-2xl overflow-hidden border border-[#d4a843]/15 hover:border-[#d4a843]/30 hover:shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z' fill='%23d4a843' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
            <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <div className="text-[10px] font-bold text-[#d4a843]/60 tracking-[0.2em] uppercase mb-2">{t("सेवा", "Service", "सेवा")} 06</div>
                <h3 className="font-bold text-[#d4a843] text-lg mb-3">{t("भक्ती संग्रह", "Devotional Collection — Sangrah")}</h3>
                <p className="text-white/40 text-[13px] leading-[1.85]">
                  {t(
                    "९०हून अधिक आरत्या, स्तोत्रे, चालीसा, मंत्र, नामावली आणि व्रत कथांचा संपूर्ण संग्रह. प्रत्येक रचना मूळ संस्कृत/मराठी मजकूर, रोमन लिप्यंतरण आणि अर्थासह उपलब्ध. Print/PDF सुविधेसह — कागदावर छापून पूजेत वापरता येते.",
                    "Over 90 aartis, stotras, chalisas, mantras, namavalis and vrat kathas. Each with original Sanskrit/Marathi text, Roman transliteration and meaning. Print/PDF enabled — can be printed for use during worship."
                  )}
                </p>
              </div>
              <div className="shrink-0 text-[#d4a843]/40 group-hover:text-[#d4a843] text-2xl transition">→</div>
            </div>
          </Link>

          {/* Row 4: Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                num: "07", titleMr: "तीर्थयात्रा सेवा", titleEn: "Pilgrimage — Yatra",
                descMr: "ज्योतिर्लिंग, अष्टविनायक, चारधाम, शक्तिपीठ, पंचकेदार — यात्रा पॅकेजेस. प्रवास कालावधी, समाविष्ट सुविधा, किंमत आणि दिनक्रम. ऑनलाइन चौकशी सुविधा.",
                descEn: "Jyotirlinga, Ashtavinayak, Char Dham, Shakti Peeth, Panch Kedar — pilgrimage packages. Travel duration, inclusions, pricing and itinerary. Online enquiry facility.",
                link: "/yatra",
              },
              {
                num: "08", titleMr: "मंदिर माहिती", titleEn: "Temple Directory",
                descMr: "महाराष्ट्र आणि भारतभरातील प्रमुख मंदिरांची सविस्तर माहिती — इतिहास, स्थापत्य, दर्शन वेळा, कसे पोहोचायचे. प्रत्येक मंदिराची धार्मिक महत्ता आणि पौराणिक कथा.",
                descEn: "Detailed information about major temples across Maharashtra and India — history, architecture, darshan timings, how to reach. Religious significance and mythological stories of each temple.",
                link: "/temples",
              },
            ].map((s) => (
              <Link key={s.num} href={s.link} className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:border-[#d4a843]/25 hover:shadow-lg transition-all overflow-hidden">
                <span className="absolute top-5 right-6 text-[48px] font-bold text-[#3d0c0c]/[0.03] leading-none select-none">{s.num}</span>
                <div className="text-[10px] font-bold text-[#d4a843] tracking-[0.2em] uppercase mb-3">{t("सेवा", "Service", "सेवा")} {s.num}</div>
                <h3 className="font-bold text-[#3d0c0c] text-base mb-3 group-hover:text-[#5c1a1a] transition">{!showEn ? s.titleMr : s.titleEn}</h3>
                <p className="text-[#5c1a1a]/55 text-[13px] leading-[1.85]">{!showEn ? s.descMr : s.descEn}</p>
                <div className="mt-4 pt-3 border-t border-gray-50 text-[#d4a843]/60 text-xs font-medium group-hover:text-[#d4a843] transition">{t("अधिक पहा", "Learn more", "और जानें")} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Technology — Split Layout ═══ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left: Text — 3 cols */}
            <div className="lg:col-span-3">
              <p className="text-[10px] font-bold text-[#d4a843] tracking-[0.25em] uppercase mb-3">{t("गणना पद्धती", "Methodology")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c] mb-6">
                {t("आमची गणना पद्धती", "Our Calculation Methodology")}
              </h2>
              <div className="space-y-4 text-[#5c1a1a]/70 text-[14px] leading-[1.9]">
                <p>
                  {t(
                    "भाग्यवेधमधील प्रत्येक गणना ही जागतिक स्तरावर मान्यताप्राप्त खगोलशास्त्रीय डेटावर आधारित आहे. NASA च्या JPL (Jet Propulsion Laboratory) डेटावर आधारित ही पद्धत ग्रहांच्या स्थितीची अत्यंत सूक्ष्म गणना करते — इसवीसन पूर्व ५४०० ते इसवीसन ५४०० या कालखंडात.",
                    "Every calculation in Bhaagyavedh is based on globally recognized astronomical data. Built on NASA's JPL (Jet Propulsion Laboratory) data, this system calculates planetary positions with extreme precision — spanning from 5400 BCE to 5400 CE."
                  )}
                </p>
                <p>
                  {t(
                    "आम्ही लाहिरी अयनांश (Chitrapaksha Ayanamsa) वापरतो, जो भारतीय शासनाने अधिकृतपणे स्वीकारलेला आहे आणि भारतीय ज्योतिष शास्त्रात सर्वाधिक प्रचलित आहे. यामुळे आमच्या कुंडली गणना पारंपरिक भारतीय पंचांगाशी सुसंगत असतात.",
                    "We use Lahiri Ayanamsa (Chitrapaksha Ayanamsa), officially adopted by the Indian government and the most widely used in Indian Jyotish Shastra. This ensures our kundli calculations remain consistent with traditional Indian almanacs."
                  )}
                </p>
              </div>
            </div>
            {/* Right: Feature list — 2 cols */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#d4a843]/15 shadow-sm p-6 sm:p-7">
              <h3 className="font-bold text-[#3d0c0c] text-[13px] tracking-wide uppercase mb-5 pb-3 border-b border-[#d4a843]/10">
                {t("गणनांमध्ये समाविष्ट", "Included")}
              </h3>
              <div className="space-y-3.5">
                {[
                  { mr: "नवग्रह स्थिती — राशी, अंश, नक्षत्र, पद", en: "Navagraha — Rashi, degrees, Nakshatra, Pada" },
                  { mr: "विंशोत्तरी महादशा व अंतर्दशा", en: "Vimshottari Mahadasha & Antardasha" },
                  { mr: "योग — राजयोग, धनयोग, विपरीत राजयोग", en: "Yogas — Rajyoga, Dhanayoga, Vipareet" },
                  { mr: "दोष — मांगलिक, काल सर्प, पित्र दोष", en: "Doshas — Manglik, Kaal Sarpa, Pitra" },
                  { mr: "ग्रह बल (शडबल) आणि ग्रह दृष्टी", en: "Shadbala & planetary aspects" },
                  { mr: "भाव फल — १२ भावांचे विश्लेषण", en: "Bhava Phala — all 12 houses" },
                  { mr: "अष्टकूट गुण मिलान (३६ गुण)", en: "Ashtakoot matching (36 Gunas)" },
                  { mr: "षोडश वर्ग (D-1 ते D-60)", en: "Shodash Varga (D-1 to D-60)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[12px]">
                    <div className="w-5 h-px bg-[#d4a843]/40 shrink-0" />
                    <span className="text-[#5c1a1a]/60">{!showEn ? item.mr : item.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Principles — Numbered timeline style ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[#d4a843] tracking-[0.25em] uppercase mb-3">{t("आमची तत्त्वे", "Principles")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
              {t("आम्ही कशावर विश्वास ठेवतो", "What We Believe In")}
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                titleMr: "शास्त्रशुद्ध अचूकता",
                titleEn: "Scientific Accuracy",
                descMr: "कोणत्याही अंदाजावर नव्हे तर गणितीय सूत्रांवर आणि खगोलशास्त्रीय डेटावर आधारित गणना. अचूक खगोलीय गणना, लाहिरी अयनांश आणि पराशर पद्धतीचे काटेकोर पालन — आमच्या कुंडल्या हस्तलिखित पंचांगाशी तंतोतंत जुळतात.",
                descEn: "Calculations based on mathematical formulas and astronomical data, not estimates. Strict adherence to precise astronomical methods, Lahiri Ayanamsa and Parashara methodology — our kundlis match hand-computed almanacs exactly.",
              },
              {
                titleMr: "परंपरेचा आदर",
                titleEn: "Respect for Tradition",
                descMr: "तंत्रज्ञान हे माध्यम आहे, पण मूळ ज्ञान प्राचीन ऋषी-मुनींचे आहे. पराशर होरा शास्त्र, बृहज्जातक आणि फलदीपिका या प्रामाणिक ग्रंथांचे पालन. भक्ती संग्रहातील प्रत्येक रचना मूळ स्रोतांवरून — कोणतीही मनगढंत रचना नाही.",
                descEn: "Technology is the medium, but the core knowledge belongs to ancient sages. We follow Parashara Hora Shastra, Brihat Jataka and Phaladeepika. Every devotional composition sourced from originals — no fabricated content.",
              },
              {
                titleMr: "मातृभाषेत सेवा",
                titleEn: "Service in Mother Tongue",
                descMr: "ज्योतिष शास्त्र कठीण वाटण्याचे मुख्य कारण भाषेचा अडथळा. भाग्यवेध मराठी आणि इंग्रजी दोन्ही भाषांमध्ये उपलब्ध. ग्रह स्थिती, दशा, योग-दोष — सर्व तुमच्या भाषेत, सोप्या शब्दांत.",
                descEn: "The main reason astrology seems difficult is the language barrier. Bhaagyavedh is available in both Marathi and English. Planetary positions, dashas, yogas — all explained in your language, in simple words.",
              },
              {
                titleMr: "गोपनीयता आणि विश्वास",
                titleEn: "Privacy & Trust",
                descMr: "जन्म तपशील अत्यंत वैयक्तिक माहिती आहे. कोणत्याही तृतीय पक्षाला विकत नाही, शेअर करत नाही, जाहिरातींसाठी वापरत नाही. HTTPS एन्क्रिप्शन आणि सुरक्षित डेटा स्टोरेज — तुमची माहिती तुमच्यापुरतीच.",
                descEn: "Birth details are extremely personal. Never sold, shared or used for advertisements. HTTPS encryption and secure data storage — your information remains yours alone.",
              },
            ].map((v, i) => (
              <div key={i} className="flex gap-6 sm:gap-8 group">
                {/* Timeline */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-[#d4a843]/30 flex items-center justify-center text-[13px] font-bold text-[#d4a843] group-hover:bg-[#d4a843] group-hover:text-white group-hover:border-[#d4a843] transition-all">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-gradient-to-b from-[#d4a843]/20 to-[#d4a843]/5 min-h-[40px]" />}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <h3 className="font-bold text-[#3d0c0c] text-[15px] mb-2">{!showEn ? v.titleMr : v.titleEn}</h3>
                  <p className="text-[#5c1a1a]/55 text-[13px] leading-[1.85]">{!showEn ? v.descMr : v.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Mission & Vision — Full-width split ═══ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">
            {/* Mission */}
            <div className="p-8 sm:p-10 md:border-r border-b md:border-b-0 border-white/10">
              <p className="text-[10px] font-bold text-[#d4a843]/50 tracking-[0.25em] uppercase mb-3">{t("ध्येय", "Mission")}</p>
              <h3 className="text-xl font-bold text-[#d4a843] mb-5">{t("आमचे ध्येय", "Our Mission")}</h3>
              <div className="space-y-4 text-white/40 text-[13px] leading-[1.9]">
                <p>{t(
                  "प्रत्येक व्यक्तीला त्यांच्या मातृभाषेत अचूक, विश्वासार्ह आणि सुलभ वैदिक ज्योतिष सेवा उपलब्ध करून देणे.",
                  "To provide accurate, reliable and accessible Vedic astrology services to every person in their mother tongue."
                )}</p>
                <p>{t(
                  "ज्योतिष शास्त्राचे ज्ञान सामान्य माणसांपर्यंत पोहोचवणे, अंधश्रद्धा दूर करणे आणि शास्त्रशुद्ध माहितीच्या आधारे लोकांना जीवनातील योग्य निर्णय घेण्यास मदत करणे.",
                  "To bring the knowledge of Jyotish Shastra to common people, dispel superstition and help people make informed life decisions based on scientifically accurate information."
                )}</p>
                <p>{t(
                  "भारतीय भक्ती परंपरा, स्तोत्रे, आरत्या आणि पारंपरिक ज्ञान यांचे डिजिटल स्वरूपात जतन करणे — पुढच्या पिढ्यांसाठी.",
                  "To digitally preserve Indian devotional traditions, stotras, aartis and traditional knowledge — for future generations."
                )}</p>
              </div>
            </div>
            {/* Vision */}
            <div className="p-8 sm:p-10">
              <p className="text-[10px] font-bold text-[#d4a843]/50 tracking-[0.25em] uppercase mb-3">{t("दृष्टी", "Vision")}</p>
              <h3 className="text-xl font-bold text-[#d4a843] mb-5">{t("आमची दृष्टी", "Our Vision")}</h3>
              <div className="space-y-4 text-white/40 text-[13px] leading-[1.9]">
                <p>{t(
                  "भारतातील सर्वात विश्वासार्ह वैदिक ज्योतिष मंच बनणे — जिथे परंपरा आणि तंत्रज्ञान एकत्र येतात. जिथे एक शेतकरी आणि एक अभियंता दोघांनाही समान दर्जाची सेवा मिळते.",
                  "To become India's most trusted Vedic astrology platform — where tradition and technology converge. Where a farmer and an engineer both receive the same quality of service."
                )}</p>
                <p>{t(
                  "मराठीपासून सुरुवात करून, प्रत्येक भारतीय भाषेत ज्योतिष सेवा उपलब्ध करणे. हिंदी, गुजराती, कन्नड, तमिळ — प्रत्येक भाषेतील व्यक्तीला त्यांच्या स्वतःच्या भाषेत ज्योतिष समजावे.",
                  "Starting from Marathi, to make astrology services available in every Indian language. Hindi, Gujarati, Kannada, Tamil — every person should understand astrology in their own language."
                )}</p>
                <p>{t(
                  "संस्कृतीचे जतन आणि प्रसार करणे — यासाठी तंत्रज्ञानाचा वापर करणे, हाच आमचा दूरगामी दृष्टीकोन आहे.",
                  "Using technology to preserve and propagate culture — that is our long-term vision."
                )}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Why Bhaagyavedh ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
              {t("भाग्यवेध का निवडावे?", "Why Choose Bhaagyavedh?")}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4a843] to-[#b8922e] mx-auto mt-3 rounded-full" />
          </div>

          <div className="bg-white rounded-2xl border border-[#d4a843]/15 shadow-sm p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {[
                { mr: "पूर्णपणे मराठी — मराठी भाषेत पहिला सर्वसमावेशक ज्योतिष मंच", en: "Fully Marathi — the first comprehensive astrology platform in Marathi language" },
                { mr: "विनामूल्य कुंडली — मूलभूत कुंडली सेवा पूर्णपणे मोफत", en: "Free Kundli — basic kundli service completely free of charge" },
                { mr: "शास्त्रशुद्ध गणना — अचूक खगोलीय डेटा आणि लाहिरी अयनांश", en: "Authentic calculations — precise astronomical data and Lahiri Ayanamsa" },
                { mr: "सर्वसमावेशक — कुंडली, मिलान, पंचांग, राशीफल, संग्रह, यात्रा", en: "All-inclusive — Kundli, Matching, Panchang, Rashifal, Sangrah, Yatra" },
                { mr: "PDF/Print — कुंडली आणि संग्रह PDF स्वरूपात डाउनलोड करा", en: "PDF/Print — download kundli and sangrah in professional PDF format" },
                { mr: "५००+ ठिकाणे — महाराष्ट्रातील गावे, तालुके आणि शहरे", en: "500+ places — villages, talukas and cities across Maharashtra" },
                { mr: "कोणत्याही जाहिराती नाहीत — स्वच्छ, विश्वासार्ह अनुभव", en: "No advertisements — clean, trustworthy experience" },
                { mr: "डेटा गोपनीयता — तुमची माहिती कधीही शेअर होत नाही", en: "Data privacy — your information is never shared" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-[13px]">
                  <div className="w-5 h-5 rounded-full border-2 border-[#d4a843]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#d4a843]" />
                  </div>
                  <span className="text-[#5c1a1a]/65 leading-[1.7]">{!showEn ? item.mr : item.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a, #3d0c0c)" }}>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#d4a843] mb-3">
            {t("तुमचा ज्योतिष प्रवास आजच सुरू करा", "Begin Your Astrology Journey Today")}
          </h2>
          <p className="text-white/35 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            {t(
              "अचूक जन्मकुंडली, शास्त्रशुद्ध विश्लेषण आणि भक्ती संग्रह — सर्वकाही मोफत आणि तुमच्या भाषेत.",
              "Accurate birth charts, authentic analysis and devotional collections — everything free and in your language."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kundli"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] shadow-lg"
              style={{ background: "linear-gradient(135deg, #d4a843, #b8922e)", color: "#1a0505" }}>
              {t("कुंडली बनवा", "Generate Kundli")} <span>→</span>
            </Link>
            <Link href="/sangrah"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-medium border border-[#d4a843]/30 text-[#d4a843] hover:bg-[#d4a843]/10 transition-all">
              {t("संग्रह पहा", "Browse Sangrah")}
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-medium border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all">
              {t("संपर्क करा", "Contact Us")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
