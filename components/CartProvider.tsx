"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { site, waLink } from "@/lib/site";
import { descuentoPorCantidad, envioGratis, ofertaPara, proximaEscala, validarCupon, type Cupon } from "@/lib/promos";

/** Codifica la lista para compartirla por link (va en el #, no se envía a ningún servidor). */
export function encodeCart(items: CartItem[]) {
  const data = items.map((i) => [i.slug, i.cantidad, i.nombre, i.imagen, i.kit ? [i.kit.off, i.kit.unidades, i.kit.detalle] : 0]);
  return btoa(unescape(encodeURIComponent(JSON.stringify(data)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decodeCart(code: string): CartItem[] {
  try {
    const json = decodeURIComponent(escape(atob(code.replace(/-/g, "+").replace(/_/g, "/"))));
    const arr = JSON.parse(json) as [string, number, string, string, 0 | [number, number, string[]]][];
    return arr.filter((a) => typeof a[0] === "string" && typeof a[3] === "string" && a[3].startsWith("/img/")).slice(0, 80).map(([slug, cantidad, nombre, imagen, k]) => ({
      slug: String(slug).slice(0, 120), cantidad: Math.max(1, Math.min(9999, Number(cantidad) || 1)), nombre: String(nombre).slice(0, 160), imagen,
      ...(k ? { kit: { off: Math.min(50, Number(k[0]) || 0), unidades: Number(k[1]) || 1, detalle: (k[2] || []).map(String).slice(0, 30) } } : {}),
    }));
  } catch { return []; }
}

export type CartItem = {
  slug: string;
  nombre: string;
  imagen: string;
  cantidad: number;
  precio?: number;
  /** Si es un kit: % fijo y el detalle de lo que incluye */
  kit?: { off: number; detalle: string[]; unidades: number };
};

export type LineCalc = CartItem & { off: number; motivo: string };

type Ctx = {
  items: CartItem[];
  lines: LineCalc[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  setQty: (slug: string, cantidad: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  toast: (msg: string) => void;
  cupon: Cupon | null;
  aplicarCupon: (code: string) => string | null;
  quitarCupon: () => void;
  totales: { bruto: number; neto: number; conPrecio: boolean };
  programado: Programado;
  setProgramado: (p: Programado) => void;
  addMany: (items: Omit<CartItem, "cantidad">[] , cants: number[]) => void;
  share: () => void;
};

export type Programado = { activo: boolean; frecuencia: "quincenal" | "mensual" | "bimestral"; momento: "inicio" | "mitad" | "fin" };
export const FRECUENCIAS = { quincenal: "Cada 15 días", mensual: "Todos los meses", bimestral: "Cada 2 meses" } as const;
export const MOMENTOS = { inicio: "Primera semana del mes", mitad: "Mitad de mes", fin: "Última semana del mes" } as const;

const CartContext = createContext<Ctx | null>(null);
const KEY = "ibarra-cotizacion-v3";
export const fmt = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function calcLine(i: CartItem): LineCalc {
  if (i.kit) return { ...i, off: i.kit.off, motivo: "Combo" };
  const tier = descuentoPorCantidad(i.cantidad);
  const mes = ofertaPara(i.slug);
  return mes > tier ? { ...i, off: mes, motivo: "Oferta del mes" } : { ...i, off: tier, motivo: tier ? "Por cantidad" : "" };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cupon, setCupon] = useState<Cupon | null>(null);
  const [programado, setProgramado] = useState<Programado>({ activo: false, frecuencia: "mensual", momento: "inicio" });
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setItems(s.items ?? []);
        setCupon(s.cupon ?? null);
        if (s.programado) setProgramado(s.programado);
      }
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify({ items, cupon, programado })); } catch {}
  }, [items, cupon, programado]);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(""), 2400);
  }, []);

  const add: Ctx["add"] = useCallback((item, cantidad = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === item.slug);
      if (found) return prev.map((i) => (i.slug === item.slug ? { ...i, cantidad: i.cantidad + cantidad } : i));
      return [...prev, { ...item, cantidad }];
    });
    toast(item.kit ? "🎁 Combo agregado a la cotización" : `✓ ${cantidad > 1 ? `${cantidad} u. agregadas` : "Agregado a la cotización"}`);
  }, [toast]);

  const addMany: Ctx["addMany"] = useCallback((list, cants) => {
    setItems((prev) => {
      const next = [...prev];
      list.forEach((item, i) => {
        const c = cants[i] || 1;
        const f = next.findIndex((x) => x.slug === item.slug);
        if (f >= 0) next[f] = { ...next[f], cantidad: next[f].cantidad + c };
        else next.push({ ...item, cantidad: c });
      });
      return next;
    });
    toast(`✓ ${list.length} productos agregados`);
  }, [toast]);

  const setQty = useCallback((slug: string, cantidad: number) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, cantidad: Math.max(1, Math.min(9999, cantidad || 1)) } : i)));
  }, []);
  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => { setItems([]); setCupon(null); }, []);

  const lines = useMemo(() => items.map(calcLine), [items]);
  const count = items.reduce((a, i) => a + i.cantidad * (i.kit?.unidades ?? 1), 0);

  const aplicarCupon = useCallback((code: string) => {
    const r = validarCupon(code, count);
    if (!r.ok) return r.error;
    setCupon(r.cupon);
    toast(`🏷️ Cupón ${r.cupon.code} aplicado`);
    return null;
  }, [count, toast]);

  // Si el cupón deja de cumplir el mínimo, se quita
  useEffect(() => {
    if (cupon?.minUnidades && count < cupon.minUnidades) setCupon(null);
  }, [count, cupon]);

  const totales = useMemo(() => {
    const conPrecio = lines.length > 0 && lines.every((l) => typeof l.precio === "number");
    if (!conPrecio) return { bruto: 0, neto: 0, conPrecio };
    const bruto = lines.reduce((a, l) => a + (l.precio ?? 0) * l.cantidad, 0);
    const conLinea = lines.reduce((a, l) => a + (l.precio ?? 0) * l.cantidad * (1 - l.off / 100), 0);
    return { bruto, neto: conLinea * (1 - (cupon?.off ?? 0) / 100), conPrecio };
  }, [lines, cupon]);

  const share = useCallback(async () => {
    if (!items.length) return;
    const url = `${location.origin}/carrito-compartido#${encodeCart(items)}`;
    const text = "Te comparto mi lista de cotización de Ibarra Insumos";
    try {
      if (navigator.share) { await navigator.share({ title: "Mi carrito · Ibarra Insumos", text, url }); return; }
    } catch { return; }
    try { await navigator.clipboard.writeText(url); toast("🔗 Link copiado: pegalo donde quieras"); }
    catch { window.prompt("Copiá este link para compartir tu carrito:", url); }
  }, [items, toast]);

  const value = useMemo<Ctx>(() => ({
    items, lines, open, setOpen, add, setQty, remove, clear, toast, count,
    has: (slug) => items.some((i) => i.slug === slug),
    cupon, aplicarCupon, quitarCupon: () => setCupon(null), totales, programado, setProgramado, addMany, share,
  }), [items, lines, open, add, setQty, remove, clear, toast, count, cupon, aplicarCupon, totales, programado, addMany, share]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <div className={`toast ${toastMsg ? "show" : ""}`} role="status" aria-live="polite">{toastMsg}</div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuera de CartProvider");
  return ctx;
}

