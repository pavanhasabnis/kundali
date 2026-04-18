/**
 * Jaimini-specific calculations: Atmakaraka (soul significator),
 * Karakamsha Lagna (AK in D9), Ishta Devata (personal deity from D12).
 *
 * Atmakaraka = planet with highest longitude degree in sidereal zodiac (among 7 grahas, Rahu excluded).
 * Some traditions include Rahu with reversed degree (30° - Rahu's degree).
 * Karakamsha = sign occupied by AK in Navamsha (D9).
 * Ishta Devata = ruling deity of sign AK occupies in Dwadashamsha (D12).
 */

import type { KundliResult, PlanetPosition } from "./calculator";
import type { DivisionalChart } from "./divisional";
import { RASHIS } from "./constants";

// Ishta Devata per rashi (D12 position of Atmakaraka)
const RASHI_DEITY: Record<number, { deityMr: string; deityEn: string; deityHi: string; mantraMr: string; mantraEn: string; significanceMr: string; significanceEn: string; significanceHi: string }> = {
  0: {
    deityMr: "श्री कार्तिकेय / सुब्रह्मण्य", deityEn: "Lord Kartikeya / Subrahmanya", deityHi: "कार्तिकेय / सुब्रह्मण्य",
    mantraMr: "ॐ शरवणभव · ॐ वचद्भुवे नमः", mantraEn: "Om Sharavanabhava · Om Vachadbhuve Namah",
    significanceMr: "मेष राशी — अग्नितत्त्व व मंगळाची राशी. कार्तिकेय हे युद्धदेव व सेनापती — आत्म्याच्या धैर्याचे प्रतीक. संकष्टीवर गणपतीसह पूजा.",
    significanceEn: "Aries — fiery sign ruled by Mars. Kartikeya, the warrior-general, signifies the soul's valour. Worship with Ganesha on Sankashti.",
    significanceHi: "मेष — अग्नि तत्व, मंगल की राशि. कार्तिकेय आत्मा के शौर्य के प्रतीक. संकष्टी पर गणेश के साथ पूजा.",
  },
  1: {
    deityMr: "श्री महालक्ष्मी / गौमाता", deityEn: "Goddess Mahalakshmi / Kamadhenu", deityHi: "महालक्ष्मी / कामधेनु",
    mantraMr: "ॐ श्रीं महालक्ष्म्यै नमः", mantraEn: "Om Shreem Mahalakshmyai Namah",
    significanceMr: "वृषभ — पृथ्वीतत्त्व, शुक्राची राशी. महालक्ष्मी ऐश्वर्य व स्थैर्याचे देवता. शुक्रवारी लक्ष्मी पूजन व गौसेवा आत्मोन्नतीकर.",
    significanceEn: "Taurus — earth sign ruled by Venus. Mahalakshmi signifies wealth and stability. Friday Lakshmi pujan and go-seva elevate the soul.",
    significanceHi: "वृषभ — पृथ्वी तत्व, शुक्र की राशि. महालक्ष्मी समृद्धि की देवी. शुक्रवार लक्ष्मी पूजन व गौ सेवा.",
  },
  2: {
    deityMr: "श्री विष्णू / श्री नारायण", deityEn: "Lord Vishnu / Narayana", deityHi: "विष्णु / नारायण",
    mantraMr: "ॐ नमो नारायणाय / विष्णू सहस्रनाम", mantraEn: "Om Namo Narayanaya / Vishnu Sahasranama",
    significanceMr: "मिथुन — वायुतत्त्व, बुधाची राशी. विष्णूचे द्वैतरूप (राम-लक्ष्मण) हे मिथुनाचे प्रतीक. एकादशीचे उपवास व विष्णू सहस्रनामाने मोक्षमार्ग.",
    significanceEn: "Gemini — air sign ruled by Mercury. Vishnu's dual aspect (Rama-Lakshmana) reflects Gemini. Ekadashi fasts and Vishnu Sahasranama illumine the path to moksha.",
    significanceHi: "मिथुन — वायु तत्व, बुध की राशि. विष्णु का द्वैत रूप. एकादशी व्रत व विष्णु सहस्रनाम.",
  },
  3: {
    deityMr: "श्री शंकर (महादेव) / पार्वती माता", deityEn: "Lord Shiva / Parvati", deityHi: "शिव / पार्वती",
    mantraMr: "ॐ नमः शिवाय · महामृत्युंजय मंत्र", mantraEn: "Om Namah Shivaya · Mahamrityunjaya Mantra",
    significanceMr: "कर्क — जलतत्त्व, चंद्राची राशी. शिव हे मन व आत्म्याचे अधिपती — कर्कामध्ये गुरूचे उच्च स्थान आहे, आत्मज्ञानास पोषक. सोमवारी रुद्राभिषेक करा.",
    significanceEn: "Cancer — water sign ruled by Moon. Shiva, lord of mind and soul; Jupiter is exalted in Cancer, supporting self-knowledge. Monday Rudrabhishek is foremost.",
    significanceHi: "कर्क — जल तत्व, चंद्र की राशि. शिव मन व आत्मा के स्वामी. सोमवार रुद्राभिषेक.",
  },
  4: {
    deityMr: "श्री सूर्यनारायण / श्री राम", deityEn: "Lord Surya / Lord Rama", deityHi: "सूर्य / श्री राम",
    mantraMr: "ॐ सूर्याय नमः · आदित्य हृदय स्तोत्र", mantraEn: "Om Suryaya Namah · Aditya Hridaya Stotra",
    significanceMr: "सिंह — अग्नितत्त्व, सूर्याची राशी. राम हे सूर्यवंशी — धर्म, सत्य, राजयोगाचे प्रतीक. रविवारी सूर्यनमस्कार व आदित्य हृदय पठण.",
    significanceEn: "Leo — fiery sign ruled by the Sun. Rama, of Surya's lineage, embodies dharma, truth, and royal yoga. Sunday Surya Namaskar and Aditya Hridaya paath.",
    significanceHi: "सिंह — अग्नि तत्व, सूर्य की राशि. श्रीराम सूर्यवंशी. रविवार सूर्य नमस्कार व आदित्य हृदय पाठ.",
  },
  5: {
    deityMr: "श्री गणपती / श्री सरस्वती", deityEn: "Lord Ganesha / Goddess Saraswati", deityHi: "गणेश / सरस्वती",
    mantraMr: "ॐ गं गणपतये नमः · गणेश अथर्वशीर्ष", mantraEn: "Om Gam Ganapataye Namah · Ganesh Atharvashirsha",
    significanceMr: "कन्या — पृथ्वीतत्त्व, बुधाची राशी. गणपती हे विवेक व विद्येचे देव — बुधामुळे अध्ययन व विश्लेषणाचे बल. मोरेश्वर व अष्टविनायक यात्रा शुभ.",
    significanceEn: "Virgo — earth sign ruled by Mercury. Ganesha, lord of discernment and knowledge, aligns with Mercury's analytical power. Yatra to Moreshwar and Ashtavinayaks is auspicious.",
    significanceHi: "कन्या — पृथ्वी तत्व, बुध की राशि. गणेश विवेक व विद्या के देव. अष्टविनायक यात्रा.",
  },
  6: {
    deityMr: "श्री महालक्ष्मी / श्री सरस्वती", deityEn: "Goddess Mahalakshmi / Saraswati", deityHi: "महालक्ष्मी / सरस्वती",
    mantraMr: "ॐ ऐं ह्रीं श्रीं · श्री सूक्त", mantraEn: "Om Aim Hreem Shreem · Shri Sukta",
    significanceMr: "तुला — वायुतत्त्व, शुक्राची राशी. शुक्र हा तुलेचा स्वामी — लक्ष्मी, न्याय व संतुलनाचे प्रतीक. कोल्हापूर महालक्ष्मी दर्शन व श्री सूक्त पठण.",
    significanceEn: "Libra — air sign ruled by Venus. Venus rules Libra — Lakshmi signifies justice and balance. Darshan at Kolhapur Mahalaxmi and Shri Sukta paath.",
    significanceHi: "तुला — वायु तत्व, शुक्र की राशि. लक्ष्मी न्याय व संतुलन की देवी. कोल्हापुर महालक्ष्मी.",
  },
  7: {
    deityMr: "श्री हनुमान / भगवान नरसिंह", deityEn: "Lord Hanuman / Narasimha", deityHi: "हनुमान / नरसिंह",
    mantraMr: "ॐ हं हनुमते नमः · हनुमान चालीसा", mantraEn: "Om Ham Hanumate Namah · Hanuman Chalisa",
    significanceMr: "वृश्चिक — जलतत्त्व, मंगळाची राशी. हनुमान हे मंगळाचे स्वरूप — शौर्य, भक्ती व रक्षण. मंगळवारी हनुमान चालीसा व शेंदूर अर्पण.",
    significanceEn: "Scorpio — water sign ruled by Mars. Hanuman embodies Mars — valour, devotion, protection. Tuesday Hanuman Chalisa and sindoor offering.",
    significanceHi: "वृश्चिक — जल तत्व, मंगल की राशि. हनुमान मंगल स्वरूप. मंगलवार हनुमान चालीसा.",
  },
  8: {
    deityMr: "श्री दत्तात्रेय / श्री विष्णू", deityEn: "Lord Dattatreya / Vishnu", deityHi: "दत्तात्रेय / विष्णु",
    mantraMr: "ॐ द्रां दत्तात्रेयाय नमः · श्री गुरुचरित्र", mantraEn: "Om Dram Dattatreyaya Namah · Shri Gurucharitra",
    significanceMr: "धनू — अग्नितत्त्व, गुरूची राशी. दत्तात्रेय हे त्रिदेवांचे एकत्रित स्वरूप — गुरुतत्त्व. गाणगापूर, नृसिंहवाडी, अक्कलकोट यात्रा व गुरुचरित्र पारायण.",
    significanceEn: "Sagittarius — fiery sign ruled by Jupiter. Dattatreya, the trinity unified, embodies the Guru principle. Yatra to Ganagapur, Narasobawadi, Akkalkot; Gurucharitra parayana.",
    significanceHi: "धनु — अग्नि तत्व, गुरु की राशि. दत्तात्रेय गुरु तत्व. गाणगापुर, नृसिंहवाड़ी यात्रा.",
  },
  9: {
    deityMr: "श्री शनिदेव / श्री कृष्ण", deityEn: "Lord Shani / Krishna", deityHi: "शनि / कृष्ण",
    mantraMr: "ॐ शं शनैश्चराय नमः / ॐ कृष्णाय नमः", mantraEn: "Om Sham Shanaishcharaya Namah / Om Krishnaya Namah",
    significanceMr: "मकर — पृथ्वीतत्त्व, शनीची राशी. कर्मयोग व धैर्याचे प्रतीक. शनिशिंगणापूर तेलाभिषेक व कृष्ण पूजा दोन्ही आत्मोन्नतीकर.",
    significanceEn: "Capricorn — earth sign ruled by Saturn. The sign of karma-yoga and perseverance. Both Shani Shingnapur oil abhishek and Krishna worship elevate the soul.",
    significanceHi: "मकर — पृथ्वी तत्व, शनि की राशि. कर्मयोग. शनि शिंगणापुर व कृष्ण पूजा.",
  },
  10: {
    deityMr: "श्री दुर्गा / श्री शंकर", deityEn: "Goddess Durga / Lord Shiva", deityHi: "दुर्गा / शिव",
    mantraMr: "ॐ दुं दुर्गायै नमः · दुर्गा सप्तशती", mantraEn: "Om Dum Durgayai Namah · Durga Saptashati",
    significanceMr: "कुंभ — वायुतत्त्व, शनीची राशी. दुर्गा शक्ती व मोक्षाचे प्रतीक. नवरात्रीत दुर्गा सप्तशती पाठ, शक्तिपीठ यात्रा आत्मोन्नतीकर.",
    significanceEn: "Aquarius — air sign ruled by Saturn. Durga embodies shakti and liberation. Durga Saptashati during Navratri and Shakti Peetha yatra elevate the soul.",
    significanceHi: "कुंभ — वायु तत्व, शनि की राशि. दुर्गा शक्ति व मोक्ष. नवरात्रि दुर्गा सप्तशती.",
  },
  11: {
    deityMr: "श्री विष्णू / श्री वेंकटेश", deityEn: "Lord Vishnu / Venkateshwara", deityHi: "विष्णु / वेंकटेश",
    mantraMr: "ॐ नमो वेंकटेशाय · विष्णू सहस्रनाम", mantraEn: "Om Namo Venkateshaya · Vishnu Sahasranama",
    significanceMr: "मीन — जलतत्त्व, गुरूची राशी. विष्णूचे पूर्ण रूप (मत्स्य अवतार मीनाशी जोडलेला). तिरुपती यात्रा व एकादशी उपवास मोक्षदायक.",
    significanceEn: "Pisces — water sign ruled by Jupiter. Vishnu's complete form (Matsya avatar connects with Pisces). Tirupati yatra and Ekadashi fasts grant moksha.",
    significanceHi: "मीन — जल तत्व, गुरु की राशि. विष्णु पूर्ण रूप (मत्स्य अवतार). तिरुपति यात्रा.",
  },
};

