import type { Metadata } from "next";
import SharedCart from "./SharedCart";

export const metadata: Metadata = {
  title: "Carrito compartido",
  description: "Lista de cotización compartida de Ibarra Insumos.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/carrito-compartido" },
};

export default function Page() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <SharedCart />
      </div>
    </section>
  );
}
