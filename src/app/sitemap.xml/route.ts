import { buildSitemapIndex, xmlResponse, BASE } from "@/lib/sitemap-builder";

export function GET() {
  const now = new Date();
  const xml = buildSitemapIndex([
    { loc: `${BASE}/sitemap-pages.xml`, lastmod: now },
    { loc: `${BASE}/sitemap-rashi.xml`, lastmod: now },
    { loc: `${BASE}/sitemap-blog.xml`, lastmod: now },
    { loc: `${BASE}/sitemap-temples.xml`, lastmod: now },
    { loc: `${BASE}/sitemap-sangrah.xml`, lastmod: now },
    { loc: `${BASE}/sitemap-yatra.xml`, lastmod: now },
  ]);
  return xmlResponse(xml);
}
