import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { TEMPLE_BLOG_MAP } from "@/lib/blog-reader";
import { getAllSangrahItems, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";
import { RASHI_LIST } from "@/lib/rashi-data";

const BASE = "https://bhaagyavedh.com";

type Entry = {
  path: string;
  lastModified?: Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

function withLangs(entries: Entry[]): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const mr = `${BASE}/mr${e.path === "/" ? "" : e.path}`;
    const en = `${BASE}/en${e.path === "/" ? "" : e.path}`;
    const alternates = { languages: { "mr-IN": mr, "en-IN": en, "x-default": mr } };
    out.push({
      url: mr,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates,
    });
    out.push({
      url: en,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates,
    });
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: Entry[] = [
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
    { path: "/yatra", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/temples", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/blog", lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { path: "/sangrah", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/about", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { path: "/disclaimer", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Blog posts
  let blogEntries: Entry[] = [];
  try {
    const blogDir = path.join(process.cwd(), "content/blog");
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
      blogEntries = files.map((file) => {
        const slug = file.replace(".json", "");
        const stat = fs.statSync(path.join(blogDir, file));
        return { path: `/blog/${slug}`, lastModified: stat.mtime, changeFrequency: "weekly", priority: 0.7 };
      });
    }
  } catch {
    // skip
  }

  // Yatra categories
  const yatraCategories = ["jyotirlinga", "char-dham", "ashtavinayak", "shakti-peeth", "panch-prayag"];
  const yatraEntries: Entry[] = yatraCategories.map((cat) => ({
    path: `/yatra/${cat}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Temple detail pages
  const templeEntries: Entry[] = Object.keys(TEMPLE_BLOG_MAP).map((id) => ({
    path: `/temples/${id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Sangrah category + detail pages
  const sangrahCategoryEntries: Entry[] = SANGRAH_CATEGORIES.map((cat) => ({
    path: `/sangrah/${cat.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const sangrahDetailEntries: Entry[] = getAllSangrahItems().map((item) => ({
    path: `/sangrah/${item.category}/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Rashi pages (12 signs)
  const rashiEntries: Entry[] = RASHI_LIST.map((r) => ({
    path: `/rashifal/${r.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return withLangs([
    ...staticEntries,
    ...rashiEntries,
    ...blogEntries,
    ...yatraEntries,
    ...templeEntries,
    ...sangrahCategoryEntries,
    ...sangrahDetailEntries,
  ]);
}
