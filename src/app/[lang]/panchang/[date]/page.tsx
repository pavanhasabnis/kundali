import { notFound } from "next/navigation";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import { calculatePanchang } from "@/lib/astrology/calculator";
import PanchangPageClient from "../panchang-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

export const revalidate = 86400;

const GREG_MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
const GREG_MONTHS_HI = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const GREG_MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MUMBAI = { lat: 19.076, lng: 72.8777, tz: 5.5 };

function parseDate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (y < 1900 || y > 2100) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function formatDate(d: Date, lang: Lang): string {
  const day = d.getDate();
  const year = d.getFullYear();
  const months = lang === "en" ? GREG_MONTHS_EN : lang === "hi" ? GREG_MONTHS_HI : GREG_MONTHS_MR;
  return `${day} ${months[d.getMonth()]} ${year}`;
}

function safePanchang(d: Date) {
  try {
    return calculatePanchang(d, MUMBAI.lat, MUMBAI.lng, MUMBAI.tz);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; date: string }> }) {
  const { lang, date: dateStr } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const d = parseDate(dateStr);
  if (!d) return { title: "Invalid date", robots: { index: false, follow: false } };

  const p = safePanchang(d);
  const dateLabel = formatDate(d, l);
  const tithi = p?.tithi ?? "";
  const paksha = p?.paksha ?? "";
  const nakshatra = p?.nakshatra ?? "";
  const rahu = p?.rahuKaal ?? "";

  const mrTitle = `${dateLabel} चे पंचांग — ${paksha} ${tithi}, ${nakshatra} नक्षत्र | भाग्यवेध`;
  const mrDesc = `${dateLabel} चे आजचे पंचांग — तिथी ${paksha} ${tithi}, नक्षत्र ${nakshatra}, राहू काळ ${rahu}. मुंबई, पुणे, नाशिक, नागपूरसाठी दैनिक तिथी, वार, योग, करण.`;

  const hiTitle = `${dateLabel} का पंचांग — ${paksha} ${tithi}, ${nakshatra} नक्षत्र | भाग्यवेध`;
  const hiDesc = `${dateLabel} का आज का पंचांग — तिथि ${paksha} ${tithi}, नक्षत्र ${nakshatra}, राहु काल ${rahu}. मुंबई, दिल्ली, पुणे के लिए दैनिक तिथि, वार, योग, करण.`;

  const enTitle = `Panchang ${dateLabel} — ${paksha} ${tithi}, ${nakshatra} Nakshatra | Bhaagyavedh`;
  const enDesc = `Panchang for ${dateLabel} — Tithi ${paksha} ${tithi}, Nakshatra ${nakshatra}, Rahu Kaal ${rahu}. Daily tithi, nakshatra, yoga, karana, sunrise & sunset for Mumbai, Pune, Delhi.`;

  return pageMetaI18n({
    lang: l,
    path: `/panchang/${dateStr}`,
    ogType: "article",
    mr: {
      title: mrTitle,
      description: mrDesc,
      keywords: [
        `${dateLabel} पंचांग`, `पंचांग ${dateLabel}`, `आजचे पंचांग ${dateLabel}`,
        `${tithi}`, `${nakshatra} नक्षत्र`, `${paksha}`,
        "पंचांग मराठी", "दैनिक पंचांग", "राहू काळ", "तिथी", "नक्षत्र",
        `panchang ${dateStr}`, `panchang ${dateLabel}`,
      ],
    },
    hi: {
      title: hiTitle,
      description: hiDesc,
      keywords: [
        `${dateLabel} पंचांग`, `पंचांग ${dateLabel}`, `आज का पंचांग ${dateLabel}`,
        `${tithi}`, `${nakshatra} नक्षत्र`, `${paksha}`,
        "पंचांग हिंदी", "दैनिक पंचांग", "राहु काल", "तिथि", "नक्षत्र",
        `panchang ${dateStr}`, `panchang ${dateLabel}`,
      ],
    },
    en: {
      title: enTitle,
      description: enDesc,
      keywords: [
        `panchang ${dateStr}`, `panchang ${dateLabel}`, `${dateLabel} panchang`,
        `tithi ${dateLabel}`, `nakshatra ${dateLabel}`, `rahu kaal ${dateLabel}`,
        "daily panchang", "hindu panchang", "vedic panchang",
        `${tithi}`, `${nakshatra}`, `${paksha}`,
      ],
    },
  });
}

