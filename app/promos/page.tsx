import type { Metadata } from "next";
import Link from "next/link";
import { eventos } from "@/lib/promos";
import { EventBadge } from "@/components/Events";

export const metadata: Metadata = {
  title: "Calendario de ofertas en limpieza",
  description: "Todas las fechas de ofertas de Ibarra Insumos: Black Friday, Cyber Monday, cierre de año, vuelta a clases, Hot Sale y temporadas.",
  alternates: { canonical: "/promos" },
};

export default function Promos() {
  const lista = [...eventos].filter((e) => e.activo).sort((a, b) => +new Date(a.desde) - +new Date(b.desde));
  const fmt = (d: string) => new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  return (
    <>
      <section className="page-head kits-head">
        <div className="wrap">
          <nav className="crumbs"><Link href="/">Inicio</Link> / <span>Calendario de ofertas</span></nav>
          <h1>📅 Calendario de ofertas</h1>
          <p>Las fechas fuertes del año, con cupón propio y kits en oferta. Suscribite para que te avisemos.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap ev-cal">
          {lista.map((e) => (
            <Link key={e.slug} href={`/promo/${e.slug}`} className={`ev-card ev-${e.tema} reveal`}>
              <span className="ev-card-e">{e.emoji}</span>
              <div className="ev-card-m">
                <EventBadge e={e} />
                <b>{e.nombre}</b>
                <small>{fmt(e.desde)} – {fmt(e.hasta)}</small>
              </div>
              <span className="ev-card-off">−{e.off}%</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
