import type { Metadata } from "next";
import Link from "next/link";
import { getProductos } from "@/lib/catalog";
import QuickOrder from "@/components/QuickOrder";

export const metadata: Metadata = {
  title: "Carga rápida: pegá tu lista y cotizá",
  description: "Pegá tu lista de insumos de limpieza (de WhatsApp, Excel o un mail) y armamos la cotización automáticamente.",
  alternates: { canonical: "/carga-rapida" },
};

export default async function Page() {
  const productos = await getProductos();
  return (
    <>
      <section className="page-head kits-head">
        <div className="wrap">
          <nav className="crumbs"><Link href="/">Inicio</Link> / <span>Carga rápida</span></nav>
          <h1>⚡ Carga rápida</h1>
          <p>¿Ya tenés tu lista? Pegala tal cual (de WhatsApp, Excel o un mail) y la convertimos en una cotización en segundos.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap"><QuickOrder productos={productos} /></div>
      </section>
    </>
  );
}
