/**
 * Plantilla de página pilar SEO. ARCHIVO NUEVO.
 * Reutiliza componentes y estilos existentes sin modificarlos.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategorias, getProductos } from "@/lib/catalog";
import { getKitViews } from "@/lib/kits";
import { getGuias } from "@/lib/guias";
import { site, waLink } from "@/lib/site";
import { getLanding, landings } from "@/lib/seo/landings";
import ProductCard from "@/components/ProductCard";
import KitCard from "@/components/KitCard";
import s from "./landing.module.css";

export const SEO_UPDATED = "2026-11-20";

export function landingMetadata(slug: string): Metadata {
  const l = getLanding(slug);
  if (!l) return {};
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: `/${l.slug}` },
    openGraph: { title: l.title, description: l.description, url: `${site.url}/${l.slug}`, type: "website" },
  };
}

export default async function SeoLanding({ slug }: { slug: string }) {
  const l = getLanding(slug);
  if (!l) notFound();
  const [prods, cats, kits, guias] = await Promise.all([getProductos(), getCategorias(), getKitViews(), getGuias()]);
  const ps = l.productos.map((x) => prods.find((p) => p.slug === x)).filter((p): p is NonNullable<typeof p> => !!p);
  const cs = l.categorias.map((x) => cats.find((c) => c.slug === x)).filter((c): c is NonNullable<typeof c> => !!c);
  const ks = l.kits.map((x) => kits.find((k) => k.slug === x)).filter((k): k is NonNullable<typeof k> => !!k);
  const gs = l.guias.map((x) => guias.find((g) => g.slug === x)).filter((g): g is NonNullable<typeof g> => !!g);
  const rel = l.relacionadas.map((x) => landings.find((y) => y.slug === x)).filter((y): y is NonNullable<typeof y> => !!y);
  const url = `${site.url}/${l.slug}`;
  const nombres = Object.fromEntries(cats.map((c) => [c.slug, c.nombre]));

  const ld = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
        { "@type": "ListItem", position: 2, name: l.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#webpage`, url, name: l.h1,
      description: l.description, inLanguage: "es-AR", dateModified: SEO_UPDATED,
      isPartOf: { "@type": "WebSite", url: site.url, name: site.name },
      about: { "@type": "Organization", name: site.name, url: site.url },
      mainEntity: {
        "@type": "ItemList", numberOfItems: ps.length,
        itemListElement: ps.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/producto/${p.slug}`, name: p.nombre })),
      },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: l.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Migas"><Link href="/">Inicio</Link> / <span>{l.h1}</span></nav>
          <p className="eyebrow">{l.eyebrow}</p>
          <h1>{l.h1}</h1>
          <p>{l.description}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className={s.body}>
            <p className={s.answer}>{l.respuesta}</p>
            {l.secciones.map((sec) => (
              <section key={sec.h2}>
                <h2>{sec.h2}</h2>
                {sec.p && <p>{sec.p}</p>}
                {sec.items && <ul>{sec.items.map((it) => <li key={it}>{it}</li>)}</ul>}
                {sec.link && <p><a href={sec.link.href} target="_blank" rel="noopener" style={{ textDecoration: "underline", fontWeight: 700 }}>{sec.link.label} →</a></p>}
              </section>
            ))}
            {l.tabla && (
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <caption>{l.tabla.titulo}</caption>
                  <thead><tr>{l.tabla.columnas.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                  <tbody>{l.tabla.filas.map((f) => <tr key={f[0]}>{f.map((c, i) => i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
            {cs.length > 0 && (
              <section>
                <h2>Categorías relacionadas</h2>
                <div className={s.chips}>{cs.map((c) => <Link key={c.slug} className={s.chip} href={`/productos/${c.slug}`}>{c.icono} {c.nombre}</Link>)}</div>
              </section>
            )}
          </div>
        </div>
      </section>

      {ps.length > 0 && (
        <section className="section section--white">
          <div className="wrap">
            <div className="head"><h2 className="section-title">Productos destacados para {l.h1.toLowerCase()}</h2></div>
            <div className="grid">{ps.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={nombres[p.categoria]} />)}</div>
          </div>
        </section>
      )}

      {ks.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head"><h2 className="section-title">Kits con descuento</h2></div>
            <div className="kits">{ks.map((k) => <KitCard key={k.slug} k={k} />)}</div>
          </div>
        </section>
      )}

      <section className="section section--white">
        <div className="wrap">
          <div className="faq-layout">
            <div className="head">
              <h2 className="section-title">Preguntas frecuentes</h2>
              <a className="btn btn-wa btn-sm" style={{ marginTop: 16 }} href={waLink(`Hola! Quiero cotizar: ${l.h1}`)} target="_blank" rel="noopener">💬 Pedir cotización</a>
            </div>
            <div className="faq">{l.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
          </div>
          {(gs.length > 0 || rel.length > 0) && (
            <div className={s.body} style={{ marginTop: 40 }}>
              {gs.length > 0 && (
                <section><h2>Guías para comprar mejor</h2><ul>{gs.map((g) => <li key={g.slug}><Link href={`/guias/${g.slug}`}>{g.titulo}</Link></li>)}</ul></section>
              )}
              {rel.length > 0 && (
                <section><h2>También te puede interesar</h2><div className={s.chips}>{rel.map((r) => <Link key={r.slug} className={s.chip} href={`/${r.slug}`}>{r.h1}</Link>)}</div></section>
              )}
              <p className={s.updated}>Actualizado el {new Date(SEO_UPDATED + "T12:00:00-03:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })} · {site.name}, fabricantes y distribuidores desde {site.founded}.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