export interface JaiminiResult {
  atmakarakaId: string;
  atmakarakaNameMr: string;
  atmakarakaNameEn: string;
  atmakarakaRashiMr: string;
  atmakarakaRashiEn: string;
  atmakarakaDegree: number;
  karakamshaRashiIndex: number;
  karakamshaRashiMr: string;
  karakamshaRashiEn: string;
  ishtaDevataRashiIndex: number;  // D12 position of AK
  ishtaDevataRashiMr: string;
  ishtaDevataRashiEn: string;
  ishtaDevataMr: string;
  ishtaDevataEn: string;
  ishtaDevataHi: string;
  mantraMr: string;
  mantraEn: string;
  significanceMr: string;
  significanceEn: string;
  significanceHi: string;
  // Chara karakas (8 in traditional Jaimini)
  charakarakas: Array<{
    id: string;
    nameMr: string;
    nameEn: string;
    karakaMr: string;
    karakaEn: string;
    role: string;
    roleMr: string;
    degree: number;
  }>;
}

const CHARAKARAKA_ROLES: Array<{ id: string; mr: string; en: string; roleMr: string; roleEn: string }> = [
  { id: "AK", mr: "आत्मकारक", en: "Atmakaraka", roleMr: "आत्मा, जीवन उद्देश", roleEn: "Soul, life purpose" },
  { id: "AmK", mr: "अमात्यकारक", en: "Amatyakaraka", roleMr: "मंत्री, करिअर", roleEn: "Minister, career" },
  { id: "BK", mr: "भ्रातृकारक", en: "Bhratrukaraka", roleMr: "भावंडे, धैर्य", roleEn: "Siblings, courage" },
  { id: "MK", mr: "मातृकारक", en: "Matrukaraka", roleMr: "माता, घर", roleEn: "Mother, home" },
  { id: "PiK", mr: "पितृकारक", en: "Pitrukaraka", roleMr: "संतती, बुद्धी", roleEn: "Children, intellect" },
  { id: "GK", mr: "ज्ञातिकारक", en: "Jnatikaraka", roleMr: "नातेवाईक, शत्रू", roleEn: "Relatives, enemies" },
  { id: "DK", mr: "दारकारक", en: "Darakaraka", roleMr: "जोडीदार, विवाह", roleEn: "Spouse, marriage" },
];

