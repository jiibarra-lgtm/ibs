import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategorias, getProductos } from "@/lib/catalog";
import { site, waLink } from "@/lib/site";
import { escalas } from "@/lib/promos";
import { ZONAS, contenido, getZona } from "@/lib/zonas";
import ProductCard from "@/components/ProductCard";
import { LazyVideo } from "@/components/Fx";
import s from "@/components/seo/landing.module.css";

export const dynamicParams = false;
export const revalidate = 3600;
const ACTUALIZADO = "2026-11-24";

export function generateStaticParams() { return ZONAS.map((z) => ({ slug: z.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const z = getZona((await params).slug);
  if (!z) return {};
  const c = contenido(z);
  return {
    title: { absolute: c.title }, description: c.description,
    alternates: { canonical: `/zonas/${z.slug}` },
    openGraph: { title: c.title, description: c.description, url: `${site.url}/zonas/${z.slug}`, type: "website", images: ["/img/marca/planta.webp"] },
  };
}

export default async function ZonaPage({ params }: { params: Promise<{ slug: string }> }) {
  const z = getZona((await params).slug);
  if (!z) notFound();
  const { barrio: b, busqueda: q } = z;
  const c = contenido(z);
  const [prods, cats] = await Promise.all([getProductos(), getCategorias()]);
  const ps = q.productos.map((x) => prods.find((p) => p.slug === x)).filter((p): p is NonNullable<typeof p> => !!p);
  const cs = q.categorias.map((x) => cats.find((k) => k.slug === x)).filter((k): k is NonNullable<typeof k> => !!k);
  const nombres = Object.fromEntries(cats.map((k) => [k.slug, k.nombre]));
  const h1 = q.h1.replaceAll("{b}", b.nombre);
  const url = `${site.url}/zonas/${z.slug}`;
  const mismasBarrio = ZONAS.filter((x) => x.barrio.slug === b.slug && x.slug !== z.slug);
  const mismaBusqueda = c.cerca.map((n) => ZONAS.find((x) => x.barrio.slug === n.slug && x.busqueda.id === q.id) ?? ZONAS.find((x) => x.barrio.slug === n.slug && x.busqueda.id === "productos-de-limpieza-por-mayor")).filter((x): x is NonNullable<typeof x> => !!x);

  const ld = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
      { "@type": "ListItem", position: 2, name: "Zonas de entrega", item: `${site.url}/zonas` },
      { "@type": "ListItem", position: 3, name: h1, item: url },
    ] },
    { "@context": "https://schema.org", "@type": "Service", "@id": `${url}#servicio`, name: h1, serviceType: q.corto, url, description: c.description,
      provider: { "@id": `${site.url}/#empresa` },
      areaServed: { "@type": "Place", name: `${b.nombre}, Ciudad Autónoma de Buenos Aires`, geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng }, containedInPlace: { "@type": "City", name: "Ciudad Autónoma de Buenos Aires" } },
      offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: b.nombre, seller: { "@id": `${site.url}/#empresa` } } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Migas"><Link href="/">Inicio</Link> / <Link href="/zonas">Zonas</Link> / <span>{b.nombre}</span></nav>
          <p className="eyebrow">{q.eyebrow} · {b.nombre} · Comuna {b.comuna}</p>
          <h1>{h1}</h1>
          <p>{c.description}</p>
          <div className="hero-ctas" style={{ marginTop: 18 }}>
            <a className="btn btn-wa btn-shine" href={waLink(`Hola! Quiero cotizar ${q.corto.toLowerCase()} con entrega en ${b.nombre}.`)} target="_blank" rel="noopener">💬 Cotizar con entrega en {b.nombre}</a>
            <Link className="btn btn-glass" href="/productos">Ver catálogo</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className={s.body}>
            <p className={s.answer}>{c.respuesta}</p>
            {c.secciones.map((sec) => (
              <section key={sec.h2}>
                <h2>{sec.h2}</h2>
                {sec.p?.map((t) => <p key={t.slice(0, 40)} style={{ marginBottom: 12 }}>{t}</p>)}
                {sec.items && <ul>{sec.items.map((it) => <li key={it}>{it}</li>)}</ul>}
              </section>
            ))}
            <div className={s.tableWrap}>
              <table className={s.table}>
                <caption>Descuentos por cantidad en {b.nombre}</caption>
                <thead><tr><th scope="col">Comprando</th><th scope="col">Descuento</th><th scope="col">Entrega en {b.nombre}</th></tr></thead>
                <tbody>{escalas.map((e) => <tr key={e.label}><th scope="row">{e.min} {e.min === 1 ? "unidad" : "unidades o más"}</th><td>{e.off ? `−${e.off}%` : "Precio de lista"}</td><td>24–48 hs hábiles</td></tr>)}</tbody>
              </table>
            </div>
            {cs.length > 0 && (
              <section>
                <h2>Categorías para {b.nombre}</h2>
                <div className={s.chips}>{cs.map((k) => <Link key={k.slug} className={s.chip} href={`/productos/${k.slug}`}>{k.icono} {k.nombre}</Link>)}</div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="ev">
        <div className="wrap ev-grid">
          <div className="ev-media">
            <LazyVideo className="ev-video" src="/video/reparto.mp4" poster="/video/reparto-poster.webp" label={`Carga de un pedido en la camioneta de Ibarra Insumos para entregar en ${b.nombre}`} />
            <span className="ev-tag">Reparto propio</span>
          </div>
          <div className="ev-copy">
            <p className="eyebrow">Así sale tu pedido</p>
            <h2 className="section-title">De nuestro depósito <em>a {b.nombre}</em></h2>
            <p>Preparamos el pedido en Parque Avellaneda, lo cargamos en nuestras camionetas y te lo entregamos en 24 a 48 horas hábiles, sin intermediarios.</p>
            <ul className="ev-list">
              <li>Camionetas propias, sin terceros</li>
              <li>Entrega de lunes a viernes</li>
              <li>Factura A o B con el pedido</li>
            </ul>
          </div>
        </div>
      </section>

      {ps.length > 0 && (
        <section className="section section--white">
          <div className="wrap">
            <div className="head"><h2 className="section-title">{q.corto} más pedidos en {b.nombre}</h2></div>
            <div className="grid">{ps.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={nombres[p.categoria]} />)}</div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="faq-layout">
            <div className="head">
              <h2 className="section-title">Preguntas frecuentes en {b.nombre}</h2>
              <a className="btn btn-wa btn-sm" style={{ marginTop: 16 }} href={waLink(`Hola! Tengo una consulta para una entrega en ${b.nombre}.`)} target="_blank" rel="noopener">💬 Consultar</a>
            </div>
            <div className="faq">{c.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
          </div>
          <div className={s.body} style={{ marginTop: 40 }}>
            {mismasBarrio.length > 0 && (
              <section><h2>Más en {b.nombre}</h2><div className={s.chips}>{mismasBarrio.map((x) => <Link key={x.slug} className={s.chip} href={`/zonas/${x.slug}`}>{x.busqueda.corto}</Link>)}</div></section>
            )}
            {mismaBusqueda.length > 0 && (
              <section><h2>Barrios cercanos a {b.nombre}</h2><div className={s.chips}>{mismaBusqueda.map((x) => <Link key={x.slug} className={s.chip} href={`/zonas/${x.slug}`}>{x.busqueda.corto} en {x.barrio.nombre}</Link>)}</div></section>
            )}
            <p className={s.updated}>Actualizado el {new Date(ACTUALIZADO + "T12:00:00-03:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })} · {site.name}, fabricantes y distribuidores desde {site.founded}. <Link href="/zonas" style={{ textDecoration: "underline" }}>Todas las zonas de entrega</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
