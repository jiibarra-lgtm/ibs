/**
 * Conexión con el sistema de gestión (Ibarra OC Track): costos de los productos.
 * Se usa sólo desde el panel: la base del sistema verifica, con la sesión del panel, que seas administrador de la tienda.
 * La clave publicable es pública por diseño; los datos se protegen con esa verificación.
 */
export const OC_URL = process.env.NEXT_PUBLIC_OCTRACK_URL || "https://blhjhmfjkiwpsunxxaxe.supabase.co";
export const OC_KEY = process.env.NEXT_PUBLIC_OCTRACK_KEY || "sb_publishable_q2fwpftiDnlMtyGtFPSfTQ_XsXjozu1";

export type Costo = { id: string; sku: string | null; description: string; supplier: string | null; cost_net: number | null; cost_gross: number | null; includes_vat: boolean; vat_pct: number | null; unit: string | null };
export type Vinculo = { slug: string; name: string | null; manual_cost_id: string | null; cost_override: number | null };

export async function costosApi<T>(token: string, action: "list" | "set", data: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch(`${OC_URL}/rest/v1/rpc/store_costs`, {
    method: "POST",
    headers: { apikey: OC_KEY, "content-type": "application/json" },
    body: JSON.stringify({ p_token: token, p_action: action, p_data: data }),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error((j as { message?: string } | null)?.message ?? `Error ${r.status}`);
  return j as T;
}
