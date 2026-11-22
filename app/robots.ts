import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/carrito-compartido"] }],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/sitemap-seo.xml`, `${site.url}/sitemap-imagenes.xml`],
    host: site.url,
  };
}
