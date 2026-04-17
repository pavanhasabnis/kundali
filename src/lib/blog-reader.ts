/**
 * Server-side blog post reader for generateMetadata and SSR.
 * Reads JSON files from content/blog/ directory.
 */
import fs from "fs";
import path from "path";

export interface BlogPostData {
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
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    keywordsMr: string[];
  };
  faq?: {
    questionMr: string;
    questionEn: string;
    answerMr: string;
    answerEn: string;
  }[];
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Read a single blog post by slug (checks filename first, then slug field) */
export function getBlogPost(slug: string): BlogPostData | null {
  try {
    // Try exact filename match first
    const filePath = path.join(BLOG_DIR, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    // Fallback: search all files for matching slug field
    if (!fs.existsSync(BLOG_DIR)) return null;
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, file), "utf-8"));
        if (data.slug === slug) return data;
      } catch { /* skip */ }
    }
    return null;
  } catch {
    return null;
  }
}

/** List all blog posts (sorted by date descending) */
export function getAllBlogPosts(): BlogPostData[] {
  try {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
    const posts: BlogPostData[] = [];
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, file), "utf-8"));
        posts.push(data);
      } catch {
        /* skip malformed */
      }
    }
    return posts.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

/** Temple ID → blog slug mapping (used by temple detail pages) */
export const TEMPLE_BLOG_MAP: Record<string, string> = {
  // Jyotirlinga (Maharashtra)
  "trimbakeshwar": "2026-04-15-trimbakeshwar-jyotirlinga",
  "bhimashankar": "2026-04-15-bhimashankar-jyotirlinga",
  "grishneshwar": "2026-04-15-grishneshwar-jyotirlinga",
  "aundha-nagnath": "2026-04-15-aundha-nagnath-jyotirlinga",
  "parli-vaijnath": "2026-04-15-parli-vaijnath-jyotirlinga",
  // Ashtavinayak
  "morgaon": "2026-04-16-morgaon-moreshwar",
  "siddhatek": "2026-04-16-siddhatek-siddhivinayak",
  "pali": "2026-04-16-pali-ballaleshwar",
  "mahad": "2026-04-16-mahad-varadvinayak",
  "theur": "2026-04-16-theur-chintamani",
  "lenyadri": "2026-04-16-lenyadri-girijatmaj",
  "ozar": "2026-04-16-ozar-vighnahar",
  "ranjangaon": "2026-04-16-ranjangaon-mahaganapati",
  // Shakti Peeth / Maharashtra temples
  "kolhapur-mahalaxmi": "2026-04-15-kolhapur-mahalaxmi",
  "tuljapur": "2026-04-16-tuljapur-tuljabhavani",
  "mahurgad": "2026-04-16-mahurgad-renuka",
  "saptashrungi": "2026-04-16-saptashrungi",
  "pandharpur": "2026-04-16-pandharpur-vitthal",
  // Other Maharashtra temples
  "ganagapur": "2026-04-17-ganagapur-dattatreya",
  "shirdi": "2026-04-17-shirdi-saibaba",
  "siddhivinayak-mumbai": "2026-04-17-siddhivinayak-mumbai",
  "jejuri": "2026-04-17-jejuri-khandoba",
  "dehu-alandi": "2026-04-17-dehu-alandi",
  "shani-shingnapur": "2026-04-17-shani-shingnapur",
  // Datta Kshetras
  "audumbar": "2026-04-18-audumbar-datta-kshetra",
  "mahur-datta": "2026-04-18-mahur-datta-mandir",
  "karanja-lad": "2026-04-18-karanja-lad-datta",
  "kurvapur": "2026-04-18-kurvapur-datta",
  "pithapuram": "2026-04-18-pithapuram-datta",
  "girnar": "2026-04-18-girnar-datta",
  "narasoba-wadi": "2026-04-18-narasobawadi-datta",
  "akkalkot": "2026-04-18-akkalkot-swami-samarth",
  "wadi-ratkal": "2026-04-18-wadi-ratkal",
  "kadganchi": "2026-04-18-kadganchi",
  "sankhali-goa": "2026-04-18-sankhali-goa",
  "mount-abu-datta": "2026-04-18-mount-abu-datta",
  "tembe-swami": "2026-04-18-tembe-swami",
  "balkundi-belgaum": "2026-04-18-balkundi-belgaum",
  "shreesailam-datta": "2026-04-18-shreesailam-datta",
  "ujjain-datta": "2026-04-18-ujjain-datta",
  // 12 Jyotirlinga (India-wide, date prefixed)
  "somnath": "2026-04-19-somnath",
  "mallikarjun": "2026-04-19-mallikarjun",
  "mahakaleshwar": "2026-04-19-mahakaleshwar",
  "omkareshwar": "2026-04-19-omkareshwar",
  "kedarnath": "2026-04-19-kedarnath",
  "kashi-vishwanath": "2026-04-19-kashi-vishwanath",
  "rameshwaram": "2026-04-19-rameshwaram",
  // Char Dham & Pan-India (date prefixed)
  "badrinath": "2026-04-20-badrinath",
  "jagannath-puri": "2026-04-20-jagannath-puri",
  "dwarka": "2026-04-20-dwarka",
  "tirupati": "2026-04-20-tirupati",
  "vaishno-devi": "2026-04-20-vaishno-devi",
  "amarnath": "2026-04-20-amarnath",
  "mathura-vrindavan": "2026-04-20-mathura-vrindavan",
  "kamakhya": "2026-04-20-kamakhya",
  "meenakshi": "2026-04-20-meenakshi-madurai",
  "chamundeshwari": "2026-04-20-chamundeshwari-mysore",
  "padmanabhaswamy": "2026-04-20-padmanabhaswamy",
  "konark": "2026-04-20-konark-surya-mandir",
  "akshardham": "2026-04-20-akshardham-delhi",
  "golden-temple": "2026-04-20-golden-temple-amritsar",
  "khatu-shyam": "2026-04-20-khatu-shyam",
  "salasar-balaji": "2026-04-20-salasar-balaji",
};

/** Get temple data from blog post by temple ID */
export function getTempleData(templeId: string): BlogPostData | null {
  const slug = TEMPLE_BLOG_MAP[templeId];
  if (!slug) return null;
  return getBlogPost(slug);
}
