import { pageMetaI18n, type Lang } from "@/lib/seo";
import CalendarPageClient from "./calendar-client";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/calendar",
    mr: {
      title: `हिंदू दिनदर्शिका ${CURRENT_YEAR} — मराठी कॅलेंडर | Marathi Calendar`,
      description: `मराठी हिंदू दिनदर्शिका ${CURRENT_YEAR} — सर्व सण, व्रत, तिथी, नक्षत्र, शुभ मुहूर्त. Marathi calendar ${CURRENT_YEAR} festivals, vrat, muhurat. मराठी महिने आणि पंचांग.`,
      keywords: [
        "मराठी कॅलेंडर", "हिंदू दिनदर्शिका", "मराठी पंचांग", "मराठी महिने",
        `सण व्रत ${CURRENT_YEAR}`,
        `marathi calendar ${CURRENT_YEAR}`, "marathi panchang", "hindu calendar marathi",
        `marathi festivals ${CURRENT_YEAR}`,
        `hindu calendar ${CURRENT_YEAR}`, "vedic calendar", `festivals ${CURRENT_YEAR}`,
      ],
    },
    en: {
      title: `Hindu Marathi Calendar ${CURRENT_YEAR} — Festivals, Tithi & Muhurat`,
      description: `Complete Hindu Vedic Marathi calendar ${CURRENT_YEAR} with daily tithi, nakshatra, festivals, vrat, and shubh muhurat. Marathi calendar ${CURRENT_YEAR} in English and Marathi.`,
      keywords: [
        `hindu calendar ${CURRENT_YEAR}`, `marathi calendar ${CURRENT_YEAR}`,
        "vedic calendar", `festivals ${CURRENT_YEAR}`, "hindu festivals calendar",
        "marathi calendar", "hindu calendar marathi", "marathi panchang",
        "मराठी कॅलेंडर", "हिंदू दिनदर्शिका",
      ],
    },
  });
}

const today = new Date().toISOString().split("T")[0];

export default async function CalendarPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/calendar`;
  const calendarArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Hindu Vedic Calendar ${CURRENT_YEAR} — हिंदू कॅलेंडर`,
    description: `Hindu Vedic calendar ${CURRENT_YEAR} — daily tithis, nakshatras, festivals, shubh muhurat, and panchang based on Lahiri Ayanamsa.`,
    url,
    image: "https://bhaagyavedh.com/opengraph-image.png",
    datePublished: `${CURRENT_YEAR}-01-01`,
    dateModified: today,
    author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
    publisher: {
      "@type": "Organization",
      name: "Bhaagyavedh",
      url: "https://bhaagyavedh.com",
      logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN",
  };
  return (
    <>
      <JsonLd data={calendarArticleSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: base },
        { name: "Calendar", url },
      ])} />
      <CalendarPageClient />
      <CalendarExplainer lang={lang} year={CURRENT_YEAR} />
    </>
  );
}

