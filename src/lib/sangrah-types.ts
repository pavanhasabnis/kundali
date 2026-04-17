/**
 * Shared types and constants for sangrah (devotional content).
 * Safe to import in both server and client components.
 */

export interface SangrahItem {
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  deity: string;
  deityMr: string;
  deityEn: string;
  content: string;
  transliteration: string;
  meaningMr: string;
  meaningEn: string;
  benefits: string;
  benefitsEn: string;
  tags: string[];
}

export const SANGRAH_CATEGORIES = [
  { id: "aarti", labelMr: "आरती संग्रह", labelEn: "Aarti Collection", icon: "🪔", description: "देवतांच्या आरत्या", descriptionEn: "Aartis of Hindu deities" },
  { id: "stotra", labelMr: "स्तोत्र संग्रह", labelEn: "Stotra Collection", icon: "📿", description: "स्तोत्रे आणि सूक्ते", descriptionEn: "Stotras and Suktas" },
  { id: "chalisa", labelMr: "चालीसा संग्रह", labelEn: "Chalisa Collection", icon: "📖", description: "चालीसा संग्रह", descriptionEn: "Chalisas of deities" },
  { id: "mantra", labelMr: "मंत्र संग्रह", labelEn: "Mantra Collection", icon: "🕉️", description: "बीज मंत्र आणि नवग्रह मंत्र", descriptionEn: "Beej mantras and Navagraha mantras" },
  { id: "vrat-katha", labelMr: "व्रत कथा", labelEn: "Vrat Katha", icon: "🙏", description: "व्रत कथा आणि महत्व", descriptionEn: "Fasting stories and significance" },
  { id: "nitya-pathan", labelMr: "नित्य पठण", labelEn: "Daily Prayers", icon: "🌅", description: "दैनंदिन प्रार्थना आणि श्लोक", descriptionEn: "Daily prayers and shlokas" },
  { id: "namavali", labelMr: "नामावली", labelEn: "Namavali", icon: "✨", description: "अष्टोत्तर शतनामावली", descriptionEn: "108 names of deities" },
] as const;

export type SangrahCategoryId = (typeof SANGRAH_CATEGORIES)[number]["id"];
