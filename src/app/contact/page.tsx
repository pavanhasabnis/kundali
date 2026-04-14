"use client";

import { useLang } from "@/lib/astrology/language-context";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${text}`, "_blank");
  };

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3d0c0c]">
            {t("संपर्क करा", "Contact Us")}
          </h1>
          <p className="text-[#5c1a1a]/70 mt-2">
            {t(
              "आम्हाला तुमच्या प्रश्नांची उत्तरे देण्यात आनंद होईल",
              "We would be happy to answer your questions"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form — Left */}
          <div className="bg-white rounded-xl border border-[#d4a843]/20 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#3d0c0c] mb-4">
              {t("संदेश पाठवा", "Send a Message")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("नाव", "Name")} *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचे नाव", "Your name")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("ई-मेल", "Email")}</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचा ई-मेल", "Your email")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("फोन नंबर", "Phone Number")} *</label>
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचा फोन नंबर", "Your phone number")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">{t("संदेश", "Message")} *</label>
                <textarea name="message" required rows={4} value={form.message} onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50 resize-none"
                  placeholder={t("तुमचा संदेश लिहा...", "Write your message...")} />
              </div>
              <button type="submit" className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                {t("व्हॉट्सअॅपवर पाठवा", "Send via WhatsApp")}
              </button>
              <p className="text-xs text-[#5c1a1a]/50 text-center">{t("तुमचा संदेश व्हॉट्सअॅपवर पाठवला जाईल", "Your message will be sent via WhatsApp")}</p>
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
                    {t("व्हॉट्सअॅप", "WhatsApp")}
                  </h3>
                  <p className="text-[#5c1a1a]/70 text-sm mt-1">+91 XXXXXXXXXX</p>
                  <a
                    href="https://wa.me/91XXXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-medium text-[#d4a843] hover:text-[#3d0c0c] transition"
                  >
                    {t("व्हॉट्सअॅपवर संदेश पाठवा →", "Send message on WhatsApp →")}
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl border border-[#d4a843]/20 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-2xl">✉</span>
                <div>
                  <h3 className="font-semibold text-[#3d0c0c]">
                    {t("ई-मेल", "Email")}
                  </h3>
                  <a
                    href="mailto:info@venkateshastrology.com"
                    className="text-[#5c1a1a]/70 text-sm mt-1 block hover:text-[#d4a843] transition"
                  >
                    info@venkateshastrology.com
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
                    {t("पत्ता", "Address")}
                  </h3>
                  <p className="text-[#5c1a1a]/70 text-sm mt-1">
                    {t("कोल्हापूर, महाराष्ट्र", "Kolhapur, Maharashtra")}
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
                    {t("कार्यालयीन वेळ", "Operating Hours")}
                  </h3>
                  <p className="text-[#5c1a1a]/70 text-sm mt-1">
                    {t("सकाळी ९ ते रात्री ९", "9:00 AM to 9:00 PM")}
                  </p>
                  <p className="text-[#5c1a1a]/50 text-xs mt-1">
                    {t("सोमवार ते रविवार", "Monday to Sunday")}
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
