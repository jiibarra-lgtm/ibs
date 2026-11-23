/** Registro propio de visitas y cotizaciones en Supabase (sin cookies, sin datos personales). */
import { SB_KEY, SB_URL } from "@/lib/supabase";

function sesion() {
  try {
    let s = sessionStorage.getItem("ibarra-s");
    if (!s) { s = Math.random().toString(36).slice(2, 12); sessionStorage.setItem("ibarra-s", s); }
    return s;
  } catch { return null; }
}

function origen() {
  try {
    const utm = new URLSearchParams(location.search).get("utm_source");
    if (utm) return utm.slice(0, 120);
    if (!document.referrer) return null;
    const h = new URL(document.referrer).hostname.replace(/^www\./, "");
    return h === location.hostname.replace(/^www\./, "") ? null : h.slice(0, 120);
  } catch { return null; }
}

function enviar(tabla: string, fila: Record<string, unknown>) {
  if (typeof window === "undefined" || location.pathname.startsWith("/admin")) return;
  if (!/ibarrainsumos\.com\.ar$/.test(location.hostname)) return; // no contar previews ni pruebas locales
  try {
    fetch(`${SB_URL}/rest/v1/${tabla}`, {
      method: "POST", keepalive: true,
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(fila),
    }).catch(() => {});
  } catch {}
}

export const TIPOS_EVENTO = new Set(["visita", "ver_producto", "ver_categoria", "ver_kit", "click_whatsapp", "click_telefono", "click_email", "agregar_producto", "agregar_kit", "aplicar_cupon", "solicitud_cotizacion", "referencia_ia", "lectura_articulo", "carga_rapida", "pedido_programado", "ver_landing_seo"]);

export function registrarEvento(tipo: string, valor?: unknown) {
  if (!TIPOS_EVENTO.has(tipo)) return;
  enviar("eventos", {
    tipo,
    valor: valor == null ? null : String(valor).slice(0, 200),
    ruta: location.pathname.slice(0, 300),
    ref: origen(),
    dispositivo: matchMedia("(max-width: 820px)").matches ? "movil" : "escritorio",
    sesion: sesion(),
  });
}

export function registrarCotizacion(c: { items: { slug: string; nombre: string; cantidad: number }[]; cupon?: string | null; programado?: string | null; empresa?: string; zona?: string }) {
  if (!c.items.length) return;
  enviar("cotizaciones", {
    items: c.items.slice(0, 200).map((i) => ({ slug: i.slug.slice(0, 120), nombre: i.nombre.slice(0, 200), cantidad: Math.max(0, Math.round(i.cantidad)) })),
    cupon: c.cupon || null, programado: c.programado || null,
    empresa: c.empresa?.slice(0, 160) || null, zona: c.zona?.slice(0, 160) || null,
    ruta: location.pathname.slice(0, 300),
  });
}
