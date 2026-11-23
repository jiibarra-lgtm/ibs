import type { Metadata } from "next";
import { getCategorias, getProductosPorCategoria } from "@/lib/catalog";
import { site } from "@/lib/site";
import { PrintButton } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Catálogo para imprimir",
  description: "Catálogo completo de Ibarra Insumos en formato para imprimir o guardar como PDF.",
  alternates: { canonical: "/catalogo" },
  robots: { index: false, follow: true },
};

export default async function CatalogoPrint() {
  const cats = await getCategorias();
  const bloques = await Promise.all(cats.map(async (c) => ({ c, ps: await getProductosPorCategoria(c.slug) })));
  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <h1 className="sr-only">Catálogo de productos de limpieza de Ibarra Insumos</h1>
            <div className="logo"><img src="/img/marca/isotipo.webp" alt="" width={44} height={54} /><span className="logo-txt"><b>IBARRA</b><span>INSUMOS</span></span></div>
            <p className="note" style={{ marginTop: 6 }}>{site.phoneDisplay} · {site.email} · WhatsApp {site.phoneDisplay}</p>
          </div>
          <PrintButton />
        </div>
        {bloques.filter((b) => b.ps.length).map(({ c, ps }) => (
          <div key={c.slug} style={{ marginBottom: 32, breakInside: "avoid-page" }}>
            <h2 style={{ fontSize: "1.3rem", borderBottom: "2px solid var(--gold)", paddingBottom: 6, marginBottom: 14 }}>{c.nombre}</h2>
            <div className="grid print-grid">
              {ps.map((p) => (
                <div className="card" key={p.slug}>
                  <div className="card-img" style={{ padding: 10 }}><img src={p.imagenes[0]} alt={p.nombre} /></div>
                  <div className="card-body"><h3>{p.nombre}</h3><p style={{ WebkitLineClamp: 3 }}>{p.descripcion}</p></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="note">Precios mayoristas a consultar. Entregas en CABA, GBA y Provincia de Buenos Aires.</p>
      </div>
    </section>
  );
}
