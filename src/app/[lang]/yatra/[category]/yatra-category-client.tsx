"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { PageHero } from "@/components/page-hero";

interface TravelPkg {
  id: string;
  titleMr: string;
  titleEn: string;
  descriptionMr?: string;
  descriptionEn?: string;
  category: string;
  duration?: string;
  priceFrom?: number;
  priceTo?: number;
  inclusions?: string;
  itineraryMr?: string;
  itineraryEn?: string;
  highlights?: string;
  imageUrl?: string;
  locationMr?: string;
  locationEn?: string;
  featured: boolean;
}

const categoryMeta: Record<string, { labelMr: string; labelEn: string; descMr: string; descEn: string; icon: string }> = {
  jyotirlinga: {
    labelMr: "ज्योतिर्लिंग यात्रा",
    labelEn: "Jyotirlinga Yatra",
    descMr: "भारतातील १२ ज्योतिर्लिंगांचे पवित्र दर्शन — भगवान शिवाची सर्वात पवित्र स्थाने. सोमनाथ, मल्लिकार्जुन, महाकालेश्वर, ओंकारेश्वर, केदारनाथ, भीमाशंकर, काशी विश्वनाथ, त्र्यंबकेश्वर, वैद्यनाथ, नागेश्वर, रामेश्वरम आणि घृष्णेश्वर.",
    descEn: "Sacred darshan of 12 Jyotirlingas across India — the holiest shrines of Lord Shiva. Somnath, Mallikarjun, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Rameshwaram and Grishneshwar.",
    icon: "🔱",
  },
  "char-dham": {
    labelMr: "चार धाम यात्रा",
    labelEn: "Char Dham Yatra",
    descMr: "बद्रीनाथ, केदारनाथ, गंगोत्री आणि यमुनोत्री — उत्तराखंडातील हिमालयातील चार पवित्र धाम. मोक्ष प्राप्तीसाठी ही यात्रा अत्यंत पुण्यदायी मानली जाते.",
    descEn: "Badrinath, Kedarnath, Gangotri and Yamunotri — four sacred dhams in the Himalayas of Uttarakhand. This pilgrimage is considered highly auspicious for attaining moksha.",
    icon: "🏔️",
  },
  ashtavinayak: {
    labelMr: "अष्टविनायक दर्शन",
    labelEn: "Ashtavinayak Tour",
    descMr: "महाराष्ट्रातील ८ पवित्र गणपती मंदिरे — मोरगाव (मयूरेश्वर), सिद्धटेक (सिद्धिविनायक), पाली (बल्लाळेश्वर), महड (वरदविनायक), थेऊर (चिंतामणी), लेण्याद्री (गिरिजात्मज), ओझर (विघ्नेश्वर) आणि रांजणगाव (महागणपती).",
    descEn: "8 sacred Ganapati temples in Maharashtra — Morgaon (Mayureshwar), Siddhatek (Siddhivinayak), Pali (Ballaleshwar), Mahad (Varadvinayak), Theur (Chintamani), Lenyadri (Girijatmaj), Ozar (Vighneshwar) and Ranjangaon (Mahaganpati).",
    icon: "🙏",
  },
  "shakti-peeth": {
    labelMr: "शक्तिपीठ दर्शन",
    labelEn: "Shakti Peeth Tour",
    descMr: "देवी शक्तीची पवित्र स्थाने — कोल्हापूर महालक्ष्मी, तुळजापूर भवानी, माहूर रेणुकामाता, सप्तश्रुंगी. महाराष्ट्रातील साडेतीन शक्तिपीठे आणि इतर प्रमुख देवी मंदिरे.",
    descEn: "Sacred sites of Goddess Shakti — Kolhapur Mahalakshmi, Tuljapur Bhavani, Mahur Renukamata, Saptashrungi. Maharashtra's 3.5 Shakti Peethas and other major Devi temples.",
    icon: "🪷",
  },
  datta: {
    labelMr: "दत्त यात्रा",
    labelEn: "Datta Yatra",
    descMr: "श्री दत्तात्रेयांची प्रमुख क्षेत्रे — गाणगापूर, नरसोबाची वाडी, औदुंबर, कारंजा लाड आणि माहूर. गुरुचरित्र पारायण आणि दत्तस्थानांचे दर्शन.",
    descEn: "Major Dattatreya shrines — Gangapur, Narsobachi Wadi, Audumbar, Karanja Lad and Mahur. Gurucharitra recitation and darshan of Datta sites.",
    icon: "🙏",
  },
  "panch-kedar": {
    labelMr: "पंच केदार यात्रा",
    labelEn: "Panch Kedar Yatra",
    descMr: "उत्तराखंडातील पंच केदार — केदारनाथ, तुंगनाथ, रुद्रनाथ, मध्यमहेश्वर आणि कल्पेश्वर. हिमालयातील ५ प्राचीन शिव मंदिरांचे ट्रेकिंगसह दर्शन.",
    descEn: "Panch Kedar in Uttarakhand — Kedarnath, Tungnath, Rudranath, Madhyamaheshwar and Kalpeshwar. Trek to 5 ancient Shiva temples in the Himalayas.",
    icon: "⛰️",
  },
  varanasi: {
    labelMr: "काशी-प्रयागराज यात्रा",
    labelEn: "Varanasi-Prayagraj Yatra",
    descMr: "काशी विश्वनाथ दर्शन, गंगा आरती, प्रयागराज संगम स्नान आणि अयोध्या श्रीराम मंदिर. उत्तर भारतातील सर्वात पवित्र तीर्थक्षेत्रांचा अनुभव.",
    descEn: "Kashi Vishwanath darshan, Ganga Aarti, Prayagraj Sangam bathing and Ayodhya Shri Ram Mandir. Experience the holiest pilgrimage sites of North India.",
    icon: "🪔",
  },
  rameshwaram: {
    labelMr: "रामेश्वरम-मदुराई दर्शन",
    labelEn: "Rameshwaram-Madurai Tour",
    descMr: "रामेश्वरम ज्योतिर्लिंग, २२ कुंड स्नान, मदुराई मीनाक्षी मंदिर आणि कन्याकुमारी. दक्षिण भारतातील प्रमुख तीर्थक्षेत्रे.",
    descEn: "Rameshwaram Jyotirlinga, 22 Kund bathing, Madurai Meenakshi Temple and Kanyakumari. Major pilgrimage sites of South India.",
    icon: "🌊",
  },
  dwarka: {
    labelMr: "द्वारका-सोमनाथ यात्रा",
    labelEn: "Dwarka-Somnath Yatra",
    descMr: "भगवान श्रीकृष्णाची नगरी द्वारका, सोमनाथ ज्योतिर्लिंग, नागेश्वर ज्योतिर्लिंग आणि गिरनार. गुजरातमधील पवित्र तीर्थक्षेत्रे.",
    descEn: "Lord Krishna's city Dwarka, Somnath Jyotirlinga, Nageshwar Jyotirlinga and Girnar. Sacred pilgrimage sites in Gujarat.",
    icon: "🏛️",
  },
  shirdi: {
    labelMr: "शिर्डी-शनि शिंगणापूर दर्शन",
    labelEn: "Shirdi-Shani Shingnapur Tour",
    descMr: "शिर्डी साईबाबा, शनि शिंगणापूर, नाशिक त्र्यंबकेश्वर आणि पंचवटी. महाराष्ट्रातील सर्वात लोकप्रिय तीर्थयात्रा.",
    descEn: "Shirdi Sai Baba, Shani Shingnapur, Nashik Trimbakeshwar and Panchavati. Most popular pilgrimage in Maharashtra.",
    icon: "🙏",
  },
  tirupati: {
    labelMr: "तिरुपती दर्शन",
    labelEn: "Tirupati Darshan",
    descMr: "तिरुपती बालाजी (वेंकटेश्वर) दर्शन — VIP व्यवस्थेसह. कल्याणम, लड्डू प्रसादम आणि श्रीवारी मेट्टू दर्शन.",
    descEn: "Tirupati Balaji (Venkateswara) darshan — with VIP arrangements. Kalyanam, Laddu Prasadam and Srivari Mettu darshan.",
    icon: "⛩️",
  },
  pandharpur: {
    labelMr: "पंढरपूर वारी",
    labelEn: "Pandharpur Wari",
    descMr: "श्री विठ्ठल-रुक्मिणी दर्शन, चंद्रभागा स्नान. आषाढी/कार्तिकी एकादशी विशेष यात्रा. अक्कलकोट स्वामी समर्थ मठ दर्शनासह.",
    descEn: "Shri Vitthal-Rukmini darshan, Chandrabhaga bathing. Special Ashadhi/Kartiki Ekadashi tour. Includes Akkalkot Swami Samarth Math darshan.",
    icon: "🚩",
  },
  local: {
    labelMr: "स्थानिक दर्शन",
    labelEn: "Local Tours",
    descMr: "पुणे, मुंबई आणि आसपासच्या मंदिरांचे एकदिवसीय दौरे. सिद्धिविनायक, दगडूशेठ गणपती, महालक्ष्मी आणि इतर प्रसिद्ध मंदिरे.",
    descEn: "One-day tours of temples in Pune, Mumbai and nearby areas. Siddhivinayak, Dagdusheth Ganpati, Mahalakshmi and other famous temples.",
    icon: "📍",
  },
  custom: {
    labelMr: "सानुकूल तीर्थयात्रा",
    labelEn: "Custom Pilgrimage",
    descMr: "आपल्या आवडीनुसार खास तीर्थयात्रा पॅकेज. कुटुंब, मित्रमंडळ किंवा ग्रुप साठी विशेष व्यवस्था. तुमच्या बजेट आणि वेळापत्रकानुसार यात्रा तयार करू.",
    descEn: "Custom pilgrimage packages as per your preference. Special arrangements for family, friends or groups. We'll plan the journey according to your budget and schedule.",
    icon: "✨",
  },
};

