"use client";

import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { SB_KEY, SB_URL } from "@/lib/supabase";

export type AdminSession = { sb: SupabaseClient; session: Session; email: string; salir: () => void };

/** Login del panel: Supabase Auth + lista de administradores (tabla public.admins). */
export default function AdminGate({ children }: { children: (s: AdminSession) => React.ReactNode }) {
  const sb = useMemo(() => createClient(SB_URL, SB_KEY, { auth: { persistSession: true, storageKey: "ibarra-admin" } }), []);
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [modo, setModo] = useState<"entrar" | "crear" | "olvide">("entrar");

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setCargando(false); });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!session) { setEsAdmin(null); return; }
    sb.rpc("es_admin").then(({ data }) => setEsAdmin(data === true));
  }, [session, sb]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (modo === "entrar") {
      const { error } = await sb.auth.signInWithPassword({ email, password: pass });
      if (error) setMsg(error.message.includes("Email not confirmed") ? "Confirmá tu email con el link que te mandamos." : "Email o contraseña incorrectos.");
    } else if (modo === "crear") {
      if (pass.length < 8) { setMsg("La contraseña tiene que tener al menos 8 caracteres."); return; }
      const { error } = await sb.auth.signUp({ email, password: pass, options: { emailRedirectTo: `${location.origin}/admin` } });
      setMsg(error ? error.message : "Listo. Te mandamos un mail para confirmar la cuenta; después entrá con tu contraseña.");
    } else {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin` });
      setMsg(error ? error.message : "Te mandamos un mail para elegir una contraseña nueva.");
    }
  }

  async function conLlave() {
    setMsg("");
    const { error } = await sb.auth.signInWithPasskey();
    if (error) setMsg(/cancel|abort|NotAllowed/i.test(error.message) ? "Cancelaste el ingreso con llave." : "No se pudo entrar con la llave. Si todavía no la registraste, entrá con tu contraseña y registrala desde el panel.");
  }

  const salir = () => { sb.auth.signOut(); };

  if (cargando) return <div className="ad-login"><p>Cargando…</p></div>;
  if (session && esAdmin) return <>{children({ sb, session, email: session.user.email ?? "", salir })}</>;

  return (
    <div className="ad-login">
      <form onSubmit={enviar} className="ad-login-card">
        <img src="/img/marca/isotipo.webp" alt="" width={44} height={54} />
        <h1>Panel de Ibarra Insumos</h1>
        {session && esAdmin === false ? (
          <>
            <p className="ad-login-err">El email {session.user.email} no está autorizado como administrador.</p>
            <button type="button" className="ad-btn" onClick={salir}>Salir</button>
          </>
        ) : (
          <>
            {modo === "entrar" && (<>
              <button type="button" className="ad-btn" onClick={conLlave}>🔑 Entrar con llave de acceso</button>
              <p className="ad-login-sep">o con email y contraseña</p>
            </>)}
            <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username webauthn" /></label>
            {modo !== "olvide" && <label>Contraseña<input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} autoComplete={modo === "crear" ? "new-password" : "current-password"} /></label>}
            <button className="ad-btn" type="submit">{modo === "entrar" ? "Entrar" : modo === "crear" ? "Crear mi contraseña" : "Enviarme el mail"}</button>
            {msg && <p className="ad-login-msg">{msg}</p>}
            <div className="ad-login-links">
              {modo !== "entrar" && <button type="button" onClick={() => { setModo("entrar"); setMsg(""); }}>Ya tengo contraseña</button>}
              {modo !== "crear" && <button type="button" onClick={() => { setModo("crear"); setMsg(""); }}>Primera vez: crear contraseña</button>}
              {modo !== "olvide" && <button type="button" onClick={() => { setModo("olvide"); setMsg(""); }}>Olvidé mi contraseña</button>}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
