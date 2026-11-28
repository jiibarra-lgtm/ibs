"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Categoria, Producto } from "@/lib/catalog";
import { costosApi, type Costo, type Vinculo } from "@/lib/octrack";
import { Card, Icon, PageHead } from "./ui";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const slugify = (s: string) => norm(s).replace(/ /g, "-").slice(0, 80);
const money = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : `$${Math.round(n).toLocaleString("es-AR")}`);
const STOP = new Set(["de", "x", "con", "para", "el", "la", "los", "las", "y", "en", "por", "un", "una", "u", "cm", "mts", "lts"]);

/** Parecido entre dos nombres (palabras en común), de 0 a 1. */
function parecido(a: string, b: string) {
  const A = new Set(norm(a).split(" ").filter((w) => w.length > 1 && !STOP.has(w)));
  const B = new Set(norm(b).split(" ").filter((w) => w.length > 1 && !STOP.has(w)));
  if (!A.size || !B.size) return 0;
  let n = 0; A.forEach((w) => { if (B.has(w)) n++; });
  return n / Math.min(A.size, B.size) * (2 * n / (A.size + B.size)) ** 0.5;
}
/** Costo con IVA para comparar con el precio de la tienda. */
const costoFinal = (v: Vinculo | undefined, c: Costo | undefined) => (v?.cost_override ?? (c ? (c.cost_gross ?? c.cost_net) : null)) ?? null;

type Props = {
  token: string; productos: Producto[]; categorias: Categoria[];
  setProds: (f: (p: Producto[]) => Producto[]) => void; ok: (m: string) => void;
};

