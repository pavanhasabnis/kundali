type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapEntry {
  path: string;
  lastModified?: Date;
  changeFrequency?: Freq;
  priority?: number;
}

export const BASE = "https://bhaagyavedh.com";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildUrlset(entries: SitemapEntry[]): string {
  const urls: string[] = [];
  for (const e of entries) {
    const mr = `${BASE}/mr${e.path === "/" ? "" : e.path}`;
    const en = `${BASE}/en${e.path === "/" ? "" : e.path}`;
    const hi = `${BASE}/hi${e.path === "/" ? "" : e.path}`;
    const lastmod = e.lastModified ? e.lastModified.toISOString() : undefined;
    const alt = [
      `    <xhtml:link rel="alternate" hreflang="mr-IN" href="${escape(mr)}" />`,
      `    <xhtml:link rel="alternate" hreflang="en-IN" href="${escape(en)}" />`,
      `    <xhtml:link rel="alternate" hreflang="hi-IN" href="${escape(hi)}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(mr)}" />`,
    ].join("\n");

    for (const loc of [mr, en, hi]) {
      const parts = [`    <loc>${escape(loc)}</loc>`, alt];
      if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
      if (e.changeFrequency) parts.push(`    <changefreq>${e.changeFrequency}</changefreq>`);
      if (e.priority !== undefined) parts.push(`    <priority>${e.priority}</priority>`);
      urls.push(`  <url>\n${parts.join("\n")}\n  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
}

export function buildSitemapIndex(sitemaps: { loc: string; lastmod?: Date }[]): string {
  const items = sitemaps
    .map((s) => {
      const parts = [`    <loc>${escape(s.loc)}</loc>`];
      if (s.lastmod) parts.push(`    <lastmod>${s.lastmod.toISOString()}</lastmod>`);
      return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
