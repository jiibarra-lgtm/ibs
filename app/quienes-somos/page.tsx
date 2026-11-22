import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { equipo, hitos, sameAs } from "@/lib/empresa";
import PageHead, { crumbsLd, Ld } from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Quiénes somos: empresa familiar desde 1985",
  description: "Ibarra Insumos es una empresa familiar fundada en 1985. Fabricantes y distribuidores de productos de limpieza e higiene institucional en CABA y GBA.",
  alternates: { canonical: "/quienes-somos" },
};

const valores = [
  { ic: "🤝", t: "Trato directo", d: "Atención personalizada, sin call centers ni vueltas." },
  { ic: "📅", t: "Cumplimiento", d: "Entregamos cuando decimos, con reparto propio." },
  { ic: "🏭", t: "Precio de fábrica", d: "Fabricamos y distribuimos: sin intermediarios." },
  { ic: "🧾", t: "Transparencia", d: "Factura A y B, cuentas corrientes y documentación al día." },
];

export default function Page() {
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Quiénes somos · Ibarra Insumos",
    url: `${site.url}/quienes-somos`,
    mainEntity: { "@type": "Organization", name: site.name, url: site.url, foundingDate: String(site.founded), ...(sameAs.length ? { sameAs } : {}) },
  };
  return (
    <>
      <Ld data={[crumbsLd([{ name: "Inicio", path: "/" }, { name: "Quiénes somos", path: "/quienes-somos" }], site.url), aboutLd]} />
      <PageHead crumb="Quiénes somos" title="Quiénes somos" sub={`Empresa familiar desde ${site.founded}. Fabricantes y distribuidores de productos de limpieza, higiene institucional y descartables.`} perks={["Desde 1985", "Fábrica propia", "Reparto propio"]} />
      <section className="section">
        <div className="wrap split">
          <div className="reveal reveal-left"><img src="/img/marca/planta.webp" alt="Planta y flota de reparto de Ibarra Insumos" width={1400} height={1050} loading="lazy" style={{ borderRadius: 24, width: "100%", height: "auto" }} /></div>
          <div className="reveal">
            <p className="eyebrow">Nuestra historia</p>
            <h2 className="section-title">Más de 40 años abasteciendo instituciones</h2>
            <p className="lead">Somos una empresa familiar de Parque Avellaneda, CABA. Empezamos en {site.founded} distribuyendo productos de limpieza e higiene y hoy <b>fabricamos la mayoría de lo que vendemos</b>.</p>
            <p className="lead" style={{ marginTop: 12 }}>Trabajamos con hospitales, organismos públicos, empresas, industrias, consorcios, escuelas y comercios de CABA, GBA y Provincia de Buenos Aires.</p>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Trayectoria</p><h2 className="section-title">Línea de tiempo</h2></div>
          <ol className="timeline">
            {hitos.map((h) => <li key={h.titulo} className="reveal"><b>{h.anio}</b><h3>{h.titulo}</h3><p>{h.texto}</p></li>)}
          </ol>
        </div>
      </section>
      {equipo.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head reveal"><p className="eyebrow">El equipo</p><h2 className="section-title">Las personas detrás de cada entrega</h2></div>
            <div className="team">
              {equipo.map((m) => <figure key={m.nombre} className="reveal"><img src={m.foto} alt={`${m.nombre}, ${m.rol} en Ibarra Insumos`} loading="lazy" /><figcaption><b>{m.nombre}</b><span>{m.rol}</span></figcaption></figure>)}
            </div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Cómo trabajamos</p><h2 className="section-title">Lo que nos importa</h2></div>
          <div className="steps steps--4">
            {valores.map((v) => <div key={v.t} className="step reveal"><span className="step-ic">{v.ic}</span><h3>{v.t}</h3><p>{v.d}</p></div>)}
          </div>
          <div className="banner reveal" style={{ marginTop: 36 }}>
            <div><h3>¿Querés trabajar con nosotros?</h3><p>Pedinos una cotización o coordiná una visita a la planta.</p></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/nuestra-fabrica">Ver la fábrica</Link>
              <a className="btn btn-wa" href={waLink("Hola! Quiero hacer una consulta.")} target="_blank" rel="noopener">💬 Escribinos</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
