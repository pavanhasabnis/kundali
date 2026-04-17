import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { LangProvider } from "@/lib/astrology/language-context";
import { NavBar } from "./nav-bar";
import { Footer } from "./footer";
import { SiteBanner } from "./site-banner";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/json-ld";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
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
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhaagyavedh — भाग्यवेध | Free Kundli & Vedic Astrology",
    description:
      "Free Vedic astrology — accurate kundli, daily rashifal, gun milaan, panchang & muhurat.",
    images: ["/logos/og-image.png"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr-IN" className={outfit.variable}>
      <head>
        <link rel="icon" href="/logos/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logos/apple-touch-icon.png" />
        <meta name="theme-color" content="#5c1a1a" />
        <meta httpEquiv="content-language" content="mr-IN" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <LangProvider>
          <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
            <SiteBanner />
            <NavBar />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
