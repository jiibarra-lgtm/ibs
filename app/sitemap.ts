import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCategorias, getProductos } from "@/lib/catalog";
import { eventos, kits } from "@/lib/promos";
import { getGuias } from "@/lib/guias";
import { novedades } from "@/lib/empresa";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, prods] = await Promise.all([getCategorias(), getProductos()]);
  const now = new Date();
  const u = (path: string, priority: number) => ({ url: `${site.url}${path}`, lastModified: now, priority });
  return [
    u("/", 1), u("/productos", 0.9), u("/compatibilidad", 0.6),
    u("/nuestra-fabrica", 0.8), u("/quienes-somos", 0.7), u("/marca-propia", 0.7), u("/novedades", 0.6), u("/programa-de-puntos", 0.5), u("/garantia-y-devoluciones", 0.4), u("/privacidad", 0.2),
    ...novedades.map((n) => u(`/novedades/${n.slug}`, 0.5)),
    u("/herramientas/carteles", 0.5), u("/herramientas/etiquetas", 0.4),
    u("/kits", 0.85), u("/promos", 0.7), u("/carga-rapida", 0.6), u("/pedido-programado", 0.6), u("/guias", 0.7),
    ...eventos.map((e) => u(`/promo/${e.slug}`, 0.6)),
    ...(await getGuias()).map((g) => u(`/guias/${g.slug}`, 0.65)),
    ...kits.map((k) => u(`/kits/${k.slug}`, 0.75)),
    ...cats.map((c) => u(`/productos/${c.slug}`, 0.8)),
    ...prods.map((p) => u(`/producto/${p.slug}`, 0.7)),
  ];
}
