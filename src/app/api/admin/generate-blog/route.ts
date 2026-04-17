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

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { prompt } = await req.json();
  if (!prompt || prompt.trim().length < 5) {
    return NextResponse.json({ error: "Please enter a topic/prompt (at least 5 characters)" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured in .env.local" }, { status: 500 });
  }

  try {
    const systemPrompt = `You are an expert Vedic astrology content writer and SEO specialist for a Marathi astrology website "Bhaagyavedh".
Generate a blog article with full SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) parameters. Return ONLY valid JSON (no markdown, no code fences) with this exact structure:

{
  "titleMr": "Marathi title (SEO-optimized, include primary keyword)",
  "titleEn": "English title (SEO-optimized, include primary keyword, max 60 chars)",
  "summaryMr": "2-3 line Marathi summary (meta description, include keywords)",
  "summaryEn": "2-3 line English summary (meta description, 150-160 chars, include keywords)",
  "category": "Marathi category name",
  "categoryEn": "English category name (one of: Astrology, Horoscope, Planets, Dosha, Remedies, Puja, Festival, Panchang, Marriage, Vastu)",
  "contentMr": "Full Marathi article with ## headings and ### subheadings, 500-700 words",
  "contentEn": "Full English article with ## headings and ### subheadings, 500-700 words",
  "seo": {
    "metaTitle": "SEO title tag (max 60 chars, include primary keyword)",
    "metaDescription": "Meta description (150-160 chars, compelling with CTA)",
    "keywords": ["10-15 targeted English keywords and phrases for this topic"],
    "keywordsMr": ["5-8 Marathi keywords for this topic"]
  },
  "faq": [
    {
      "questionMr": "Marathi FAQ question",
      "questionEn": "English FAQ question (what people search on Google)",
      "answerMr": "Marathi answer (2-3 sentences, informative)",
      "answerEn": "English answer (2-3 sentences, direct and informative)"
    }
  ]
}

Requirements:
- Both Marathi and English content must be 500-700 words each
- Use proper Vedic astrology terminology
- Include practical remedies/tips where applicable
- Use ## for main sections and ### for subsections
- Use - for bullet points
- Content must be original, detailed, and informative
- Marathi should be natural Devanagari, not transliteration

SEO Requirements:
- Title must include the primary keyword naturally
- Meta description must be compelling with a call-to-action
- Keywords must include trending search terms (e.g., "horoscope today", "kundli", zodiac sign names)
- Include long-tail keywords people actually search for

AEO Requirements (for Google featured snippets & AI answers):
- Generate exactly 4-5 FAQ items per article
- Questions should be what people actually search on Google (use "How", "What", "Why", "When" format)
- Answers should be concise, direct, and informative (2-3 sentences)
- FAQs should cover the main topic from different angles

GEO Requirements (for AI engines like ChatGPT, Gemini, Perplexity):
- Content should have clear, authoritative statements that AI can cite
- Use structured headings that answer specific questions
- Include factual, quotable sentences at the start of each section`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          { role: "user", content: `Write a detailed astrology blog article about: ${prompt}` },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `API error: ${response.status} — ${errText.substring(0, 200)}` }, { status: 500 });
    }

    const aiData = await response.json();
    const text = aiData.content?.[0]?.text || "";

    // Parse JSON from response
    let article;
    try {
      article = JSON.parse(text);
    } catch {
      // Try extracting JSON from response if wrapped in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        article = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json({ error: "Failed to parse AI response. Try again." }, { status: 500 });
      }
    }

    // Validate required fields
    if (!article.titleEn || !article.contentMr || !article.contentEn) {
      return NextResponse.json({ error: "AI response missing required fields. Try again." }, { status: 500 });
    }

    // Create slug and save
    const today = new Date().toISOString().slice(0, 10);
    const slug = `${today}-${article.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").substring(0, 60)}`;
    const filePath = path.join(BLOG_DIR, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "An article with this title already exists for today", slug }, { status: 409 });
    }

    if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

    const post = {
      slug,
      title: article.titleMr || article.titleEn,
      titleEn: article.titleEn,
      summary: article.summaryMr || "",
      summaryEn: article.summaryEn || "",
      date: today,
      category: article.category || "",
      categoryEn: article.categoryEn || "Astrology",
      content: article.contentMr,
      contentEn: article.contentEn,
      seo: article.seo || null,
      faq: article.faq || [],
    };

    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), "utf-8");

    return NextResponse.json({ success: true, slug, title: post.titleEn });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate article" }, { status: 500 });
  }
}
