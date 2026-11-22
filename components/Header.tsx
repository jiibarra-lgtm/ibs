"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { site, waLink } from "@/lib/site";
import { AnnouncementBar } from "./Fx";

const links = [
  { href: "/productos", label: "Productos" },
  { href: "/kits", label: "Kits" },
  { href: "/nuestra-fabrica", label: "Fábrica" },
  { href: "/promos", label: "Ofertas" },
  { href: "/carga-rapida", label: "⚡ Carga rápida" },
  { href: "/guias", label: "Guías" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  useEffect(() => setMenu(false), [path]);

  return (
    <>
      <AnnouncementBar />
      <header className="header">
        <div className="wrap">
          <Link href="/" className="logo" aria-label={`${site.name} — inicio`}>
            <img src="/img/marca/isotipo.png" alt="" width={36} height={44} />
            <span className="logo-txt"><b>IBARRA</b><span>INSUMOS</span><small>Fabricantes y distribuidores</small></span>
          </Link>
          <nav className="nav" aria-label="Principal">
            {links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>
          <button className="btn btn-primary btn-sm cart-btn" onClick={() => setOpen(true)} aria-label={`Cotización, ${count} productos`}>
            🛒 <span className="label">Cotización</span>
            {count > 0 && <span className="badge">{count}</span>}
          </button>
          <button className="burger" aria-label="Menú" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>{menu ? "✕" : "☰"}</button>
        </div>
        <nav className={`mobile-nav ${menu ? "open" : ""}`} aria-label="Menú móvil">
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setMenu(false)}>{l.label}</Link>)}
          <a href={waLink("Hola! Quiero hacer una consulta.")} target="_blank" rel="noopener">💬 WhatsApp</a>
        </nav>
      </header>
    </>
  );
}
