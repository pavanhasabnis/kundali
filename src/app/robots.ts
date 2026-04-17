import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin", "/admin/",
          "/account", "/account/",
          "/login", "/login/",
          "/*/admin", "/*/admin/",
          "/*/account", "/*/account/",
          "/*/login", "/*/login/",
          "/*/kundli/result",
          "/*/sangrah/download",
        ],
      },
    ],
    sitemap: "https://bhaagyavedh.com/sitemap.xml",
  };
}
