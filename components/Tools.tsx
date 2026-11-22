"use client";

import { useState } from "react";
import { compat } from "@/lib/content";
import { site, waLink } from "@/lib/site";

const carteles = [
  { ic: "🧼", t: "Por favor lavá tus manos", s: "Cuidamos tu salud y la de todos" },
  { ic: "🚽", t: "Mantené el baño limpio", s: "Gracias por colaborar" },
  { ic: "🧻", t: "No arrojes papel al inodoro", s: "Usá el cesto de residuos" },
  { ic: "⚠️", t: "Piso mojado", s: "Precaución al transitar" },
  { ic: "🧴", t: "Usá alcohol en gel", s: "Higiene ante todo" },
];

export function CartelGenerator() {
  const [i, setI] = useState(0);
  const [empresa, setEmpresa] = useState("");
  const [titulo, setTitulo] = useState(carteles[0].t);
  const [sub, setSub] = useState(carteles[0].s);
  const pick = (n: number) => { setI(n); setTitulo(carteles[n].t); setSub(carteles[n].s); };

  return (
    <div className="tool-layout">
      <div className="tool-panel no-print">
        <div className="field"><label>Modelo</label>
          <div className="opts">{carteles.map((c, n) => <button key={c.t} className={n === i ? "on" : ""} onClick={() => pick(n)}>{c.ic} {c.t.split(" ").slice(0, 3).join(" ")}</button>)}</div>
        </div>
        <div className="field"><label htmlFor="ct-t">Texto principal</label><input id="ct-t" value={titulo} maxLength={60} onChange={(e) => setTitulo(e.target.value)} /></div>
        <div className="field"><label htmlFor="ct-s">Texto secundario</label><input id="ct-s" value={sub} maxLength={80} onChange={(e) => setSub(e.target.value)} /></div>
        <div className="field"><label htmlFor="ct-e">Nombre de tu empresa</label><input id="ct-e" value={empresa} maxLength={40} placeholder="Ej: Clínica San José" onChange={(e) => setEmpresa(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir / Guardar PDF</button>
        <p className="note">Sale en hoja A4. En el diálogo de impresión elegí “Guardar como PDF” si querés el archivo.</p>
      </div>
      <div className="preview-wrap">
        <div className="cartel">
          <div className="big-ic">{carteles[i].ic}</div>
          <h2>{titulo}</h2>
          <p>{sub}</p>
          {empresa && <div className="co">{empresa}</div>}
          <div className="by">Insumos provistos por {site.name}</div>
        </div>
      </div>
    </div>
  );
}

export function EtiquetaGenerator() {
  const [empresa, setEmpresa] = useState("");
  const [sector, setSector] = useState("");
  const [cant, setCant] = useState(10);
  const msg = `Hola! Quiero pedir ${cant} etiquetas para dispensers.\nEmpresa: ${empresa || "-"}${sector ? `\nSector / leyenda: ${sector}` : ""}`;
  return (
    <div className="tool-layout">
      <div className="tool-panel">
        <div className="field"><label htmlFor="et-e">Empresa / institución</label><input id="et-e" value={empresa} maxLength={36} placeholder="Tu empresa" onChange={(e) => setEmpresa(e.target.value)} /></div>
        <div className="field"><label htmlFor="et-s">Sector o leyenda (opcional)</label><input id="et-s" value={sector} maxLength={40} placeholder="Ej: Baño planta baja" onChange={(e) => setSector(e.target.value)} /></div>
        <div className="field"><label htmlFor="et-c">Cantidad</label><input id="et-c" type="number" min={1} value={cant} onChange={(e) => setCant(Math.max(1, +e.target.value || 1))} /></div>
        <a className="btn btn-wa" href={waLink(msg)} target="_blank" rel="noopener">📲 Pedir etiquetas por WhatsApp</a>
        <p className="note">Las etiquetas se entregan junto con los dispensers en comodato.</p>
      </div>
      <div className="preview-wrap">
        <div className="etiqueta">
          <small>PROVISTO POR IBARRA INSUMOS</small>
          <b>{empresa || "Tu empresa"}</b>
          {sector && <span>{sector}</span>}
        </div>
      </div>
    </div>
  );
}

type Key = keyof typeof compat;
export function Compatibilidad() {
  const [k, setK] = useState<Key>("toallas");
  const d = compat[k];
  const mark = { ok: "✅", warn: "⚠️", no: "❌" } as const;
  return (
    <>
      <div className="compat-grid">
        {(Object.keys(compat) as Key[]).map((key) => (
          <button key={key} className={`compat-card ${k === key ? "on" : ""}`} onClick={() => setK(key)} aria-pressed={k === key}>
            <div className="ic">{compat[key].icono}</div>
            <h3>{compat[key].nombre}</h3>
          </button>
        ))}
      </div>
      <div className="compat-result" aria-live="polite">
        <h3>{d.icono} Insumos compatibles con {d.nombre.toLowerCase()}</h3>
        {d.items.map((it) => (
          <div className="compat-row" key={it.nombre}>
            <span>{mark[it.estado]}</span>
            <div><b>{it.nombre}</b><div className="note">{it.detalle}</div></div>
          </div>
        ))}
        <div><a className="btn btn-wa" href={waLink(d.wa)} target="_blank" rel="noopener">💬 Cotizar estos insumos</a></div>
      </div>
    </>
  );
}
