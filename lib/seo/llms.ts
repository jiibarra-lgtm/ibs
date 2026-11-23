/** Generadores de llms.txt (propuesta experimental llmstxt.org). ARCHIVO NUEVO. */
import { site } from "@/lib/site";
import { faqs, glosario } from "@/lib/content";
import { getCategorias, getProductos } from "@/lib/catalog";
import { getGuias } from "@/lib/guias";
import { kits } from "@/lib/promos";
import { landings } from "./landings";

const U = (p: string) => `${site.url}${p}`;

export async function llmsTxt() {
  const [cats, guias] = await Promise.all([getCategorias(), getGuias()]);
  return [
    `# ${site.name}`,
    "",
    `> Fabricantes y distribuidores mayoristas de productos de limpieza, higiene institucional y descartables en Buenos Aires, Argentina, desde ${site.founded}. Reparto propio en CABA, Gran Buenos Aires y Provincia de Buenos Aires.`,
    "",
    "Datos de la empresa:",
    `- Ubicación: ${site.address.locality}, Ciudad Autónoma de Buenos Aires, Argentina`,
    `- Horario: ${site.hours}`,
    `- WhatsApp y teléfono: ${site.phoneDisplay}`,
    `- Email: ${site.email}`,
    "- Entregas: 24 a 48 horas hábiles en CABA y GBA",
    "- Facturación: A y B. Pagos: transferencia, cheque, efectivo; financiación a 30, 60 y 90 días para cuentas corrientes",
    "- Dispensers en comodato para clientes con consumo regular",
    "- Proveedor del Gobierno de la Ciudad de Buenos Aires (compras públicas BAC y Convenios Marco)",
    "- Venta por cotización (WhatsApp); los precios no se publican en la web",
    "- Envío gratis en compras desde $150.000 en CABA y GBA",
    "- Bolsas mortuorias (bolsas de óbito) de PVC por mayor: adulto, adulto obeso, pediátrica y neonatal, en negro y rojo. Catálogo propio: https://www.bolsasmortuoriasibarra.com.ar/",
    "",
    "## Páginas principales",
    `- [Inicio](${U("/")}): presentación de la empresa, ofertas, kits y preguntas frecuentes`,
    `- [Catálogo](${U("/productos")}): todos los productos por categoría`,
    `- [Kits por rubro](${U("/kits")}): combos con descuento para baño, gastronomía, industria, comercio, edificios, salud y escuelas`,
    `- [Compatibilidad de dispensers](${U("/compatibilidad")}): qué recarga va con cada dispenser`,
    `- [Quiénes somos](${U("/quienes-somos")}): historia de la empresa familiar desde 1985`,
    `- [Nuestra fábrica](${U("/nuestra-fabrica")}): planta, depósito y reparto propio`,
    `- [Marca propia](${U("/marca-propia")}): productos de fabricación propia`,
    `- [Garantía y devoluciones](${U("/garantia-y-devoluciones")}): cambios, fallas y botón de arrepentimiento`,
    `- [Programa de puntos](${U("/programa-de-puntos")}): puntos por compra canjeables por descuento`,
    `- [Novedades](${U("/novedades")}): noticias de la empresa`,
    "",
    "## Soluciones",
    ...landings.map((l) => `- [${l.h1}](${U(`/${l.slug}`)}): ${l.description}`),
    "",
    "## Categorías",
    ...cats.map((c) => `- [${c.nombre}](${U(`/productos/${c.slug}`)}): ${c.descripcion}`),
    "",
    "## Guías",
    ...guias.map((g) => `- [${g.titulo}](${U(`/guias/${g.slug}`)}): ${g.resumen}`),
    "",
    "## Optional",
    `- [Información completa para modelos de lenguaje](${U("/llms-full.txt")})`,
    `- [Calendario de ofertas](${U("/promos")})`,
    `- [Pedido programado](${U("/pedido-programado")})`,
    `- [Carga rápida de pedidos](${U("/carga-rapida")})`,
    "",
  ].join("\n");
}

export async function llmsFullTxt() {
  const [prods, cats, guias] = await Promise.all([getProductos(), getCategorias(), getGuias()]);
  const out: string[] = [await llmsTxt(), "", "---", "", "# Catálogo completo", ""];
  for (const c of cats) {
    out.push(`## ${c.nombre}`, "", c.descripcion, "");
    for (const p of prods.filter((x) => x.categoria === c.slug)) out.push(`- [${p.nombre}](${U(`/producto/${p.slug}`)}): ${p.descripcion}`);
    out.push("");
  }
  out.push("# Kits", "");
  for (const k of kits) out.push(`- [${k.nombre}](${U(`/kits/${k.slug}`)}) (${k.rubro}, ${k.off}% de descuento): ${k.descripcion} Incluye: ${k.items.map((i) => `${i.cantidad}× ${prods.find((p) => p.slug === i.slug)?.nombre ?? i.slug}`).join(", ")}.`);
  out.push("", "# Preguntas frecuentes", "");
  for (const f of faqs) out.push(`### ${f.q}`, "", f.a, "");
  for (const l of landings) for (const f of l.faqs) out.push(`### ${f.q}`, "", f.a, "");
  out.push("# Glosario", "");
  for (const g of glosario) out.push(`- **${g.t}**: ${g.d}`);
  out.push("", "# Guías (resumen)", "");
  for (const g of guias) out.push(`## ${g.titulo}`, "", g.resumen, "", `Leer: ${U(`/guias/${g.slug}`)}`, "");
  return out.join("\n");
}
