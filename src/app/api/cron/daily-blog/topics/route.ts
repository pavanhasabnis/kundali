import { NextResponse } from "next/server";

// Same topic list — keep in sync with parent route
const topics = [
  { index: 0, titleMr: "शनि ग्रहाचे साडेसाती — तुमच्या आयुष्यावर होणारा प्रभाव आणि उपाय", titleEn: "Saturn's Sade Sati — Impact and Remedies", cat: "Planets" },
  { index: 1, titleMr: "कालसर्प दोष — ओळख, प्रभाव आणि निवारण विधी", titleEn: "Kalsarpa Dosha — Identification and Remedies", cat: "Dosha" },
  { index: 2, titleMr: "मंगळ दोष — विवाहावरील प्रभाव आणि योग्य उपाय", titleEn: "Mangal Dosha — Marriage Impact and Remedies", cat: "Dosha" },
  { index: 3, titleMr: "नवग्रह पूजा — नऊ ग्रहांची शक्ती आणि पूजाविधी", titleEn: "Navagraha Puja — Power of Nine Planets", cat: "Puja" },
  { index: 4, titleMr: "राहू-केतू गोचर 2026 — सर्व राशींवर होणारा प्रभाव", titleEn: "Rahu-Ketu Transit 2026 — All Signs Impact", cat: "Astrology" },
];

export async function GET() {
  return NextResponse.json({ topics });
}
