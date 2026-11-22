"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { estadoEvento, eventoActivo, type Evento } from "@/lib/promos";
import { Countdown } from "./Fx";

export type EventoView = Evento & { prods: { slug: string; nombre: string; imagen: string }[] };

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  return now;
}

/** Franja del evento en curso, debajo del header */
export function EventStrip({ eventos }: { eventos: Evento[] }) {
  const now = useNow();
  const [hidden, setHidden] = useState(false);
  const e = now ? eventoActivo(eventos, now) : null;
  useEffect(() => { try { if (e && sessionStorage.getItem(`ibarra-strip-${e.slug}`)) setHidden(true); } catch {} }, [e]);
  if (!e || hidden) return null;
  return (
    <div className={`ev-strip ev-${e.tema} no-print`}>
      <div className="wrap ev-strip-in">
        <span className="ev-strip-e">{e.emoji}</span>
        <b>{e.nombre}</b>
        <span className="ev-strip-off">−{e.off}% con <code>{e.cupon}</code></span>
        <span className="ev-strip-cd">Termina en <Countdown hasta={e.hasta} /></span>
        <Link href={`/promo/${e.slug}`} className="ev-strip-go">Ver ofertas →</Link>
        <button aria-label="Cerrar" onClick={() => { setHidden(true); try { sessionStorage.setItem(`ibarra-strip-${e.slug}`, "1"); } catch {} }}>✕</button>
      </div>
    </div>
  );
}

/** Cabecera de la landing de un evento, según si está por empezar, en curso o terminado */
export function EventHero({ e }: { e: Evento }) {
  const now = useNow();
  const st = now ? estadoEvento(e, now) : "en-curso";
  const fmt = (d: string) => new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  const [copied, setCopied] = useState(false);
  return (
    <section className={`ev-hero ev-${e.tema}`}>
      <div className="blob blob-1" /><div className="grain" />
      <div className="wrap ev-hero-in">
        <div>
          <p className="eyebrow">{e.emoji} {e.nombre} · {e.etiqueta}</p>
          <h1>{e.titulo}</h1>
          <p className="ev-sub">{e.bajada}</p>
          <p className="ev-dates">Del {fmt(e.desde)} al {fmt(e.hasta)}</p>
        </div>
        <div className="ev-box">
          {st === "terminado" ? (
            <><b className="ev-box-t">Esta promo terminó</b><p>Mirá las próximas fechas en el calendario de ofertas.</p><Link className="btn btn-gold" href="/promos">Ver calendario</Link></>
          ) : (
            <>
              <span className="ev-big">−{e.off}%</span>
              <span className="ev-box-l">{st === "proximo" ? "Empieza en" : "Termina en"}</span>
              <Countdown hasta={st === "proximo" ? e.desde : e.hasta} />
              <button className="coupon-code ev-code" onClick={() => { navigator.clipboard?.writeText(e.cupon); setCopied(true); }}>
                <span>{e.cupon}</span><small>{copied ? "¡Copiado!" : st === "proximo" ? "Guardalo: vale desde el " + fmt(e.desde) : "Tocá para copiar"}</small>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/** Estado chico para el calendario */
export function EventBadge({ e }: { e: Evento }) {
  const now = useNow();
  if (!now) return null;
  const st = estadoEvento(e, now);
  return <span className={`ev-badge ev-badge--${st}`}>{st === "en-curso" ? "● En curso" : st === "proximo" ? "Próximamente" : "Terminado"}</span>;
}
