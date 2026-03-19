// app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://printpocketshop.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/admin/",
          "/checkout/",
          "/success/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
