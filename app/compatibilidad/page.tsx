import type { Metadata } from "next";
import { Compatibilidad } from "@/components/Tools";

export const metadata: Metadata = {
  title: "Compatibilidad de dispensers e insumos",
  description: "Qué toallas, jabón, papel higiénico y alcohol en gel van con cada tipo de dispenser. Consultá antes de pedir.",
  alternates: { canonical: "/compatibilidad" },
};

export default function Page() {
  return (
    <>
      <section className="page-head"><div className="wrap"><h1>🔗 Compatibilidad de dispensers</h1><p>Elegí tu dispenser y mirá qué recargas le van.</p></div></section>
      <section className="section" style={{ paddingTop: 36 }}><div className="wrap"><Compatibilidad /></div></section>
    </>
  );
}
