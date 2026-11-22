"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { flyToCart } from "./Shop";

export type KitView = {
  slug: string; nombre: string; rubro: string; para: string; icono: string; off: number; tag?: string; descripcion: string;
  items: { slug: string; nombre: string; imagen: string; cantidad: number }[];
};

export function useKitAdd(k: KitView) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(k.items.map((i) => [i.slug, i.cantidad])));
  const items = k.items.map((i) => ({ ...i, cantidad: qty[i.slug] ?? 0 })).filter((i) => i.cantidad > 0);
  const unidades = items.reduce((a, i) => a + i.cantidad, 0);
  const custom = k.items.some((i) => (qty[i.slug] ?? 0) !== i.cantidad);
  const agregar = (img?: HTMLImageElement | null) => {
    if (!items.length) return;
    flyToCart(img ?? null);
    add({
      slug: custom ? `${k.slug}-${items.map((i) => i.cantidad).join("-")}` : k.slug,
      nombre: custom ? `${k.nombre} (personalizado)` : k.nombre,
      imagen: k.items[0].imagen,
      kit: { off: k.off, unidades, detalle: items.map((i) => `${i.cantidad}× ${i.nombre}`) },
    }, 1);
    setTimeout(() => setOpen(true), 650);
  };
  return { qty, setQty, items, unidades, custom, agregar };
}

export default function KitCard({ k }: { k: KitView }) {
  const [edit, setEdit] = useState(false);
  const { qty, setQty, unidades, custom, agregar } = useKitAdd(k);
  return (
    <article className={`kit reveal ${k.tag ? "kit--hot" : ""}`}>
      {k.tag && <span className="kit-tag">{k.tag}</span>}
      <div className="kit-head">
        <span className="kit-ic" aria-hidden>{k.icono}</span>
        <div><span className="kit-rubro">{k.rubro}</span><h3><Link href={`/kits/${k.slug}`}>{k.nombre}</Link></h3><p>{k.para}</p></div>
        <span className="kit-off">−{k.off}%</span>
      </div>
      <Link href={`/kits/${k.slug}`} className="kit-imgs" aria-label={`Ver ${k.nombre}`}>
        {k.items.slice(0, 5).map((i) => <img key={i.slug} src={i.imagen} alt={i.nombre} loading="lazy" />)}
      </Link>
      <p className="kit-desc">{k.descripcion}</p>
      <ul className={`kit-list ${edit ? "kit-list--edit" : ""}`}>
        {k.items.map((i) => (
          <li key={i.slug}>
            {edit ? (
              <span className="kit-q">
                <button onClick={() => setQty({ ...qty, [i.slug]: Math.max(0, (qty[i.slug] ?? 0) - 1) })} aria-label="Restar">−</button>
                <b>{qty[i.slug]}</b>
                <button onClick={() => setQty({ ...qty, [i.slug]: (qty[i.slug] ?? 0) + 1 })} aria-label="Sumar">+</button>
              </span>
            ) : <b>{qty[i.slug]}×</b>}
            <span className={qty[i.slug] === 0 ? "off" : ""}>{i.nombre}</span>
          </li>
        ))}
      </ul>
      <div className="kit-foot">
        <button className="kit-edit" onClick={() => setEdit((v) => !v)}>{edit ? "✓ Listo" : "✏️ Personalizar cantidades"}</button>
        {custom && <span className="kit-custom">Personalizado</span>}
      </div>
      <button className="btn btn-primary btn-block btn-shine" disabled={!unidades}
        onClick={(e) => agregar(e.currentTarget.closest(".kit")?.querySelector(".kit-imgs img") as HTMLImageElement)}>
        Agregar kit · {unidades} u. · −{k.off}%
      </button>
    </article>
  );
}
