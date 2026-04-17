import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";

export function GET() {
  const now = new Date();
  const entries: SitemapEntry[] = [
    { path: "/", lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { path: "/kundli", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { path: "/rashifal", lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { path: "/matching", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { path: "/panchang", lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { path: "/calendar", lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { path: "/muhurat", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/graha-sthiti", lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { path: "/compare", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { path: "/consultation", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/pooja-services", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/about", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { path: "/disclaimer", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
  return xmlResponse(buildUrlset(entries));
}
