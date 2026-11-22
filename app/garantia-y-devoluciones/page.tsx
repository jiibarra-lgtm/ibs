import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import PageHead, { crumbsLd, Ld } from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Garantía de calidad, cambios y devoluciones",
  description: "Política de garantía, cambios y devoluciones de Ibarra Insumos: productos fallados, errores de entrega, dispensers en comodato y botón de arrepentimiento.",
  alternates: { canonical: "/garantia-y-devoluciones" },
};

const items = [
  { t: "Producto fallado o dañado", d: "Si un producto llega dañado o con fallas de fabricación, avisanos dentro de las 48 hs de recibido con una foto y el número de remito. Lo cambiamos sin cargo en la siguiente entrega o lo retiramos." },
  { t: "Error en la entrega", d: "Si recibiste un producto distinto al pedido o una cantidad equivocada, lo corregimos sin costo. Revisá el pedido al recibirlo y anotá la diferencia en el remito." },
  { t: "Químicos y productos de higiene", d: "Por seguridad e higiene, no aceptamos devoluciones de productos químicos o de higiene abiertos, salvo que tengan una falla de fabricación." },
  { t: "Dispensers en comodato", d: "Los dispensers en comodato tienen mantenimiento y reposición sin cargo mientras dure el acuerdo. Si uno se rompe por uso normal, lo reemplazamos." },
  { t: "Dispensers comprados", d: "Si un dispenser comprado presenta una falla de fabricación, lo cambiamos o reparamos dentro de la garantía del fabricante." },
  { t: "Arrepentimiento de compra", d: "Si sos consumidor final, podés arrepentirte de una compra hecha a distancia dentro de los 10 días corridos desde que recibiste el producto, sin costo y sin dar motivos (Ley 24.240 de Defensa del Consumidor). El producto tiene que estar sin uso y en su envase original." },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({ "@type": "Question", name: i.t, acceptedAnswer: { "@type": "Answer", text: i.d } })),
};

export default function Page() {
  return (
    <>
      <Ld data={[crumbsLd([{ name: "Inicio", path: "/" }, { name: "Garantía y devoluciones", path: "/garantia-y-devoluciones" }], site.url), faqLd]} />
      <PageHead crumb="Garantía y devoluciones" title="🛡️ Garantía, cambios y devoluciones" sub="Si algo no está bien con tu pedido, lo resolvemos. Estas son las condiciones." perks={["Cambio sin cargo por fallas", "Corrección de errores de entrega", "Botón de arrepentimiento"]} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="policy">
            {items.map((i) => <div key={i.t} className="reveal"><h2>{i.t}</h2><p>{i.d}</p></div>)}
          </div>
          <div className="banner reveal" id="arrepentimiento" style={{ marginTop: 32 }}>
            <div><span className="pill pill-gold">Botón de arrepentimiento</span><h3>¿Querés arrepentirte de una compra?</h3><p>Escribinos con tu nombre, número de remito o factura y el producto. Te confirmamos la recepción y coordinamos el retiro.</p></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href={`mailto:${site.email}?subject=${encodeURIComponent("Arrepentimiento de compra")}`}>Arrepentirme por e-mail</a>
              <a className="btn btn-wa" href={waLink("Hola! Quiero arrepentirme de una compra. Mi número de remito/factura es:")} target="_blank" rel="noopener">💬 Por WhatsApp</a>
            </div>
          </div>
          <p className="note" style={{ marginTop: 20 }}>¿Dudas sobre un pedido? Escribinos a <a href={`mailto:${site.email}`}>{site.email}</a> o al {site.phoneDisplay}. Ver también <Link href="/privacidad" style={{ textDecoration: "underline" }}>política de privacidad</Link>.</p>
        </div>
      </section>
    </>
  );
}
