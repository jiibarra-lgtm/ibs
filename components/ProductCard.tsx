"use client";

import Link from "next/link";
import type { Producto } from "@/lib/catalog";
import { useCart, fmt } from "./CartProvider";
import { waLink } from "@/lib/site";
import { maxEscala as maxOff, ofertaPara } from "@/lib/promos";
import { flyToCart } from "./Shop";

export default function ProductCard({ p, categoriaNombre }: { p: Producto; categoriaNombre?: string }) {
  const { add, has } = useCart();
  const inCart = has(p.slug);
  const mes = ofertaPara(p.slug);
  return (
    <article className="card reveal">
      <Link href={`/producto/${p.slug}`} className="card-img" aria-label={p.nombre}>
        <div className="card-badges">
          {mes > 0 && <span className="b b-hot">🔥 −{mes}% este mes</span>}
          {p.badge && <span className="b b-gold">{p.badge}</span>}
          {p.fabricacionPropia && <span className="b b-fab">🏭 Fabricación propia</span>}
        </div>
        <img src={p.imagenes[0]} alt={p.nombre} loading="lazy" width={300} height={300} />
      </Link>
      <div className="card-body">
        {categoriaNombre && <span className="card-cat">{categoriaNombre}</span>}
        <h3><Link href={`/producto/${p.slug}`}>{p.nombre}</Link></h3>
        <p>{p.descripcion}</p>
        {typeof p.precio === "number"
          ? <div className="card-price"><b>{fmt(p.precio)}</b><span>hasta −{Math.max(maxOff, mes)}% por cantidad</span></div>
          : <div className="card-vol">🏷️ Hasta <b>−{Math.max(maxOff, mes)}%</b> por cantidad</div>}
        <div className="card-actions no-print">
          <button className={`btn btn-primary ${inCart ? "added" : ""}`}
            onClick={(e) => { flyToCart(e.currentTarget.closest(".card")?.querySelector("img") ?? null); add({ slug: p.slug, nombre: p.nombre, imagen: p.imagenes[0], precio: p.precio }); }}>
            {inCart ? "✓ Sumar otro" : "+ Cotizar"}
          </button>
          <a className="btn btn-ghost" style={{ color: "var(--teal)", flex: "0 0 auto" }} aria-label={`Consultar ${p.nombre} por WhatsApp`}
            href={waLink(`Hola! Quiero consultar por: ${p.nombre}`)} target="_blank" rel="noopener">💬</a>
        </div>
      </div>
    </article>
  );
}
