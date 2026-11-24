"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cupones as cuponesTodos, cuponesVisibles, eventoActivo, type Banner, type PopupCfg } from "@/lib/promos";
import type { EventoView } from "./Events";
import { useCart } from "./CartProvider";

/** Versiones livianas de imágenes grandes del carrusel (mejora el LCP en celulares). */
const SRCSET: Record<string, string> = {
  "/img/marca/planta.webp": "/img/marca/planta-800.webp 800w, /img/marca/planta.webp 1400w",
};

/** Imagen que "vuela" hasta el botón del carrito */
export function flyToCart(img: HTMLImageElement | null) {
  if (!img || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("no-anim") || document.body.dataset.fly === "0") return;
  const target = document.querySelector(".cart-btn");
  if (!target) return;
  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const clone = img.cloneNode(true) as HTMLImageElement;
  Object.assign(clone.style, {
    position: "fixed", left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`,
    objectFit: "contain", zIndex: "200", pointerEvents: "none", borderRadius: "16px", background: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,.25)", transition: "transform .75s cubic-bezier(.55,0,.1,1), opacity .75s ease",
  } as CSSStyleDeclaration);
  document.body.appendChild(clone);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const s = Math.max(0.08, 36 / a.width);
  requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(${s}) rotate(12deg)`;
    clone.style.opacity = ".6";
  });
  setTimeout(() => {
    clone.remove();
    target.classList.remove("bump"); void (target as HTMLElement).offsetWidth; target.classList.add("bump");
  }, 760);
}

/** Scroll suave (Lenis) + header que se compacta al bajar */
export function SmoothScroll({ enabled }: { enabled: boolean }) {
  const path = usePathname();
  const { open } = useCart();
  const lenisRef = useRef<{ stop: () => void; start: () => void; destroy: () => void; scrollTo: (t: number, o?: object) => void } | null>(null);

  useEffect(() => {
    const onScroll = () => document.documentElement.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!enabled || path.startsWith("/admin") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let alive = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      const lenis = new Lenis({ duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4), anchors: { offset: -80 } } as ConstructorParameters<typeof Lenis>[0]);
      lenisRef.current = lenis as unknown as typeof lenisRef.current;
      const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { alive = false; cancelAnimationFrame(raf); lenisRef.current?.destroy(); lenisRef.current = null; };
  }, [enabled, path.startsWith("/admin")]);

  useEffect(() => { lenisRef.current?.scrollTo(0, { immediate: true }); }, [path]);
  useEffect(() => { if (open) lenisRef.current?.stop(); else lenisRef.current?.start(); }, [open]);
  return null;
}

