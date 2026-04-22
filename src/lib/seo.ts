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

export type Lang = "mr" | "en" | "hi";

// ─── Default OpenGraph image ────────────────────────────────
// Dynamically rendered via src/app/opengraph-image.tsx (ImageResponse).
// Next.js file-convention exposes this at /opengraph-image.png at runtime.
export const OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image.png`,
  width: 1200,
  height: 630,
  alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
};

// ─── Helper: build page metadata (legacy, single-lang) ──────
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

// ─── Helper: bilingual page metadata ────────────────────────
export interface LangMeta {
  title: string;
  description: string;
  keywords?: string[];
}

export function pageMetaI18n(opts: {
  lang: Lang;
  mr: LangMeta;
  en: LangMeta;
  hi?: LangMeta;
  path: string; // path without lang prefix, e.g. "/kundli"
  noindex?: boolean;
  ogType?: "website" | "article";
}): Metadata {
  const data =
    opts.lang === "en"
      ? opts.en
      : opts.lang === "hi"
      ? opts.hi ?? opts.mr
      : opts.mr;
  const pathWithLang = `/${opts.lang}${opts.path === "/" ? "" : opts.path}`;
  const url = `${SITE_URL}${pathWithLang}`;
  const mrUrl = `${SITE_URL}/mr${opts.path === "/" ? "" : opts.path}`;
  const enUrl = `${SITE_URL}/en${opts.path === "/" ? "" : opts.path}`;
  const hiUrl = `${SITE_URL}/hi${opts.path === "/" ? "" : opts.path}`;
  const locale =
    opts.lang === "en" ? "en_IN" : opts.lang === "hi" ? "hi_IN" : "mr_IN";
  const altLocale =
    opts.lang === "mr" ? "en_IN" : opts.lang === "en" ? "hi_IN" : "mr_IN";

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords?.join(", "),
    alternates: {
      canonical: url,
      languages: {
        "mr-IN": mrUrl,
        "en-IN": enUrl,
        "hi-IN": hiUrl,
        "x-default": mrUrl,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url,
      siteName: SITE_NAME,
      locale,
      alternateLocale: altLocale,
      type: opts.ogType || "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [OG_IMAGE.url],
    },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
