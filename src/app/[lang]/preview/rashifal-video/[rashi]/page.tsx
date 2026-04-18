import VideoPreviewClient from "./video-preview-client";

export const dynamic = "force-dynamic";

const RASHI_LIST = [
  { id: 0, mr: "मेष", en: "Aries", hi: "मेष", symbol: "♈" },
  { id: 1, mr: "वृषभ", en: "Taurus", hi: "वृषभ", symbol: "♉" },
  { id: 2, mr: "मिथुन", en: "Gemini", hi: "मिथुन", symbol: "♊" },
  { id: 3, mr: "कर्क", en: "Cancer", hi: "कर्क", symbol: "♋" },
  { id: 4, mr: "सिंह", en: "Leo", hi: "सिंह", symbol: "♌" },
  { id: 5, mr: "कन्या", en: "Virgo", hi: "कन्या", symbol: "♍" },
  { id: 6, mr: "तुला", en: "Libra", hi: "तुला", symbol: "♎" },
  { id: 7, mr: "वृश्चिक", en: "Scorpio", hi: "वृश्चिक", symbol: "♏" },
  { id: 8, mr: "धनु", en: "Sagittarius", hi: "धनु", symbol: "♐" },
  { id: 9, mr: "मकर", en: "Capricorn", hi: "मकर", symbol: "♑" },
  { id: 10, mr: "कुंभ", en: "Aquarius", hi: "कुम्भ", symbol: "♒" },
  { id: 11, mr: "मीन", en: "Pisces", hi: "मीन", symbol: "♓" },
];

export default async function Page({ params }: { params: Promise<{ lang: string; rashi: string }> }) {
  const { rashi } = await params;
  const rashiId = Math.max(0, Math.min(11, parseInt(rashi) || 0));
  const meta = RASHI_LIST[rashiId];

  return <VideoPreviewClient rashiId={rashiId} rashiMeta={meta} rashiList={RASHI_LIST} />;
}
