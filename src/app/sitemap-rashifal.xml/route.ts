import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";
import { RASHI_LIST } from "@/lib/rashi-data";
import { getWeekStart } from "@/lib/astrology/gochar-weekly";

export const revalidate = 3600;

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function GET() {
  const entries: SitemapEntry[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  // Daily per-sign: today + past 7 days × 12 rashis.
  for (let offset = -7; offset <= 0; offset++) {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    const dateIso = iso(d);
    const isToday = offset === 0;
    for (const r of RASHI_LIST) {
      entries.push({
        path: `/rashifal/${r.slug}/${dateIso}`,
        lastModified: d,
        changeFrequency: isToday ? "daily" : "monthly",
        priority: isToday ? 0.9 : 0.5,
      });
    }
  }

  // Weekly per-sign: current week + past 4 weeks × 12 rashis.
  const thisMonday = getWeekStart(base);
  for (let wOffset = -4; wOffset <= 0; wOffset++) {
    const monday = new Date(thisMonday);
    monday.setDate(monday.getDate() + wOffset * 7);
    const weekIso = iso(monday);
    const isCurrent = wOffset === 0;
    for (const r of RASHI_LIST) {
      entries.push({
        path: `/rashifal/saptahik/${r.slug}/${weekIso}`,
        lastModified: monday,
        changeFrequency: isCurrent ? "weekly" : "monthly",
        priority: isCurrent ? 0.8 : 0.5,
      });
    }
  }

  return xmlResponse(buildUrlset(entries));
}
