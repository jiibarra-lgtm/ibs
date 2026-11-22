import type { Metadata } from "next";
import Link from "next/link";
import { getKitViews } from "@/lib/kits";
import KitsBrowser from "@/components/KitsBrowser";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kits de limpieza por rubro con descuento",
  description: "Kits de limpieza armados por rubro con descuento: baño, cocina, restaurante, fábrica, comercio, oficina, consorcio, salud y escuelas. CABA y GBA.",
  alternates: { canonical: "/kits" },
};

export default async function KitsPage() {
  const kits = await getKitViews();
  return (
    <>
      <section className="page-head kits-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Migas"><Link href="/">Inicio</Link> / <span>Kits</span></nav>
          <h1>Kits de limpieza para cada rubro</h1>
          <p>Todo lo que tu lugar necesita en un solo pedido, con descuento incluido. Podés ajustar las cantidades antes de agregar.</p>
          <div className="kits-perks">
            <span>🏭 Directo de fábrica</span><span>🎁 Hasta −12% por kit</span><span>✏️ Cantidades a medida</span><span>🚚 Entrega 24–48 hs</span>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <KitsBrowser kits={kits} />
          <div className="banner reveal" style={{ marginTop: 40 }}>
            <div><span className="pill pill-gold">A medida</span><h3>¿Tu rubro no está?</h3><p>Contanos qué tipo de lugar es y cuánta gente circula: te armamos el kit ideal.</p></div>
            <a className="btn btn-wa" href={waLink("Hola! Quiero que me armen un kit de limpieza a medida para mi lugar.")} target="_blank" rel="noopener">💬 Pedir kit a medida</a>
          </div>
        </div>
      </section>
    </>
  );
}
