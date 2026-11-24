// Sitemap de imágenes (productos, kits y guías). ARCHIVO NUEVO. Enviar en Search Console.
import { absUrl, site } from "@/lib/site";
import { getProductos } from "@/lib/catalog";
import { getGuias } from "@/lib/guias";
export const revalidate = 3600;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export async function GET() {
  const [prods, guias] = await Promise.all([getProductos(), getGuias()]);
  const entries = [
    ...prods.map((p) => ({ loc: `/producto/${p.slug}`, imgs: p.imagenes })),
    ...guias.map((g) => ({ loc: `/guias/${g.slug}`, imgs: [g.imagen] })),
    { loc: "/", imgs: ["/img/marca/planta.webp", "/img/marca/camioneta.webp"] },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map((e) => `  <url>
    <loc>${site.url}${e.loc}</loc>
${e.imgs.map((i) => `    <image:image><image:loc>${esc(absUrl(i))}</image:loc></image:image>`).join("\n")}
  </url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
