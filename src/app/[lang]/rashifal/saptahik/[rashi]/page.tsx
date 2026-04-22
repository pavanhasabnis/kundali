import { notFound, redirect } from "next/navigation";
import { getRashiBySlug } from "@/lib/rashi-data";
import { getWeekStart } from "@/lib/astrology/gochar-weekly";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; rashi: string }> };

export default async function SaptahikIndexPage({ params }: Props) {
  const { lang, rashi: slug } = await params;
  if (!getRashiBySlug(slug)) notFound();

  // Newspaper Sunday model: on Sunday, jump to upcoming Monday so readers
  // land on next week's forecast (published Sunday morning by the cron).
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const istDate = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
  if (istDate.getDay() === 0) istDate.setDate(istDate.getDate() + 1);
  const monday = getWeekStart(istDate);
  const iso = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

  redirect(`/${lang}/rashifal/saptahik/${slug}/${iso}`);
}
