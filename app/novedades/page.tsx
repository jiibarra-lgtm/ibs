import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { fechaLarga, novedades } from "@/lib/empresa";
import PageHead, { crumbsLd, Ld } from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Novedades y prensa",
  description: "Novedades de Ibarra Insumos: fábrica propia, nuevos productos, servicios y noticias de la empresa.",
  alternates: { canonical: "/novedades" },
};

export default function Page() {
  return (
    <>
      <Ld data={crumbsLd([{ name: "Inicio", path: "/" }, { name: "Novedades", path: "/novedades" }], site.url)} />
      <PageHead crumb="Novedades" title="📰 Novedades" sub="Lo nuevo de Ibarra Insumos: fábrica, productos y servicios." />
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="g-grid">
            {novedades.map((n) => (
              <Link key={n.slug} href={`/novedades/${n.slug}`} className="g-card reveal">
                <div className="g-img"><img src={n.imagen} alt="" loading="lazy" /></div>
                <span className="kit-rubro">{fechaLarga(n.fecha)}</span>
                <h3>{n.titulo}</h3>
                <p>{n.resumen}</p>
              </Link>
            ))}
          </div>
          <p className="note" style={{ marginTop: 28 }}>Prensa: escribinos a <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