export function calculateJaimini(k: KundliResult, navamshaChart?: DivisionalChart, dwadashamshaChart?: DivisionalChart): JaiminiResult {
  // Use 7 grahas (exclude Rahu/Ketu) sorted by degree in sign, descending
  const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const candidates = k.planets
    .filter((p) => PLANET_ORDER.includes(p.id))
    .map((p) => ({ ...p, degree: p.degreeInSign }))
    .sort((a, b) => b.degree - a.degree);

  const ak = candidates[0];

  // Charakarakas (7 planets assigned to 7 roles in descending degree order)
  const charakarakas = candidates.slice(0, 7).map((p, i) => ({
    id: p.id,
    nameMr: p.nameMr,
    nameEn: p.name,
    karakaMr: CHARAKARAKA_ROLES[i].mr,
    karakaEn: CHARAKARAKA_ROLES[i].en,
    role: CHARAKARAKA_ROLES[i].id,
    roleMr: CHARAKARAKA_ROLES[i].roleMr,
    degree: Math.round(p.degree * 100) / 100,
  }));

  // Karakamsha = sign of AK in navamsha
  let karakamshaIdx = ak.rashiIndex;
  if (navamshaChart) {
    const akInD9 = navamshaChart.planets.find((p) => p.id === ak.id);
    if (akInD9) karakamshaIdx = akInD9.rashiIndex;
  }

  // Ishta Devata rashi = sign of AK in D12
  let ishtaIdx = ak.rashiIndex;
  if (dwadashamshaChart) {
    const akInD12 = dwadashamshaChart.planets.find((p) => p.id === ak.id);
    if (akInD12) ishtaIdx = akInD12.rashiIndex;
  }

  const deity = RASHI_DEITY[ishtaIdx];

  return {
    atmakarakaId: ak.id,
    atmakarakaNameMr: ak.nameMr,
    atmakarakaNameEn: ak.name,
    atmakarakaRashiMr: ak.rashiMr,
    atmakarakaRashiEn: ak.rashi,
    atmakarakaDegree: Math.round(ak.degree * 100) / 100,
    karakamshaRashiIndex: karakamshaIdx,
    karakamshaRashiMr: RASHIS[karakamshaIdx].mr,
    karakamshaRashiEn: RASHIS[karakamshaIdx].en,
    ishtaDevataRashiIndex: ishtaIdx,
    ishtaDevataRashiMr: RASHIS[ishtaIdx].mr,
    ishtaDevataRashiEn: RASHIS[ishtaIdx].en,
    ishtaDevataMr: deity.deityMr,
    ishtaDevataEn: deity.deityEn,
    ishtaDevataHi: deity.deityHi,
    mantraMr: deity.mantraMr,
    mantraEn: deity.mantraEn,
    significanceMr: deity.significanceMr,
    significanceEn: deity.significanceEn,
    significanceHi: deity.significanceHi,
    charakarakas,
  };
}

