import Link from "next/link";
import { waLink } from "@/lib/site";

const sugeridos = [
  ["/productos", "Catálogo completo"], ["/kits", "Kits por rubro"], ["/promos", "Ofertas del mes"],
  ["/guias", "Guías"], ["/nuestra-fabrica", "Nuestra fábrica"], ["/dispensers-en-comodato", "Dispensers en comodato"],
];

export default function NotFound() {
  return (
    <section className="section"><div className="wrap" style={{ textAlign: "center", maxWidth: 720 }}>
      <p style={{ fontSize: "3rem" }}>🧽</p>
      <h1 style={{ marginBottom: 10 }}>No encontramos esta página</h1>
      <p className="lead" style={{ margin: "0 auto 22px" }}>Puede que el producto ya no esté publicado o que el link haya cambiado. Buscá en el catálogo o probá con estas secciones:</p>
      <form action="/productos" method="get" style={{ display: "flex", gap: 8, maxWidth: 460, margin: "0 auto 22px" }}>
        <input name="q" placeholder="Buscar producto (ej: toallas, lavandina)" aria-label="Buscar producto" style={{ flex: 1, padding: "12px 16px", borderRadius: 999, border: "1px solid var(--line)" }} />
        <button className="btn btn-primary" type="submit">Buscar</button>
      </form>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {sugeridos.map(([h, l]) => <Link key={h} className="btn btn-sm btn-outline" href={h}>{l}</Link>)}
      </div>
      <p className="note" style={{ marginTop: 22 }}>¿Buscabas algo puntual? <a href={waLink("Hola! Estoy buscando un producto que no encuentro en la web.")} target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>Escribinos por WhatsApp</a>.</p>
    </div></section>
  );
}
