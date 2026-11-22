import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";
import { getCategorias, getProductos } from "@/lib/catalog";
import tienda from "@/data/tienda.json";
import testimonios from "@/data/testimonios.json";
import guias from "@/data/guias.json";

export const metadata: Metadata = { title: "Panel de control", robots: { index: false, follow: false } };

export default async function Admin() {
  const [productos, categorias] = await Promise.all([getProductos(), getCategorias()]);
  return <AdminApp tienda={tienda} productos={productos} categorias={categorias} testimonios={testimonios as { texto: string; nombre: string; cargo?: string }[]} guias={guias} />;
}
