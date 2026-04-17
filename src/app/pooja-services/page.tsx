import { pageMeta } from "@/lib/seo";
import PoojaServicesPageClient from "./pooja-services-client";

export const metadata = pageMeta({
  title: "Pooja Services & Booking — पूजा सेवा | Homam, Archana & Vedic Rituals",
  description:
    "Book authentic Vedic pooja, path & ritual services in Pune. Satyanarayan Puja, Griha Shanti, Navgraha Shanti, Rudrabhishek, Vastu Puja performed by experienced priests. पूजा सेवा.",
  path: "/pooja-services",
  keywords: [
    "online pooja booking",
    "pooja services",
    "puja vidhi",
    "पूजा सेवा",
    "homam booking",
    "hindu puja online",
  ],
});

export default function PoojaServicesPage() {
  return <PoojaServicesPageClient />;
}
