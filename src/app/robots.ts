import type { MetadataRoute } from "next";
import { getConfig } from "@/platform/config";

export default function robots(): MetadataRoute.Robots {
  const { APP_ENV, NEXT_PUBLIC_SITE_URL } = getConfig();
  if (APP_ENV !== "production") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/bookings", "/support", "/driver/", "/ops", "/api"],
    },
    sitemap: `${NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}
