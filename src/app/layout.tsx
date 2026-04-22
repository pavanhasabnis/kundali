import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Serif_Devanagari } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { LangProvider, type Lang } from "@/lib/astrology/language-context";
import { NavBar } from "./nav-bar";
import { Footer } from "./footer";
import { SiteBanner } from "./site-banner";
import { ChromeOrRaw } from "./chrome-or-raw";
import { JsonLd, organizationSchema, websiteSchema, localBusinessSchema } from "@/components/json-ld";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Editorial serif for headings — supports Devanagari + Latin so same font
// renders across all three site languages (mr / hi / en).
const notoSerifDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bhaagyavedh.com"),
  title: {
    default: "Bhaagyavedh — भाग्यवेध | Free Horoscope Today, Kundli Maker & Vedic Astrology",
    template: "%s | Bhaagyavedh भाग्यवेध",
  },
  description:
    "Free kundli maker & daily horoscope — kundli matching, panchang, muhurat & Vedic astrology. अचूक कुंडली, राशीफल, गुण मिलान, पंचांग आणि मुहूर्त.",
  keywords: [
    "kundli", "कुंडली", "rashifal", "राशीफल", "panchang", "पंचांग",
    "gun milaan", "गुण मिलान", "vedic astrology", "वैदिक ज्योतिष",
    "muhurat", "मुहूर्त", "janam kundali", "जन्म कुंडली",
    "marriage matching", "pooja", "yatra", "jyotirlinga", "ashtavinayak",
    "free kundli online", "marathi rashifal", "today panchang",
    "mofat kundli", "aajcha rashifal", "ajjcha rashi bhavishya",
    "gun milan marathi", "panchang marathi", "shubh muhurat marathi",
    "horoscope", "horoscope today", "today horoscope", "daily horoscope",
    "horoscope 2026", "tomorrow horoscope", "horoscope tomorrow",
    "virgo horoscope", "scorpio horoscope", "leo horoscope",
    "aries horoscope", "taurus horoscope", "gemini horoscope",
    "cancer horoscope", "libra horoscope", "sagittarius horoscope",
    "capricorn horoscope", "aquarius horoscope", "pisces horoscope",
    "kundli maker", "kundali maker", "kundli maker online free",
    "free horoscope", "birth chart free", "janam patrika",
    "daily horoscope today", "weekly horoscope", "monthly horoscope",
  ],
  authors: [{ name: "Bhaagyavedh", url: "https://bhaagyavedh.com" }],
  creator: "Bhaagyavedh",
  publisher: "Bhaagyavedh",
  alternates: { canonical: "https://bhaagyavedh.com" },
  openGraph: {
    type: "website",
    locale: "mr_IN",
    alternateLocale: "en_IN",
    url: "https://bhaagyavedh.com",
    siteName: "Bhaagyavedh — भाग्यवेध",
    title: "Bhaagyavedh — भाग्यवेध | Free Horoscope Today, Kundli Maker & Astrology",
    description:
      "Free horoscope today & kundli maker — daily horoscope, free kundli, kundli matching, panchang & Vedic astrology. अचूक कुंडली, राशीफल, गुण मिलान आणि पंचांग.",
    // OG images auto-injected via src/app/opengraph-image.tsx file convention.
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhaagyavedh — भाग्यवेध | Free Kundli & Vedic Astrology",
    description:
      "Free Vedic astrology — accurate kundli, daily rashifal, gun milaan, panchang & muhurat.",
    // Twitter image auto-injected via src/app/twitter-image.tsx file convention.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
  category: "Astrology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#5c1a1a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const c = await cookies();
  // Priority: x-lang header > x-pathname first segment > lang cookie > default mr
  const xLang = h.get("x-lang");
  const xPath = h.get("x-pathname") || "";
  const firstSeg = xPath.split("/")[1];
  const cookieLang = c.get("lang")?.value;
  const isLang = (v: string | undefined | null): v is Lang =>
    v === "mr" || v === "en" || v === "hi";
  let resolved: Lang = "mr";
  if (isLang(xLang)) resolved = xLang;
  else if (isLang(firstSeg)) resolved = firstSeg;
  else if (isLang(cookieLang)) resolved = cookieLang;
  const lang: Lang = resolved;
  const htmlLang = lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN";

  return (
    <html lang={htmlLang} className={`${outfit.variable} ${notoSerifDeva.variable}`}>
      <head>
        <link rel="icon" href="/logos/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logos/apple-touch-icon.png" />
        <meta httpEquiv="content-language" content={htmlLang} />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <LangProvider lang={lang}>
          {/* ChromeOrRaw toggles the global navbar/banner/footer off when
              the URL has ?raw=1 — used by the Playwright reel recorder to
              capture the preview page with zero surrounding chrome. */}
          <ChromeOrRaw>{children}</ChromeOrRaw>
        </LangProvider>
      </body>
    </html>
  );
}
