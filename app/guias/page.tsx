import type { Metadata } from "next";
import Link from "next/link";
import { getGuias } from "@/lib/guias";

export const metadata: Metadata = {
  title: "Guías de limpieza institucional",
  description: "Guías prácticas para elegir y usar insumos de limpieza: papeles, dispensers, lavandina, restaurantes, consorcios y más. De fabricantes y distribuidores.",
  alternates: { canonical: "/guias" },
};

export default async function Guias() {
  const gs = await getGuias();
  const [first, ...rest] = gs;
  return (
    <>
      <section className="page-head kits-head">
        <div className="wrap">
          <nav className="crumbs"><Link href="/">Inicio</Link> / <span>Guías</span></nav>
          <h1>📚 Guías de limpieza institucional</h1>
          <p>Lo que aprendimos en más de 40 años fabricando y distribuyendo insumos, para que compres mejor.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap">
          {first && (
            <Link href={`/guias/${first.slug}`} className="g-feat reveal">
              <div className="g-feat-img"><img src={first.imagen} alt={first.titulo} /></div>
              <div><span className="kit-rubro">{first.categoria} · {first.minutos} min</span><h2>{first.titulo}</h2><p>{first.resumen}</p><span className="go">Leer guía →</span></div>
            </Link>
          )}
          <div className="g-grid">
            {rest.map((g) => (
              <Link key={g.slug} href={`/guias/${g.slug}`} className="g-card reveal">
                <div className="g-img"><img src={g.imagen} alt="" loading="lazy" /></div>
                <span className="kit-rubro">{g.categoria} · {g.minutos} min</span>
                <h3>{g.titulo}</h3>
                <p>{g.resumen}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
