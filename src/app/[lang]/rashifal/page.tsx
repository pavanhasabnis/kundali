import { pageMetaI18n, type Lang } from "@/lib/seo";
import RashifalPageClient from "./rashifal-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const today = new Date();
  const dateEn = today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const dateMr = today.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" });
  const dateHi = today.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" });

  return pageMetaI18n({
    lang: l,
    path: "/rashifal",
    mr: {
      title: `आजचे राशीभविष्य — 12 राशी | Aajcha Rashifal`,
      description: `आजचे राशीभविष्य ${dateMr} — मेष ते मीन सर्व 12 राशींचे दैनिक राशीफल. Aajcha rashi bhavishya marathi, ग्रह गोचरावर आधारित अचूक भविष्य.`,
      keywords: [
        "आजचे राशीभविष्य", "दैनिक राशीफल", "12 राशी भविष्य", "राशी भविष्य मराठी",
        "aajcha rashifal", "ajjcha rashi bhavishya", "aaj cha rashi bhavishya",
        "daily rashifal marathi", "rashi bhavishya today",
        "daily horoscope", "today horoscope", "12 zodiac signs horoscope",
      ],
    },
    en: {
      title: `Today's Horoscope — All 12 Zodiac Signs`,
      description: `Daily horoscope ${dateEn} for all 12 zodiac signs in Marathi & English. Aajcha rashi bhavishya based on real Vedic planetary transits — career, love, health.`,
      keywords: [
        "daily horoscope", "today horoscope", "12 zodiac horoscope", "daily rashifal",
        "vedic horoscope", "horoscope today",
        "aajcha rashifal", "ajjcha rashi bhavishya", "rashi bhavishya marathi",
        "daily rashifal marathi",
        "आजचे राशीभविष्य", "दैनिक राशीफल",
      ],
    },
    hi: {
      title: `आज का राशिफल — १२ राशियाँ | Aaj Ka Rashifal`,
      description: `आज का राशिफल ${dateHi} — मेष से मीन तक सभी १२ राशियों का दैनिक राशिफल. Aaj ka rashifal hindi, ग्रह गोचर पर आधारित सटीक भविष्य.`,
      keywords: [
        "आज का राशिफल", "दैनिक राशिफल", "१२ राशि भविष्य", "राशि भविष्य हिंदी",
        "aaj ka rashifal", "aaj ka rashifal hindi", "daily rashifal hindi",
        "rashifal today hindi", "horoscope hindi", "daily horoscope hindi",
        "12 rashi horoscope hindi",
      ],
    },
  });
}

export const dynamic = "force-dynamic";

export default async function RashifalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <RashifalPageClient />
      <RashifalExplainer lang={lang} />
    </>
  );
}

const RASHI_LIST = [
  { mr: "मेष", hi: "मेष", en: "Aries", slug: "mesh", traitsMr: "नेतृत्व, धैर्य, ऊर्जा", traitsEn: "leadership, courage, energy" },
  { mr: "वृषभ", hi: "वृषभ", en: "Taurus", slug: "vrishabh", traitsMr: "स्थैर्य, कला, संयम", traitsEn: "stability, artistry, patience" },
  { mr: "मिथुन", hi: "मिथुन", en: "Gemini", slug: "mithun", traitsMr: "बुद्धिमत्ता, संवाद", traitsEn: "intelligence, communication" },
  { mr: "कर्क", hi: "कर्क", en: "Cancer", slug: "kark", traitsMr: "भावना, कुटुंबप्रेम", traitsEn: "emotion, family-focus" },
  { mr: "सिंह", hi: "सिंह", en: "Leo", slug: "singh", traitsMr: "अभिमान, कर्तृत्व", traitsEn: "pride, leadership" },
  { mr: "कन्या", hi: "कन्या", en: "Virgo", slug: "kanya", traitsMr: "नीटनेटकेपणा, विश्लेषण", traitsEn: "precision, analysis" },
  { mr: "तुला", hi: "तुला", en: "Libra", slug: "tula", traitsMr: "सौंदर्य, संतुलन", traitsEn: "balance, aesthetics" },
  { mr: "वृश्चिक", hi: "वृश्चिक", en: "Scorpio", slug: "vrishchik", traitsMr: "तीव्रता, रहस्य", traitsEn: "intensity, mystery" },
  { mr: "धनु", hi: "धनु", en: "Sagittarius", slug: "dhanu", traitsMr: "साहस, तत्त्वज्ञान", traitsEn: "adventure, philosophy" },
  { mr: "मकर", hi: "मकर", en: "Capricorn", slug: "makar", traitsMr: "शिस्त, महत्त्वाकांक्षा", traitsEn: "discipline, ambition" },
  { mr: "कुंभ", hi: "कुम्भ", en: "Aquarius", slug: "kumbh", traitsMr: "मौलिकता, मानवतावाद", traitsEn: "originality, humanism" },
  { mr: "मीन", hi: "मीन", en: "Pisces", slug: "meen", traitsMr: "कल्पनाशक्ती, आध्यात्म", traitsEn: "imagination, spirituality" },
] as const;

