import type { Metadata } from "next";
import { EtiquetaGenerator } from "@/components/Tools";

export const metadata: Metadata = {
  title: "Etiquetas personalizadas para dispensers",
  description: "Diseñá la etiqueta con el nombre de tu empresa para tus dispensers en comodato y pedila por WhatsApp.",
  alternates: { canonical: "/herramientas/etiquetas" },
};

export default function Page() {
  return (
    <>
      <section className="page-head"><div className="wrap"><h1>🏷️ Etiquetas personalizadas</h1><p>Mirá cómo queda la etiqueta con tu marca y pedila junto con tus dispensers.</p></div></section>
      <section className="section" style={{ paddingTop: 36 }}><div className="wrap"><EtiquetaGenerator /></div></section>
    </>
  );
}
