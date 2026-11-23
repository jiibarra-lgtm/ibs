"use client";
/**
 * Medición SEO/SEM —
 * Para activarlo hace falta autorización: agregar <Measurement /> (y <ConsentBanner />) en app/layout.tsx
 * y cargar las variables de .env.example en Vercel. Sin variables no carga ningún script.
 */
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { registrarEvento } from "@/lib/registro";
import { REFERENCIAS_IA, leerConsent, track } from "@/lib/seo/track";

const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const GADS = process.env.NEXT_PUBLIC_GADS_ID;
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function textoDe(el: Element | null) { return (el?.textContent ?? "").trim().toLowerCase(); }

export default function Measurement() {
  const path = usePathname();

  // Vistas por tipo de página
  useEffect(() => {
    const p = path || "/";
    if (p.startsWith("/admin")) return;
    registrarEvento("visita");
    if (p.startsWith("/producto/")) track("ver_producto", { producto: p.split("/")[2] });
    else if (p.startsWith("/productos/")) track("ver_categoria", { categoria: p.split("/")[2] });
    else if (p.startsWith("/kits/")) track("ver_kit", { kit: p.split("/")[2] });
    window.fbq?.("track", "PageView");
  }, [path]);

  // Referencias desde plataformas de IA (una vez por sesión)
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ibarra-ref-ia")) return;
      const host = document.referrer ? new URL(document.referrer).hostname : "";
      const ia = REFERENCIAS_IA[host];
      const utm = new URLSearchParams(location.search).get("utm_source") ?? "";
      const iaUtm = /chatgpt|openai|perplexity|gemini|copilot|claude/i.test(utm) ? utm : "";
      if (ia || iaUtm) { track("referencia_ia", { plataforma: ia || iaUtm, landing: location.pathname }); sessionStorage.setItem("ibarra-ref-ia", "1"); }
    } catch {}
  }, []);

  // Lectura de artículo (75% de scroll en /guias/*)
  useEffect(() => {
    if (!path?.startsWith("/guias/")) return;
    let sent = false;
    const on = () => {
      const h = document.documentElement;
      if (!sent && (h.scrollTop + innerHeight) / h.scrollHeight > 0.75) { sent = true; track("lectura_articulo", { articulo: path.split("/")[2] }); }
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [path]);

  // Clics: un solo escuchador, sin tocar componentes existentes
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest("a,button");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      const t = textoDe(el);
      if (href.includes("wa.me/")) {
        const msg = decodeURIComponent(href.split("text=")[1] ?? "");
        if (/quiero cotizar:|pedido programado|quiero cotizar/i.test(msg) && el.tagName === "A") track("click_whatsapp", { origen: location.pathname, tipo: "consulta" });
        else track("click_whatsapp", { origen: location.pathname });
      } else if (href.startsWith("tel:")) track("click_telefono", { origen: location.pathname });
      else if (href.startsWith("mailto:")) track("click_email", { origen: location.pathname });
      else if (t.startsWith("enviar cotización") || t.startsWith("enviar pedido programado")) {
        track("solicitud_cotizacion", { origen: location.pathname, programado: t.includes("programado") });
        if (t.includes("programado")) track("pedido_programado", {});
        window.fbq?.("track", "Lead");
      } else if (t.startsWith("agregar kit")) track("agregar_kit", { origen: location.pathname });
      else if (t.startsWith("+ cotizar") || t.startsWith("✓ sumar otro") || t.startsWith("agregar ") || t === "agregar") track("agregar_producto", { origen: location.pathname });
      else if (t === "aplicar" || t.startsWith("aplicar a mi cotización")) track("aplicar_cupon", { origen: location.pathname });
      else if (t.startsWith("3. agregar todo")) track("carga_rapida", {});
    };
    document.addEventListener("click", on, true);
    return () => document.removeEventListener("click", on, true);
  }, []);

  const c = typeof window !== "undefined" ? leerConsent() : null;
  const consentInit = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'${c?.ads ? "granted" : "denied"}',ad_user_data:'${c?.ads ? "granted" : "denied"}',ad_personalization:'${c?.ads ? "granted" : "denied"}',analytics_storage:'${c?.analytics ? "granted" : "denied"}',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('js',new Date());${GA4 ? `gtag('config','${GA4}');` : ""}${GADS ? `gtag('config','${GADS}');` : ""}`;

  if (!GTM && !GA4 && !GADS && !META) return null;
  return (
    <>
      <Script id="consent-default" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: consentInit }} />
      {GTM && <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');` }} />}
      {(GA4 || GADS) && <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4 ?? GADS}`} strategy="afterInteractive" />}
      {META && <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','${c?.ads ? "grant" : "revoke"}');fbq('init','${META}');fbq('track','PageView');` }} />}
    </>
  );
}
