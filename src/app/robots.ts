import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/account", "/login", "/kundli/result", "/sangrah/download"],
      },
    ],
    sitemap: "https://bhaagyavedh.com/sitemap.xml",
  };
}
