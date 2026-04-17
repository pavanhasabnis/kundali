import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LANGS = ["mr", "en", "hi"] as const;
const DEFAULT_LANG = "mr";
type Lang = (typeof SUPPORTED_LANGS)[number];

function detectLang(req: NextRequest): Lang {
  const cookieLang = req.cookies.get("lang")?.value;
  if (cookieLang === "mr" || cookieLang === "en" || cookieLang === "hi") return cookieLang;

  const accept = req.headers.get("accept-language") || "";
  const primary = accept.split(",")[0]?.toLowerCase() || "";
  if (primary.startsWith("mr")) return "mr";
  if (primary.startsWith("hi")) return "hi";
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
    // Propagate x-lang to server components via REQUEST headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-lang", lang as string);
    requestHeaders.set("x-pathname", pathname);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set("x-lang", lang as string);
    if (req.cookies.get("lang")?.value !== lang) {
      res.cookies.set("lang", lang as string, { path: "/", maxAge: 60 * 60 * 24 * 365 });
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
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|logos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|txt|xml|xsl|pdf|woff|woff2|ttf|otf|eot)).*)",
  ],
};
