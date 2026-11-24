/**
 * Plantillas de diseño de la web. Todas respetan la paleta de la marca
 * (verde #1a4a44, dorado #b08a3a, crema): cambian tipografía, bordes y tono de fondo.
 */
import type { Apariencia } from "@/lib/promos";

export type Tema = Apariencia & { id: string; nombre: string; para: string };

const VERDE = "#1a4a44", DORADO = "#b08a3a";

export const TEMAS: Tema[] = [
  { id: "clasico", nombre: "Clásico Ibarra", para: "El de siempre: equilibrado y confiable.", colorPrincipal: VERDE, colorAcento: DORADO, colorFondo: "#f6f2ea", redondeo: 14, tipografiaTitulos: "Montserrat" },
  { id: "promo", nombre: "Promo", para: "Más redondo y llamativo, para épocas de ofertas.", colorPrincipal: VERDE, colorAcento: DORADO, colorFondo: "#f9f6f0", redondeo: 22, tipografiaTitulos: "Poppins" },
  { id: "moderno", nombre: "Moderno", para: "Fondo blanco, limpio y aireado.", colorPrincipal: VERDE, colorAcento: DORADO, colorFondo: "#ffffff", redondeo: 18, tipografiaTitulos: "Plus Jakarta Sans" },
  { id: "institucional", nombre: "Institucional", para: "Sobrio, ideal para hospitales y organismos públicos.", colorPrincipal: VERDE, colorAcento: DORADO, colorFondo: "#f2f5f4", redondeo: 10, tipografiaTitulos: "Inter" },
  { id: "fabrica", nombre: "Fábrica", para: "Esquinas rectas y tono industrial.", colorPrincipal: VERDE, colorAcento: DORADO, colorFondo: "#efeae0", redondeo: 4, tipografiaTitulos: "Outfit" },
  { id: "premium", nombre: "Premium", para: "Verde más profundo y detalles finos.", colorPrincipal: "#143a35", colorAcento: DORADO, colorFondo: "#f6f2ea", redondeo: 8, tipografiaTitulos: "DM Sans" },
];

export const FUENTES = ["Montserrat", "Poppins", "Inter", "Outfit", "Plus Jakarta Sans", "DM Sans"];
