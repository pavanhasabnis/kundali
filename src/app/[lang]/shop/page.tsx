import { pageMetaI18n, type Lang } from "@/lib/seo";
import ShopPageClient from "./shop-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/shop",
    mr: {
      title: "भाग्यवेध दुकान — बांधील कुंडली पुस्तक व छापील दिनदर्शिका | घरपोच",
      description: "वैदिक पंचांग व कुंडलीवर आधारित छापील उत्पादने — बांधील कुंडली पुस्तक (८०+ पाने), वार्षिक छापील दिनदर्शिका, महाराष्ट्रभर मोफत शिपिंग.",
      keywords: ["बांधील कुंडली पुस्तक", "छापील दिनदर्शिका", "मराठी पंचांग प्रिंट", "भाग्यवेध दुकान", "kundli book India"],
    },
    en: {
      title: "Bhaagyavedh Shop — Bound Kundli Book & Printed Calendar | Home Delivery",
      description: "Printed products based on Vedic panchang and kundli — bound kundli book (80+ pg), annual printed calendar, free shipping across Maharashtra.",
      keywords: ["bound kundli book", "printed vedic calendar", "marathi panchang print", "bhaagyavedh shop", "astrology gift book"],
    },
  });
}

export default function Page() {
  return <ShopPageClient />;
}
