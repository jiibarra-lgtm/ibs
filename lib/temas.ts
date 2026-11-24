/** Plantillas de diseño de la web. Se eligen desde el panel (Apariencia) y se guardan en Supabase. */
import type { Apariencia } from "@/lib/promos";

export type Tema = Apariencia & { id: string; nombre: string; para: string };

export const TEMAS: Tema[] = [
  { id: "clasico", nombre: "Clásico Ibarra", para: "El de siempre: verde y dorado, serio y confiable.", colorPrincipal: "#1a4a44", colorAcento: "#b08a3a", colorFondo: "#f6f2ea", redondeo: 14, tipografiaTitulos: "Montserrat" },
  { id: "cyber", nombre: "Cyber / Promo", para: "Violeta eléctrico para Cyber Monday y lanzamientos.", colorPrincipal: "#4c1d95", colorAcento: "#22c3ee", colorFondo: "#f5f3ff", redondeo: 18, tipografiaTitulos: "Poppins" },
  { id: "black", nombre: "Black Friday", para: "Negro con naranja fuego: ofertas agresivas.", colorPrincipal: "#121212", colorAcento: "#ff5a1f", colorFondo: "#f4f1ec", redondeo: 10, tipografiaTitulos: "Plus Jakarta Sans" },
  { id: "hospital", nombre: "Institucional salud", para: "Azul limpio, ideal para hospitales y organismos.", colorPrincipal: "#0b3b66", colorAcento: "#16a394", colorFondo: "#f3f7fb", redondeo: 12, tipografiaTitulos: "Inter" },
  { id: "fabrica", nombre: "Fábrica", para: "Verde industrial con amarillo de autoelevador.", colorPrincipal: "#173f2a", colorAcento: "#e3a20b", colorFondo: "#f6f6f1", redondeo: 8, tipografiaTitulos: "Outfit" },
  { id: "minimal", nombre: "Minimal premium", para: "Grafito y dorado suave, bordes chicos, muy sobrio.", colorPrincipal: "#1f2933", colorAcento: "#c3a35a", colorFondo: "#fafaf8", redondeo: 6, tipografiaTitulos: "DM Sans" },
  { id: "navidad", nombre: "Fiestas", para: "Rojo y dorado para diciembre.", colorPrincipal: "#7a1620", colorAcento: "#c9a227", colorFondo: "#fbf6ef", redondeo: 16, tipografiaTitulos: "Poppins" },
  { id: "verano", nombre: "Verano", para: "Turquesa y coral, fresco y liviano.", colorPrincipal: "#0e6e74", colorAcento: "#f06a4f", colorFondo: "#f2faf9", redondeo: 20, tipografiaTitulos: "Outfit" },
];

export const FUENTES = ["Montserrat", "Poppins", "Inter", "Outfit", "Plus Jakarta Sans", "DM Sans"];
