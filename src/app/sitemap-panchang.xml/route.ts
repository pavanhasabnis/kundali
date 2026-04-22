import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";

export const revalidate = 3600;

export function GET() {
  const entries: SitemapEntry[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  // Rolling window: previous 30 days + next 60 days.
  for (let offset = -30; offset <= 60; offset++) {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${day}`;
    const isToday = offset === 0;
    entries.push({
      path: `/panchang/${iso}`,
      lastModified: d,
      changeFrequency: isToday ? "daily" : "monthly",
      priority: offset < 0 ? 0.4 : isToday ? 0.9 : 0.6,
    });
  }

  return xmlResponse(buildUrlset(entries));
}
