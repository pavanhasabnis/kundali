"use client";

import { useLang } from "@/lib/astrology/language-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  gold: { bg: "bg-[#FFF8E7]", text: "text-[#3d0c0c]", border: "border-[#d4a843]/30" },
  red: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  green: { bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
};

export function SiteBanner() {
  const { lang } = useLang();
  const pathname = usePathname();
  const [banner, setBanner] = useState<{ active: boolean; textMr: string; textEn: string; link: string; color: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || {};
        if (s.banner_active === "true" && (s.banner_text_mr || s.banner_text_en)) {
          setBanner({
            active: true,
            textMr: s.banner_text_mr || "",
            textEn: s.banner_text_en || "",
            link: s.banner_link || "",
            color: s.banner_color || "gold",
          });
        }
      })
      .catch(() => {});
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) return null;
  if (!banner || !banner.active || dismissed) return null;

  const colors = colorMap[banner.color] || colorMap.gold;
  const text = lang === "en" ? banner.textEn : banner.textMr;
  if (!text) return null;

  const content = (
    <div className={`${colors.bg} ${colors.text} border-b ${colors.border} px-4 py-2 text-center text-sm font-medium relative no-print`}>
      {banner.link ? (
        <Link href={banner.link} className="hover:underline">{text}</Link>
      ) : (
        <span>{text}</span>
      )}
      <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-current/40 hover:text-current text-lg leading-none">×</button>
    </div>
  );

  return content;
}
