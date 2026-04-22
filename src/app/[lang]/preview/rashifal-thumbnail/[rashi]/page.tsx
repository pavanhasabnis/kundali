import ThumbnailClient from "./thumbnail-client";

const RASHI_LIST = [
  { id: 0, slug: "mesh", mr: "मेष", en: "Aries" },
  { id: 1, slug: "vrushabh", mr: "वृषभ", en: "Taurus" },
  { id: 2, slug: "mithun", mr: "मिथुन", en: "Gemini" },
  { id: 3, slug: "kark", mr: "कर्क", en: "Cancer" },
  { id: 4, slug: "simha", mr: "सिंह", en: "Leo" },
  { id: 5, slug: "kanya", mr: "कन्या", en: "Virgo" },
  { id: 6, slug: "tula", mr: "तुला", en: "Libra" },
  { id: 7, slug: "vrushchik", mr: "वृश्चिक", en: "Scorpio" },
  { id: 8, slug: "dhanu", mr: "धनु", en: "Sagittarius" },
  { id: 9, slug: "makar", mr: "मकर", en: "Capricorn" },
  { id: 10, slug: "kumbh", mr: "कुंभ", en: "Aquarius" },
  { id: 11, slug: "meen", mr: "मीन", en: "Pisces" },
];

export default async function Page({ params }: { params: Promise<{ rashi: string }> }) {
  const { rashi } = await params;
  const rashiId = parseInt(rashi, 10);
  const meta = RASHI_LIST[rashiId] ?? RASHI_LIST[0];
  return <ThumbnailClient rashiId={rashiId} rashiMr={meta.mr} rashiSlug={meta.slug} />;
}
