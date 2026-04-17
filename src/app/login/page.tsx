import { pageMeta } from "@/lib/seo";
import LoginPageClient from "./login-client";

export const metadata = pageMeta({
  title: "Login — लॉगिन",
  description: "Sign in to your Bhaagyavedh account to access saved kundlis, consultation history, and personalized astrology services.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return <LoginPageClient />;
}
