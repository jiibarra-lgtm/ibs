import type { Metadata } from "next";
import { CartelGenerator } from "@/components/Tools";

export const metadata: Metadata = {
  title: "Generador de carteles para baños gratis",
  description: "Creá carteles de higiene para baños con el nombre de tu empresa: lavado de manos, piso mojado, alcohol en gel. Listos para imprimir en A4.",
  alternates: { canonical: "/herramientas/carteles" },
};

export default function Page() {
  return (
    <>
      <section className="page-head no-print"><div className="wrap"><h1>🖨️ Generador de carteles</h1><p>Elegí un modelo, poné el nombre de tu empresa e imprimilo en A4.</p></div></section>
      <section className="section" style={{ paddingTop: 36 }}><div className="wrap"><CartelGenerator /></div></section>
    </>
  );
}
