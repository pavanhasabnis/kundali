import { pageMeta } from "@/lib/seo";
import PrivacyPageClient from "./privacy-client";

export const metadata = pageMeta({
  title: "Privacy Policy — गोपनीयता धोरण",
  description:
    "Bhaagyavedh privacy policy — how we collect, use, and protect your personal information including birth details for Vedic astrology calculations. गोपनीयता धोरण.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "गोपनीयता धोरण", "bhaagyavedh privacy"],
});

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
