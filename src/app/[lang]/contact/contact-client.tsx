"use client";

import { useLang } from "@/lib/astrology/language-context";
import { useState } from "react";
import { JsonLd, localBusinessSchema, breadcrumbSchema } from "@/components/json-ld";

export default function ContactPageClient() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://bhaagyavedh.com" }, { name: "Contact", url: "https://bhaagyavedh.com/contact" }])} />
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">
            {t("संपर्क करा", "Contact Us", "सम्पर्क करें")}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t(
              "आम्हाला तुमच्या प्रश्नांची उत्तरे देण्यात आनंद होईल",
              "We would be happy to answer your questions",
              "हमें आपके प्रश्नों के उत्तर देकर खुशी होगी"
            )}
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form — Left */}
          <div className="bg-white rounded-xl border border-[#d4a843]/20 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#3d0c0c] mb-4">
              {t("संदेश पाठवा", "Send a Message", "संदेश भेजें")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("नाव", "Name", "नाम")} *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचे नाव", "Your name", "आपका नाम")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("ई-मेल", "Email", "ई-मेल")}</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचा ई-मेल", "Your email", "आपका ई-मेल")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("फोन नंबर", "Phone Number", "फ़ोन नंबर")} *</label>
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचा फोन नंबर", "Your phone number", "आपका फ़ोन नंबर")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("संदेश", "Message", "संदेश")} *</label>
                <textarea name="message" required rows={4} value={form.message} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50 resize-none"
                  placeholder={t("तुमचा संदेश लिहा...", "Write your message...", "अपना संदेश लिखें...")} />
              </div>
              {submitted ? (
                <div className="text-center py-3 px-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-green-700 text-sm font-medium">{t("तुमचा संदेश पाठवला गेला!", "Your message has been sent!", "आपका संदेश भेज दिया गया!")}</p>
                  <p className="text-green-600 text-xs mt-1">{t("आम्ही लवकरच तुमच्याशी संपर्क करू.", "We will contact you soon.", "हम जल्द ही आपसे सम्पर्क करेंगे.")}</p>
                </div>
              ) : (
                <button type="submit" disabled={submitting} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                  {submitting ? t("पाठवत आहे...", "Sending...", "भेज रहे हैं...") : t("संदेश पाठवा", "Send Message", "संदेश भेजें")}
                </button>
              )}
            </form>
          </div>

          {/* Contact Info — Right */}
          <div className="space-y-6">
            {/* WhatsApp */}
            <div className="bg-white rounded-xl border border-[#d4a843]/20 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-semibold text-[#3d0c0c]">
                    {t("व्हाट्सअप", "WhatsApp", "व्हाट्सऐप")}
                  </h3>
                  <p className="text-[#5c1a1a]/70 text-sm mt-1">+91 9146189837</p>
                  <p className="text-[#5c1a1a]/50 text-xs mt-1">
                    {t("डावीकडील फॉर्म भरा, आम्ही संपर्क करू", "Fill the form on left, we will contact you", "बाईं ओर का फ़ॉर्म भरें, हम सम्पर्क करेंगे")}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl border border-[#d4a843]/20 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-2xl">✉</span>
                <div>
                  <h3 className="font-semibold text-[#3d0c0c]">
                    {t("ई-मेल", "Email", "ई-मेल")}
                  </h3>
                  <a
                    href="mailto:info@bhaagyavedh.com"
                    className="text-[#5c1a1a]/70 text-sm mt-1 block hover:text-[#d4a843] transition"
                  >
                    info@bhaagyavedh.com
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-[#d4a843]/20 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-semibold text-[#3d0c0c]">
                    {t("पत्ता", "Address", "पता")}
                  </h3>
                  <p className="text-[#5c1a1a]/70 text-sm mt-1">
                    {t("कोथरूड, पुणे, महाराष्ट्र", "Kothrud, Pune, Maharashtra", "कोथरूड, पुणे, महाराष्ट्र")}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl border border-[#d4a843]/20 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🕐</span>
                <div>
                  <h3 className="font-semibold text-[#3d0c0c]">
                    {t("कार्यालयीन वेळ", "Operating Hours", "कार्यालयीन समय")}
                  </h3>
                  <p className="text-[#5c1a1a]/70 text-sm mt-1">
                    {t("सकाळी ९ ते रात्री ९", "9:00 AM to 9:00 PM", "सुबह ९ से रात ९")}
                  </p>
                  <p className="text-[#5c1a1a]/50 text-xs mt-1">
                    {t("सोमवार ते शनिवार", "Monday to Saturday", "सोमवार से शनिवार")}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
