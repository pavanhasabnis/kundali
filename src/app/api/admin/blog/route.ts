import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

async function checkAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return false;
  const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
  return user?.role === "admin";
}

// GET — list ALL blog posts (including temple guides) for admin
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!fs.existsSync(BLOG_DIR)) return NextResponse.json({ posts: [] });

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
  const posts = files.map((file) => {
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const post = JSON.parse(raw);
      return { slug: post.slug, title: post.title, titleEn: post.titleEn, category: post.category, categoryEn: post.categoryEn, date: post.date };
    } catch { return null; }
  }).filter(Boolean);

  posts.sort((a: any, b: any) => b.date.localeCompare(a.date));
  return NextResponse.json({ posts });
}

// POST — create new blog post
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { slug, title, titleEn, summary, summaryEn, date, category, categoryEn, content, contentEn } = body;

  if (!slug || !title || !date) {
    return NextResponse.json({ error: "slug, title, and date are required" }, { status: 400 });
  }

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post with this slug already exists" }, { status: 409 });
  }

  const post = { slug, title, titleEn: titleEn || title, summary: summary || "", summaryEn: summaryEn || "", date, category: category || "", categoryEn: categoryEn || "", content: content || "", contentEn: contentEn || "" };
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), "utf-8");

  return NextResponse.json({ success: true, slug });
}

// PUT — update existing blog post
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { slug, ...updates } = body;

  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const updated = { ...existing, ...updates, slug }; // slug cannot change
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}

// DELETE — delete blog post
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return NextResponse.json({ success: true });
}
