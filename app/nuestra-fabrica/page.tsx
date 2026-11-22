import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { getProductos } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import PageHead, { crumbsLd, Ld } from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Nuestra fábrica de productos de limpieza",
  description: "Conocé la planta de Ibarra Insumos: fabricamos la mayoría de nuestros productos de limpieza y los distribuimos con reparto propio en CABA y GBA.",
  alternates: { canonical: "/nuestra-fabrica" },
  openGraph: { images: [{ url: "/img/marca/planta.webp", width: 1400, height: 1050 }] },
};

const etapas = [
  { ic: "🏭", t: "Fabricación", d: "Producimos en nuestra planta la mayoría de los productos de la línea." },
  { ic: "🔎", t: "Control", d: "Revisamos cada lote antes de que salga al depósito." },
  { ic: "📦", t: "Depósito", d: "Stock permanente para responder pedidos grandes y entregas programadas." },
  { ic: "🚚", t: "Reparto propio", d: "Nuestra flota entrega en CABA y GBA en 24–48 hs." },
];

const videoLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Vista aérea de la planta y depósito de Ibarra Insumos",
  description: "Recorrido aéreo por la planta, el depósito y la flota de reparto de Ibarra Insumos, fabricantes y distribuidores de productos de limpieza.",
  thumbnailUrl: [`${site.url}/video/planta-poster.webp`],
  uploadDate: "2026-11-20",
  duration: "PT6S",
  contentUrl: `${site.url}/video/planta.mp4`,
};

export default async function Page() {
  const propios = (await getProductos()).filter((p) => p.fabricacionPropia);
  return (
    <>
      <Ld data={[crumbsLd([{ name: "Inicio", path: "/" }, { name: "Nuestra fábrica", path: "/nuestra-fabrica" }], site.url), videoLd]} />
      <PageHead crumb="Nuestra fábrica" title="🏭 Nuestra fábrica" sub={`Fabricamos la mayoría de lo que vendemos y distribuimos el resto. Más de ${new Date().getFullYear() - site.founded} años abasteciendo instituciones en Buenos Aires.`} perks={["Precio directo de fábrica", "Calidad controlada en origen", "Reparto propio"]} />
      <section className="section">
        <div className="wrap split">
          <div className="reveal reveal-left">
            <video className="about-video" src="/video/planta.mp4" poster="/video/planta-poster.webp" autoPlay muted loop playsInline preload="metadata" width={1152} height={576} aria-label="Vista aérea de la planta de Ibarra Insumos" />
          </div>
          <div className="reveal">
            <p className="eyebrow">De la planta a tu institución</p>
            <h2 className="section-title">Fabricantes y distribuidores, sin intermediarios</h2>
            <p className="lead">Al fabricar nuestros propios productos controlamos la calidad desde el origen y te damos <b>precio directo de fábrica</b>. Lo que no fabricamos lo distribuimos, para que resuelvas toda la compra de limpieza e higiene en una sola orden.</p>
            <ul className="checks">
              <li>Una sola factura para toda la línea</li>
              <li>Stock para pedidos grandes y entregas programadas</li>
              <li>Visitas a la planta para clientes institucionales</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Cómo trabajamos</p><h2 className="section-title">Del lote al reparto</h2></div>
          <div className="steps steps--4">
            {etapas.map((p, i) => (
              <div key={p.t} className="step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="step-n">{i + 1}</span><span className="step-ic">{p.ic}</span><h3>{p.t}</h3><p>{p.d}</p>
              </div>
            ))}
          </div>
          <div className="fab-gallery reveal">
            <figure><img src="/img/marca/planta.webp" alt="Frente de la planta de Ibarra Insumos con la flota de reparto" loading="lazy" /><figcaption>La planta</figcaption></figure>
            <figure><img src="/img/marca/deposito.webp" alt="Depósito de Ibarra Insumos con stock de productos de limpieza" loading="lazy" /><figcaption>El depósito</figcaption></figure>
            <figure><img src="/img/marca/camioneta.webp" alt="Camioneta de reparto propio de Ibarra Insumos" loading="lazy" /><figcaption>Reparto propio</figcaption></figure>
          </div>
        </div>
      </section>
      {propios.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head reveal"><p className="eyebrow">Fabricación propia</p><h2 className="section-title">Productos que fabricamos</h2></div>
            <div className="grid">{propios.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="wrap">
          <div className="banner reveal">
            <div><span className="pill pill-gold">Clientes institucionales</span><h3>¿Querés conocer la planta?</h3><p>Coordinamos una visita para compras de hospitales, empresas y organismos.</p></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-wa" href={waLink("Hola! Quiero coordinar una visita a la planta.")} target="_blank" rel="noopener">💬 Coordinar visita</a>
              <Link className="btn btn-primary" href="/marca-propia">Ver marca propia</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
