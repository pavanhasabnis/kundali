"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";

interface EnquiryPopupProps {
  open: boolean;
  onClose: () => void;
  subject?: string;
}

export function EnquiryPopup({ open, onClose, subject }: EnquiryPopupProps) {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset form when popup opens
  useEffect(() => {
    if (open) {
      setForm({ name: "", phone: "", email: "", message: "" });
      setSubmitted(false);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || `${form.phone}@enquiry.bhaagyavedh.com`,
          subject: subject || "General Enquiry",
          message: form.message || `Enquiry for: ${subject || "General"}`,
        }),
      });
      setSubmitted(true);
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 text-white" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#d4a843]">
                {t("चौकशी फॉर्म", "Enquiry Form")}
              </h2>
              {subject && (
                <p className="text-xs text-white/50 mt-0.5">{subject}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              X
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">&#10003;</span>
              </div>
              <h3 className="text-lg font-bold text-[#3d0c0c] mb-2">
                {t("चौकशी प्राप्त झाली!", "Enquiry Received!")}
              </h3>
              <p className="text-sm text-[#5c1a1a]/60 mb-6">
                {t("आम्ही लवकरच तुमच्याशी संपर्क करू.", "We will contact you soon.")}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}
              >
                {t("बंद करा", "Close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">
                  {t("नाव", "Name")} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचे नाव", "Your name")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">
                  {t("फोन नंबर", "Phone Number")} *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचा फोन नंबर", "Your phone number")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">
                  {t("ई-मेल", "Email")} <span className="text-[#5c1a1a]/40 text-xs">({t("ऐच्छिक", "optional")})</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
                  placeholder={t("तुमचा ई-मेल", "Your email")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d0c0c] mb-1">
                  {t("संदेश", "Message")} <span className="text-[#5c1a1a]/40 text-xs">({t("ऐच्छिक", "optional")})</span>
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-[#FFF8E7]/30 px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50 resize-none"
                  placeholder={t("तुमचा संदेश लिहा...", "Write your message...")}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}
              >
                {submitting ? t("पाठवत आहे...", "Sending...") : t("चौकशी पाठवा", "Submit Enquiry")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