// Map URL slug to database category value
function slugToDbCategory(slug: string): string {
  return slug.replace(/-/g, "_");
}

export default function YatraCategoryPageClient() {
  const { t, lang } = useLang();
  const params = useParams();
  const slug = params.category as string;
  const dbCategory = slugToDbCategory(slug);
  const meta = categoryMeta[slug];

  const [packages, setPackages] = useState<TravelPkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<TravelPkg | null>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", travelDate: "", travelers: "1", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/travel?category=${dbCategory}`)
      .then((r) => r.json())
      .then((d) => setPackages(d.packages || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dbCategory]);

  async function submitEnquiry() {
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone) return;
    setSubmitting(true);
    try {
      await fetch("/api/travel/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enquiryForm,
          packageId: selectedPkg?.id,
          packageTitle: selectedPkg ? t(selectedPkg.titleMr, selectedPkg.titleEn) : meta ? t(meta.labelMr, meta.labelEn) : "General Enquiry",
        }),
      });
      setSubmitted(true);
      setEnquiryForm({ name: "", email: "", phone: "", travelDate: "", travelers: "1", message: "" });
    } catch { /* ignore */ }
    setSubmitting(false);
  }

  function parseJsonArray(str?: string): string[] {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return str.split(",").map((s) => s.trim()).filter(Boolean); }
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-[#3d0c0c] mb-4">{t("श्रेणी सापडली नाही", "Category not found", "श्रेणी नहीं मिली")}</p>
          <Link href="/yatra" className="text-sm text-[#d4a843] font-medium hover:underline">&larr; {t("यात्रा सेवा", "Travel Services", "यात्रा सेवा")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <PageHero
        backHref={`/${lang}/yatra`}
        backLabel={t("सर्व यात्रा सेवा", "All Travel Services", "सभी यात्रा सेवाएँ")}
        eyebrow={meta.icon}
        title={t(meta.labelMr, meta.labelEn, meta.labelMr)}
        subtitle={t(meta.descMr, meta.descEn, meta.descMr)}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#d4a843]/30 border-t-[#3d0c0c] rounded-full animate-spin" />
          </div>
        )}

        {/* Package Detail View */}
        {selectedPkg && !showEnquiry && (
          <div className="space-y-6">
            <button onClick={() => setSelectedPkg(null)} className="text-sm text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">
              &larr; {t("मागे", "Back to packages", "पैकेजों पर वापस")}
            </button>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-20 flex items-center justify-center px-6" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                <h3 className="text-lg font-bold text-[#d4a843] text-center">{t(selectedPkg.titleMr, selectedPkg.titleEn, selectedPkg.titleMr)}</h3>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#3d0c0c]">{t(selectedPkg.titleMr, selectedPkg.titleEn, selectedPkg.titleMr)}</h2>
                    {(selectedPkg.locationMr || selectedPkg.locationEn) && (
                      <p className="text-sm text-[#5c1a1a]/50 mt-1">{t(selectedPkg.locationMr || "", selectedPkg.locationEn || "", selectedPkg.locationMr || "")}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {selectedPkg.priceFrom && (
                      <p className="text-2xl font-bold text-[#3d0c0c]">
                        ₹{selectedPkg.priceFrom.toLocaleString()}
                        {selectedPkg.priceTo ? <span className="text-sm font-normal text-[#5c1a1a]/40"> - ₹{selectedPkg.priceTo.toLocaleString()}</span> : ""}
                      </p>
                    )}
                    {selectedPkg.duration && <p className="text-xs text-[#5c1a1a]/50 mt-0.5">{selectedPkg.duration}</p>}
                    <p className="text-[10px] text-[#5c1a1a]/30">{t("प्रति व्यक्ती", "per person", "प्रति व्यक्ति")}</p>
                  </div>
                </div>

                {(selectedPkg.descriptionMr || selectedPkg.descriptionEn) && (
                  <p className="text-sm text-[#5c1a1a]/70 leading-relaxed mb-6">
                    {t(selectedPkg.descriptionMr || "", selectedPkg.descriptionEn || "", selectedPkg.descriptionMr || "")}
                  </p>
                )}

                {/* Highlights */}
                {(() => { const items = parseJsonArray(selectedPkg.highlights); return items.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-[#3d0c0c] mb-2">{t("ठळक वैशिष्ट्ये", "Highlights", "मुख्य विशेषताएँ")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((h, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-[#FFF8E7] text-xs text-[#3d0c0c] font-medium">{h}</span>
                      ))}
                    </div>
                  </div>
                ) : null; })()}

                {/* Inclusions */}
                {(() => { const items = parseJsonArray(selectedPkg.inclusions); return items.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-[#3d0c0c] mb-2">{t("समाविष्ट सेवा", "Inclusions", "शामिल सेवाएँ")}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {items.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-xs text-green-700">
                          <svg className="w-3.5 h-3.5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {inc}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null; })()}

                {/* Itinerary */}
                {(selectedPkg.itineraryMr || selectedPkg.itineraryEn) && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-[#3d0c0c] mb-2">{t("यात्रा कार्यक्रम", "Itinerary", "यात्रा कार्यक्रम")}</h3>
                    <div className="bg-[#FAFAF8] rounded-lg p-4 space-y-2">
                      {t(selectedPkg.itineraryMr || "", selectedPkg.itineraryEn || "", selectedPkg.itineraryMr || "").split("\n").map((line, i) => (
                        <div key={i} className="flex gap-3 text-sm text-[#5c1a1a]/70">
                          <span className="w-6 h-6 rounded-full bg-[#3d0c0c] text-[#d4a843] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                          <span className="leading-relaxed">{line.replace(/^(दिवस \d+:|Day \d+:)\s*/, "").trim() || line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => { setShowEnquiry(true); setSubmitted(false); }}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition text-sm">
                  {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enquiry Form */}
        {showEnquiry && (
          <div className="space-y-4 max-w-xl mx-auto">
            <button onClick={() => setShowEnquiry(false)} className="text-sm text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">
              &larr; {t("मागे", "Back", "वापस")}
            </button>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#3d0c0c] mb-1">{t("यात्रा चौकशी", "Travel Enquiry", "यात्रा पूछताछ")}</h2>
              {selectedPkg && <p className="text-xs text-[#d4a843] mb-4">{t(selectedPkg.titleMr, selectedPkg.titleEn, selectedPkg.titleMr)}</p>}
              {!selectedPkg && <p className="text-xs text-[#d4a843] mb-4">{t(meta.labelMr, meta.labelEn, meta.labelMr)}</p>}

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-lg font-bold text-green-700 mb-2">{t("चौकशी प्राप्त झाली!", "Enquiry Received!", "पूछताछ प्राप्त हुई!")}</p>
                  <p className="text-sm text-[#5c1a1a]/60">{t("आमची टीम तुम्हाला लवकरच संपर्क करेल", "Our team will contact you shortly", "हमारी टीम जल्द ही आपसे सम्पर्क करेगी")}</p>
                  <button onClick={() => { setShowEnquiry(false); setSelectedPkg(null); setSubmitted(false); }}
                    className="mt-6 px-6 py-2 rounded-lg bg-[#3d0c0c] text-[#d4a843] text-sm font-medium hover:bg-[#5c1a1a] transition">
                    {t("सर्व पॅकेजेस पहा", "View All Packages", "सभी पैकेज देखें")}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("नाव", "Name", "नाम")} *</label>
                    <input value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4a843]/40 focus:border-[#d4a843] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("ईमेल", "Email", "ईमेल")} *</label>
                      <input type="email" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4a843]/40 focus:border-[#d4a843] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("फोन", "Phone", "फ़ोन")} *</label>
                      <input type="tel" value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4a843]/40 focus:border-[#d4a843] focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("प्रवास तारीख", "Travel Date", "यात्रा तिथि")}</label>
                      <input type="date" value={enquiryForm.travelDate} onChange={(e) => setEnquiryForm({ ...enquiryForm, travelDate: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4a843]/40 focus:border-[#d4a843] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("प्रवासी संख्या", "Travelers", "यात्री संख्या")}</label>
                      <input type="number" min="1" value={enquiryForm.travelers} onChange={(e) => setEnquiryForm({ ...enquiryForm, travelers: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4a843]/40 focus:border-[#d4a843] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("संदेश", "Message", "संदेश")}</label>
                    <textarea rows={3} value={enquiryForm.message} onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4a843]/40 focus:border-[#d4a843] focus:outline-none resize-none"
                      placeholder={t("विशेष विनंती किंवा प्रश्न", "Any special requests or questions", "कोई विशेष अनुरोध या प्रश्न")} />
                  </div>
                  <button onClick={submitEnquiry} disabled={submitting || !enquiryForm.name || !enquiryForm.email || !enquiryForm.phone}
                    className="w-full py-3 rounded-lg bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition text-sm disabled:opacity-50">
                    {submitting ? t("पाठवत आहे...", "Submitting...") : t("चौकशी पाठवा", "Submit Enquiry")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Package Grid */}
        {!selectedPkg && !showEnquiry && !loading && (
          <>
            <h2 className="text-lg font-bold text-[#3d0c0c] mb-4">
              {t("उपलब्ध पॅकेजेस", "Available Packages", "उपलब्ध पैकेज")}
              <span className="text-sm font-normal text-[#5c1a1a]/40 ml-2">({packages.length})</span>
            </h2>

            {packages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="text-4xl mb-4">{meta.icon}</div>
                <p className="text-[#5c1a1a]/50 mb-2">{t("या श्रेणीत अद्याप पॅकेजेस नाहीत", "No packages in this category yet", "इस श्रेणी में अभी पैकेज नहीं हैं")}</p>
                <p className="text-xs text-[#5c1a1a]/30 mb-6">{t("पण तुम्ही चौकशी करू शकता — आम्ही तुमच्यासाठी पॅकेज तयार करू", "But you can enquire — we'll create a package for you", "लेकिन आप पूछताछ कर सकते हैं — हम आपके लिए पैकेज बनाएँगे")}</p>
                <button onClick={() => { setSelectedPkg(null); setShowEnquiry(true); setSubmitted(false); }}
                  className="px-6 py-2.5 rounded-lg bg-[#3d0c0c] text-[#d4a843] text-sm font-medium hover:bg-[#5c1a1a] transition">
                  {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {packages.map((pkg) => (
                  <button key={pkg.id} onClick={() => setSelectedPkg(pkg)}
                    className="text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#d4a843]/30 transition group">
                    <div className="h-24 flex items-center justify-center relative px-4" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                      <h4 className="text-sm font-bold text-[#d4a843] text-center leading-tight">{t(pkg.titleMr, pkg.titleEn, pkg.titleMr)}</h4>
                      {pkg.priceFrom && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(212,168,67,0.9)", color: "#1a0505" }}>
                          ₹{pkg.priceFrom.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#3d0c0c] text-sm mb-1">{t(pkg.titleMr, pkg.titleEn, pkg.titleMr)}</h3>
                      {(pkg.descriptionMr || pkg.descriptionEn) && (
                        <p className="text-xs text-[#5c1a1a]/50 line-clamp-2 mb-3">{t(pkg.descriptionMr || "", pkg.descriptionEn || "", pkg.descriptionMr || "")}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          {pkg.priceFrom ? (
                            <span className="font-bold text-[#3d0c0c]">₹{pkg.priceFrom.toLocaleString()}</span>
                          ) : (
                            <span className="text-xs text-[#5c1a1a]/40">{t("किंमत विचारा", "Ask for price", "कीमत पूछें")}</span>
                          )}
                          {pkg.duration && <span className="text-[10px] text-[#5c1a1a]/40 ml-2">{pkg.duration}</span>}
                        </div>
                        <span className="text-xs text-[#d4a843] font-medium">{t("तपशील पहा", "View Details", "विवरण देखें")} &rarr;</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Enquiry CTA */}
            <div className="mt-10 text-center bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-bold text-[#3d0c0c] mb-2">
                {t("या यात्रेबद्दल अधिक माहिती हवी?", "Need more information about this yatra?", "इस यात्रा के बारे में अधिक जानकारी चाहिए?")}
              </h3>
              <p className="text-sm text-[#5c1a1a]/50 max-w-md mx-auto mb-4">
                {t("आमच्या टीमशी संपर्क साधा — आम्ही तुमच्या प्रश्नांची उत्तरे देऊ", "Contact our team — we'll answer all your questions")}
              </p>
              <button onClick={() => { setSelectedPkg(null); setShowEnquiry(true); setSubmitted(false); }}
                className="px-8 py-3 rounded-lg bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition text-sm">
                {t("चौकशी करा", "Enquire Now", "पूछताछ करें")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
