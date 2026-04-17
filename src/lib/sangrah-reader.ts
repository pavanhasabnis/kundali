/**
 * Server-side sangrah (devotional content) reader.
 * Reads JSON files from content/sangrah/ directory.
 */
import fs from "fs";
import path from "path";
import type { SangrahItem } from "./sangrah-types";

export { SANGRAH_CATEGORIES } from "./sangrah-types";
export type { SangrahItem, SangrahCategoryId } from "./sangrah-types";

const SANGRAH_DIR = path.join(process.cwd(), "content", "sangrah");

/** Read a single sangrah item by slug */
export function getSangrahItem(slug: string): SangrahItem | null {
  try {
    if (!fs.existsSync(SANGRAH_DIR)) return null;
    // Try exact filename match
    const filePath = path.join(SANGRAH_DIR, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    // Fallback: search all files for matching slug
    const files = fs.readdirSync(SANGRAH_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(SANGRAH_DIR, file), "utf-8"));
        if (data.slug === slug) return data;
      } catch { /* skip */ }
    }
    return null;
  } catch {
    return null;
  }
}

/** List all sangrah items, optionally filtered by category */
export function getAllSangrahItems(category?: string): SangrahItem[] {
  try {
    if (!fs.existsSync(SANGRAH_DIR)) return [];
    const files = fs.readdirSync(SANGRAH_DIR).filter((f) => f.endsWith(".json"));
    const items: SangrahItem[] = [];
    for (const file of files) {
      try {
        const data: SangrahItem = JSON.parse(fs.readFileSync(path.join(SANGRAH_DIR, file), "utf-8"));
        if (!category || data.category === category) {
          items.push(data);
        }
      } catch { /* skip malformed */ }
    }
    return items.sort((a, b) => a.title.localeCompare(b.title, "mr"));
  } catch {
    return [];
  }
}

/** Get all unique deities across items */
export function getAllDeities(category?: string): { id: string; mr: string; en: string }[] {
  const items = getAllSangrahItems(category);
  const deityMap = new Map<string, { mr: string; en: string }>();
  for (const item of items) {
    if (!deityMap.has(item.deity)) {
      deityMap.set(item.deity, { mr: item.deityMr, en: item.deityEn });
    }
  }
  return Array.from(deityMap.entries()).map(([id, labels]) => ({ id, ...labels }));
}

/** Get items count per category */
export function getSangrahCategoryCounts(): Record<string, number> {
  const items = getAllSangrahItems();
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  return counts;
}

/** Get all slugs for static generation */
export function getAllSangrahSlugs(): { category: string; slug: string }[] {
  const items = getAllSangrahItems();
  return items.map((item) => ({ category: item.category, slug: item.slug }));
}
