/**
 * Capa de medición (GA4 / GTM / Google Ads / Meta Pixel). ARCHIVO NUEVO.
 * Envía eventos al dataLayer; GTM decide a qué plataforma mandarlos.
 */
import { registrarEvento } from "@/lib/registro";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void } }

export type EventoSeo =
  | "solicitud_cotizacion" | "click_whatsapp" | "click_telefono" | "click_email"
  | "agregar_producto" | "agregar_kit" | "aplicar_cupon" | "ver_producto" | "ver_categoria"
  | "ver_kit" | "ver_landing_seo" | "lectura_articulo" | "referencia_ia" | "carga_rapida" | "pedido_programado";

export function track(evento: EventoSeo, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...params });
  const v = params.producto ?? params.categoria ?? params.kit ?? params.articulo ?? params.plataforma ?? params.tipo ?? null;
  registrarEvento(evento, v);
}

/** Plataformas de IA que pueden aparecer como referencia (document.referrer) */
export const REFERENCIAS_IA: Record<string, string> = {
  "chatgpt.com": "ChatGPT", "chat.openai.com": "ChatGPT", "perplexity.ai": "Perplexity", "www.perplexity.ai": "Perplexity",
  "gemini.google.com": "Gemini", "copilot.microsoft.com": "Copilot", "claude.ai": "Claude", "you.com": "You.com", "chat.deepseek.com": "DeepSeek",
};

export const CONSENT_KEY = "ibarra-consent-v1";
export type Consent = { analytics: boolean; ads: boolean };
export function leerConsent(): Consent | null {
  try { const r = localStorage.getItem(CONSENT_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
export function guardarConsent(c: Consent) {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch {}
  window.gtag?.("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.ads ? "granted" : "denied",
    ad_user_data: c.ads ? "granted" : "denied",
    ad_personalization: c.ads ? "granted" : "denied",
  });
  if (c.ads) window.fbq?.("consent", "grant"); else window.fbq?.("consent", "revoke");
}
