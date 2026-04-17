import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";
import { RASHI_LIST } from "@/lib/rashi-data";

export function GET() {
  const now = new Date();
  const entries: SitemapEntry[] = RASHI_LIST.map((r) => ({
    path: `/rashifal/${r.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));
  return xmlResponse(buildUrlset(entries));
}
