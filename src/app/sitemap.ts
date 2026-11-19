import type { MetadataRoute } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { getConfig } from "@/platform/config";
import { PUBLIC_ROUTES } from "@/ui/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getConfig().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const paths = [...PUBLIC_ROUTES, ...SERVICE_PACKAGES.map((p) => `/services/${p.slug}`)];
  return paths.map((p) => ({ url: `${base}${p === "/" ? "" : p}` }));
}
