import CoverSamplesClient from "./cover-samples-client";

export const metadata = {
  title: "Rashifal Thumbnail Samples",
  robots: { index: false, follow: false },
};

const RASHI_LIST = [
  { id: 0,  mr: "मेष",    en: "Aries",       hi: "मेष",    symbol: "♈", icon: "/images/rashi-gold/mesh.svg" },
  { id: 1,  mr: "वृषभ",   en: "Taurus",      hi: "वृषभ",   symbol: "♉", icon: "/images/rashi-gold/vrushabh.svg" },
  { id: 2,  mr: "मिथुन",  en: "Gemini",      hi: "मिथुन",  symbol: "♊", icon: "/images/rashi-gold/mithun.svg" },
  { id: 3,  mr: "कर्क",   en: "Cancer",      hi: "कर्क",   symbol: "♋", icon: "/images/rashi-gold/kark.svg" },
  { id: 4,  mr: "सिंह",   en: "Leo",         hi: "सिंह",   symbol: "♌", icon: "/images/rashi-gold/simha.svg" },
  { id: 5,  mr: "कन्या",  en: "Virgo",       hi: "कन्या",  symbol: "♍", icon: "/images/rashi-gold/kanya.svg" },
  { id: 6,  mr: "तुला",   en: "Libra",       hi: "तुला",   symbol: "♎", icon: "/images/rashi-gold/tula.svg" },
  { id: 7,  mr: "वृश्चिक", en: "Scorpio",     hi: "वृश्चिक", symbol: "♏", icon: "/images/rashi-gold/vrushchik.svg" },
  { id: 8,  mr: "धनु",    en: "Sagittarius", hi: "धनु",    symbol: "♐", icon: "/images/rashi-gold/dhanu.svg" },
  { id: 9,  mr: "मकर",    en: "Capricorn",   hi: "मकर",    symbol: "♑", icon: "/images/rashi-gold/makar.svg" },
  { id: 10, mr: "कुंभ",   en: "Aquarius",    hi: "कुम्भ",  symbol: "♒", icon: "/images/rashi-gold/kumbh.svg" },
  { id: 11, mr: "मीन",    en: "Pisces",      hi: "मीन",    symbol: "♓", icon: "/images/rashi-gold/meen.svg" },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rashi?: string }>;
}) {
  const sp = await searchParams;
  const rashiId = Math.max(0, Math.min(11, parseInt(sp.rashi ?? "0", 10) || 0));
  const meta = RASHI_LIST[rashiId];

  return <CoverSamplesClient rashiId={rashiId} rashiMeta={meta} rashiList={RASHI_LIST} />;
}
