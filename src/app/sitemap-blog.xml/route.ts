import fs from "fs";
import path from "path";
import { buildUrlset, xmlResponse, type SitemapEntry } from "@/lib/sitemap-builder";

export function GET() {
  const now = new Date();
  const entries: SitemapEntry[] = [
    { path: "/blog", lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];
  try {
    const blogDir = path.join(process.cwd(), "content/blog");
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        const slug = file.replace(".json", "");
        const stat = fs.statSync(path.join(blogDir, file));
        entries.push({
          path: `/blog/${slug}`,
          lastModified: stat.mtime,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // skip
  }
  return xmlResponse(buildUrlset(entries));
}
