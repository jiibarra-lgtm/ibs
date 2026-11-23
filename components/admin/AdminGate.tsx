"use client";

import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { SB_KEY, SB_URL } from "@/lib/supabase";

export type AdminSession = { sb: SupabaseClient; session: Session; email: string; salir: () => void };

/** Login del panel: Supabase Auth + lista de administradores (tabla public.admins). */
export default function AdminGate({ children }: { children: (s: AdminSession) => React.ReactNode }) {
  const sb = useMemo(() => createClient(SB_URL, SB_KEY, { auth: { persistSession: true, storageKey: "ibarra-admin", storage: typeof window !== "undefined" ? window.sessionStorage : undefined } }), []);
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setCargando(false); });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  // Cierre automático tras 20 minutos sin actividad
  useEffect(() => {
    if (!session) return;
    let t: ReturnType<typeof setTimeout>;
    const reiniciar = () => { clearTimeout(t); t = setTimeout(() => { sb.auth.signOut(); }, 20 * 60 * 1000); };
    const ev = ["mousemove", "keydown", "touchstart", "scroll"] as const;
    ev.forEach((x) => window.addEventListener(x, reiniciar, { passive: true }));
    reiniciar();
    return () => { clearTimeout(t); ev.forEach((x) => window.removeEventListener(x, reiniciar)); };
  }, [session, sb]);

  useEffect(() => {
    if (!session) { setEsAdmin(null); return; }
    sb.rpc("es_admin").then(({ data }) => setEsAdmin(data === true));
  }, [session, sb]);

  async function conLlave() {
    setMsg("");
    const { error } = await sb.auth.signInWithPasskey();
    if (error) setMsg(/cancel|abort|NotAllowed/i.test(error.message) ? "Cancelaste el ingreso con llave." : "No se pudo entrar con la llave.");
  }

  const salir = () => { sb.auth.signOut(); };

  if (cargando) return <div className="ad-login"><p>Cargando…</p></div>;
  if (session && esAdmin) return <>{children({ sb, session, email: session.user.email ?? "", salir })}</>;

  return (
    <div className="ad-login">
      <form onSubmit={(e) => e.preventDefault()} className="ad-login-card">
        <img src="/img/marca/isotipo.webp" alt="" width={44} height={54} />
        <h1>Panel de Ibarra Insumos</h1>
        {session && esAdmin === false ? (
          <>
            <p className="ad-login-err">El email {session.user.email} no está autorizado como administrador.</p>
            <button type="button" className="ad-btn" onClick={salir}>Salir</button>
          </>
        ) : (
          <>
            <button type="button" className="ad-btn" onClick={conLlave}>🔑 Entrar con llave de acceso</button>
            {msg && <p className="ad-login-msg">{msg}</p>}
          </>
        )}
      </form>
    </div>
  );
}
