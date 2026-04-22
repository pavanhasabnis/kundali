import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Bhaagyavedh — भाग्यवेध | Vedic Astrology Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at 30% 20%, #7a2020 0%, #5c1a1a 45%, #2e0d0d 100%)",
          color: "#f0c040",
          fontFamily: "serif",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 80,
            fontSize: 28,
            color: "#f0c040",
            letterSpacing: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          bhaagyavedh.com
        </div>
        <div
          style={{
            fontSize: 148,
            fontWeight: 800,
            lineHeight: 1,
            background: "linear-gradient(135deg, #f0c040, #d4a843, #c49535)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          भाग्यवेध
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 54,
            fontWeight: 600,
            color: "#fff",
            display: "flex",
          }}
        >
          Bhaagyavedh
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 34,
            color: "#f4e4c1",
            textAlign: "center",
            maxWidth: 960,
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          मोफत कुंडली · राशीभविष्य · पंचांग · मुहूर्त · तीर्थयात्रा
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 24,
            color: "#d4a843",
            letterSpacing: 2,
            display: "flex",
          }}
        >
          Vedic Astrology · Pune · Since Parashara
        </div>
      </div>
    ),
    { ...size },
  );
}
