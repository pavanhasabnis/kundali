import { pageMeta } from "@/lib/seo";
import DisclaimerPageClient from "./disclaimer-client";

export const metadata = pageMeta({
  title: "Disclaimer — अस्वीकरण",
  description:
    "Bhaagyavedh disclaimer — astrology predictions are for guidance only. Vedic astrology methods, calculation accuracy, and professional advice notice. अस्वीकरण.",
  path: "/disclaimer",
  keywords: ["disclaimer", "astrology disclaimer", "अस्वीकरण", "bhaagyavedh disclaimer"],
});

export default function DisclaimerPage() {
  return <DisclaimerPageClient />;
}
