import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { getCategorias, getProductos } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import PageHead, { crumbsLd, Ld } from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Marca propia: limpieza de fabricación propia",
  description: "Línea de productos de limpieza con marca Ibarra, fabricados en nuestra planta. Precio directo de fábrica para instituciones, empresas y comercios.",
  alternates: { canonical: "/marca-propia" },
};

export default async function Page() {
  const [prods, cats] = await Promise.all([getProductos(), getCategorias()]);
  const propios = prods.filter((p) => p.fabricacionPropia);
  const listLd = propios.length ? {
    "@context": "https://schema.org", "@type": "ItemList", name: "Productos de marca propia Ibarra",
    itemListElement: propios.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/producto/${p.slug}`, name: p.nombre })),
  } : null;
  return (
    <>
      <Ld data={[crumbsLd([{ name: "Inicio", path: "/" }, { name: "Marca propia", path: "/marca-propia" }], site.url), ...(listLd ? [listLd] : [])]} />
      <PageHead crumb="Marca propia" title="Marca propia Ibarra" sub="Productos fabricados en nuestra planta, con nuestra marca y precio directo de fábrica." perks={["Fabricación propia", "Calidad controlada", "Precio de fábrica"]} />
      <section className="section">
        <div className="wrap">
          {propios.length > 0 ? (
            <>
              <div className="head reveal"><p className="eyebrow">Línea Ibarra</p><h2 className="section-title">{propios.length} productos de fabricación propia</h2></div>
              <div className="grid">{propios.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={cats.find((c) => c.slug === p.categoria)?.nombre} />)}</div>
            </>
          ) : (
            <div className="empty reveal">
              <p style={{ fontSize: "2rem" }}>🏭</p>
              <h2 className="section-title">Estamos sumando la línea completa</h2>
              <p className="lead">Consultanos por los productos de fabricación propia disponibles hoy.</p>
            </div>
          )}
          <div className="banner reveal" style={{ marginTop: 36 }}>
            <div><span className="pill pill-gold">Por qué elegir marca propia</span><h3>Mismo uso profesional, precio directo</h3><p>Al fabricarlos nosotros, no pagás intermediarios. Y si un lote tiene un problema, lo resolvemos en origen.</p></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/nuestra-fabrica">Conocé la fábrica</Link>
              <a className="btn btn-wa" href={waLink("Hola! Quiero consultar por los productos de marca propia.")} target="_blank" rel="noopener">💬 Consultar</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