/** Banner principal deslizable */
export function HeroSlider({ banners, flotantes, segundos = 7, sinH1 = false }: { banners: Banner[]; flotantes: string[]; segundos?: number; sinH1?: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null);
  const n = banners.length;
  const DUR = segundos * 1000;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), DUR);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  const go = (d: number) => setI((x) => (x + d + n) % n);

  return (
    <section className="slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}
      aria-roledescription="carrusel">
      {banners.map((b, k) => {
        const [antes, despues] = b.destacado && b.titulo.includes(b.destacado) ? b.titulo.split(b.destacado) : [b.titulo, ""];
        const ext = (h?: string) => h?.startsWith("http");
        return (
          <div key={k} className={`slide slide--${b.tema} ${k === i ? "on" : ""}`} aria-hidden={k !== i}>
            <div className="blob blob-1" /><div className="blob blob-2" /><div className="grain" />
            <div className="wrap slide-inner">
              <div className="slide-copy">
                <p className="eyebrow">{b.etiqueta}</p>
                {(() => { const H = k === 0 && !sinH1 ? "h1" : "h2"; return (
                  <H className="slide-title">
                    {antes}{b.destacado && b.titulo.includes(b.destacado) && <em>{b.destacado}</em>}{despues}
                  </H>
                ); })()}
                <p className="slide-sub">{b.bajada}</p>
                <div className="hero-ctas">
                  {ext(b.ctaHref)
                    ? <a className="btn btn-gold btn-lg btn-shine" href={b.ctaHref} target="_blank" rel="noopener" tabIndex={k === i ? 0 : -1}>{b.cta}</a>
                    : <Link className="btn btn-gold btn-lg btn-shine" href={b.ctaHref} tabIndex={k === i ? 0 : -1}>{b.cta}</Link>}
                  {b.cta2 && b.cta2Href && (ext(b.cta2Href)
                    ? <a className="btn btn-glass btn-lg" href={b.cta2Href} target="_blank" rel="noopener" tabIndex={k === i ? 0 : -1}>{b.cta2}</a>
                    : <Link className="btn btn-glass btn-lg" href={b.cta2Href} tabIndex={k === i ? 0 : -1}>{b.cta2}</Link>)}
                </div>
              </div>
              <div className="slide-visual">
                <div className={`slide-img ${b.imagen.includes("/productos/") ? "slide-img--prod" : ""}`}>
                  <img src={b.imagen} srcSet={SRCSET[b.imagen]} sizes={SRCSET[b.imagen] ? "(max-width: 760px) 92vw, 560px" : undefined} alt={b.imagen.includes("/marca/") ? "Planta y depósito de Ibarra Insumos" : b.titulo} fetchPriority={k === 0 && !sinH1 ? "high" : "low"} loading={k === 0 && !sinH1 ? "eager" : "lazy"} />
                </div>
                {k === 0 && flotantes.map((src, j) => <div key={src} className={`float-card fc-${j + 1}`}><img src={src} alt="" aria-hidden="true" /></div>)}
              </div>
            </div>
          </div>
        );
      })}
      {n > 1 && (
        <div className="slider-ui wrap">
          <div className="dots">
            {banners.map((b, k) => (
              <button key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Banner ${k + 1}: ${b.titulo}`}>
                <i style={{ animationDuration: `${DUR}ms`, animationPlayState: paused ? "paused" : "running" }} />
              </button>
            ))}
          </div>
          <div className="arrows">
            <button onClick={() => go(-1)} aria-label="Anterior">←</button>
            <button onClick={() => go(1)} aria-label="Siguiente">→</button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Popup de entrada: si hay un evento en curso con popup, muestra el del evento; si no, el general */
export function PromoPopup({ cfg, ofertas, eventos, destacadosPop = [] }: { cfg: PopupCfg; ofertas: { slug: string; nombre: string; imagen: string; off: number }[]; eventos: EventoView[]; destacadosPop?: { slug: string; nombre: string; imagen: string }[] }) {
  const [show, setShow] = useState(false);
  const [ev, setEv] = useState<EventoView | null>(null);
  const [copied, setCopied] = useState(false);
  const path = usePathname();
  const { aplicarCupon } = useCart();

  useEffect(() => {
    if (path.startsWith("/admin")) return;
    const activo = eventoActivo(eventos) as EventoView | null;
    const e = activo && activo.popup.activo ? activo : null;
    if (!e && !cfg.activo) return;
    const key = e ? `ibarra-popup-${e.slug}` : "ibarra-popup";
    try {
      if (e && sessionStorage.getItem(key)) return;
      if (!e && cfg.frecuencia === "una-vez" && localStorage.getItem(key)) return;
      if (!e && cfg.frecuencia === "sesion" && sessionStorage.getItem(key)) return;
    } catch { return; }
    setEv(e);
    const t = setTimeout(() => setShow(true), Math.max(0, cfg.retrasoSeg) * 1000);
    return () => clearTimeout(t);
  }, [cfg, path, eventos]);

  const close = () => {
    setShow(false);
    const key = ev ? `ibarra-popup-${ev.slug}` : "ibarra-popup";
    try { localStorage.setItem(key, "1"); sessionStorage.setItem(key, "1"); } catch {}
  };

  useEffect(() => {
    if (!show) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  if (!show) return null;
  const offCupon = (code?: string) => cuponesVisibles.concat(cuponesTodos).find((c) => c.code === code)?.off ?? 0;
  const v = ev
    ? { etiqueta: `${ev.emoji} ${ev.nombre}`, titulo: ev.popup.titulo, texto: ev.popup.texto, cupon: ev.cupon, cta: ev.popup.cta, href: `/promo/${ev.slug}`, items: ev.prods.slice(0, 5), off: ev.off }
    : { etiqueta: cfg.etiqueta, titulo: cfg.titulo, texto: cfg.texto, cupon: cfg.cupon, cta: cfg.cta, href: cfg.ctaHref, items: (cfg.mostrarOfertas && ofertas.length ? ofertas : destacadosPop).slice(0, 5), off: offCupon(cfg.cupon) };
  const big = v.off > 0 ? `${v.off}% OFF` : "";
  const sinBig = big && v.titulo.toUpperCase().startsWith(big.toUpperCase()) ? v.titulo.slice(big.length).trim() : v.titulo;
  const titulo = sinBig ? sinBig.charAt(0).toUpperCase() + sinBig.slice(1) : v.titulo;
  const ctaTxt = v.cupon && v.off ? `Quiero mi ${v.off}% OFF →` : v.cta;
  const usar = () => { if (v.cupon) { aplicarCupon(v.cupon); try { navigator.clipboard?.writeText(v.cupon); } catch {} } close(); };

  return (
    <div className="pop-wrap no-print" role="dialog" aria-modal="true" aria-labelledby="pop-t" onClick={close}>
      <div className="pp" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button className="pop-x" onClick={close} aria-label="Cerrar">✕</button>
        <div className="pp-l">
          <div className="pp-band">
            <img src="/img/marca/isotipo.webp" alt="" width={30} height={30} />
            <b>Ibarra Insumos</b>
          </div>
          <div className="pp-ribbon"><div className="confetti" aria-hidden>{Array.from({ length: 10 }).map((_, i) => <i key={i} />)}</div><span>{v.etiqueta}</span></div>
          <div className="pp-body">
            <h3 id="pop-t">{titulo}</h3>
            {big && <p className="pp-big">{big}</p>}
            {v.cupon && (
              <button className="pp-code" onClick={() => { navigator.clipboard?.writeText(v.cupon!); setCopied(true); }}>
                Código <b>{v.cupon}</b> <small>{copied ? "¡Copiado!" : "Tocá para copiar"}</small>
              </button>
            )}
            {v.cupon
              ? <button className="pp-cta" onClick={usar}>{ctaTxt}</button>
              : <Link className="pp-cta" href={v.href} onClick={close}>{ctaTxt}</Link>}
            <p className="pp-txt">{v.texto}</p>
            <button className="pp-skip" onClick={close}>Seguir mirando</button>
          </div>
        </div>
        <div className="pp-r" aria-hidden="true">
          <div className="pp-stage">
            {v.items.map((o, i) => (
              <Link key={o.slug} href={`/producto/${o.slug}`} onClick={close} className={`pp-prod pp-prod--${i + 1}`} tabIndex={-1}>
                <img src={o.imagen} alt="" />
                {i < 2 && <span className="pp-bow">🎀</span>}
              </Link>
            ))}
            <span className="pp-podium pp-podium--1" /><span className="pp-podium pp-podium--2" /><span className="pp-podium pp-podium--3" />
          </div>
        </div>
      </div>
    </div>
  );
}
