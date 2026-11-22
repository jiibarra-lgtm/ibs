"use client";

import { useEffect, useMemo, useState } from "react";
import type { Categoria, Producto } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import { waLink } from "@/lib/site";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function CatalogBrowser({ productos, categorias, inicial = "todos" }: {
  productos: Producto[]; categorias: Categoria[]; inicial?: string;
}) {
  const [cat, setCat] = useState(inicial);
  const [q, setQ] = useState("");
  useEffect(() => { const v = new URLSearchParams(location.search).get("q"); if (v) setQ(v.slice(0, 60)); }, []);
  const nombres = useMemo(() => Object.fromEntries(categorias.map((c) => [c.slug, c.nombre])), [categorias]);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    productos.forEach((p) => (m[p.categoria] = (m[p.categoria] || 0) + 1));
    return m;
  }, [productos]);

  const lista = useMemo(() => {
    const t = norm(q.trim());
    return productos.filter((p) =>
      (cat === "todos" || p.categoria === cat) &&
      (!t || norm(`${p.nombre} ${p.descripcion} ${p.subcategoria ?? ""} ${nombres[p.categoria]}`).includes(t)));
  }, [productos, cat, q, nombres]);

  const opciones = [{ slug: "todos", nombre: "Todos" }, ...categorias];

  return (
    <div className="catalog">
      <aside className="filters" aria-label="Categorías">
        <h4>Categorías</h4>
        {opciones.map((c) => (
          <button key={c.slug} className={cat === c.slug ? "on" : ""} onClick={() => setCat(c.slug)}>
            {c.nombre} <small>{c.slug === "todos" ? productos.length : counts[c.slug] || 0}</small>
          </button>
        ))}
      </aside>
      <div>
        <div className="search">
          <span aria-hidden>🔍</span>
          <input type="search" placeholder="Buscar: lavandina, toallas, dispenser…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar productos" />
          {q && <button className="btn btn-sm" onClick={() => setQ("")}>Limpiar</button>}
        </div>
        <div className="chips" role="tablist">
          {opciones.map((c) => (
            <button key={c.slug} className={cat === c.slug ? "on" : ""} onClick={() => setCat(c.slug)}>{c.nombre}</button>
          ))}
        </div>
        <p className="result-meta">{lista.length} {lista.length === 1 ? "producto" : "productos"}</p>
        {lista.length ? (
          <div className="grid">
            {lista.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={nombres[p.categoria]} />)}
          </div>
        ) : (
          <div className="empty">
            <p><b>No encontramos “{q}” en el catálogo online.</b></p>
            <p style={{ margin: "6px 0 16px" }}>Trabajamos con muchos más productos de los que están publicados.</p>
            <a className="btn btn-wa" href={waLink(`Hola! Busco: ${q}`)} target="_blank" rel="noopener">Consultar por WhatsApp</a>
          </div>
        )}
      </div>
    </div>
  );
}
