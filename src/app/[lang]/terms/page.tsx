import { pageMeta } from "@/lib/seo";
import TermsPageClient from "./terms-client";

export const metadata = pageMeta({
  title: "Terms & Conditions — अटी व शर्ती",
  description:
    "Bhaagyavedh terms and conditions — service usage terms for free kundli, rashifal, consultation, and paid astrology services. अटी व शर्ती.",
  path: "/terms",
  keywords: ["terms and conditions", "terms of service", "अटी व शर्ती", "bhaagyavedh terms"],
});

export default function TermsPage() {
  return <TermsPageClient />;
}