export function QtyInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="qty">
      <button type="button" aria-label="Restar" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <input inputMode="numeric" aria-label="Cantidad" value={value}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, "")) || 1)} />
      <button type="button" aria-label="Sumar" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, clear, cupon, aplicarCupon, quitarCupon, totales, count, programado, setProgramado, share } = useCart();
  const [empresa, setEmpresa] = useState("");
  const [zona, setZona] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const ahorroMax = Math.max(0, ...lines.map((l) => l.off)) + (cupon?.off ?? 0);

  function enviar() {
    const det = lines.map((l) => {
      const base = `• ${l.cantidad} x ${l.nombre}${l.off ? ` (−${l.off}% ${l.motivo.toLowerCase()})` : ""}`;
      return l.kit ? `${base}\n   ${l.kit.detalle.join(" · ")}` : base;
    }).join("\n");
    const extra = [
      cupon && `Cupón: ${cupon.code} (−${cupon.off}% adicional)`,
      programado.activo && `🔁 Pedido programado: ${FRECUENCIAS[programado.frecuencia].toLowerCase()}, ${MOMENTOS[programado.momento].toLowerCase()}`,
      totales.conPrecio && `Total estimado: ${fmt(totales.neto)}`,
      empresa && `Empresa / institución: ${empresa}`,
      zona && `Zona de entrega: ${zona}`,
      envioGratis.activo && totales.conPrecio && totales.neto >= envioGratis.minimo && "🚚 Supera el mínimo para envío gratis",
    ].filter(Boolean).join("\n");
    const msg = `Hola ${site.name}! Quiero cotizar:\n\n${det}${extra ? `\n\n${extra}` : ""}\n\nGracias!`;
    window.open(waLink(msg), "_blank", "noopener");
  }

  function submitCupon(e: React.FormEvent) {
    e.preventDefault();
    const r = aplicarCupon(code);
    setErr(r ?? "");
    if (!r) setCode("");
  }

  return (
    <>
      <div className={`overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Lista de cotización">
        <div className="drawer-head">
          <h3>🛒 Tu cotización <small style={{ opacity: .7, fontWeight: 400 }}>({count} u.)</small></h3>
          <button aria-label="Cerrar" onClick={() => setOpen(false)} style={{ fontSize: "1.3rem" }}>✕</button>
        </div>
        <div className="drawer-body" data-lenis-prevent>
          {lines.length === 0 ? (
            <div className="empty" style={{ marginTop: 20 }}>
              <p style={{ fontSize: "2rem" }}>🧾</p>
              <p><b>Tu lista está vacía.</b></p>
              <p className="note">Agregá productos o kits, o pegá tu lista en la <a href="/carga-rapida" style={{ textDecoration: "underline" }}>carga rápida</a>.</p>
            </div>
          ) : (
            lines.map((l) => {
              const next = !l.kit ? proximaEscala(l.cantidad) : null;
              return (
                <div className="line-item" key={l.slug}>
                  <img src={l.imagen} alt="" loading="lazy" />
                  <div>
                    <h4>{l.nombre}</h4>
                    {l.off > 0 && <span className="pill pill-off">−{l.off}% {l.motivo}</span>}
                    {l.kit && <p className="note" style={{ fontSize: ".72rem" }}>{l.kit.detalle.join(" · ")}</p>}
                    {next && next.off > l.off && (
                      <button className="nudge" onClick={() => setQty(l.slug, next.min)}>
                        Llevá {next.min - l.cantidad} más y ahorrá {next.off}% →
                      </button>
                    )}
                    {typeof l.precio === "number" && (
                      <p className="note">
                        {l.off > 0 && <s>{fmt(l.precio * l.cantidad)}</s>} <b>{fmt(l.precio * l.cantidad * (1 - l.off / 100))}</b>
                      </p>
                    )}
                    <button className="rm" onClick={() => remove(l.slug)}>Quitar</button>
                  </div>
                  <QtyInput value={l.cantidad} onChange={(n) => setQty(l.slug, n)} />
                </div>
              );
            })
          )}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            {envioGratis.activo && (totales.conPrecio ? (
              <div className="envio">
                {totales.neto >= envioGratis.minimo
                  ? <span>🚚 <b>¡Tenés envío gratis!</b></span>
                  : <span>🚚 Te faltan <b>{fmt(envioGratis.minimo - totales.neto)}</b> para el envío gratis</span>}
                <i style={{ width: `${Math.min(100, (totales.neto / envioGratis.minimo) * 100)}%` }} />
              </div>
            ) : (
              <div className="envio"><span>🚚 <b>Envío gratis</b> en compras desde {fmt(envioGratis.minimo)} (CABA y GBA)</span></div>
            ))}
            {cupon ? (
              <div className="cupon-ok">
                <span>🏷️ <b>{cupon.code}</b> · −{cupon.off}% adicional</span>
                <button onClick={quitarCupon} aria-label="Quitar cupón">✕</button>
              </div>
            ) : (
              <form className="cupon-form" onSubmit={submitCupon}>
                <input placeholder="¿Tenés un cupón?" value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} aria-label="Código de cupón" />
                <button className="btn btn-sm btn-primary" type="submit" disabled={!code.trim()}>Aplicar</button>
              </form>
            )}
            {err && <p className="note" style={{ color: "#b4483c" }}>{err}</p>}
            {totales.conPrecio ? (
              <div className="tot">
                <span>Total estimado</span>
                <span>{totales.bruto !== totales.neto && <s>{fmt(totales.bruto)}</s>} <b>{fmt(totales.neto)}</b></span>
              </div>
            ) : ahorroMax > 0 ? (
              <div className="tot"><span>Tu ahorro</span><b className="save">hasta −{ahorroMax}%</b></div>
            ) : null}
            <div className={`prog ${programado.activo ? "on" : ""}`}>
              <label className="prog-h">
                <input type="checkbox" checked={programado.activo} onChange={(e) => setProgramado({ ...programado, activo: e.target.checked })} />
                <span><b>🔁 Recibir este pedido de forma programada</b><small>Te lo preparamos y entregamos solo, sin volver a pedir. <a href="/pedido-programado" target="_blank">Cómo funciona</a></small></span>
              </label>
              {programado.activo && (
                <div className="prog-opts">
                  <select value={programado.frecuencia} onChange={(e) => setProgramado({ ...programado, frecuencia: e.target.value as Programado["frecuencia"] })} aria-label="Frecuencia">
                    {Object.entries(FRECUENCIAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <select value={programado.momento} onChange={(e) => setProgramado({ ...programado, momento: e.target.value as Programado["momento"] })} aria-label="Momento de entrega">
                    {Object.entries(MOMENTOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="field"><label htmlFor="c-emp">Empresa (opcional)</label><input id="c-emp" value={empresa} onChange={(e) => setEmpresa(e.target.value)} /></div>
              <div className="field"><label htmlFor="c-zona">Zona (opcional)</label><input id="c-zona" value={zona} onChange={(e) => setZona(e.target.value)} /></div>
            </div>
            <button className="btn btn-wa btn-block btn-shine" onClick={enviar}>{programado.activo ? "Enviar pedido programado por WhatsApp" : "Enviar cotización por WhatsApp"}</button>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-sm btn-outline" onClick={share}>🔗 Compartir mi carrito</button>
              <button className="btn btn-sm" style={{ color: "var(--muted)" }} onClick={clear}>Vaciar lista</button>
            </div>
            <p className="note">Te confirmamos precios con los descuentos aplicados. El pago se coordina después.</p>
          </div>
        )}
      </aside>
    </>
  );
}
