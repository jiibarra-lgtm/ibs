import type { Metadata } from "next";
import Link from "next/link";
import { getCategorias, getProductos } from "@/lib/catalog";
import CatalogBrowser from "@/components/CatalogBrowser";

export const metadata: Metadata = {
  title: "Catálogo mayorista de productos de limpieza",
  description: "Catálogo mayorista de dispensers, papeles, químicos de limpieza, higiene y descartables. Armá tu lista y cotizá por WhatsApp. Entregas en CABA y GBA.",
  alternates: { canonical: "/productos" },
};

export default async function Productos() {
  const [productos, categorias] = await Promise.all([getProductos(), getCategorias()]);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Migas"><Link href="/">Inicio</Link> / <span>Productos</span></nav>
          <h1>Catálogo de productos</h1>
          <p>Fabricantes y distribuidores: precios mayoristas directo de fábrica. Agregá productos a tu cotización y mandala por WhatsApp, o usá la <Link href="/carga-rapida" style={{ textDecoration: "underline" }}>carga rápida</Link>.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap"><CatalogBrowser productos={productos} categorias={categorias} /></div>
      </section>
    </>
  );
}
