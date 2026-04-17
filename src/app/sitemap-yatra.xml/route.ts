import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";

const YATRA_CATEGORIES = ["jyotirlinga", "char-dham", "ashtavinayak", "shakti-peeth", "panch-prayag"];

export function GET() {
  const now = new Date();
  const entries: SitemapEntry[] = [
    { path: "/yatra", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...YATRA_CATEGORIES.map<SitemapEntry>((cat) => ({
      path: `/yatra/${cat}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
  return xmlResponse(buildUrlset(entries));
}