// ─── Mitra-Shatru Chakra (planetary friendship) ──────────────────

const NAISARGIKA_MITRA: Record<string, { mitra: string[]; shatru: string[]; sama: string[] }> = {
  Sun: { mitra: ["Moon", "Mars", "Jupiter"], shatru: ["Venus", "Saturn"], sama: ["Mercury"] },
  Moon: { mitra: ["Sun", "Mercury"], shatru: [], sama: ["Mars", "Jupiter", "Venus", "Saturn"] },
  Mars: { mitra: ["Sun", "Moon", "Jupiter"], shatru: ["Mercury"], sama: ["Venus", "Saturn"] },
  Mercury: { mitra: ["Sun", "Venus"], shatru: ["Moon"], sama: ["Mars", "Jupiter", "Saturn"] },
  Jupiter: { mitra: ["Sun", "Moon", "Mars"], shatru: ["Mercury", "Venus"], sama: ["Saturn"] },
  Venus: { mitra: ["Mercury", "Saturn"], shatru: ["Sun", "Moon"], sama: ["Mars", "Jupiter"] },
  Saturn: { mitra: ["Mercury", "Venus"], shatru: ["Sun", "Moon", "Mars"], sama: ["Jupiter"] },
};

export interface MitraShatruEntry {
  planetId: string;
  planetMr: string;
  planetEn: string;
  relations: Array<{
    otherId: string;
    otherMr: string;
    otherEn: string;
    naisargika: "मित्र" | "शत्रू" | "सम";
    naisargikaEn: "Mitra" | "Shatru" | "Sama";
    tatkalik: "मित्र" | "शत्रू" | "सम";
    tatkalikEn: "Mitra" | "Shatru" | "Sama";
    panchadha: string;           // 5-fold composite
    panchadhaEn: string;
  }>;
}

