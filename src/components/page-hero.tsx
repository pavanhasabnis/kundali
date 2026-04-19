"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Unified cinematic hero used across every top-level page.
 * Matches the design locked in on /mr/rashifal + /mr/rashifal/saptahik.
 *
 * - Maroon gradient + gold star-field overlay
 * - Tracked-caps eyebrow between gold dividers (optional)
 * - Cream serif H1 (Noto Serif Devanagari) — same size everywhere
 * - Gold date/subtitle line, soft-cream description paragraph
 * - Optional back-link pill styled in gold
 */
export interface PageHeroProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  date?: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function PageHero({ title, eyebrow, subtitle, date, backHref, backLabel, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #1a0505 0%, #3d0c0c 40%, #5c1a1a 100%)" }}>
      <svg aria-hidden className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="ph-stars" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="20" r="0.8" fill="#d4a843" />
            <circle cx="40" cy="55" r="1.2" fill="#d4a843" />
            <circle cx="65" cy="15" r="0.6" fill="#d4a843" />
            <circle cx="70" cy="70" r="0.9" fill="#d4a843" />
            <circle cx="20" cy="65" r="0.5" fill="#d4a843" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ph-stars)" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
        {backHref && (
          <Link href={backHref} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#d4a843" }}>
            ← {backLabel || "Back"}
          </Link>
        )}
        {eyebrow && (
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-semibold mb-5" style={{ color: "#d4a843" }}>
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
            {eyebrow}
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{ color: "#f5e6c8", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}>
          {title}
        </h1>
        {date && (
          <p className="text-lg sm:text-xl font-semibold tracking-wide" style={{ color: "#d4a843" }}>
            {date}
          </p>
        )}
        {subtitle && (
          <p className="mt-4 text-sm max-w-2xl mx-auto" style={{ color: "rgba(245,230,200,0.7)" }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
