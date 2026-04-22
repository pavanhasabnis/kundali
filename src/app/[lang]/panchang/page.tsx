import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PanchangIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  redirect(`/${lang}/panchang/${today}`);
}
