// Sitemap complementario con las páginas nuevas (no reemplaza /sitemap.xml). ARCHIVO NUEVO.
// Enviarlo manualmente en Google Search Console y Bing Webmaster Tools.
import { site } from "@/lib/site";
import { landings } from "@/lib/seo/landings";
import { ZONAS } from "@/lib/zonas";
export const dynamic = "force-static";
const SEO_UPDATED = "2026-11-20";
export async function GET() {
  const urls = [...landings.map((l) => `/${l.slug}`), "/llms.txt"].filter((u) => !u.endsWith(".txt"));
  const zonas = ["/zonas", ...ZONAS.map((z) => `/zonas/${z.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u}</loc><lastmod>${SEO_UPDATED}</lastmod></url>`).join("\n")}
${zonas.map((u) => `  <url><loc>${site.url}${u}</loc><lastmod>2026-11-24</lastmod></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
