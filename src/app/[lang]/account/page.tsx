import { pageMeta } from "@/lib/seo";
import AccountPageClient from "./account-client";

export const metadata = pageMeta({
  title: "My Account — माझे खाते",
  description: "Manage your Bhaagyavedh account — saved kundlis, consultation history, payments, and profile settings.",
  path: "/account",
  noindex: true,
});

export default function AccountPage() {
  return <AccountPageClient />;
}
