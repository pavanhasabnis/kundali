"use client";

/**
 * Strips the global SiteBanner + NavBar + Footer when the URL carries
 * `?raw=1`. Exists so the Playwright reel recorder can capture the video
 * preview page as-is at 360×640 with zero surrounding layout chrome.
 *
 * Client component so it can read `useSearchParams`. The root layout stays
 * a server component; this wrapper is the only client-side piece.
 */

import { useSearchParams } from "next/navigation";
import { NavBar } from "./nav-bar";
import { Footer } from "./footer";
import { SiteBanner } from "./site-banner";

export function ChromeOrRaw({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const raw = params.get("raw") === "1";

  if (raw) {
    return <div style={{ margin: 0, padding: 0 }}>{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      <SiteBanner />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
