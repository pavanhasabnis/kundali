import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { TEMPLE_BLOG_MAP } from "@/lib/blog-reader";
import { getAllSangrahItems, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";
import { RASHI_LIST } from "@/lib/rashi-data";

const BASE = "https://bhaagyavedh.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with priorities
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/kundli`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rashifal`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/matching`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/panchang`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/calendar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/muhurat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/graha-sthiti`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/consultation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pooja-services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/yatra`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/temples`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Dynamic blog posts from content/blog/*.json
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogDir = path.join(process.cwd(), "content/blog");
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
      blogPages = files.map((file) => {
        const slug = file.replace(".json", "");
        const stat = fs.statSync(path.join(blogDir, file));
        return {
          url: `${BASE}/blog/${slug}`,
          lastModified: stat.mtime,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      });
    }
  } catch {
    // Skip if blog dir not available
  }

  // Yatra categories
  const yatraCategories = [
    "jyotirlinga", "char-dham", "ashtavinayak", "shakti-peeth", "panch-prayag",
  ];
  const yatraPages: MetadataRoute.Sitemap = yatraCategories.map((cat) => ({
    url: `${BASE}/yatra/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Temple pages — all temples from TEMPLE_BLOG_MAP
  const templeIds = Object.keys(TEMPLE_BLOG_MAP);
  const templePages: MetadataRoute.Sitemap = templeIds.map((id) => ({
    url: `${BASE}/temples/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Sangrah pages
  const sangrahMain: MetadataRoute.Sitemap = [
    { url: `${BASE}/sangrah`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];
  const sangrahCategoryPages: MetadataRoute.Sitemap = SANGRAH_CATEGORIES.map((cat) => ({
    url: `${BASE}/sangrah/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const sangrahItems = getAllSangrahItems();
  const sangrahDetailPages: MetadataRoute.Sitemap = sangrahItems.map((item) => ({
    url: `${BASE}/sangrah/${item.category}/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Individual rashi pages — daily horoscope for each zodiac sign
  const rashiPages: MetadataRoute.Sitemap = RASHI_LIST.map((r) => ({
    url: `${BASE}/rashifal/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...rashiPages, ...blogPages, ...yatraPages, ...templePages, ...sangrahMain, ...sangrahCategoryPages, ...sangrahDetailPages];
}
