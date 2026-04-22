import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import DownloadClient from "./download-client";

export const metadata = pageMeta({
  title: "Download Sangrah — संग्रह डाउनलोड",
  description: "Download complete sangrah collection as PDF — aartis, stotras, chalisas, mantras, vrat kathas, daily prayers and namavalis.",
  path: "/sangrah/download",
  noindex: true,
});

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8E7" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#d4a843] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5c1a1a] font-medium">Preparing...</p>
        </div>
      </div>
    }>
      <DownloadClient />
    </Suspense>
  );
}
