import type { Metadata } from "next";
import Link from "next/link";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pedido programado de insumos de limpieza",
  description: "Programá la entrega de tus insumos de limpieza cada 15 días, todos los meses o cada 2 meses. Sin volver a pedir, con los mismos descuentos. CABA y GBA.",
  alternates: { canonical: "/pedido-programado" },
};

const pasos = [
  { ic: "🛒", t: "Armá tu pedido una vez", d: "Sumá productos o kits a tu cotización, como siempre." },
  { ic: "🔁", t: "Marcá “pedido programado”", d: "Elegí cada cuánto (15 días, mes o 2 meses) y en qué momento del mes." },
  { ic: "💬", t: "Confirmamos por WhatsApp", d: "Te pasamos precios con los descuentos y fijamos el día de entrega." },
  { ic: "🚚", t: "Te llega solo", d: "Antes de cada entrega te avisamos para que ajustes cantidades si hace falta." },
];

export default function Page() {
  return (
    <>
      <section className="page-head kits-head">
        <div className="wrap">
          <nav className="crumbs"><Link href="/">Inicio</Link> / <span>Pedido programado</span></nav>
          <h1>🔁 Pedido programado</h1>
          <p>Para instituciones que compran lo mismo todos los meses: lo armás una vez y te lo entregamos solo.</p>
          <div className="kits-perks"><span>Sin volver a pedir</span><span>Mismos descuentos por cantidad</span><span>Cambiás o pausás cuando quieras</span></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="steps steps--4">
            {pasos.map((p, i) => (
              <div key={p.t} className="step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="step-n">{i + 1}</span><span className="step-ic">{p.ic}</span><h3>{p.t}</h3><p>{p.d}</p>
              </div>
            ))}
          </div>
          <div className="banner reveal" style={{ marginTop: 36 }}>
            <div><span className="pill pill-gold">Ideal para</span><h3>Hospitales, consorcios, escuelas y oficinas</h3><p>Nunca más quedarte sin papel, jabón o lavandina a mitad de mes.</p></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/kits">Empezar con un kit</Link>
              <a className="btn btn-wa" href={waLink("Hola! Quiero armar un pedido programado.")} target="_blank" rel="noopener">💬 Consultar</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