function CalendarExplainer({ lang, year }: { lang: string; year: number }) {
  const mr = lang === "mr";
  const hi = lang === "hi";
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 prose prose-stone">
      <h2 className="text-2xl font-bold text-[#3d0c0c] mb-3">
        {mr ? `हिंदू दिनदर्शिका ${year} म्हणजे काय?` : hi ? `हिंदू कैलेंडर ${year} क्या है?` : `The Hindu Vedic Calendar for ${year}`}
      </h2>
      <p>
        {mr
          ? `हिंदू वैदिक दिनदर्शिका ही चंद्र-सौर (luni-solar) पद्धतीवर आधारित आहे. शक संवत, विक्रम संवत, आणि चांद्र महिन्यांची (चैत्र, वैशाख, ज्येष्ठ, आषाढ, श्रावण, भाद्रपद, आश्विन, कार्तिक, मार्गशीर्ष, पौष, माघ, फाल्गुन) रचना तिथी, नक्षत्र व सणांच्या आधारे आखली जाते. भाग्यवेधचे ${year} चे कॅलेंडर दररोज तिथी, नक्षत्र, योग, करण, शुभ मुहूर्त आणि सण-व्रत दर्शवते.`
          : hi
          ? `हिंदू वैदिक कैलेंडर चंद्र-सौर (luni-solar) पद्धति पर आधारित है. शक और विक्रम संवत के साथ १२ चांद्र मास (चैत्र से फाल्गुन तक) तिथि, नक्षत्र और पर्व के आधार पर व्यवस्थित हैं. भाग्यवेध का ${year} कैलेंडर दैनिक तिथि, नक्षत्र, योग, करण, शुभ मुहूर्त और सभी व्रत-त्योहार दिखाता है.`
          : `The Hindu Vedic calendar uses a luni-solar system. Months (Chaitra, Vaisakha, Jyaistha, Asadha, Sravana, Bhadrapada, Asvina, Kartika, Margashirsha, Pausha, Magha, Phalguna) run on lunar cycles while aligning with solar years via adhika maasa (extra months). The Bhaagyavedh ${year} calendar lists daily tithi, nakshatra, yoga, karana, shubh muhurat and every major festival and vrat.`}
      </p>

      <h2 className="text-xl font-bold text-[#3d0c0c] mt-8 mb-2">
        {mr ? `${year} मधील प्रमुख सण` : hi ? `${year} के प्रमुख पर्व` : `Major Festivals in ${year}`}
      </h2>
      <ul>
        <li>{mr ? "गुढीपाडवा — चैत्र शुक्ल प्रतिपदा (हिंदू नववर्ष)" : hi ? "गुड़ी पड़वा — चैत्र शुक्ल प्रतिपदा" : "Gudi Padwa — Chaitra Shukla Pratipada (Marathi New Year)"}</li>
        <li>{mr ? "रामनवमी — चैत्र शुक्ल नवमी" : hi ? "राम नवमी — चैत्र शुक्ल नवमी" : "Ram Navami — Chaitra Shukla Navami"}</li>
        <li>{mr ? "गणेश चतुर्थी — भाद्रपद शुक्ल चतुर्थी" : hi ? "गणेश चतुर्थी — भाद्रपद शुक्ल चतुर्थी" : "Ganesh Chaturthi — Bhadrapada Shukla Chaturthi"}</li>
        <li>{mr ? "नवरात्र व दसरा — आश्विन शुक्ल" : hi ? "नवरात्रि और दशहरा — आश्विन शुक्ल" : "Navratri and Dussehra — Ashvina Shukla"}</li>
        <li>{mr ? "दिवाळी — कार्तिक अमावस्या" : hi ? "दीपावली — कार्तिक अमावस्या" : "Diwali — Kartika Amavasya"}</li>
        <li>{mr ? "मकर संक्रांती — पौष मध्य" : hi ? "मकर संक्रान्ति — पौष मध्य" : "Makar Sankranti — mid-Pausha"}</li>
        <li>{mr ? "महाशिवरात्री — फाल्गुन कृष्ण चतुर्दशी" : hi ? "महाशिवरात्रि — फाल्गुन कृष्ण चतुर्दशी" : "Mahashivratri — Phalguna Krishna Chaturdashi"}</li>
      </ul>

      <h2 className="text-xl font-bold text-[#3d0c0c] mt-8 mb-2">
        {mr ? "व्रत व मुहूर्त" : hi ? "व्रत और मुहूर्त" : "Vrat and Muhurat"}
      </h2>
      <p>
        {mr
          ? "एकादशी, प्रदोष, अमावस्या, पौर्णिमा, संकष्ट चतुर्थी — ही मासिक व्रत दिनदर्शिकेत ठळकपणे दाखवली आहेत. विवाह, गृहप्रवेश, वास्तुशांती, नामकरण, उद्योग उद्घाटन अशा प्रसंगांसाठी शुभ मुहूर्त निवडताना तिथी, वार, नक्षत्र, योग आणि अभिजित मुहूर्त पाहिले जातात."
          : hi
          ? "एकादशी, प्रदोष, अमावस्या, पूर्णिमा, संकष्टी चतुर्थी मासिक व्रत कैलेंडर में चिह्नित हैं. विवाह, गृह प्रवेश, नामकरण, व्यवसाय आरंभ के लिए शुभ मुहूर्त तिथि, वार, नक्षत्र और अभिजित पर आधारित निकाले जाते हैं."
          : "Monthly vrats — Ekadashi, Pradosh, Amavasya, Purnima, Sankashti Chaturthi — are marked on the calendar. For ceremonial events (marriage, griha pravesh, vastu shanti, naamkaran, business inauguration) the Bhaagyavedh calendar provides shubh muhurat windows computed from tithi, vara, nakshatra, yoga and Abhijit muhurat."}
      </p>

      <p className="mt-8 text-sm text-gray-500">
        {mr
          ? `${year} ची भाग्यवेध दिनदर्शिका लाहिरी अयनांश व NASA JPL खगोलीय डेटावर आधारित, भारतातील सर्व प्रमुख शहरांसाठी अचूक.`
          : hi
          ? `${year} का भाग्यवेध कैलेंडर लाहिरी अयनांश और NASA JPL डेटा पर आधारित, भारत के सभी प्रमुख शहरों के लिए सटीक.`
          : `The ${year} Bhaagyavedh calendar uses Lahiri Ayanamsa with NASA JPL ephemeris, accurate across every major Indian city.`}
      </p>
    </section>
  );
}
