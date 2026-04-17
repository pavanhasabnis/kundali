/* JSON-LD structured data component for SEO/AEO/GEO */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Pre-built schemas ──────────────────────────────────── */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bhaagyavedh",
  alternateName: "भाग्यवेध",
  url: "https://bhaagyavedh.com",
  logo: "https://bhaagyavedh.com/logos/logo-dark.svg",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9146189837",
    contactType: "customer service",
    availableLanguage: ["Marathi", "Hindi", "English"],
    areaServed: "IN",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kothrud",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411038",
    addressCountry: "IN",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bhaagyavedh — भाग्यवेध",
  url: "https://bhaagyavedh.com",
  description:
    "Accurate Vedic astrology — free kundli, rashifal, gun milaan, panchang, muhurat, and yatra services.",
  inLanguage: "mr-IN",
  publisher: { "@type": "Organization", name: "Bhaagyavedh" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bhaagyavedh.com/blog?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Bhaagyavedh — भाग्यवेध",
  image: "https://bhaagyavedh.com/logos/logo-dark.svg",
  url: "https://bhaagyavedh.com",
  telephone: "+91-9146189837",
  email: "info@bhaagyavedh.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kothrud",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411038",
    addressCountry: "IN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "₹0 - ₹199",
  description:
    "Vedic astrology services — kundli generation, rashifal, gun milaan, panchang, muhurat, pooja services, and religious yatra packages from Pune, Maharashtra.",
  knowsLanguage: ["mr", "hi", "en"],
  areaServed: {
    "@type": "Country",
    name: "India",
  },
};

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  provider?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      "@type": "Organization",
      name: opts.provider || "Bhaagyavedh",
      url: "https://bhaagyavedh.com",
    },
    areaServed: { "@type": "Country", name: "India" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: opts.url,
      serviceType: "Online",
    },
  };
}

export const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "Main Navigation",
  url: "https://bhaagyavedh.com",
  hasPart: [
    { "@type": "WebPage", name: "कुंडली (Kundli)", url: "https://bhaagyavedh.com/kundli" },
    { "@type": "WebPage", name: "गुण मिलान (Matching)", url: "https://bhaagyavedh.com/matching" },
    { "@type": "WebPage", name: "पंचांग (Panchang)", url: "https://bhaagyavedh.com/panchang" },
    { "@type": "WebPage", name: "राशीफल (Rashifal)", url: "https://bhaagyavedh.com/rashifal" },
    { "@type": "WebPage", name: "दिनदर्शिका (Calendar)", url: "https://bhaagyavedh.com/calendar" },
    { "@type": "WebPage", name: "मुहूर्त (Muhurat)", url: "https://bhaagyavedh.com/muhurat" },
    { "@type": "WebPage", name: "पूजा सेवा (Pooja Services)", url: "https://bhaagyavedh.com/pooja-services" },
    { "@type": "WebPage", name: "मंदिरे (Temples)", url: "https://bhaagyavedh.com/temples" },
    { "@type": "WebPage", name: "यात्रा सेवा (Yatra)", url: "https://bhaagyavedh.com/yatra" },
    { "@type": "WebPage", name: "सल्ला सेवा (Consultation)", url: "https://bhaagyavedh.com/consultation" },
    { "@type": "WebPage", name: "संग्रह (Sangrah)", url: "https://bhaagyavedh.com/sangrah" },
    { "@type": "WebPage", name: "ब्लॉग (Blog)", url: "https://bhaagyavedh.com/blog" },
    { "@type": "WebPage", name: "संपर्क (Contact)", url: "https://bhaagyavedh.com/contact" },
  ],
};

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    image: opts.image || "https://bhaagyavedh.com/logos/og-image.png",
    author: { "@type": "Organization", name: "Bhaagyavedh" },
    publisher: {
      "@type": "Organization",
      name: "Bhaagyavedh",
      logo: {
        "@type": "ImageObject",
        url: "https://bhaagyavedh.com/logos/logo-dark.svg",
      },
    },
    inLanguage: opts.inLanguage || "mr-IN",
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
  };
}
