"use client";

import { useLang } from "@/lib/astrology/language-context";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

interface TempleDetail {
  nameMr: string;
  nameEn: string;
  deityMr: string;
  deityEn: string;
  icon: string;
  locationMr: string;
  locationEn: string;
  descMr: string;
  descEn: string;
  significanceMr: string;
  significanceEn: string;
  timingsMr: string;
  timingsEn: string;
  specialMr: string;
  specialEn: string;
  detailMr: string;
  detailEn: string;
  category: string;
}

export default function TempleDetailClient({ id, temple }: { id: string; temple: TempleDetail | null }) {
  const { t, lang } = useLang();
  const showEn = lang === "en";

  if (!temple) {
    return (
      <div className="bg-[#FAFAF8] py-20 text-center">
        <p className="text-4xl mb-3">🛕</p>
        <p className="text-[#5c1a1a]/60 text-lg">{t("मंदिर सापडले नाही.", "Temple not found.", "मंदिर नहीं मिला.")}</p>
        <Link href="/temples" className="mt-4 inline-block text-[#d4a843] hover:text-[#3d0c0c] font-medium">
          {t("← सर्व मंदिरे", "← All Temples", "← सभी मंदिर")}
        </Link>
      </div>
    );
  }

  const content = showEn ? temple.detailEn : temple.detailMr;

  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-[#3d0c0c] mt-6 mb-3 border-b border-[#d4a843]/20 pb-2">{trimmed.replace("## ", "")}</h2>;
      if (trimmed.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-[#3d0c0c] mt-4 mb-2">{trimmed.replace("### ", "")}</h3>;
      if (trimmed.startsWith("- ")) return <li key={i} className="ml-5 list-disc mb-1">{trimmed.replace("- ", "").replace(/\*\*([^*]+)\*\*/g, "$1")}</li>;
      if (trimmed === "") return <br key={i} />;
      return <p key={i} className="mb-3 leading-relaxed">{trimmed.replace(/\*\*([^*]+)\*\*/g, "$1")}</p>;
    });
  }

  const templeUrl = `https://bhaagyavedh.com/${lang}/temples/${id}`;

  return (
    <div className="bg-[#FAFAF8] py-6">
      {/* JSON-LD Structured Data */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "HinduTemple",
        name: temple.nameEn,
        alternateName: temple.nameMr,
        description: temple.descEn,
        url: templeUrl,
        ...(temple.locationEn && { address: { "@type": "PostalAddress", addressLocality: temple.locationEn, addressCountry: "IN" } }),
        ...(temple.timingsEn && { openingHours: temple.timingsEn }),
        isAccessibleForFree: true,
        publicAccess: true,
        tourBookingPage: "https://bhaagyavedh.com/yatra",
      }} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: `https://bhaagyavedh.com/${lang}` },
        { name: "Temples", url: `https://bhaagyavedh.com/${lang}/temples` },
        { name: temple.nameEn, url: templeUrl },
      ])} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link href="/temples" className="inline-flex items-center gap-1 text-sm text-[#d4a843] hover:text-[#3d0c0c] mb-6 transition">
          {t("← सर्व मंदिरे", "← All Temples", "← सभी मंदिर")}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-[#d4a843]/20 shadow-sm overflow-hidden mb-6">
          <div className="p-6" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{temple.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-[#d4a843]">
                  {t(temple.nameMr, temple.nameEn, temple.nameMr)}
                </h1>
                {temple.deityMr && (
                  <p className="text-white/70 mt-1">{t(temple.deityMr, temple.deityEn, temple.deityMr)}</p>
                )}
                {temple.locationMr && (
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                    <span>📍</span> {t(temple.locationMr, temple.locationEn, temple.locationMr)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick info bar */}
          {(temple.timingsMr || temple.specialMr) && (
            <div className="px-6 py-3 bg-[#FFF8E7] border-b border-[#d4a843]/10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5c1a1a]/70">
              {temple.timingsMr && (
                <span className="flex items-center gap-1">
                  <span>🕐</span> {t(temple.timingsMr, temple.timingsEn, temple.timingsMr)}
                </span>
              )}
              {temple.specialMr && (
                <span className="flex items-center gap-1">
                  <span>🎉</span> {t(temple.specialMr, temple.specialEn, temple.specialMr)}
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="p-6">
            <p className="text-[#5c1a1a]/80 leading-relaxed">
              {t(temple.descMr, temple.descEn, temple.descMr)}
            </p>
            {temple.significanceMr && (
              <div className="mt-4 p-3 rounded-lg bg-[#FFF8E7] border border-[#d4a843]/10">
                <p className="text-xs font-semibold text-[#3d0c0c] mb-1">{t("महत्व", "Significance", "महत्व")}</p>
                <p className="text-sm text-[#5c1a1a]/60">{t(temple.significanceMr, temple.significanceEn, temple.significanceMr)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Full Detail Content */}
        <div className="bg-white rounded-xl border border-[#d4a843]/20 shadow-sm p-6 text-[#5c1a1a]/80 text-[15px]">
          {renderContent(content)}
        </div>

        {/* Back to all temples */}
        <div className="mt-6 text-center">
          <Link href="/temples" className="inline-flex items-center gap-1 text-sm font-medium text-[#d4a843] hover:text-[#3d0c0c] transition">
            {t("← सर्व मंदिरांची यादी पहा", "← View all temples", "← सभी मंदिरों की सूची देखें")}
          </Link>
        </div>
      </div>
    </div>
  );
}
