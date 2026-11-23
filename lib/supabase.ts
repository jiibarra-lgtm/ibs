/** Conexión pública a Supabase (la clave publicable es pública por diseño; la seguridad la da RLS). */
export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://khxtmxbdrcigddvskalk.supabase.co";
export const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_6JE7pm5dau0e-UY5BMBVMw_CgtXMegU";
export const SB_BUCKET = "productos";