function getTatkalikFriend(p1: PlanetPosition, p2: PlanetPosition): "Mitra" | "Shatru" {
  // Tatkalik (temporary) friendship: planets in 2nd, 3rd, 4th, 10th, 11th, 12th from each other = friends
  const diff = ((p2.rashiIndex - p1.rashiIndex) + 12) % 12 + 1;
  const friendHouses = [2, 3, 4, 10, 11, 12];
  return friendHouses.includes(diff) ? "Mitra" : "Shatru";
}

function combinePanchadha(nais: string, tat: string): { mr: string; en: string } {
  // 5-fold composite (Panchadha Maitri)
  if (nais === "मित्र" && tat === "Mitra") return { mr: "अधिमित्र", en: "Adhimitra (Great Friend)" };
  if (nais === "शत्रू" && tat === "Shatru") return { mr: "अधिशत्रू", en: "Adhishatru (Great Enemy)" };
  if (nais === "सम" && tat === "Mitra") return { mr: "मित्र", en: "Mitra" };
  if (nais === "सम" && tat === "Shatru") return { mr: "शत्रू", en: "Shatru" };
  if ((nais === "मित्र" && tat === "Shatru") || (nais === "शत्रू" && tat === "Mitra")) return { mr: "सम", en: "Sama" };
  return { mr: "सम", en: "Sama" };
}

