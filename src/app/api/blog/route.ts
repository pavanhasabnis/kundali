import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface BlogFaq {
  questionMr: string;
  questionEn: string;
  answerMr: string;
  answerEn: string;
}

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  keywordsMr: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  date: string;
  category: string;
  categoryEn: string;
  content: string;
  contentEn: string;
  seo?: BlogSeo;
  faq?: BlogFaq[];
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const post = JSON.parse(raw) as BlogPost;
      posts.push(post);
    } catch {
      // skip malformed files
    }
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const allPosts = readAllPosts();

  // Single post by slug (includes temple posts for detail pages)
  if (slug) {
    const post = allPosts.find((p) => p.slug === slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  // Paginated list — exclude temple guide posts (shown on /temples page, not blog)
  const blogPosts = allPosts.filter((p) => p.categoryEn !== "Temple Guide");
  const total = blogPosts.length;
  const start = (page - 1) * limit;
  const posts = blogPosts.slice(start, start + limit).map(({ content, contentEn, ...rest }) => rest);

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
