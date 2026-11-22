"use client";
/** Aviso de cookies para medición (Consent Mode v2). */
import { useEffect, useState } from "react";
import { guardarConsent, leerConsent } from "@/lib/seo/track";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!leerConsent() && (process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID)) setShow(true); }, []);
  if (!show) return null;
  const set = (a: boolean, b: boolean) => { guardarConsent({ analytics: a, ads: b }); setShow(false); };
  return (
    <div role="dialog" aria-label="Cookies" style={{ position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 140, maxWidth: 560, margin: "0 auto", background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 16, boxShadow: "0 20px 40px -12px rgba(0,0,0,.3)", display: "grid", gap: 10, fontSize: ".9rem" }}>
      <p>Usamos cookies para medir visitas y mejorar nuestros anuncios. Podés aceptar todo, solo medición o rechazar. <a href="/privacidad" style={{ textDecoration: "underline" }}>Más info</a></p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" onClick={() => set(true, true)}>Aceptar todo</button>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--teal)" }} onClick={() => set(true, false)}>Solo medición</button>
        <button className="btn btn-sm" style={{ color: "var(--muted)" }} onClick={() => set(false, false)}>Rechazar</button>
      </div>
    </div>
  );
}
