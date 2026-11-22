/** Detecta cantidad y producto en cada renglón de una lista pegada (texto, WhatsApp o Excel). */
import type { Producto } from "./catalog";

const STOP = new Set(["de", "del", "para", "x", "el", "la", "los", "las", "en", "con", "y", "un", "una", "u", "unid", "unidad", "unidades", "uds", "cajas", "caja", "bultos", "bulto", "pack", "paquetes", "paquete", "bidon", "bidones", "lt", "lts", "litro", "litros", "l", "kg"]);
const SYN: Record<string, string> = {
  ph: "higienico", higienic: "higienico", lavandin: "lavandina", jabonera: "jabon", toalla: "toalla", toallita: "toalla",
  intercalada: "intercalada", gel: "gel", alcohol: "alcohol", trapo: "trapo", rejilla: "trapo", escoba: "escobillon",
  guante: "guante", detergente: "detergente", desengrasant: "desengrasante", vidrio: "limpiavidrio", limpiavidrio: "limpiavidrio",
  cono: "cono", bobina: "bobina", dispensador: "dispenser", dispencer: "dispenser", dispenser: "dispenser", esponja: "esponja", balde: "balde",
};

export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const stem = (w: string) => {
  let x = w;
  if (x.length > 4 && x.endsWith("es")) x = x.slice(0, -2);
  else if (x.length > 3 && x.endsWith("s")) x = x.slice(0, -1);
  return SYN[x] ?? SYN[w] ?? x;
};
const tokens = (s: string) => norm(s).split(" ").filter((w) => w && !STOP.has(w)).map(stem);

export type Linea = { original: string; cantidad: number; texto: string };

export function parseLinea(raw: string): Linea | null {
  const original = raw.trim();
  if (!original) return null;
  const cols = original.split(/\t|;|\|/).map((c) => c.trim()).filter(Boolean);
  if (cols.length >= 2) {
    const n = cols.findIndex((c) => /^\d+([.,]\d+)?$/.test(c));
    if (n >= 0) return { original, cantidad: Math.max(1, Math.round(parseFloat(cols[n].replace(",", ".")))), texto: cols.filter((_, i) => i !== n).join(" ") };
  }
  const t = original.replace(/^[-•*·]\s*/, "").trim();
  let m = t.match(/^(\d+)\s*(?:x|×|u\.?|unid\w*|cajas?|bultos?|packs?|paquetes?|bidones?)?\s+(.+)$/i);
  if (m) return { original, cantidad: parseInt(m[1]), texto: m[2] };
  m = t.match(/^(.+?)\s*(?:[:\-–]|x|×)\s*(\d+)\s*(?:u\.?|unid\w*|cajas?|bultos?|packs?|paquetes?|bidones?)?$/i);
  if (m) return { original, cantidad: parseInt(m[2]), texto: m[1] };
  m = t.match(/^(.+?[a-z\u00e0-\u00ff])\s+(\d+)$/i);
  if (m) return { original, cantidad: parseInt(m[2]), texto: m[1] };
  return { original, cantidad: 1, texto: t };
}

export function rank(texto: string, productos: Producto[]) {
  const q = tokens(texto);
  if (!q.length) return [];
  return productos
    .map((p) => {
      const pt = new Set(tokens(`${p.nombre} ${p.subcategoria ?? ""}`));
      const hits = q.filter((w) => pt.has(w) || [...pt].some((x) => x.length > 4 && (x.startsWith(w) || w.startsWith(x)))).length;
      const score = hits / q.length + (hits / Math.max(pt.size, 1)) * 0.35;
      return { p, score };
    })
    .filter((r) => r.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