export default async function PanchangDatedPage({ params }: { params: Promise<{ lang: string; date: string }> }) {
  const { lang, date: dateStr } = await params;
  const d = parseDate(dateStr);
  if (!d) notFound();

  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/panchang/${dateStr}`;
  const p = safePanchang(d);
  const dateLabel = formatDate(d, l);

  const headline = l === "mr"
    ? `${dateLabel} चे पंचांग — ${p?.paksha ?? ""} ${p?.tithi ?? ""}, ${p?.nakshatra ?? ""} नक्षत्र`
    : l === "hi"
    ? `${dateLabel} का पंचांग — ${p?.paksha ?? ""} ${p?.tithi ?? ""}, ${p?.nakshatra ?? ""} नक्षत्र`
    : `Panchang ${dateLabel} — ${p?.paksha ?? ""} ${p?.tithi ?? ""}, ${p?.nakshatra ?? ""} Nakshatra`;

  const desc = l === "mr"
    ? `${dateLabel} चे दैनिक पंचांग — तिथी, नक्षत्र, योग, करण, राहू काळ, सूर्योदय, सूर्यास्त.`
    : l === "hi"
    ? `${dateLabel} का दैनिक पंचांग — तिथि, नक्षत्र, योग, करण, राहु काल, सूर्योदय, सूर्यास्त.`
    : `Daily panchang for ${dateLabel} — tithi, nakshatra, yoga, karana, rahu kaal, sunrise, sunset.`;

  const panchangArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: desc,
    url,
    image: "https://bhaagyavedh.com/opengraph-image.png",
    datePublished: dateStr,
    dateModified: dateStr,
    author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
    publisher: {
      "@type": "Organization",
      name: "Bhaagyavedh",
      url: "https://bhaagyavedh.com",
      logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: l === "en" ? "en-IN" : l === "hi" ? "hi-IN" : "mr-IN",
  };

  const breadcrumbs = [
    { name: l === "mr" ? "मुख्यपृष्ठ" : l === "hi" ? "मुखपृष्ठ" : "Home", url: base },
    { name: l === "mr" ? "पंचांग" : l === "hi" ? "पंचांग" : "Panchang", url: `${base}/panchang` },
    { name: dateLabel, url },
  ];

  return (
    <>
      <JsonLd data={panchangArticleSchema} />
      <JsonLd data={serviceSchema({
        name: headline,
        description: desc,
        url,
      })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PanchangPageClient initialDate={dateStr} />
      <PanchangExplainer lang={lang} />
    </>
  );
}

function PanchangExplainer({ lang }: { lang: string }) {
  const mr = lang === "mr";
  const hi = lang === "hi";
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 prose prose-stone">
      <h2 className="text-2xl font-bold text-[#3d0c0c] mb-3">
        {mr ? "पंचांग म्हणजे काय?" : hi ? "पंचांग क्या है?" : "What is Panchang?"}
      </h2>
      <p>
        {mr
          ? "पंचांग हे वैदिक दिनदर्शिकेचे हृदय आहे. ‘पंच’ म्हणजे पाच आणि ‘अंग’ म्हणजे घटक — तिथी, वार, नक्षत्र, योग आणि करण. या पाच घटकांच्या आधारे शुभ-अशुभ काळ ठरवला जातो आणि मुहूर्त, विवाह, गृहप्रवेश, व्रत, उपासना यांसाठी योग्य वेळ निवडली जाते."
          : hi
          ? "पंचांग वैदिक कैलेंडर का मूल है. ‘पंच’ यानी पाँच और ‘अंग’ यानी तत्व — तिथि, वार, नक्षत्र, योग और करण. इन पाँच तत्वों के आधार पर शुभ-अशुभ समय और मुहूर्त निर्धारित किए जाते हैं."
          : "Panchang is the foundation of the Vedic calendar. ‘Pancha’ means five and ‘anga’ means limbs — Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (sun–moon combination) and Karana (half-tithi). These five elements determine auspicious timings (muhurat) for marriage, griha pravesh, business, vrat and all important Vedic activities."}
      </p>

      <h2 className="text-xl font-bold text-[#3d0c0c] mt-8 mb-2">
        {mr ? "तिथी (Tithi)" : hi ? "तिथि" : "Tithi (Lunar Day)"}
      </h2>
      <p>
        {mr
          ? "तिथी म्हणजे चंद्र आणि सूर्य यामधील १२° अंतर. एका चांद्र महिन्यात ३० तिथी असतात — प्रतिपदेपासून पौर्णिमा/अमावस्या पर्यंत. शुक्ल पक्ष (वाढत्या चंद्राचा) आणि कृष्ण पक्ष (घटत्या चंद्राचा) यांमध्ये तिथी विभागल्या जातात."
          : hi
          ? "तिथि चंद्र और सूर्य के बीच १२° की दूरी को कहते हैं. एक चंद्र मास में ३० तिथियाँ होती हैं — प्रतिपदा से पूर्णिमा/अमावस्या तक, शुक्ल और कृष्ण पक्ष में विभाजित."
          : "A Tithi is the 12° angular distance between the Moon and the Sun. A lunar month has 30 tithis — from Pratipada to Purnima/Amavasya — split across Shukla Paksha (waxing moon) and Krishna Paksha (waning moon). The tithi of the day drives vrat selection and festival dates."}
      </p>

      <h2 className="text-xl font-bold text-[#3d0c0c] mt-6 mb-2">
        {mr ? "नक्षत्र (Nakshatra)" : hi ? "नक्षत्र" : "Nakshatra (Lunar Mansion)"}
      </h2>
      <p>
        {mr
          ? "आकाशातील चंद्राच्या पथावरील २७ नक्षत्रांपैकी प्रत्येकाला १३°२०′ अंश मिळतात. जन्म नक्षत्र जीवनाच्या स्वभावावर परिणाम करते; दैनिक नक्षत्र मुहूर्त आणि उपासनेच्या कालावधीसाठी वापरले जाते."
          : hi
          ? "आकाश में चंद्रमा के पथ पर २७ नक्षत्र हैं, प्रत्येक को १३°२०′ मिलते हैं. जन्म नक्षत्र स्वभाव तय करता है; दैनिक नक्षत्र मुहूर्त के लिए उपयोग होता है."
          : "The 27 Nakshatras divide the Moon’s ecliptic into 13°20′ segments. Birth Nakshatra shapes personality traits, while the day’s Nakshatra informs muhurat, mantra sadhana and travel timing. Each Nakshatra has a ruling deity, planetary lord and gana classification."}
      </p>

      <h2 className="text-xl font-bold text-[#3d0c0c] mt-6 mb-2">
        {mr ? "योग व करण" : hi ? "योग और करण" : "Yoga and Karana"}
      </h2>
      <p>
        {mr
          ? "योग म्हणजे सूर्य व चंद्र यांच्या रेखांशांचा योग (एकूण २७ प्रकार) — काही शुभ (सिद्धि, शुभ, अमृत), काही अशुभ (व्याघात, व्यतिपात). करण म्हणजे अर्ध-तिथी; दिवसभरात ११ करणं फिरतात आणि शकुन-अपशकुन ठरवतात."
          : hi
          ? "योग सूर्य और चंद्र की रेखांश-योगफल है (२७ प्रकार); कुछ शुभ, कुछ अशुभ. करण अर्ध-तिथि है; दिनभर में ११ करण घूमते हैं."
          : "Yoga is the sum of solar and lunar longitudes (27 types) — some highly auspicious (Siddhi, Shubha, Amrita), others to avoid (Vyaghata, Vyatipata). Karana is half a tithi; 11 karanas rotate through the month, guiding auspiciousness at finer resolution."}
      </p>

      <h2 className="text-xl font-bold text-[#3d0c0c] mt-6 mb-2">
        {mr ? "राहू काळ — अशुभ कालखंड" : hi ? "राहु काल — अशुभ अवधि" : "Rahu Kaal — Inauspicious Window"}
      </h2>
      <p>
        {mr
          ? "राहू काळ हा दिवसाच्या सूर्योदयापासून सूर्यास्तापर्यंतच्या कालावधीच्या १/८ भागाइतका असतो — साधारण ९० मिनिटे. वारानुसार राहू काळ वेगवेगळ्या भागात पडतो (उदा. सोमवारी दुपारी ७:३०–९:००, शनिवारी सकाळी ९:००–१०:३०). या काळात नवीन कार्य, प्रवास, गुंतवणूक टाळावी."
          : hi
          ? "राहु काल दिन (सूर्योदय से सूर्यास्त) के १/८ भाग का अशुभ समय है — लगभग ९० मिनट. वार के अनुसार अलग-अलग भाग में पड़ता है. इस समय नया कार्य, यात्रा, निवेश न करें."
          : "Rahu Kaal is a ~90-minute inauspicious window calculated as 1/8th of the daytime (sunrise to sunset). It rotates across the day based on weekday — Monday afternoon, Saturday morning, Sunday evening, etc. Avoid starting new ventures, travel or financial commitments during this window."}
      </p>

      <p className="mt-8 text-sm text-gray-500">
        {mr
          ? "भाग्यवेधचे पंचांग NASA JPL खगोलीय डेटा आणि लाहिरी अयनांश यावर आधारित आहे — शास्त्रीय वैदिक परंपरेला आधुनिक अचूकतेची जोड."
          : hi
          ? "भाग्यवेध का पंचांग NASA JPL खगोलीय डेटा और लाहिरी अयनांश पर आधारित है."
          : "Bhaagyavedh panchang uses NASA JPL ephemeris data with Lahiri Ayanamsa — classical Vedic tradition backed by modern astronomical precision."}
      </p>
    </section>
  );
}
