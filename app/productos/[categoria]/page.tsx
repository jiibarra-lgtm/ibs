import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoria, getCategorias, getProductosPorCategoria } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { site, waLink } from "@/lib/site";
import Md from "@/components/Md";
import { getGuias } from "@/lib/guias";

type Props = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  return (await getCategorias()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategoria((await params).categoria);
  if (!c) return {};
  return {
    title: `${c.nombre} por mayor en Buenos Aires`,
    description: c.descripcion.length < 70 ? `${c.descripcion} Venta por mayor para instituciones y empresas, con entrega en CABA y GBA.` : c.descripcion.length > 158 ? `${c.descripcion.slice(0, 150).replace(/\s+\S*$/, "")}…` : c.descripcion,
    alternates: { canonical: `/productos/${c.slug}` },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const slug = (await params).categoria;
  const [c, productos, todas] = await Promise.all([getCategoria(slug), getProductosPorCategoria(slug), getCategorias()]);
  if (!c) notFound();
  const slugs = new Set(productos.map((p) => p.slug));
  const guiasCat = (await getGuias()).filter((g) => g.productos.some((s) => slugs.has(s))).slice(0, 4);
  const ld = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Productos", item: `${site.url}/productos` },
      { "@type": "ListItem", position: 3, name: c.nombre, item: `${site.url}/productos/${c.slug}` }] },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: `${c.nombre} por mayor`, url: `${site.url}/productos/${c.slug}`,
      mainEntity: { "@type": "ItemList", itemListElement: productos.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/producto/${p.slug}`, name: p.nombre })) } },
    ...(c.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Migas"><Link href="/">Inicio</Link> / <Link href="/productos">Productos</Link> / <span>{c.nombre}</span></nav>
          <h1>{c.icono} {c.nombre}</h1>
          <p>{c.descripcion}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap catalog">
          <aside className="filters" aria-label="Categorías">
            <h4>Categorías</h4>
            <Link href="/productos">Todos</Link>
            {todas.map((t) => <Link key={t.slug} href={`/productos/${t.slug}`} className={t.slug === c.slug ? "on" : ""}>{t.nombre}</Link>)}
          </aside>
          <div>
            <div className="chips">
              <Link href="/productos" className="btn btn-sm" style={{ background: "#fff", border: "1px solid var(--line)" }}>Todos</Link>
              {todas.map((t) => <Link key={t.slug} href={`/productos/${t.slug}`} className="btn btn-sm" style={t.slug === c.slug ? { background: "var(--teal)", color: "#fff" } : { background: "#fff", border: "1px solid var(--line)" }}>{t.nombre}</Link>)}
            </div>
            <p className="result-meta">{productos.length} productos</p>
            <div className="grid">{productos.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={c.nombre} />)}</div>
            <div className="banner" style={{ marginTop: 32 }}>
              <div><h3>¿No encontrás lo que buscás?</h3><p>Tenemos más productos de {c.nombre.toLowerCase()} que los publicados.</p></div>
              <a className="btn btn-wa btn-sm" href={waLink(`Hola! Busco productos de ${c.nombre}.`)} target="_blank" rel="noopener">Consultar por WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      {(c.intro || c.faqs?.length) && (
        <section className="section section--white">
          <div className="wrap">
            {c.intro && <div className="cat-intro"><h2 className="section-title" style={{ fontSize: "1.5rem" }}>{c.nombre} por mayor</h2><Md src={c.intro} /></div>}
            {guiasCat.length > 0 && (
              <div className="cat-intro">
                <h2 className="section-title" style={{ fontSize: "1.3rem" }}>Guías sobre {c.nombre.toLowerCase()}</h2>
                <ul className="checks">{guiasCat.map((g) => <li key={g.slug}><Link href={`/guias/${g.slug}`} style={{ textDecoration: "underline" }}>{g.titulo}</Link></li>)}</ul>
              </div>
            )}
            {c.faqs && c.faqs.length > 0 && (
              <div className="p-faq" style={{ maxWidth: 860, margin: "0 auto" }}>
                <h2 className="section-title" style={{ fontSize: "1.4rem" }}>Preguntas frecuentes sobre {c.nombre.toLowerCase()}</h2>
                {c.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
