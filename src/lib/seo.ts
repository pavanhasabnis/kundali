import type { Metadata } from "next";

// ─── Site-wide SEO constants ────────────────────────────────
export const SITE_NAME = "Bhaagyavedh";
export const SITE_NAME_MR = "भाग्यवेध";
export const SITE_URL = "https://bhaagyavedh.com";
export const SITE_DESCRIPTION =
  "Accurate Vedic astrology — free kundli, rashifal, gun milaan, panchang, muhurat, and yatra services. Trusted by thousands across Maharashtra.";
export const SITE_DESCRIPTION_MR =
  "अचूक वैदिक ज्योतिष — मोफत कुंडली, राशीफल, गुण मिलान, पंचांग, मुहूर्त आणि यात्रा सेवा.";
export const SITE_LOCALE = "mr_IN";
export const SITE_PHONE = "+91 9146189837";
export const SITE_EMAIL = "info@bhaagyavedh.com";
export const SITE_ADDRESS = {
  streetAddress: "Kothrud",
  addressLocality: "Pune",
  addressRegion: "Maharashtra",
  postalCode: "411038",
  addressCountry: "IN",
};

// ─── Default OpenGraph image (fallback) ─────────────────────
export const OG_IMAGE = {
  url: `${SITE_URL}/logos/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
};

// ─── Helper: build page metadata ────────────────────────────
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  ogType?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords?.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: opts.ogType || "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [OG_IMAGE.url],
    },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
