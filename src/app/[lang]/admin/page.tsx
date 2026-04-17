import { pageMeta } from "@/lib/seo";
import AdminPageClient from "./admin-client";

export const metadata = pageMeta({
  title: "Admin Dashboard",
  description: "Bhaagyavedh admin dashboard.",
  path: "/admin",
  noindex: true,
});

export default function AdminPage() {
  return <AdminPageClient />;
}
