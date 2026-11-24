import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { BARRIOS, ZONAS, km } from "@/lib/zonas";
import s from "@/components/seo/landing.module.css";

export const metadata: Metadata = {
  title: "Zonas de entrega en CABA: los 48 barrios",
  description: "Entregamos productos de limpieza por mayor en los 48 barrios de la Ciudad de Buenos Aires con reparto propio en 24–48 hs, desde nuestra planta en Parque Avellaneda.",
  alternates: { canonical: "/zonas" },
};

export default function Zonas() {
  const comunas = Array.from(new Set(BARRIOS.map((b) => b.comuna))).sort((a, b) => a - b);
  const pa = BARRIOS[0];
  const ld = { "@context": "https://schema.org", "@type": "ItemList", name: "Zonas de entrega de Ibarra Insumos en CABA", numberOfItems: ZONAS.length,
    itemListElement: ZONAS.map((z, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/zonas/${z.slug}`, name: z.busqueda.h1.replaceAll("{b}", z.barrio.nombre) })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Migas"><Link href="/">Inicio</Link> / <span>Zonas</span></nav>
          <p className="eyebrow">Reparto propio · 24–48 hs hábiles</p>
          <h1>Entregamos productos de limpieza en los 48 barrios de CABA</h1>
          <p>Desde nuestra planta en Parque Avellaneda (Comuna 9) llegamos con camionetas propias a toda la Ciudad y al Gran Buenos Aires. Elegí tu barrio.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className={s.body} style={{ maxWidth: "none" }}>
            {comunas.map((n) => (
              <section key={n}>
                <h2>Comuna {n}</h2>
                {BARRIOS.filter((b) => b.comuna === n).sort((a, b) => km(pa, a) - km(pa, b)).map((b) => (
                  <div key={b.slug} style={{ marginBottom: 14 }}>
                    <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>{b.nombre}</h3>
                    <div className={s.chips}>{ZONAS.filter((z) => z.barrio.slug === b.slug).map((z) => <Link key={z.slug} className={s.chip} href={`/zonas/${z.slug}`}>{z.busqueda.corto}</Link>)}</div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
