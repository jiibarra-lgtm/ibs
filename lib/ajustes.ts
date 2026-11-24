import { SB_KEY, SB_URL } from "@/lib/supabase";
import { apariencia as aparienciaJson, type Apariencia } from "@/lib/promos";

/** Ajustes editables en vivo desde el panel (tabla ajustes). Si la base no responde, usa el JSON. */
export async function getApariencia(): Promise<Apariencia> {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/ajustes?clave=eq.apariencia&select=valor`, { headers: { apikey: SB_KEY }, next: { revalidate: 300, tags: ["catalogo"] } });
    if (!r.ok) return aparienciaJson;
    const d = (await r.json()) as { valor: Partial<Apariencia> }[];
    return limpiar(d[0]?.valor);
  } catch { return aparienciaJson; }
}

const HEX = /^#[0-9a-f]{6}$/i;
const FUENTES_OK = ["Montserrat", "Poppins", "Inter", "Outfit", "Plus Jakarta Sans", "DM Sans"];
/** Solo deja pasar valores válidos (se inyectan como CSS) */
function limpiar(v?: Partial<Apariencia>): Apariencia {
  const a = aparienciaJson;
  if (!v) return a;
  return {
    colorPrincipal: HEX.test(v.colorPrincipal ?? "") ? v.colorPrincipal! : a.colorPrincipal,
    colorAcento: HEX.test(v.colorAcento ?? "") ? v.colorAcento! : a.colorAcento,
    colorFondo: HEX.test(v.colorFondo ?? "") ? v.colorFondo! : a.colorFondo,
    redondeo: Number.isFinite(v.redondeo) ? Math.max(0, Math.min(28, Math.round(v.redondeo!))) : a.redondeo,
    tipografiaTitulos: FUENTES_OK.includes(v.tipografiaTitulos ?? "") ? v.tipografiaTitulos! : a.tipografiaTitulos,
  };
}
