import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoria, getProducto, getProductos, getProductosPorCategoria } from "@/lib/catalog";
import { ProductView } from "@/components/Bits";
import ProductCard from "@/components/ProductCard";
import { getGuias } from "@/lib/guias";
import { absUrl, site } from "@/lib/site";
import { complementos } from "@/lib/promos";
import { Marquee } from "@/components/Fx";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProductos()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProducto((await params).slug);
  if (!p) return {};
  const desc = p.descripcion.length < 50 ? `${p.descripcion} Venta por mayor con descuento por cantidad y entrega en CABA y GBA. Cotizá por WhatsApp.` : `${p.descripcion} Por mayor, entrega en CABA y GBA.`;
  return {
    title: `${p.nombre} por mayor`.length > 46 ? { absolute: `${p.nombre} por mayor` } : `${p.nombre} por mayor`,
    description: desc.length > 158 ? `${p.descripcion.slice(0, 150).replace(/\s+\S*$/, "")}…` : desc,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { images: [{ url: p.imagenes[0] }] },
  };
}

export default async function ProductoPage({ params }: Props) {
  const p = await getProducto((await params).slug);
  if (!p) notFound();
  const [c, relacionados] = await Promise.all([getCategoria(p.categoria), getProductosPorCategoria(p.categoria)]);
  const todos = await getProductos();
  const comp = (complementos[p.slug] ?? []).map((s) => todos.find((t) => t.slug === s)).filter((x): x is NonNullable<typeof x> => !!x);
  const guiasRel = (await getGuias()).filter((g) => g.productos.includes(p.slug) || g.categoria.toLowerCase() === (c?.nombre ?? "").toLowerCase()).slice(0, 3);
  const otros = relacionados.filter((r) => r.slug !== p.slug && !comp.some((c) => c.slug === r.slug)).slice(0, 4);
  const ld = {
    "@context": "https://schema.org", "@type": "Product",
    name: p.nombre, description: p.descripcion, category: c?.nombre,
    image: p.imagenes.map(absUrl),
    brand: { "@type": "Brand", name: site.name },
    sku: p.slug, url: `${site.url}/producto/${p.slug}`,
    ...(p.fabricacionPropia ? { manufacturer: { "@type": "Organization", name: site.name } } : {}),
    ...(typeof p.precio === "number" ? { offers: { "@type": "Offer", price: p.precio, priceCurrency: "ARS", availability: "https://schema.org/InStock", url: `${site.url}/producto/${p.slug}`, seller: { "@type": "Organization", name: site.name } } } : {}),
  };
  const faqs = [
    ...(c?.faqs ?? []),
    { q: `¿Venden ${p.nombre.toLowerCase()} por mayor?`, a: `Sí. Vendemos ${p.nombre.toLowerCase()} en cantidades mayoristas, con descuentos de hasta 15% por cantidad y entrega en 24–48 hs en CABA y GBA.` },
    { q: "¿Cómo pido una cotización?", a: "Agregá el producto a tu lista y enviala por WhatsApp. Te respondemos con precio y fecha de entrega." },
  ];
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Productos", item: `${site.url}/productos` },
      ...(c ? [{ "@type": "ListItem", position: 3, name: c.nombre, item: `${site.url}/productos/${c.slug}` }] : []),
      { "@type": "ListItem", position: c ? 4 : 3, name: p.nombre, item: `${site.url}/producto/${p.slug}` },
    ],
  };
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs, faqLd]) }} />
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="wrap">
          <nav className="crumbs" style={{ color: "var(--muted)", marginBottom: 20 }} aria-label="Migas">
            <Link href="/">Inicio</Link> / <Link href="/productos">Productos</Link> / {c && <><Link href={`/productos/${c.slug}`}>{c.nombre}</Link> / </>}<span>{p.nombre}</span>
          </nav>
          <ProductView slug={p.slug} nombre={p.nombre} imagenes={p.imagenes} precio={p.precio} extra={comp[0] ? { slug: comp[0].slug, nombre: comp[0].nombre, imagen: comp[0].imagenes[0] } : undefined}>
            {p.badge && <span className="b b-gold" style={{ marginBottom: 8, display: "inline-block", marginRight: 6 }}>{p.badge}</span>}
            {p.fabricacionPropia && <span className="b b-fab" style={{ marginBottom: 8, display: "inline-block" }}>🏭 Fabricación propia</span>}
            <span className="card-cat" style={{ display: "block" }}>{c?.nombre}{p.subcategoria ? ` · ${p.subcategoria}` : ""}</span>
            <h1>{p.nombre}</h1>
            <p className="desc">{p.descripcion}</p>
          </ProductView>
        </div>
      </section>
      {(p.detalle || p.usos?.length) && (
        <section className="section section--white" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap split" style={{ alignItems: "start" }}>
            <div>
              <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Sobre {p.nombre.toLowerCase()}</h2>
              {p.detalle && <p className="lead">{p.detalle}</p>}
            </div>
            {p.usos && p.usos.length > 0 && (
              <div>
                <h3 style={{ color: "var(--teal)", marginTop: 0 }}>Dónde se usa</h3>
                <ul className="checks">{p.usos.map((u) => <li key={u}>{u}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      )}
      <Marquee items={["Entrega 24–48 hs", "Factura A y B", "Hasta −15% por cantidad", "Comodato de dispensers", "Stock permanente"]} />
      {comp.length > 0 && (
        <section className="section section--white">
          <div className="wrap">
            <div className="head reveal"><p className="eyebrow">Va bien con</p><h2 className="section-title">Completá tu kit</h2></div>
            <div className="grid">{comp.map((o) => <ProductCard key={o.slug} p={o} />)}</div>
          </div>
        </section>
      )}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap p-faq" style={{ maxWidth: 860 }}>
          <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Preguntas frecuentes</h2>
          {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>
      {guiasRel.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <h2 className="section-title" style={{ fontSize: "1.4rem" }}>Guías para elegir y usar {p.nombre.toLowerCase()}</h2>
            <ul className="checks">{guiasRel.map((g) => <li key={g.slug}><Link href={`/guias/${g.slug}`} style={{ textDecoration: "underline" }}>{g.titulo}</Link></li>)}</ul>
          </div>
        </section>
      )}
      {otros.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head"><h2 className="section-title">También en {c?.nombre}</h2></div>
            <div className="grid">{otros.map((o) => <ProductCard key={o.slug} p={o} categoriaNombre={c?.nombre} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
