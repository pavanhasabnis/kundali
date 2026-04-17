import { pageMeta } from "@/lib/seo";
import ContactPageClient from "./contact-client";

export const metadata = pageMeta({
  title: "Contact Us — संपर्क करा | Bhaagyavedh Astrology Services",
  description:
    "Contact Bhaagyavedh for astrology consultation, pooja services, yatra booking and more. Phone, email or visit us in Pune. संपर्क करा.",
  path: "/contact",
  keywords: [
    "contact astrologer",
    "bhaagyavedh contact",
    "astrology enquiry",
    "संपर्क",
  ],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
