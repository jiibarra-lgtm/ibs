"use client";

import { useState } from "react";
import type { Producto } from "@/lib/catalog";
import { norm, parseLinea, rank } from "@/lib/matcher";
import { useCart } from "./CartProvider";

type Row = { original: string; cantidad: number; slug: string; opciones: string[]; seguro: boolean };
const EJEMPLO = `20 cajas toallas intercaladas
lavandina concentrada x 10
papel higiénico jumbo - 12
6 alcohol en gel 5 litros
guantes industriales	24
bolsas de consorcio 50`;

export default function QuickOrder({ productos }: { productos: Producto[] }) {
  const { addMany, setOpen } = useCart();
  const [txt, setTxt] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const by = Object.fromEntries(productos.map((p) => [p.slug, p]));

  function detectar(texto = txt) {
    const out: Row[] = [];
    texto.split(/\r?\n/).forEach((l) => {
      const L = parseLinea(l);
      if (!L) return;
      const r = rank(L.texto, productos);
      const seguro = !!r[0] && r[0].score >= 0.75 && (!r[1] || r[0].score - r[1].score > 0.12);
      out.push({ original: L.original, cantidad: L.cantidad, slug: r[0] && r[0].score >= 0.45 ? r[0].p.slug : "", opciones: r.map((x) => x.p.slug), seguro });
    });
    setRows(out);
  }

  function leerArchivo(f: File) {
    const fr = new FileReader();
    fr.onload = () => { const t = String(fr.result); setTxt(t); detectar(t); };
    fr.readAsText(f);
  }

  function agregar() {
    if (!rows) return;
    const list = rows.filter((r) => r.cantidad > 0).map((r) => {
      const p = by[r.slug];
      return p
        ? { slug: p.slug, nombre: p.nombre, imagen: p.imagenes[0], precio: p.precio }
        : { slug: `libre-${norm(r.original).replace(/ /g, "-").slice(0, 40)}`, nombre: `${r.original.replace(/^\d+\s*/, "")} (a consultar)`, imagen: "/img/marca/isotipo.png" };
    });
    addMany(list, rows.filter((r) => r.cantidad > 0).map((r) => r.cantidad));
    setOpen(true);
  }

  const encontrados = rows?.filter((r) => r.slug).length ?? 0;

  return (
    <div className="qo">
      <div className="qo-in reveal">
        <div className="qo-h">
          <b>1. Pegá tu lista</b>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-sm btn-ghost" style={{ color: "var(--teal)" }} onClick={() => { setTxt(EJEMPLO); detectar(EJEMPLO); }}>Probar con un ejemplo</button>
            <label className="btn btn-sm btn-ghost" style={{ color: "var(--teal)", cursor: "pointer" }}>📎 Subir .txt / .csv<input type="file" accept=".txt,.csv" hidden onChange={(e) => e.target.files?.[0] && leerArchivo(e.target.files[0])} /></label>
          </div>
        </div>
        <textarea rows={9} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={"Un producto por renglón, con su cantidad. Por ejemplo:\n20 toallas intercaladas\nlavandina x 10\npapel jumbo - 12"} />
        <p className="note">Funciona con “20 toallas”, “toallas x 20”, “toallas - 20” o dos columnas copiadas de Excel.</p>
        <button className="btn btn-primary btn-lg btn-shine" disabled={!txt.trim()} onClick={() => detectar()}>Detectar productos</button>
      </div>

      {rows && (
        <div className="qo-out reveal in">
          <div className="qo-h"><b>2. Revisá</b><span className="note">{encontrados} de {rows.length} renglones reconocidos</span></div>
          {rows.map((r, i) => {
            const p = by[r.slug];
            return (
              <div key={i} className={`qo-row ${p ? (r.seguro ? "ok" : "maybe") : "no"}`}>
                <span className="qo-st">{p ? (r.seguro ? "✓" : "?") : "!"}</span>
                <input type="number" min={0} value={r.cantidad} aria-label="Cantidad" onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, cantidad: Math.max(0, +e.target.value) } : x))} />
                <div className="qo-main">
                  <select value={r.slug} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, slug: e.target.value, seguro: true } : x))}>
                    <option value="">— No está en el catálogo: consultar —</option>
                    {r.opciones.length > 0 && <optgroup label="Sugeridos">{r.opciones.map((s) => <option key={s} value={s}>{by[s].nombre}</option>)}</optgroup>}
                    <optgroup label="Todos los productos">{productos.filter((x) => !r.opciones.includes(x.slug)).map((x) => <option key={x.slug} value={x.slug}>{x.nombre}</option>)}</optgroup>
                  </select>
                  <small>Escribiste: “{r.original}”</small>
                </div>
                {p ? <img src={p.imagenes[0]} alt="" /> : <span className="qo-ph">?</span>}
              </div>
            );
          })}
          <div className="qo-legend"><span><i className="ok" />Seguro</span><span><i className="maybe" />Revisá</span><span><i className="no" />Lo consultamos aparte</span></div>
          <button className="btn btn-primary btn-lg btn-block btn-shine" onClick={agregar}>3. Agregar todo a la cotización</button>
        </div>
      )}
    </div>
  );
}
