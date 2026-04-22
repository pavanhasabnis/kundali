import { pageMetaI18n, type Lang } from "@/lib/seo";
import ShopPageClient from "./shop-client";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/shop",
    mr: {
      title: "भाग्यवेध शॉप — बांधील कुंडली पुस्तक व छापील दिनदर्शिका | घरपोच",
      description: "वैदिक पंचांग व कुंडलीवर आधारित छापील उत्पादने — बांधील कुंडली पुस्तक (८०+ पाने), वार्षिक छापील दिनदर्शिका, महाराष्ट्रभर मोफत शिपिंग.",
      keywords: ["बांधील कुंडली पुस्तक", "छापील दिनदर्शिका", "मराठी पंचांग प्रिंट", "भाग्यवेध शॉप", "kundli book India"],
    },
    en: {
      title: "Bhaagyavedh Shop — Bound Kundli Book & Printed Calendar | Home Delivery",
      description: "Printed products based on Vedic panchang and kundli — bound kundli book (80+ pg), annual printed calendar, free shipping across Maharashtra.",
      keywords: ["bound kundli book", "printed vedic calendar", "marathi panchang print", "bhaagyavedh shop", "astrology gift book"],
    },
  });
}

const bookProduct = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Bound Kundli Book — बांधील कुंडली पुस्तक",
  description: "Complete Vedic birth chart, dasha analysis, planetary positions, and remedies delivered as a beautifully bound hardcover book (80+ pages) to your home.",
  image: "https://bhaagyavedh.com/opengraph-image.png",
  brand: { "@type": "Brand", name: "Bhaagyavedh" },
  offers: {
    "@type": "Offer",
    price: "799",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
    url: "https://bhaagyavedh.com/mr/shop/claim-book",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN", addressRegion: "MH" },
    },
  },
};

const calendarProduct = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Printed Annual Marathi Calendar 14×22\" — छापील वार्षिक दिनदर्शिका",
  description: "Full year of tithis, nakshatras, festivals, muhurat, and rahu-kaal — printed calendar for wall display, shipped to your home annually.",
  image: "https://bhaagyavedh.com/opengraph-image.png",
  brand: { "@type": "Brand", name: "Bhaagyavedh" },
  offers: {
    "@type": "Offer",
    price: "199",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
    url: "https://bhaagyavedh.com/mr/shop",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN", addressRegion: "MH" },
    },
  },
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const base = `https://bhaagyavedh.com/${lang}`;
  const shopLabel = lang === "mr" ? "शॉप" : lang === "hi" ? "शॉप" : "Shop";
  const homeLabel = lang === "mr" ? "मुख्यपृष्ठ" : lang === "hi" ? "मुख्य पृष्ठ" : "Home";

  return (
    <>
      <JsonLd data={bookProduct} />
      <JsonLd data={calendarProduct} />
      <JsonLd data={breadcrumbSchema([
        { name: homeLabel, url: base },
        { name: shopLabel, url: `${base}/shop` },
      ])} />
      <ShopPageClient />
    </>
  );
}