function RashifalExplainer({ lang }: { lang: string }) {
  const mr = lang === "mr";
  const hi = lang === "hi";
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="prose prose-stone max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#3d0c0c] mb-3">
          {mr ? "राशीभविष्य कसे वाचावे" : hi ? "राशिफल कैसे पढ़ें" : "How to Read Your Rashifal"}
        </h2>
        <p>
          {mr
            ? "आपली राशी ही जन्मकुंडलीतील चंद्र जेथे होता त्या राशीने ठरते — ही ‘जन्मराशी’ (चंद्र राशी). सूर्य राशी (Sun sign) पाश्चात्त्य पद्धतीत वापरली जाते; भारतीय ज्योतिषशास्त्रात चंद्र राशी अधिक महत्त्वाची मानली जाते. आजचे राशीभविष्य ग्रह गोचराच्या आधारे — सूर्य, चंद्र, मंगळ, बुध, गुरू, शुक्र, शनि, राहू, केतू यांच्या सध्याच्या स्थानांनुसार — मोजले जाते."
            : hi
            ? "आपकी राशि जन्म के समय चंद्रमा जहाँ था उस राशि से तय होती है — यह ‘जन्म राशि’ (चंद्र राशि) है. भारतीय ज्योतिष में चंद्र राशि को प्रमुख माना जाता है. आज का राशिफल सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु की वर्तमान स्थिति से निकलता है."
            : "In Vedic astrology your rashi is determined by the sign the Moon was in at birth — the Moon sign (Janma Rashi), not the Sun sign used in Western astrology. Today's rashifal reads the current planetary transit — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu — against your Moon sign to forecast the day."}
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#3d0c0c] mt-10 mb-5 text-center">
        {mr ? "१२ राशी — सखोल माहिती" : hi ? "१२ राशियाँ — विस्तृत जानकारी" : "The 12 Rashis — Deep Dive"}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {RASHI_LIST.map((r) => (
          <a
            key={r.slug}
            href={`/${lang}/rashifal/${r.slug}`}
            className="block p-4 rounded-xl border border-[#d4a843]/20 bg-white hover:border-[#d4a843]/60 hover:shadow transition"
          >
            <h2 className="text-lg font-bold text-[#3d0c0c]">
              {mr ? r.mr : hi ? r.hi : r.en}{" "}
              <span className="text-sm font-normal text-gray-500">
                {mr || hi ? r.en : r.mr}
              </span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mr || hi ? r.traitsMr : r.traitsEn}
            </p>
          </a>
        ))}
      </div>

      <div className="prose prose-stone max-w-3xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-[#3d0c0c] mb-2">
          {mr ? "दैनिक विरुद्ध साप्ताहिक व मासिक" : hi ? "दैनिक बनाम साप्ताहिक व मासिक" : "Daily vs Weekly & Monthly"}
        </h2>
        <p>
          {mr
            ? "दैनिक राशीभविष्य चंद्राच्या वेगवान गोचरावर (अडीच दिवसांत राशी बदल) अवलंबून असते, त्यामुळे ते रोज बदलते. साप्ताहिक व मासिक भविष्य सूर्य, बुध, मंगळाच्या गोचरांवर आणि गुरू-शनीसारख्या मंद ग्रहांच्या एकूण प्रभावावर आधारित असते."
            : hi
            ? "दैनिक राशिफल चंद्रमा की तेज़ गति (२.५ दिन में राशि बदल) पर निर्भर है. साप्ताहिक व मासिक सूर्य, बुध, मंगल व धीमे ग्रहों (गुरु, शनि) के प्रभाव पर निर्भर."
            : "Daily rashifal reflects the Moon's fast transit (2.5 days per sign), so it shifts every day. Weekly and monthly horoscopes integrate Sun, Mercury, Mars transits along with slow-moving Jupiter and Saturn influences for longer-term trends."}
        </p>
        <p className="text-sm text-gray-500 mt-6">
          {mr
            ? "भाग्यवेधचे राशीभविष्य NASA JPL खगोलीय डेटा आणि लाहिरी अयनांश यावर आधारित — दररोज नवीन, ग्रह गोचरावर आधारित."
            : hi
            ? "भाग्यवेध का राशिफल NASA JPL डेटा व लाहिरी अयनांश पर आधारित — प्रतिदिन अपडेटेड."
            : "Bhaagyavedh rashifal is computed daily using NASA JPL ephemeris data and Lahiri Ayanamsa — grounded in real astronomical transits."}
        </p>
      </div>
    </section>
  );
}
