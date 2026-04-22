export type ReelBackground = {
  id: string;
  label: string;
  gradient: string;
  starOpacity: number;
  starColor: string;
  accentGold: string;
};

export const BACKGROUNDS: ReelBackground[] = [
  // --- January (weeks 1-4) — Winter maroon / new year ---
  { id: "maroon-classic",    label: "Maroon Classic",     gradient: "radial-gradient(ellipse at 30% 20%, #5c1a1a 0%, #3d0c0c 40%, #1a0505 100%)", starOpacity: 0.4,  starColor: "#ffffff", accentGold: "#d4a843" },
  { id: "midnight-blue",     label: "Midnight Blue",      gradient: "radial-gradient(ellipse at 70% 30%, #1e3a5f 0%, #0f1e3d 45%, #050815 100%)", starOpacity: 0.6,  starColor: "#ffffff", accentGold: "#f5c543" },
  { id: "frost-silver",      label: "Frost Silver",       gradient: "radial-gradient(ellipse at 50% 30%, #2a3a52 0%, #151f30 45%, #050a14 100%)", starOpacity: 0.7,  starColor: "#e0eaff", accentGold: "#b8c5d4" },
  { id: "ink-violet",        label: "Ink Violet",         gradient: "radial-gradient(ellipse at 40% 35%, #2d1a4d 0%, #180a2b 50%, #080412 100%)", starOpacity: 0.65, starColor: "#d8c5ff", accentGold: "#c5a8ff" },

  // --- February (weeks 5-8) — Royal / devotional ---
  { id: "royal-purple",      label: "Royal Purple",       gradient: "radial-gradient(ellipse at 60% 20%, #3d1a5c 0%, #220d3d 50%, #0a0518 100%)", starOpacity: 0.7,  starColor: "#ffffff", accentGold: "#e8c266" },
  { id: "deep-indigo",       label: "Deep Indigo",        gradient: "radial-gradient(ellipse at 45% 25%, #1a1a5c 0%, #0d0d3d 50%, #050518 100%)", starOpacity: 0.65, starColor: "#d5d5ff", accentGold: "#e0c566" },
  { id: "rose-nebula",       label: "Rose Nebula",        gradient: "radial-gradient(ellipse at 65% 35%, #7a1f3a 0%, #4a0f24 45%, #1a050d 100%)", starOpacity: 0.5,  starColor: "#ffd5e5", accentGold: "#f5c5a8" },
  { id: "lotus-bloom",       label: "Lotus Bloom",        gradient: "radial-gradient(ellipse at 55% 30%, #5c1a3d 0%, #2e0d1f 50%, #0f050a 100%)", starOpacity: 0.45, starColor: "#ffe0f0", accentGold: "#f5a8c5" },

  // --- March (weeks 9-12) — Holi / Gudi Padwa ---
  { id: "saffron-dawn",      label: "Saffron Dawn",       gradient: "radial-gradient(ellipse at 50% 10%, #8b3a0f 0%, #5c1f0a 50%, #1f0a05 100%)", starOpacity: 0.3,  starColor: "#ffe4b8", accentGold: "#ffd27a" },
  { id: "holi-fuchsia",      label: "Holi Fuchsia",       gradient: "radial-gradient(ellipse at 55% 30%, #8b1a5c 0%, #5c0d3d 50%, #1f0512 100%)", starOpacity: 0.4,  starColor: "#ffd5ee", accentGold: "#ffb8e0" },
  { id: "holi-turmeric",     label: "Holi Turmeric",      gradient: "radial-gradient(ellipse at 40% 40%, #8b5c0f 0%, #5c3d0a 50%, #1f1405 100%)", starOpacity: 0.35, starColor: "#fff2c5", accentGold: "#ffe08a" },
  { id: "gudi-padwa-gold",   label: "Gudi Padwa Gold",    gradient: "radial-gradient(ellipse at 50% 20%, #a8670f 0%, #6b3d08 50%, #241505 100%)", starOpacity: 0.4,  starColor: "#fff0c5", accentGold: "#ffc940" },

  // --- April (weeks 13-16) — Spring / forest ---
  { id: "forest-mystic",     label: "Forest Mystic",      gradient: "radial-gradient(ellipse at 40% 30%, #1a4d2e 0%, #0d2818 50%, #05100a 100%)", starOpacity: 0.5,  starColor: "#d9f5e3", accentGold: "#c9a959" },
  { id: "spring-emerald",    label: "Spring Emerald",     gradient: "radial-gradient(ellipse at 55% 25%, #0d5c3d 0%, #073d28 50%, #021812 100%)", starOpacity: 0.55, starColor: "#c5ffde", accentGold: "#d4c566" },
  { id: "sage-meadow",       label: "Sage Meadow",        gradient: "radial-gradient(ellipse at 45% 40%, #3d5c2e 0%, #283d1f 50%, #101805 100%)", starOpacity: 0.45, starColor: "#e5ffc5", accentGold: "#e0d466" },
  { id: "jade-temple",       label: "Jade Temple",        gradient: "radial-gradient(ellipse at 50% 30%, #0f5c52 0%, #073d36 50%, #02181a 100%)", starOpacity: 0.6,  starColor: "#c5fff0", accentGold: "#d4c466" },

  // --- May (weeks 17-20) — Teal / ocean ---
  { id: "cosmic-teal",       label: "Cosmic Teal",        gradient: "radial-gradient(ellipse at 35% 40%, #0d4d4d 0%, #05282e 50%, #020f12 100%)", starOpacity: 0.55, starColor: "#b5f5f0", accentGold: "#e0c566" },
  { id: "deep-ocean",        label: "Deep Ocean",         gradient: "radial-gradient(ellipse at 45% 25%, #0a2545 0%, #05152b 50%, #010610 100%)", starOpacity: 0.6,  starColor: "#ffffff", accentGold: "#d4c466" },
  { id: "azure-sky",         label: "Azure Sky",          gradient: "radial-gradient(ellipse at 50% 20%, #0f3d6b 0%, #072a4d 50%, #02101f 100%)", starOpacity: 0.65, starColor: "#d5eaff", accentGold: "#f5c543" },
  { id: "turquoise-depth",   label: "Turquoise Depth",    gradient: "radial-gradient(ellipse at 40% 30%, #0f5c6b 0%, #073d4a 50%, #02181f 100%)", starOpacity: 0.55, starColor: "#c5f0ff", accentGold: "#e0d066" },

  // --- June (weeks 21-24) — Monsoon approach ---
  { id: "storm-cobalt",      label: "Storm Cobalt",       gradient: "radial-gradient(ellipse at 40% 25%, #1a2e5c 0%, #0d1a3d 50%, #050812 100%)", starOpacity: 0.6,  starColor: "#d5e0ff", accentGold: "#c5b866" },
  { id: "monsoon-gray",      label: "Monsoon Gray",       gradient: "radial-gradient(ellipse at 50% 20%, #2d3845 0%, #171d28 50%, #070a10 100%)", starOpacity: 0.55, starColor: "#e0eaf5", accentGold: "#b8c5d4" },
  { id: "raincloud-slate",   label: "Raincloud Slate",    gradient: "radial-gradient(ellipse at 45% 30%, #3d4a5c 0%, #1f2838 50%, #0a0e18 100%)", starOpacity: 0.5,  starColor: "#e5eaf0", accentGold: "#b0c0d0" },
  { id: "peacock-blue",      label: "Peacock Blue",       gradient: "radial-gradient(ellipse at 55% 25%, #0d3d5c 0%, #072845 50%, #02101f 100%)", starOpacity: 0.6,  starColor: "#c5eaff", accentGold: "#e0c566" },

  // --- July (weeks 25-28) — Guru Purnima devotional ---
  { id: "temple-gold",       label: "Temple Gold",        gradient: "radial-gradient(ellipse at 50% 50%, #3d2a0c 0%, #1f1505 45%, #0a0702 100%)", starOpacity: 0.4,  starColor: "#ffeaa8", accentGold: "#f5d875" },
  { id: "brass-devotion",    label: "Brass Devotion",     gradient: "radial-gradient(ellipse at 45% 35%, #6b4a1a 0%, #3d2810 50%, #180f05 100%)", starOpacity: 0.45, starColor: "#ffe8b8", accentGold: "#ffce66" },
  { id: "incense-smoke",     label: "Incense Smoke",      gradient: "radial-gradient(ellipse at 50% 40%, #3d2d3d 0%, #1f171f 50%, #0a080a 100%)", starOpacity: 0.5,  starColor: "#e8d8e8", accentGold: "#d4b866" },
  { id: "ghee-warm",         label: "Ghee Warm",          gradient: "radial-gradient(ellipse at 50% 30%, #5c3d1a 0%, #3d280f 50%, #181005 100%)", starOpacity: 0.4,  starColor: "#ffe4c5", accentGold: "#ffd27a" },

  // --- August (weeks 29-32) — Shravan / Nag Panchami ---
  { id: "shravan-sapphire",  label: "Shravan Sapphire",   gradient: "radial-gradient(ellipse at 40% 30%, #0f2a6b 0%, #071a45 50%, #020818 100%)", starOpacity: 0.65, starColor: "#d5e5ff", accentGold: "#f5c543" },
  { id: "sandalwood-cream",  label: "Sandalwood Cream",   gradient: "radial-gradient(ellipse at 50% 35%, #6b5c3d 0%, #3d3d28 50%, #181805 100%)", starOpacity: 0.35, starColor: "#fff5c5", accentGold: "#ffe08a" },
  { id: "serpent-emerald",   label: "Serpent Emerald",    gradient: "radial-gradient(ellipse at 55% 30%, #0d4d3d 0%, #073d28 50%, #021810 100%)", starOpacity: 0.55, starColor: "#c5ffde", accentGold: "#e0d066" },
  { id: "mandala-bronze",    label: "Mandala Bronze",     gradient: "radial-gradient(ellipse at 45% 25%, #6b3d1a 0%, #3d280f 50%, #180f05 100%)", starOpacity: 0.4,  starColor: "#ffd8b8", accentGold: "#ffb866" },

  // --- September (weeks 33-36) — Ganesh Chaturthi ---
  { id: "ganesh-crimson",    label: "Ganesh Crimson",     gradient: "radial-gradient(ellipse at 50% 25%, #a81f1a 0%, #6b0f0d 50%, #240505 100%)", starOpacity: 0.45, starColor: "#ffd8d5", accentGold: "#ffce66" },
  { id: "modak-yellow",      label: "Modak Yellow",       gradient: "radial-gradient(ellipse at 45% 35%, #8b6b0f 0%, #5c4808 50%, #1f1805 100%)", starOpacity: 0.45, starColor: "#fff5a8", accentGold: "#ffe040" },
  { id: "durva-green",       label: "Durva Green",        gradient: "radial-gradient(ellipse at 50% 30%, #2a6b1a 0%, #1a4810 50%, #091805 100%)", starOpacity: 0.5,  starColor: "#e0ffc5", accentGold: "#e0e066" },
  { id: "sindoor-red",       label: "Sindoor Red",        gradient: "radial-gradient(ellipse at 55% 25%, #8b1f2e 0%, #5c0f1c 50%, #1f050a 100%)", starOpacity: 0.4,  starColor: "#ffd5dd", accentGold: "#ffc566" },

  // --- October (weeks 37-41) — Navratri / Dussehra ---
  { id: "navratri-red",      label: "Navratri Red",       gradient: "radial-gradient(ellipse at 45% 30%, #8b0d1a 0%, #5c050f 50%, #1f0205 100%)", starOpacity: 0.5,  starColor: "#ffd5d5", accentGold: "#ffce66" },
  { id: "navratri-orange",   label: "Navratri Orange",    gradient: "radial-gradient(ellipse at 50% 25%, #8b4a0f 0%, #5c2f08 50%, #1f1005 100%)", starOpacity: 0.45, starColor: "#ffe4b8", accentGold: "#ff9e40" },
  { id: "navratri-yellow",   label: "Navratri Yellow",    gradient: "radial-gradient(ellipse at 55% 30%, #a8850f 0%, #6b5608 50%, #241c05 100%)", starOpacity: 0.45, starColor: "#fff5a8", accentGold: "#ffd640" },
  { id: "dussehra-royal",    label: "Dussehra Royal",     gradient: "radial-gradient(ellipse at 50% 25%, #5c1a8b 0%, #3d0d5c 50%, #14051f 100%)", starOpacity: 0.6,  starColor: "#e8d5ff", accentGold: "#ffce66" },
  { id: "dussehra-saffron",  label: "Dussehra Saffron",   gradient: "radial-gradient(ellipse at 50% 20%, #a85c0f 0%, #6b3a08 50%, #241405 100%)", starOpacity: 0.4,  starColor: "#ffe0b8", accentGold: "#ff9e2e" },

  // --- November (weeks 42-45) — Diwali cluster ---
  { id: "diwali-lamp",       label: "Diwali Lamp",        gradient: "radial-gradient(ellipse at 50% 40%, #8b5c0f 0%, #5c3d08 50%, #1f1405 100%)", starOpacity: 0.5,  starColor: "#fff5a8", accentGold: "#ffc940" },
  { id: "diwali-marigold",   label: "Diwali Marigold",    gradient: "radial-gradient(ellipse at 45% 30%, #a8670f 0%, #6b4208 50%, #241605 100%)", starOpacity: 0.45, starColor: "#ffe4b8", accentGold: "#ff9e2e" },
  { id: "diwali-lakshmi",    label: "Diwali Lakshmi",     gradient: "radial-gradient(ellipse at 50% 25%, #a81a5c 0%, #6b0d3d 50%, #240512 100%)", starOpacity: 0.45, starColor: "#ffd5ee", accentGold: "#ffce66" },
  { id: "diwali-midnight",   label: "Diwali Midnight",    gradient: "radial-gradient(ellipse at 40% 25%, #2a0d4d 0%, #180528 50%, #080212 100%)", starOpacity: 0.75, starColor: "#ffe8a8", accentGold: "#ffd640" },

  // --- Late Nov / Early Dec (weeks 46-49) — Post-festival calm ---
  { id: "volcanic-ember",    label: "Volcanic Ember",     gradient: "radial-gradient(ellipse at 40% 45%, #6b1a05 0%, #3d0a02 50%, #1a0401 100%)", starOpacity: 0.35, starColor: "#ffb588", accentGold: "#ffa84d" },
  { id: "dusk-amber",        label: "Dusk Amber",         gradient: "radial-gradient(ellipse at 55% 30%, #6b3d0d 0%, #3d2208 50%, #180e05 100%)", starOpacity: 0.4,  starColor: "#ffd8a8", accentGold: "#ffb866" },
  { id: "winter-plum",       label: "Winter Plum",        gradient: "radial-gradient(ellipse at 50% 30%, #3d1a3d 0%, #280d28 50%, #0a040a 100%)", starOpacity: 0.55, starColor: "#e8d5e8", accentGold: "#e0c566" },
  { id: "charcoal-moon",     label: "Charcoal Moon",      gradient: "radial-gradient(ellipse at 45% 20%, #1f2838 0%, #0f1520 50%, #05080f 100%)", starOpacity: 0.7,  starColor: "#ffffff", accentGold: "#d4c466" },

  // --- December (weeks 50-52) — Solstice / year end ---
  { id: "solstice-navy",     label: "Solstice Navy",      gradient: "radial-gradient(ellipse at 50% 25%, #0d1a3d 0%, #050e24 50%, #010510 100%)", starOpacity: 0.75, starColor: "#ffffff", accentGold: "#f5c543" },
  { id: "year-end-wine",     label: "Year-End Wine",      gradient: "radial-gradient(ellipse at 55% 30%, #5c0d2e 0%, #3d051a 50%, #18020a 100%)", starOpacity: 0.5,  starColor: "#ffd5dd", accentGold: "#ffce66" },
  { id: "winter-obsidian",   label: "Winter Obsidian",    gradient: "radial-gradient(ellipse at 40% 30%, #1a1a28 0%, #0d0d18 50%, #050508 100%)", starOpacity: 0.8,  starColor: "#ffffff", accentGold: "#e0c566" },
];

export function getIsoWeek(date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeekBackground(date = new Date()): ReelBackground {
  const week = getIsoWeek(date);
  return BACKGROUNDS[(week - 1) % BACKGROUNDS.length];
}

export function getWeekRange(weekNumber: number, year = new Date().getFullYear()): { start: Date; end: Date } {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setUTCDate(jan4.getUTCDate() - jan4Day + 1 + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  return { start: weekStart, end: weekEnd };
}
