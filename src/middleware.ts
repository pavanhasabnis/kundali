import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LANGS = ["mr", "en"] as const;
const DEFAULT_LANG = "mr";
type Lang = (typeof SUPPORTED_LANGS)[number];

function detectLang(req: NextRequest): Lang {
  const cookieLang = req.cookies.get("lang")?.value;
  if (cookieLang === "mr" || cookieLang === "en") return cookieLang;

  const accept = req.headers.get("accept-language") || "";
  const primary = accept.split(",")[0]?.toLowerCase() || "";
  if (primary.startsWith("mr") || primary.startsWith("hi")) return "mr";
  if (primary.startsWith("en")) return "en";
  return DEFAULT_LANG;
}

function hasLangPrefix(pathname: string): Lang | null {
  for (const lang of SUPPORTED_LANGS) {
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) return lang;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const lang = hasLangPrefix(pathname);
  if (lang) {
    const res = NextResponse.next();
    res.headers.set("x-lang", lang);
    if (req.cookies.get("lang")?.value !== lang) {
      res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
    return res;
  }

  const target = detectLang(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|logos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|txt|xml|pdf|woff|woff2|ttf|otf|eot)).*)",
  ],
};
