import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuia, getGuias } from "@/lib/guias";
import { getProductos } from "@/lib/catalog";
import { getKitViews } from "@/lib/kits";
import Md from "@/components/Md";
import ProductCard from "@/components/ProductCard";
import KitCard from "@/components/KitCard";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
const corto = (t: string) => t.length <= 62 ? t : (t.includes(":") && t.indexOf(":") > 20 ? t.slice(0, t.indexOf(":")) : t.slice(0, 60).replace(/\s+\S*$/, ""));
export async function generateStaticParams() { return (await getGuias()).map((g) => ({ slug: g.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getGuia((await params).slug);
  if (!g) return {};
  return { title: g.titulo.length > 48 ? { absolute: corto(g.titulo) } : g.titulo, description: g.resumen, alternates: { canonical: `/guias/${g.slug}` }, openGraph: { type: "article", images: [{ url: g.imagen }] } };
}

export default async function GuiaPage({ params }: Props) {
  const g = await getGuia((await params).slug);
  if (!g) notFound();
  const [prods, kits, todas] = await Promise.all([getProductos(), getKitViews(), getGuias()]);
  const ps = g.productos.map((s) => prods.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
  const kit = kits.find((k) => k.slug === g.kit);
  const resto = todas.filter((x) => x.slug !== g.slug);
  const comparte = (x: typeof g) => x.productos.filter((s) => g.productos.includes(s)).length + (x.categoria === g.categoria ? 1 : 0);
  const otras = resto.slice().sort((a, b) => comparte(b) - comparte(a)).slice(0, 3);
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: g.titulo, description: g.resumen, datePublished: g.fecha,
    dateModified: g.fecha, mainEntityOfPage: `${site.url}/guias/${g.slug}`, inLanguage: "es-AR",
    image: `${site.url}${g.imagen}`, author: { "@type": "Organization", name: site.name, url: `${site.url}/quienes-somos` }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/img/marca/icon-512.png` } },
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${site.url}/` },
    { "@type": "ListItem", position: 2, name: "Guías", item: `${site.url}/guias` },
    { "@type": "ListItem", position: 3, name: g.titulo, item: `${site.url}/guias/${g.slug}` }] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <article className="section" style={{ paddingTop: 28 }}>
        <div className="wrap g-layout">
          <div>
            <nav className="crumbs" style={{ color: "var(--muted)", marginBottom: 16 }}><Link href="/">Inicio</Link> / <Link href="/guias">Guías</Link> / <span>{g.categoria}</span></nav>
            <span className="kit-rubro">{g.categoria} · {g.minutos} min de lectura</span>
            <h1 className="g-title">{g.titulo}</h1>
            <p className="g-lead">{g.resumen}</p>
            <div className="g-hero"><img src={g.imagen} alt={g.titulo} /></div>
            <Md src={g.contenido} />
            <p className="g-by">Por el equipo de <Link href="/quienes-somos">{site.name}</Link>, fabricantes y distribuidores desde {site.founded}. Actualizado el {new Date(g.fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}.</p>
          </div>
          <aside className="g-side">
            <div className="g-side-box">
              <b>Productos de esta guía</b>
              {ps.map((p) => <Link key={p.slug} href={`/producto/${p.slug}`} className="g-side-p"><img src={p.imagenes[0]} alt={p.nombre} /><span>{p.nombre}</span></Link>)}
              <Link className="btn btn-primary btn-sm btn-block" href="/carga-rapida">⚡ Cotizar mi lista</Link>
            </div>
          </aside>
        </div>
      </article>
      {kit && (
        <section className="section section--white">
          <div className="wrap">
            <div className="head reveal"><p className="eyebrow">Todo junto</p><h2 className="section-title">El kit para esto</h2></div>
            <div className="kits"><KitCard k={kit} /></div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="wrap">
          <div className="head reveal"><h2 className="section-title">Productos mencionados</h2></div>
          <div className="grid">{ps.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          <div className="head reveal" style={{ marginTop: 56 }}><h2 className="section-title">Más guías</h2></div>
          <div className="g-grid">{otras.map((o) => (
            <Link key={o.slug} href={`/guias/${o.slug}`} className="g-card reveal"><div className="g-img"><img src={o.imagen} alt="" loading="lazy" /></div><span className="kit-rubro">{o.categoria}</span><h3>{o.titulo}</h3></Link>
          ))}</div>
        </div>
      </section>
    </>
  );
}
