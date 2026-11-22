import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { puntos } from "@/lib/promos";
const fmt = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
import PageHead, { crumbsLd, Ld } from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Programa de puntos Ibarra: sumá en cada compra",
  description: "Sumá puntos en cada compra a Ibarra Insumos y canjealos por descuentos en tus próximos pedidos de productos de limpieza.",
  alternates: { canonical: "/programa-de-puntos" },
};

export default function Page() {
  const p = puntos;
  const pasos = [
    { ic: "🧾", t: "Comprá como siempre", d: `Sumás 1 punto por cada ${fmt(p.pesosPorPunto)} de compra facturada.` },
    { ic: "⭐", t: "Acumulá", d: `Te informamos tu saldo en cada factura y cuando lo pidas por WhatsApp.${p.bonoBienvenida ? ` Arrancás con ${p.bonoBienvenida} puntos de bienvenida.` : ""}` },
    { ic: "🎁", t: "Canjeá", d: `Desde ${p.minimoCanje} puntos, cada punto vale ${fmt(p.valorPunto)} de descuento en tu próximo pedido.` },
  ];
  const faq = [
    { q: "¿Quién puede sumar puntos?", a: "Todos los clientes con compras facturadas: instituciones, empresas, consorcios y comercios." },
    { q: "¿Cómo consulto mis puntos?", a: "Pedinos tu saldo por WhatsApp; también lo informamos con cada factura." },
    { q: "¿Los puntos vencen?", a: `Sí, a los ${p.vencimientoMeses} meses de haberlos sumado.` },
    { q: "¿Se combina con otros descuentos?", a: "Sí, el canje se aplica sobre el total ya descontado por cantidad, ofertas o cupones." },
  ];
  return (
    <>
      <Ld data={[crumbsLd([{ name: "Inicio", path: "/" }, { name: "Programa de puntos", path: "/programa-de-puntos" }], site.url),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]} />
      <PageHead crumb="Programa de puntos" title="⭐ Programa de puntos" sub="Cada compra suma. Canjeá tus puntos por descuento en el próximo pedido." perks={[`1 punto cada ${fmt(p.pesosPorPunto)}`, `1 punto = ${fmt(p.valorPunto)}`, "Para todos los clientes"]} />
      <section className="section">
        <div className="wrap">
          <div className="steps">
            {pasos.map((x, i) => <div key={x.t} className="step reveal" style={{ transitionDelay: `${i * 100}ms` }}><span className="step-n">{i + 1}</span><span className="step-ic">{x.ic}</span><h3>{x.t}</h3><p>{x.d}</p></div>)}
          </div>
          <div className="policy" style={{ maxWidth: 820, margin: "40px auto 0" }}>
            {faq.map((f) => <div key={f.q} className="reveal"><h2>{f.q}</h2><p>{f.a}</p></div>)}
          </div>
          <div className="banner reveal" style={{ marginTop: 36 }}>
            <div><h3>¿Querés sumarte o saber tu saldo?</h3><p>Escribinos y te damos de alta en el programa.</p></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-wa" href={waLink("Hola! Quiero sumarme al programa de puntos / consultar mi saldo.")} target="_blank" rel="noopener">💬 Consultar mis puntos</a>
              <Link className="btn btn-primary" href="/productos">Ver productos</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
