"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { decodeCart, useCart, type CartItem } from "@/components/CartProvider";

export default function SharedCart() {
  const { addMany, setOpen } = useCart();
  const [items, setItems] = useState<CartItem[] | null>(null);
  useEffect(() => { setItems(decodeCart(location.hash.slice(1))); }, []);

  if (items === null) return <p className="note">Cargando…</p>;
  if (!items.length) return (
    <div className="empty">
      <p style={{ fontSize: "2rem" }}>🔗</p>
      <h1 className="section-title">El link del carrito no es válido</h1>
      <p className="lead">Pedile a quien te lo mandó que lo vuelva a compartir, o armá tu lista desde el <Link href="/productos" style={{ textDecoration: "underline" }}>catálogo</Link>.</p>
    </div>
  );

  const unidades = items.reduce((a, i) => a + i.cantidad * (i.kit?.unidades ?? 1), 0);
  return (
    <>
      <p className="eyebrow">Carrito compartido</p>
      <h1 className="section-title">Te compartieron esta lista de cotización</h1>
      <p className="lead">{items.length} {items.length === 1 ? "producto" : "productos"} · {unidades} unidades. Podés sumarla a tu cotización, cambiar cantidades y enviarla por WhatsApp.</p>
      <div className="shared-list">
        {items.map((i) => (
          <div className="shared-item" key={i.slug}>
            <img src={i.imagen} alt={i.nombre} loading="lazy" />
            <div><b>{i.nombre}</b>{i.kit && <small>{i.kit.detalle.join(" · ")}</small>}</div>
            <b>x{i.cantidad}</b>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-block btn-shine" onClick={() => { addMany(items.map(({ cantidad, ...rest }) => rest), items.map((i) => i.cantidad)); setTimeout(() => setOpen(true), 300); }}>
        Agregar todo a mi cotización
      </button>
    </>
  );
}
