import { notFound, redirect } from "next/navigation";
import { getRashiBySlug } from "@/lib/rashi-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; rashi: string }> };

export default async function RashiIndexPage({ params }: Props) {
  const { lang, rashi: slug } = await params;
  if (!getRashiBySlug(slug)) notFound();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  redirect(`/${lang}/rashifal/${slug}/${today}`);
}