export default function Costos({ token, productos, categorias, setProds, ok }: Props) {
  const [costos, setCostos] = useState<Costo[] | null>(null);
  const [links, setLinks] = useState<Record<string, Vinculo>>({});
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "sin" | "con">("todos");
  const [elegir, setElegir] = useState<Producto | null>(null);
  const [importar, setImportar] = useState(false);

  const cargar = useCallback(async () => {
    setErr("");
    try {
      const r = await costosApi<{ costs: Costo[]; links: Vinculo[] }>(token, "list");
      setCostos(r.costs);
      setLinks(Object.fromEntries(r.links.map((l) => [l.slug, l])));
    } catch (e) { setErr((e as Error).message); }
  }, [token]);
  useEffect(() => { void cargar(); }, [cargar]);

  const byId = useMemo(() => new Map((costos ?? []).map((c) => [c.id, c])), [costos]);
  const usados = useMemo(() => new Set(Object.values(links).map((l) => l.manual_cost_id).filter(Boolean) as string[]), [links]);

  async function guardar(items: Vinculo[]) {
    try {
      await costosApi(token, "set", { items });
      setLinks((m) => {
        const n = { ...m };
        for (const it of items) { if (!it.manual_cost_id && it.cost_override === null) delete n[it.slug]; else n[it.slug] = it; }
        return n;
      });
      return true;
    } catch (e) { ok(`✗ ${(e as Error).message}`); return false; }
  }

  // sugerencia automática para los que no tienen costo
  const sugerencias = useMemo(() => {
    if (!costos) return [];
    const libres = costos.filter((c) => !usados.has(c.id));
    const out: { p: Producto; c: Costo; s: number }[] = [];
    const tomado = new Set<string>();
    const cand = productos.filter((p) => !links[p.slug]).flatMap((p) => libres.map((c) => ({ p, c, s: parecido(p.nombre, c.description) }))).filter((x) => x.s >= 0.5).sort((a, b) => b.s - a.s);
    const hecho = new Set<string>();
    for (const x of cand) { if (hecho.has(x.p.slug) || tomado.has(x.c.id)) continue; hecho.add(x.p.slug); tomado.add(x.c.id); out.push(x); }
    return out;
  }, [costos, productos, links, usados]);

  const lista = productos.filter((p) => norm(p.nombre).includes(norm(q)))
    .filter((p) => filtro === "todos" || (filtro === "sin" ? !links[p.slug] : !!links[p.slug]));
  const conCosto = productos.filter((p) => links[p.slug]).length;

  if (err) return (
    <>
      <PageHead title="Costos" desc="Costos de cada producto, tomados de tu sistema de gestión." />
      <Card title="No se pudo conectar con el sistema"><p className="ad-mut">{err}</p><button className="ad-btn ad-btn--sm" style={{ marginTop: 12 }} onClick={cargar}>Reintentar</button></Card>
    </>
  );

  return (
    <>
      <PageHead title="Costos" desc="Elegí qué costo de tu sistema corresponde a cada producto. Los costos los cargás y actualizás en el sistema (Costos manuales); acá se ven siempre al día.">
        <button className="ad-btn ad-btn--ghost" disabled={!costos} onClick={() => setImportar(true)}><Icon n="download" size={16} /> Importar productos de mis costos</button>
      </PageHead>

      <div className="ad-kpis">
        <div className="ad-kpi"><span>Productos con costo</span><b>{conCosto}/{productos.length}</b><small>{productos.length - conCosto} sin costo</small></div>
        <div className="ad-kpi"><span>Costos en el sistema</span><b>{costos?.length ?? "…"}</b><small>{costos ? `${costos.length - usados.size} sin producto en la tienda` : "cargando"}</small></div>
        <div className="ad-kpi"><span>Sugerencias</span><b>{sugerencias.length}</b><small>emparejados por nombre</small></div>
        <div className="ad-kpi"><span>Con precio y costo</span><b>{productos.filter((p) => typeof p.precio === "number" && links[p.slug]).length}</b><small>muestran margen</small></div>
      </div>

      {sugerencias.length > 0 && (
        <Card title={`Sugerencias (${sugerencias.length})`} desc="Productos de la tienda que tienen un costo con nombre parecido. Revisá y aplicá."
          right={<button className="ad-btn ad-btn--sm" onClick={async () => { if (await guardar(sugerencias.map((x) => ({ slug: x.p.slug, name: x.p.nombre, manual_cost_id: x.c.id, cost_override: null })))) ok(`✓ ${sugerencias.length} costos asignados`); }}>Aplicar todas</button>}>
          <div className="ad-costs-sug">
            {sugerencias.slice(0, 30).map((x) => (
              <div key={x.p.slug} className="ad-costs-sugrow">
                <span><b>{x.p.nombre}</b><small className="ad-mut">→ {x.c.description}{x.c.supplier ? ` · ${x.c.supplier}` : ""} · {money(x.c.cost_gross ?? x.c.cost_net)}</small></span>
                <button className="ad-link" onClick={() => guardar([{ slug: x.p.slug, name: x.p.nombre, manual_cost_id: x.c.id, cost_override: null }])}>Aplicar</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="ad-tools" style={{ marginTop: 16 }}>
        <input placeholder="Buscar producto…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value as typeof filtro)}>
          <option value="todos">Todos</option><option value="sin">Sin costo</option><option value="con">Con costo</option>
        </select>
      </div>
      <div className="ad-list">
        {!costos && <p className="ad-mut">Cargando costos…</p>}
        {costos && lista.map((p) => {
          const v = links[p.slug];
          const c = v?.manual_cost_id ? byId.get(v.manual_cost_id) : undefined;
          const fin = costoFinal(v, c);
          const margen = typeof p.precio === "number" && fin ? ((p.precio - fin) / p.precio) * 100 : null;
          return (
            <div className="ad-item ad-item--cost" key={p.slug}>
              {p.imagenes[0] ? <img src={p.imagenes[0]} alt="" /> : <span className="ad-noimg" />}
              <div className="ad-item-main">
                <b>{p.nombre}</b>
                <small>
                  {c ? <>{c.description}{c.supplier ? ` · ${c.supplier}` : ""}</> : v?.cost_override != null ? "Costo propio" : <span style={{ color: "#fbbf24" }}>Sin costo asignado</span>}
                  {p.visible === false ? " · 🚫 oculto" : ""}
                </small>
              </div>
              <div className="ad-cost-num">
                <b>{money(fin)}</b>
                <small className="ad-mut">{c ? (c.includes_vat ? "con IVA" : `neto ${money(c.cost_net)} + IVA`) : v ? "propio" : ""}{margen !== null ? ` · margen ${margen.toFixed(0)}%` : ""}</small>
              </div>
              <button className="ad-link" onClick={() => setElegir(p)}>{v ? "Cambiar" : "Elegir costo"}</button>
            </div>
          );
        })}
      </div>

      {elegir && costos && (
        <Elegir p={elegir} costos={costos} usados={usados} actual={links[elegir.slug]} onClose={() => setElegir(null)}
          onPick={async (v) => { if (await guardar([v])) { ok("✓ Costo guardado"); setElegir(null); } }} />
      )}
      {importar && costos && (
        <Importar costos={costos.filter((c) => !usados.has(c.id))} productos={productos} categorias={categorias} onClose={() => setImportar(false)}
          onImport={async (nuevos, vincs) => {
            setProds((a) => [...a, ...nuevos]);
            if (await guardar(vincs)) ok(`✓ ${nuevos.length} productos importados como ocultos con su costo. Completalos y tocá Guardar para subirlos.`);
            setImportar(false);
          }} />
      )}
    </>
  );
}

function Elegir({ p, costos, usados, actual, onClose, onPick }: { p: Producto; costos: Costo[]; usados: Set<string>; actual?: Vinculo; onClose: () => void; onPick: (v: Vinculo) => void }) {
  const [q, setQ] = useState("");
  const [propio, setPropio] = useState(actual?.cost_override != null ? String(actual.cost_override) : "");
  const orden = useMemo(() => costos.map((c) => ({ c, s: parecido(p.nombre, c.description) }))
    .filter((x) => !q || norm(`${x.c.description} ${x.c.supplier ?? ""} ${x.c.sku ?? ""}`).includes(norm(q)))
    .sort((a, b) => b.s - a.s || a.c.description.localeCompare(b.c.description)).slice(0, 80), [costos, p.nombre, q]);
  return (
    <>
      <div className="ad-scrim on" onClick={onClose} />
      <aside className="ad-drawer" data-lenis-prevent>
        <header><h3>Costo de «{p.nombre}»</h3><button onClick={onClose} aria-label="Cerrar"><Icon n="x" /></button></header>
        <div className="ad-drawer-body">
          <input autoFocus placeholder="Buscar en mis costos (descripción, proveedor, código)…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="ad-costs-pick">
            {orden.map(({ c, s }) => (
              <button key={c.id} className={`ad-costs-opt${actual?.manual_cost_id === c.id ? " on" : ""}`} onClick={() => onPick({ slug: p.slug, name: p.nombre, manual_cost_id: c.id, cost_override: null })}>
                <span><b>{c.description}</b><small className="ad-mut">{[c.supplier, c.sku, c.unit].filter(Boolean).join(" · ")}{usados.has(c.id) && actual?.manual_cost_id !== c.id ? " · ya usado en otro producto" : ""}{s >= 0.5 ? " · ⭐ parecido" : ""}</small></span>
                <span className="ad-cost-num"><b>{money(c.cost_gross ?? c.cost_net)}</b><small className="ad-mut">{c.includes_vat ? "con IVA" : `neto ${money(c.cost_net)}`}</small></span>
              </button>
            ))}
            {!orden.length && <p className="ad-mut">No hay costos que coincidan.</p>}
          </div>
        </div>
        <footer>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="number" min={0} placeholder="Costo propio $" value={propio} onChange={(e) => setPropio(e.target.value)} style={{ width: 150 }} />
            <button className="ad-btn ad-btn--ghost ad-btn--sm" disabled={!propio} onClick={() => onPick({ slug: p.slug, name: p.nombre, manual_cost_id: null, cost_override: Number(propio) })}>Usar este</button>
          </div>
          {actual && <button className="ad-link ad-danger" onClick={() => onPick({ slug: p.slug, name: p.nombre, manual_cost_id: null, cost_override: null })}>Quitar costo</button>}
        </footer>
      </aside>
    </>
  );
}

function Importar({ costos, productos, categorias, onClose, onImport }: {
  costos: Costo[]; productos: Producto[]; categorias: Categoria[]; onClose: () => void;
  onImport: (nuevos: Producto[], vincs: Vinculo[]) => void;
}) {
  const [sel, setSel] = useState<Set<string>>(() => new Set(costos.map((c) => c.id)));
  const [cat, setCat] = useState(categorias[0]?.slug ?? "");
  const [q, setQ] = useState("");
  const visibles = costos.filter((c) => !q || norm(`${c.description} ${c.supplier ?? ""}`).includes(norm(q)));
  const go = () => {
    const slugs = new Set(productos.map((p) => p.slug));
    const nuevos: Producto[] = [], vincs: Vinculo[] = [];
    for (const c of costos.filter((x) => sel.has(x.id))) {
      let s = slugify(c.description) || `producto-${c.id.slice(0, 6)}`, k = 2;
      while (slugs.has(s)) s = `${slugify(c.description)}-${k++}`;
      slugs.add(s);
      const nombre = c.description.trim().replace(/\s+/g, " ");
      nuevos.push({ slug: s, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), descripcion: "", categoria: cat, imagenes: [], visible: false });
      vincs.push({ slug: s, name: nombre, manual_cost_id: c.id, cost_override: null });
    }
    onImport(nuevos, vincs);
  };
  return (
    <>
      <div className="ad-scrim on" onClick={onClose} />
      <aside className="ad-drawer" data-lenis-prevent>
        <header><h3>Importar productos de mis costos</h3><button onClick={onClose} aria-label="Cerrar"><Icon n="x" /></button></header>
        <div className="ad-drawer-body">
          <p className="ad-mut">Se crean en la tienda como <b>ocultos</b>, con el nombre y el costo de tu sistema. Después les ponés foto, descripción, categoría y precio, y los mostrás cuando estén listos.</p>
          <label className="ad-field"><span>Categoría para todos (después la cambiás uno por uno)</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>{categorias.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}</select>
          </label>
          <div className="ad-tools">
            <input placeholder="Filtrar…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="ad-link" onClick={() => setSel(new Set(visibles.map((c) => c.id)))}>Todos</button>
            <button className="ad-link" onClick={() => setSel(new Set())}>Ninguno</button>
          </div>
          <div className="ad-costs-pick">
            {visibles.map((c) => (
              <label key={c.id} className={`ad-costs-opt${sel.has(c.id) ? " on" : ""}`}>
                <input type="checkbox" checked={sel.has(c.id)} onChange={(e) => setSel((s) => { const n = new Set(s); if (e.target.checked) n.add(c.id); else n.delete(c.id); return n; })} />
                <span><b>{c.description}</b><small className="ad-mut">{[c.supplier, c.sku].filter(Boolean).join(" · ")}</small></span>
                <span className="ad-cost-num"><b>{money(c.cost_gross ?? c.cost_net)}</b></span>
              </label>
            ))}
            {!costos.length && <p className="ad-mut">Todos tus costos ya tienen un producto en la tienda.</p>}
          </div>
        </div>
        <footer>
          <span className="ad-mut">{sel.size} seleccionados</span>
          <button className="ad-btn" disabled={!sel.size || !cat} onClick={go}>Importar {sel.size}</button>
        </footer>
      </aside>
    </>
  );
}
