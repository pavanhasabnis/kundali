import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["swisseph"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
