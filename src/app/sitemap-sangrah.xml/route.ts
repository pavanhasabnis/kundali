import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";
import { getAllSangrahItems, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";

export function GET() {
  const now = new Date();
  const entries: SitemapEntry[] = [
    { path: "/sangrah", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...SANGRAH_CATEGORIES.map<SitemapEntry>((cat) => ({
      path: `/sangrah/${cat.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...getAllSangrahItems().map<SitemapEntry>((item) => ({
      path: `/sangrah/${item.category}/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
  return xmlResponse(buildUrlset(entries));
}
