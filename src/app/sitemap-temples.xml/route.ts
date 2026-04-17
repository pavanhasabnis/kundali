import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";
import { TEMPLE_BLOG_MAP } from "@/lib/blog-reader";

export function GET() {
  const now = new Date();
  const entries: SitemapEntry[] = [
    { path: "/temples", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...Object.keys(TEMPLE_BLOG_MAP).map<SitemapEntry>((id) => ({
      path: `/temples/${id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
  return xmlResponse(buildUrlset(entries));
}
