import type { CSSProperties } from "react";

type Variant = "ganpati" | "maroon" | "gold" | "outline";

export function ZodiacBadge({
  slug,
  size = 72,
  variant = "ganpati",
  style,
}: {
  slug: string;
  size?: number;
  variant?: Variant;
  style?: CSSProperties;
}) {
  const v: Record<Variant, { bg: string; icon: string; ring: string }> = {
    ganpati: { bg: "#FFF8E7", icon: "#3d0c0c", ring: "#3d0c0c" },
    maroon:  { bg: "#3d0c0c", icon: "#FFF8E7", ring: "#d4a843" },
    gold:    { bg: "#d4a843", icon: "#3d0c0c", ring: "#3d0c0c" },
    outline: { bg: "#FAFAF8", icon: "#3d0c0c", ring: "#3d0c0c" },
  };
  const s = v[variant];
  const iconSize = size * 0.58;
  const borderWidth = Math.max(1.5, size * 0.02);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: s.bg,
        border: `${borderWidth}px solid ${s.ring}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(61,12,12,0.12)",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          width: iconSize,
          height: iconSize,
          backgroundColor: s.icon,
          WebkitMaskImage: `url(/images/rashi/${slug}.svg)`,
          maskImage: `url(/images/rashi/${slug}.svg)`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </div>
  );
}
