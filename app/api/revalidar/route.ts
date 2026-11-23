/**
 * El panel de admin llama acá después de guardar en Supabase:
 * verifica que quien llama sea administrador y refresca la web al instante.
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { SB_KEY, SB_URL } from "@/lib/supabase";

export async function POST(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ ok: false, error: "Falta sesión" }, { status: 401 });
  const r = await fetch(`${SB_URL}/rest/v1/rpc/es_admin`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
  });
  if (!r.ok || (await r.json()) !== true) return Response.json({ ok: false, error: "No autorizado" }, { status: 403 });
  revalidateTag("catalogo");
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
