/**
 * Configuración comercial de la tienda.
 * TODO sale de data/tienda.json — es lo que edita el panel de control.
 * Los valores actuales son EJEMPLOS: revisalos antes de publicar.
 */
import tienda from "@/data/tienda.json";

export type Escala = { min: number; off: number; label: string; tag?: string };
export type Cupon = { code: string; off: number; desc: string; minUnidades?: number; desde?: string; vence?: string; oculto?: boolean };
export type Kit = { slug: string; nombre: string; rubro: string; para: string; icono: string; off: number; tag?: string; descripcion: string; items: { slug: string; cantidad: number }[] };
export type Banner = { etiqueta: string; titulo: string; destacado?: string; bajada: string; cta: string; ctaHref: string; cta2?: string; cta2Href?: string; imagen: string; tema: "teal" | "gold" | "dark" };
export type Sello = { icono: string; titulo: string; texto: string };
export type PopupCfg = { activo: boolean; retrasoSeg: number; frecuencia: "siempre" | "sesion" | "una-vez"; etiqueta: string; titulo: string; texto: string; cupon?: string; mostrarOfertas: boolean; cta: string; ctaHref: string };
export type Oferta = { activa: boolean; titulo: string; bajada: string; off: number; productos: string[]; hasta: string };

export const barraSuperior = tienda.barraSuperior;
export const anuncios: string[] = tienda.barraSuperior.activa ? tienda.barraSuperior.mensajes : [];
export const banners = tienda.banners as Banner[];
export const sellos = tienda.sellos as Sello[];
export const marcas = tienda.marcas as { nombre: string; logo: string }[];
export const popup = tienda.popup as PopupCfg;
export const ofertaDelMes = tienda.ofertaDelMes as Oferta;
export const escalas = tienda.escalas as Escala[];
export const cupones = tienda.cupones as Cupon[];
export const kits = tienda.kits as Kit[];
export const rubrosKits = Array.from(new Set(kits.map((k) => k.rubro)));
export const complementos = tienda.complementos as Record<string, string[]>;
export const cuponBienvenida = popup.cupon ?? "";
export const maxEscala = Math.max(...escalas.map((e) => e.off));

export function descuentoPorCantidad(cant: number) {
  let off = 0;
  for (const e of escalas) if (cant >= e.min) off = e.off;
  return off;
}

export function proximaEscala(cant: number) {
  return escalas.find((e) => e.min > cant) ?? null;
}

export function ofertaPara(slug: string) {
  return ofertaDelMes.activa && new Date(ofertaDelMes.hasta) > new Date() && ofertaDelMes.productos.includes(slug) ? ofertaDelMes.off : 0;
}

export function validarCupon(code: string, unidades: number): { ok: true; cupon: Cupon } | { ok: false; error: string } {
  const c = cupones.find((x) => x.code === code.trim().toUpperCase());
  if (!c) return { ok: false, error: "Cupón inválido" };
  if (c.desde && new Date(c.desde) > new Date()) return { ok: false, error: "Este cupón todavía no está vigente" };
  if (c.vence && new Date(c.vence) < new Date()) return { ok: false, error: "Este cupón venció" };
  if (c.minUnidades && unidades < c.minUnidades) return { ok: false, error: `Válido desde ${c.minUnidades} unidades` };
  return { ok: true, cupon: c };
}

export type Apariencia = { colorPrincipal: string; colorAcento: string; colorFondo: string; redondeo: number; tipografiaTitulos: string };
export type Animaciones = { activas: boolean; scrollSuave: boolean; productoVuelaAlCarrito: boolean; bannerAutoplaySeg: number };
export const apariencia = tienda.apariencia as Apariencia;
export const animaciones = tienda.animaciones as Animaciones;
export const secciones = tienda.secciones as Record<string, boolean>;

/** Oscurece/aclara un color hex (para derivar tonos del color principal) */
export function shade(hex: string, pct: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + (pct < 0 ? c : 255 - c) * pct)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export type Evento = {
  slug: string; activo: boolean; nombre: string; emoji: string; tema: string; etiqueta: string; titulo: string; bajada: string;
  cupon: string; off: number; desde: string; hasta: string; productos: string[]; kits: string[];
  popup: { activo: boolean; titulo: string; texto: string; cta: string };
};
export const eventos = (tienda as unknown as { eventos: Evento[] }).eventos ?? [];
export const envioGratis = ((tienda as unknown as { envioGratis?: { activo: boolean; minimo: number; texto: string } }).envioGratis) ?? { activo: false, minimo: 0, texto: "" };
export const puntos = ((tienda as unknown as { puntos?: { activo: boolean; pesosPorPunto: number; valorPunto: number; minimoCanje: number; vencimientoMeses: number; bonoBienvenida: number } }).puntos) ?? { activo: false, pesosPorPunto: 1000, valorPunto: 10, minimoCanje: 500, vencimientoMeses: 12, bonoBienvenida: 0 };
export const cuponesVisibles = cupones.filter((c) => !c.oculto);

/** Evento en curso (si hay varios, el más corto: suele ser el más puntual) */
export function eventoActivo(list: Evento[] = eventos, now = new Date()) {
  return list
    .filter((e) => e.activo && new Date(e.desde) <= now && now <= new Date(e.hasta))
    .sort((a, b) => (+new Date(a.hasta) - +new Date(a.desde)) - (+new Date(b.hasta) - +new Date(b.desde)))[0] ?? null;
}
export function estadoEvento(e: Evento, now = new Date()): "proximo" | "en-curso" | "terminado" {
  if (now < new Date(e.desde)) return "proximo";
  if (now > new Date(e.hasta)) return "terminado";
  return "en-curso";
}
