"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { anuncios, escalas, ofertaPara } from "@/lib/promos";
import { flyToCart } from "./Shop";
import { waLink } from "@/lib/site";

/** Activa las animaciones de entrada (.reveal) cuando el elemento entra en pantalla */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const scan = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [path]);
  return null;
}

/** Franja de anuncios en bucle */
export function AnnouncementBar() {
  const items = [...anuncios, ...anuncios];
  return (
    <div className="announce no-print" aria-label="Novedades">
      <div className="announce-track">
        {items.map((a, i) => <span key={i} aria-hidden={i >= anuncios.length}>{a}</span>)}
      </div>
    </div>
  );
}

/** Banda en bucle reutilizable (garantías, rubros, etc.) */
export function Marquee({ items, variant = "gold" }: { items: string[]; variant?: "gold" | "teal" }) {
  const all = [...items, ...items, ...items];
  return (
    <div className={`band band-${variant}`} aria-hidden>
      <div className="band-track">{all.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}</div>
    </div>
  );
}

/** Número que cuenta hacia arriba al aparecer */
export function CountUp({ to, prefix = "", suffix = "", duration = 1400 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(to); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{n.toLocaleString("es-AR")}{suffix}</span>;
}

/** Cuenta regresiva de la oferta del mes */
export function Countdown({ hasta }: { hasta: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(hasta);
    const upd = () => setLeft(Math.max(0, target.getTime() - Date.now()));
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, [hasta]);
  const v = left ?? 0;
  const parts = [
    { n: Math.floor(v / 864e5), l: "días" },
    { n: Math.floor((v / 36e5) % 24), l: "hs" },
    { n: Math.floor((v / 6e4) % 60), l: "min" },
    { n: Math.floor((v / 1e3) % 60), l: "seg" },
  ];
  return (
    <div className="countdown" aria-label="Tiempo restante de la oferta">
      {parts.map((p) => (
        <div key={p.l}><b suppressHydrationWarning>{left === null ? "--" : String(p.n).padStart(2, "0")}</b><span>{p.l}</span></div>
      ))}
    </div>
  );
}

/** Selector de packs en la ficha de producto: "Llevando X" con descuento por cantidad y complemento opcional */
export function PackSelector({ slug, nombre, imagen, precio, extra }: { slug: string; nombre: string; imagen: string; precio?: number; extra?: { slug: string; nombre: string; imagen: string } }) {
  const { add, setOpen } = useCart();
  const [sel, setSel] = useState(Math.min(2, escalas.length - 1));
  const [conExtra, setConExtra] = useState(false);
  const mes = ofertaPara(slug);
  const e = escalas[sel];
  const btnRef = useRef<HTMLButtonElement>(null);
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setSticky(!en.isIntersecting && en.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const agregar = () => {
    flyToCart(document.querySelector<HTMLImageElement>(".gallery-main img"));
    add({ slug, nombre, imagen, precio }, e.min);
    if (conExtra && extra) add({ slug: extra.slug, nombre: extra.nombre, imagen: extra.imagen }, 1);
    setTimeout(() => setOpen(true), 650);
  };
  const off = Math.max(e.off, mes);
  const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-AR")}`;
  return (
    <div className="packs">
      <p className="packs-rule"><span>{mes ? `🔥 Oferta del mes −${mes}%` : "Más llevás, menos pagás"}</span></p>
      <div className="packs-list" role="radiogroup" aria-label="Cantidad">
        {escalas.map((x, i) => {
          const o = Math.max(x.off, mes);
          const pilas = Math.min(3, i + 1);
          return (
            <button key={x.label} role="radio" aria-checked={sel === i} className={`pk ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}>
              {x.tag && <span className="pk-tag">{x.tag}</span>}
              <span className="pk-img" data-n={pilas}>{Array.from({ length: pilas }).map((_, j) => <img key={j} src={imagen} alt="" aria-hidden="true" />)}</span>
              <span className="pk-txt">
                <b>Llevando {x.min}{o > 0 && <em>−{o}% OFF{o >= 10 ? " 🔥" : ""}</em>}</b>
                <small>{o > 0 ? `Ahorrás el ${o}% en cada unidad` : "Precio de lista"}</small>
              </span>
              <span className="pk-price">
                {typeof precio === "number"
                  ? <>{fmt(precio * (1 - o / 100))}<small>c/u</small>{o > 0 && <s>{fmt(precio)}</s>}</>
                  : <>{o > 0 ? `−${o}%` : "Lista"}<small>{o > 0 ? "en tu cotización" : ""}</small></>}
              </span>
            </button>
          );
        })}
      </div>
      {extra && (
        <label className={`pk-extra ${conExtra ? "on" : ""}`}>
          <input type="checkbox" checked={conExtra} onChange={(ev) => setConExtra(ev.target.checked)} />
          <img src={extra.imagen} alt="" />
          <span><b>+ Sumá {extra.nombre}</b><small>Va perfecto con este producto</small></span>
        </label>
      )}
      <button ref={btnRef} className="btn btn-primary btn-block btn-lg btn-shine pk-cta" onClick={agregar}>
        Agregar {e.min} {e.min === 1 ? "unidad" : "u."}{conExtra && extra ? " + complemento" : ""}{off ? ` · −${off}%` : ""}
      </button>
      <div className={`sticky-buy ${sticky ? "show" : ""}`} aria-hidden={!sticky}>
        <img src={imagen} alt="" />
        <div><b>{nombre}</b><span>Llevando {e.min}{off ? ` · −${off}%` : ""}</span></div>
        <button className="btn btn-primary btn-sm btn-shine" onClick={agregar} tabIndex={sticky ? 0 : -1}>Agregar</button>
      </div>
      <p className="note" style={{ textAlign: "center" }}>El descuento se aplica solo en tu cotización. Podés cambiar la cantidad después.</p>
    </div>
  );
}

/** Tarjeta de cupón copiable */
export function CouponCard({ code, off, desc }: { code: string; off: number; desc: string }) {
  const [copied, setCopied] = useState(false);
  const { aplicarCupon, toast } = useCart();
  return (
    <div className="coupon reveal">
      <div className="coupon-left"><b>{off}%</b><span>OFF</span></div>
      <div className="coupon-right">
        <p>{desc}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="coupon-chip" onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? "✓ Copiado" : code}
          </button>
          <button className="btn btn-sm btn-ghost" style={{ color: "var(--teal)" }} onClick={() => { const e = aplicarCupon(code); if (e) toast(`⚠️ ${e}`); }}>Aplicar</button>
        </div>
      </div>
    </div>
  );
}

/** Calculadora de rendimiento de productos concentrados */
const CONC = [
  { id: "lav", nombre: "Lavandina concentrada", ratio: 10, uso: "1 parte en 10 de agua para pisos y superficies" },
  { id: "des", nombre: "Desengrasante profesional", ratio: 20, uso: "1 parte en 20 para limpieza diaria de cocina" },
  { id: "det", nombre: "Detergente profesional", ratio: 30, uso: "1 parte en 30 para vajilla" },
];
export function RendimientoCalc() {
  const [p, setP] = useState(CONC[0]);
  const [litros, setLitros] = useState(5);
  const total = litros * (p.ratio + 1);
  return (
    <div className="calc reveal">
      <div className="calc-form">
        <div className="field">
          <label htmlFor="calc-p">Producto</label>
          <select id="calc-p" value={p.id} onChange={(e) => setP(CONC.find((c) => c.id === e.target.value)!)}>
            {CONC.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="calc-l">Litros que comprás: <b>{litros} L</b></label>
          <input id="calc-l" type="range" min={1} max={100} value={litros} onChange={(e) => setLitros(+e.target.value)} />
        </div>
        <p className="note">Dilución orientativa: {p.uso}. Seguí siempre la indicación del rótulo.</p>
      </div>
      <div className="calc-out">
        <span>Te rinde aprox.</span>
        <b>{total.toLocaleString("es-AR")} L</b>
        <span>de solución lista para usar</span>
        <a className="btn btn-gold btn-sm" href={waLink(`Hola! Quiero cotizar ${litros} L de ${p.nombre}.`)} target="_blank" rel="noopener">Cotizar {litros} L</a>
      </div>
    </div>
  );
}

/** Suscripción a ofertas (por WhatsApp, sin backend) */
export function OfertasSignup() {
  const [n, setN] = useState("");
  return (
    <form className="signup" onSubmit={(e) => { e.preventDefault(); window.open(waLink(`Hola! Soy ${n}. Quiero recibir las ofertas mayoristas de Ibarra Insumos.`), "_blank", "noopener"); }}>
      <input required placeholder="Tu nombre o empresa" value={n} onChange={(e) => setN(e.target.value)} aria-label="Nombre o empresa" />
      <button className="btn btn-gold" type="submit">Quiero las ofertas</button>
    </form>
  );
}
