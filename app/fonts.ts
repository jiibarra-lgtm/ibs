/** Tipografías servidas desde el propio dominio (más rápido y sin pedir nada a Google). */
import localFont from "next/font/local";
import { apariencia } from "@/lib/promos";

export const lato = localFont({ src: [{ path: "./fonts/lato-latin-400-normal.woff2", weight: "400", style: "normal" }, { path: "./fonts/lato-latin-700-normal.woff2", weight: "700", style: "normal" }], variable: "--f-lato", display: "swap" });
const montserrat = localFont({ src: "./fonts/montserrat-latin-wght-normal.woff2", weight: "100 900", variable: "--f-montserrat", display: "swap", preload: true });
const inter = localFont({ src: "./fonts/inter-latin-wght-normal.woff2", weight: "100 900", variable: "--f-inter", display: "swap", preload: false });
const outfit = localFont({ src: "./fonts/outfit-latin-wght-normal.woff2", weight: "100 900", variable: "--f-outfit", display: "swap", preload: false });
const jakarta = localFont({ src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2", weight: "200 800", variable: "--f-jakarta", display: "swap", preload: false });
const dmsans = localFont({ src: "./fonts/dm-sans-latin-wght-normal.woff2", weight: "100 1000", variable: "--f-dmsans", display: "swap", preload: false });
const poppins = localFont({ src: [{ path: "./fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" }, { path: "./fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" }, { path: "./fonts/poppins-latin-800-normal.woff2", weight: "800", style: "normal" }], variable: "--f-poppins", display: "swap", preload: false });

export const fontMap: Record<string, string> = { Montserrat: "--f-montserrat", Inter: "--f-inter", Outfit: "--f-outfit", "Plus Jakarta Sans": "--f-jakarta", "DM Sans": "--f-dmsans", Poppins: "--f-poppins" };
export const headVar = fontMap[apariencia.tipografiaTitulos] ?? "--f-montserrat";
export const fontClasses = [lato, montserrat, inter, outfit, jakarta, dmsans, poppins].map((f) => f.variable).join(" ");