export function calculateMitraShatru(k: KundliResult): MitraShatruEntry[] {
  const PLANET_IDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const out: MitraShatruEntry[] = [];

  for (const pid of PLANET_IDS) {
    const p = k.planets.find((pp) => pp.id === pid);
    if (!p) continue;
    const rels = NAISARGIKA_MITRA[pid];
    const relations = [];
    for (const other of PLANET_IDS) {
      if (other === pid) continue;
      const op = k.planets.find((pp) => pp.id === other);
      if (!op) continue;
      let nais: "मित्र" | "शत्रू" | "सम" = "सम";
      let naisEn: "Mitra" | "Shatru" | "Sama" = "Sama";
      if (rels.mitra.includes(other)) { nais = "मित्र"; naisEn = "Mitra"; }
      else if (rels.shatru.includes(other)) { nais = "शत्रू"; naisEn = "Shatru"; }

      const tatEn = getTatkalikFriend(p, op);
      const tat = tatEn === "Mitra" ? "मित्र" : "शत्रू";
      const pancha = combinePanchadha(nais, tatEn);
      relations.push({
        otherId: other,
        otherMr: op.nameMr,
        otherEn: op.name,
        naisargika: nais,
        naisargikaEn: naisEn,
        tatkalik: tat as "मित्र" | "शत्रू",
        tatkalikEn: tatEn,
        panchadha: pancha.mr,
        panchadhaEn: pancha.en,
      });
    }
    out.push({
      planetId: pid,
      planetMr: p.nameMr,
      planetEn: p.name,
      relations,
    });
  }

  return out;
}
