"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, PageHead } from "@/components/admin/ui";
import { FUENTES, TEMAS, type Tema } from "@/lib/temas";
import type { Apariencia } from "@/lib/promos";


type Evento = { tipo: string; valor: string | null; ruta: string | null; ref: string | null; dispositivo: string | null; sesion: string | null; created_at: string };
type Item = { slug: string; nombre: string; cantidad: number };
type Cotizacion = { id: number; items: Item[]; cupon: string | null; programado: string | null; empresa: string | null; zona: string | null; ruta: string | null; estado: string; nota: string | null; created_at: string };

const fecha = (s: string) => new Date(s).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const dia = (d: Date) => d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });

function contar<T>(arr: T[], key: (x: T) => string | null | undefined, peso: (x: T) => number = () => 1) {
  const m = new Map<string, number>();
  for (const x of arr) { const k = key(x); if (k) m.set(k, (m.get(k) ?? 0) + peso(x)); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Ranking({ titulo, filas, vacio, nombre }: { titulo: string; filas: [string, number][]; vacio: string; nombre?: (k: string) => string }) {
  const max = filas[0]?.[1] ?? 1;
  return (
    <Card title={titulo}>
      {filas.length === 0 ? <p className="ad-an-vacio">{vacio}</p> : (
        <ol className="ad-an-rank">
          {filas.slice(0, 10).map(([k, n]) => (
            <li key={k}>
              <span className="ad-an-bar" style={{ width: `${(n / max) * 100}%` }} />
              <span className="ad-an-k">{nombre ? nombre(k) : k}</span>
              <b>{n.toLocaleString("es-AR")}</b>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function nombreOrigen(h: string) {
  if (/google/.test(h)) return "Google";
  if (/facebook|fb\.|instagram|l\.instagram/.test(h)) return "Facebook / Instagram";
  if (/chatgpt|openai/.test(h)) return "ChatGPT";
  if (/bing/.test(h)) return "Bing";
  if (/mercadolibre/.test(h)) return "Mercado Libre";
  if (/bolsasmortuorias/.test(h)) return "Web bolsas mortuorias";
  return h;
}

/* ───────── ANALÍTICA ───────── */
export function Analitica({ sb, nombres }: { sb: SupabaseClient; nombres: Record<string, string> }) {
  const [dias, setDias] = useState(30);
  const [ev, setEv] = useState<Evento[] | null>(null);
  const [cot, setCot] = useState<Cotizacion[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    setEv(null); setErr("");
    const desde = new Date(Date.now() - dias * 864e5).toISOString();
    (async () => {
      const todos: Evento[] = [];
      for (let i = 0; i < 20; i++) {
        const { data, error } = await sb.from("eventos").select("tipo,valor,ruta,ref,dispositivo,sesion,created_at").gte("created_at", desde).order("created_at", { ascending: false }).range(i * 1000, i * 1000 + 999);
        if (error) { setErr(error.message); break; }
        todos.push(...(data as Evento[]));
        if (!data || data.length < 1000) break;
      }
      const c = await sb.from("cotizaciones").select("*").gte("created_at", desde).limit(5000);
      setCot((c.data as Cotizacion[]) ?? []);
      setEv(todos);
    })();
  }, [sb, dias]);

  const r = useMemo(() => {
    if (!ev) return null;
    const vis = ev.filter((e) => e.tipo === "visita");
    const sesiones = new Set(vis.map((e) => e.sesion).filter(Boolean));
    const porDia: { d: string; n: number }[] = [];
    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      porDia.push({ d: dia(d), n: vis.filter((e) => new Date(e.created_at).toISOString().slice(0, 10) === key).length });
    }
    const primeras = new Map<string, Evento>();
    for (const e of [...vis].reverse()) if (e.sesion && !primeras.has(e.sesion)) primeras.set(e.sesion, e);
    return {
      visitas: vis.length,
      visitantes: sesiones.size,
      wa: ev.filter((e) => e.tipo === "click_whatsapp").length,
      cotizaciones: cot.length,
      porDia,
      productos: contar(ev.filter((e) => e.tipo === "ver_producto"), (e) => e.valor),
      categorias: contar(ev.filter((e) => e.tipo === "ver_categoria"), (e) => e.valor),
      cotizados: contar(cot.flatMap((c) => c.items ?? []), (i) => i.slug, (i) => i.cantidad || 1),
      cupones: contar(cot, (c) => c.cupon),
      origen: contar([...primeras.values()], (e) => (e.ref ? nombreOrigen(e.ref) : "Directo / sin dato")),
      paginas: contar(vis, (e) => e.ruta),
      dispositivo: contar([...primeras.values()], (e) => (e.dispositivo === "movil" ? "Celular" : e.dispositivo === "escritorio" ? "Computadora" : null)),
    };
  }, [ev, cot, dias]);

  const maxDia = Math.max(1, ...(r?.porDia.map((x) => x.n) ?? [1]));
  const nom = (k: string) => nombres[k] ?? k;

  return (
    <>
      <PageHead title="Analítica" desc="Visitas reales de ibarrainsumos.com.ar. No usa cookies ni guarda datos personales.">
        <div className="ad-seg">
          {[7, 30, 90].map((d) => <button key={d} className={dias === d ? "on" : ""} onClick={() => setDias(d)}>{d} días</button>)}
        </div>
      </PageHead>
      {err && <Card><p className="ad-login-err">No se pudieron leer los datos: {err}</p></Card>}
      {!r ? <Card><p className="ad-an-vacio">Cargando…</p></Card> : (
        <>
          <div className="ad-an-kpis">
            {[["Visitas", r.visitas], ["Visitantes", r.visitantes], ["Clics a WhatsApp", r.wa], ["Cotizaciones enviadas", r.cotizaciones]].map(([k, v]) => (
              <div key={k as string} className="ad-card ad-an-kpi"><small>{k}</small><b>{(v as number).toLocaleString("es-AR")}</b></div>
            ))}
          </div>
          <Card title="Visitas por día">
            {r.visitas === 0 ? <p className="ad-an-vacio">Todavía no hay visitas registradas en este período. Se empiezan a contar desde hoy.</p> : (
              <div className="ad-an-chart" style={{ gridTemplateColumns: `repeat(${r.porDia.length}, 1fr)` }}>
                {r.porDia.map((x, i) => (
                  <div key={i} className="ad-an-col" title={`${x.d}: ${x.n} visitas`}>
                    <span style={{ height: `${(x.n / maxDia) * 100}%` }} />
                    {(r.porDia.length <= 14 || i % Math.ceil(r.porDia.length / 10) === 0) && <small>{x.d}</small>}
                  </div>
                ))}
              </div>
            )}
          </Card>
          <div className="ad-grid2">
            <Ranking titulo="Productos más vistos" filas={r.productos} vacio="Sin datos todavía." nombre={nom} />
            <Ranking titulo="Productos más cotizados (unidades)" filas={r.cotizados} vacio="Sin cotizaciones todavía." nombre={nom} />
            <Ranking titulo="De dónde llegan" filas={r.origen} vacio="Sin datos todavía." />
            <Ranking titulo="Categorías más vistas" filas={r.categorias} vacio="Sin datos todavía." />
            <Ranking titulo="Cupones usados" filas={r.cupones} vacio="Ningún cupón usado en este período." />
            <Ranking titulo="Celular o computadora" filas={r.dispositivo} vacio="Sin datos todavía." />
          </div>
          <Ranking titulo="Páginas más visitadas" filas={r.paginas} vacio="Sin datos todavía." />
        </>
      )}
    </>
  );
}

/* ───────── COTIZACIONES ───────── */
const ESTADOS: Record<string, string> = { nueva: "🟡 Nueva", respondida: "🔵 Respondida", cerrada: "🟢 Vendida", perdida: "⚪ Perdida" };

export function Cotizaciones({ sb, ok }: { sb: SupabaseClient; ok: (m: string) => void }) {
  const [lista, setLista] = useState<Cotizacion[] | null>(null);
  const [filtro, setFiltro] = useState("todas");
  const cargar = useCallback(async () => {
    const { data } = await sb.from("cotizaciones").select("*").order("created_at", { ascending: false }).limit(500);
    setLista((data as Cotizacion[]) ?? []);
  }, [sb]);
  useEffect(() => { cargar(); }, [cargar]);

  async function cambiar(id: number, cambios: Partial<Cotizacion>) {
    const { error } = await sb.from("cotizaciones").update(cambios).eq("id", id);
    if (error) ok("No se pudo guardar: " + error.message);
    else setLista((l) => l?.map((c) => (c.id === id ? { ...c, ...cambios } : c)) ?? null);
  }
  async function borrar(id: number) {
    if (!confirm("¿Borrar esta cotización del registro?")) return;
    const { error } = await sb.from("cotizaciones").delete().eq("id", id);
    if (error) ok("No se pudo borrar: " + error.message);
    else setLista((l) => l?.filter((c) => c.id !== id) ?? null);
  }

  const vis = (lista ?? []).filter((c) => filtro === "todas" || c.estado === filtro);
  const cuenta = (e: string) => (lista ?? []).filter((c) => c.estado === e).length;

  return (
    <>
      <PageHead title="Cotizaciones" desc="Cada vez que un cliente toca “Enviar cotización por WhatsApp”, queda registrada acá.">
        <button className="ad-btn ad-btn--ghost" onClick={cargar}>Actualizar</button>
      </PageHead>
      <div className="ad-seg">
        <button className={filtro === "todas" ? "on" : ""} onClick={() => setFiltro("todas")}>Todas ({lista?.length ?? 0})</button>
        {Object.entries(ESTADOS).map(([k, v]) => <button key={k} className={filtro === k ? "on" : ""} onClick={() => setFiltro(k)}>{v} ({cuenta(k)})</button>)}
      </div>
      {!lista ? <Card><p className="ad-an-vacio">Cargando…</p></Card> : vis.length === 0 ? (
        <Card><p className="ad-an-vacio">{lista.length === 0 ? "Todavía no llegó ninguna cotización desde la web. Se registran a partir de hoy." : "No hay cotizaciones con este estado."}</p></Card>
      ) : vis.map((c) => (
        <Card key={c.id} title={`#${c.id} · ${fecha(c.created_at)}`} desc={[c.empresa, c.zona].filter(Boolean).join(" · ") || "Sin empresa ni zona"}
          right={<select value={c.estado} onChange={(e) => cambiar(c.id, { estado: e.target.value })}>{Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>}>
          <ul className="ad-cot-items">{c.items.map((i, n) => <li key={n}><b>{i.cantidad} ×</b> {i.nombre}</li>)}</ul>
          <div className="ad-chips">
            {c.cupon && <span className="ad-cot-tag">🏷️ {c.cupon}</span>}
            {c.programado && <span className="ad-cot-tag">🔁 {c.programado}</span>}
            {c.ruta && <span className="ad-cot-tag">Desde {c.ruta}</span>}
          </div>
          <textarea placeholder="Nota interna (precio pasado, quién respondió, etc.)" defaultValue={c.nota ?? ""} rows={2}
            onBlur={(e) => { if ((e.target.value || null) !== c.nota) cambiar(c.id, { nota: e.target.value || null }); }} />
          <div><button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => borrar(c.id)}>Borrar</button></div>
        </Card>
      ))}
    </>
  );
}

/* ───────── USUARIOS / SEGURIDAD ───────── */
type Llave = { id: string; friendly_name?: string | null; created_at: string; last_used_at?: string | null };

export function Usuarios({ sb, email, ok }: { sb: SupabaseClient; email: string; ok: (m: string) => void }) {
  const [llaves, setLlaves] = useState<Llave[] | null>(null);
  const cargar = useCallback(async () => {
    const { data, error } = await sb.auth.passkey.list();
    if (error) ok("No se pudieron leer las llaves: " + error.message);
    setLlaves((data as unknown as Llave[]) ?? []);
  }, [sb, ok]);
  useEffect(() => { cargar(); }, [cargar]);

  async function agregar() {
    const { error } = await sb.auth.registerPasskey();
    if (error) ok("No se pudo registrar: " + error.message); else { ok("Llave registrada."); cargar(); }
  }
  async function renombrar(l: Llave) {
    const n = prompt("Nombre para esta llave (ej. iPhone, MacBook)", l.friendly_name ?? "");
    if (!n) return;
    const { error } = await sb.auth.passkey.update({ passkeyId: l.id, friendlyName: n });
    if (error) ok("No se pudo renombrar: " + error.message); else cargar();
  }
  async function quitar(l: Llave) {
    if ((llaves?.length ?? 0) <= 1) { ok("Es tu única llave: registrá otra antes de quitarla, o te quedás sin acceso."); return; }
    if (!confirm(`¿Quitar la llave "${l.friendly_name ?? "sin nombre"}"? Ese dispositivo ya no va a poder entrar.`)) return;
    const { error } = await sb.auth.passkey.delete({ passkeyId: l.id });
    if (error) ok("No se pudo quitar: " + error.message); else cargar();
  }

  return (
    <>
      <PageHead title="Usuarios y seguridad" desc="El panel solo se abre con llave de acceso (Face ID / Touch ID). La contraseña no sirve para entrar ni para guardar cambios." />
      <Card title="Administrador">
        <p><b>{email}</b> — único usuario con acceso al panel.</p>
        <p className="ad-an-vacio">Para sumar a otra persona, pedímelo: la agrego a la lista de administradores y ella registra su propia llave.</p>
      </Card>
      <Card title="Llaves de acceso" desc="Cada dispositivo que puede abrir el panel. Si perdés uno, quitalo de acá." right={<button className="ad-btn ad-btn--sm" onClick={agregar}>+ Registrar este dispositivo</button>}>
        {!llaves ? <p className="ad-an-vacio">Cargando…</p> : (
          <ul className="ad-llaves">
            {llaves.map((l) => (
              <li key={l.id}>
                <div><b>🔑 {l.friendly_name || "Llave sin nombre"}</b><small>Creada {fecha(l.created_at)}{l.last_used_at ? ` · último uso ${fecha(l.last_used_at)}` : ""}</small></div>
                <div className="ad-chips">
                  <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => renombrar(l)}>Renombrar</button>
                  <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => quitar(l)}>Quitar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

/* ───────── APARIENCIA: plantillas ───────── */

const fuenteCss: Record<string, string> = { Montserrat: "var(--f-montserrat)", Poppins: "var(--f-poppins)", Inter: "var(--f-inter)", Outfit: "var(--f-outfit)", "Plus Jakarta Sans": "var(--f-jakarta)", "DM Sans": "var(--f-dmsans)" };
const igual = (a: Apariencia, b: Apariencia) => a.colorPrincipal.toLowerCase() === b.colorPrincipal.toLowerCase() && a.colorAcento.toLowerCase() === b.colorAcento.toLowerCase() && a.colorFondo.toLowerCase() === b.colorFondo.toLowerCase() && a.redondeo === b.redondeo && a.tipografiaTitulos === b.tipografiaTitulos;

function Mini({ a, img, nombre, grande = false }: { a: Apariencia; img?: string; nombre?: string; grande?: boolean }) {
  const f = fuenteCss[a.tipografiaTitulos] ?? "inherit";
  return (
    <div className={`tp-mini ${grande ? "tp-mini--xl" : ""}`} style={{ background: a.colorFondo, borderRadius: a.redondeo / 2 + 6 }}>
      <div className="tp-bar" style={{ background: a.colorAcento }}>Envío gratis desde $150.000</div>
      <div className="tp-hero" style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, ${a.colorPrincipal}ee), url(/img/marca/planta-800.webp)` }}>
        <span className="tp-stk" style={{ fontFamily: f }}><i style={{ background: a.colorPrincipal }}>DESCUENTOS</i><i style={{ color: a.colorPrincipal, borderColor: a.colorAcento }}>EXCLUSIVOS</i></span>
        <b style={{ fontFamily: f }}>Fabricamos limpieza institucional</b>
        <em style={{ background: a.colorAcento, borderRadius: a.redondeo }}>Ver catálogo</em>
      </div>
      <div className="tp-row">
        {[0, 1].map((k) => (
          <div key={k} className="tp-card" style={{ borderRadius: a.redondeo / 2 + 4 }}>
            {img && <img src={img} alt="" />}
            <b style={{ color: a.colorPrincipal, fontFamily: f }}>{k === 0 ? nombre : "Llevando 12 · −10%"}</b>
            <em style={{ background: a.colorPrincipal, borderRadius: a.redondeo }}>+ Cotizar</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Plantillas({ sb, ok, img, nombre, inicial }: { sb: SupabaseClient; ok: (m: string) => void; img?: string; nombre?: string; inicial: Apariencia }) {
  const [enUso, setEnUso] = useState<Apariencia>(inicial);
  const [edit, setEdit] = useState<Apariencia>(inicial);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    sb.from("ajustes").select("valor").eq("clave", "apariencia").maybeSingle().then(({ data }) => {
      if (data?.valor) { const v = { ...inicial, ...(data.valor as Apariencia) }; setEnUso(v); setEdit(v); }
    });
  }, [sb, inicial]);

  async function publicar(a: Apariencia, nombreTema?: string) {
    setGuardando(true);
    const { error } = await sb.from("ajustes").upsert({ clave: "apariencia", valor: a, updated_at: new Date().toISOString() });
    if (error) { ok("No se pudo publicar: " + error.message); setGuardando(false); return; }
    const { data } = await sb.auth.getSession();
    await fetch("/api/revalidar", { method: "POST", headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` } }).catch(() => {});
    setEnUso(a); setEdit(a); setGuardando(false);
    ok(`${nombreTema ? `“${nombreTema}”` : "Diseño"} publicado. Recargá la web para verlo.`);
  }

  const cambiado = !igual(edit, enUso);
  const temaActual = TEMAS.find((t) => igual(t, enUso));

  return (
    <>
      <PageHead title="Apariencia" desc="Elegí una plantilla y se aplica a toda la web en segundos. Todas mantienen los colores de la marca.">
        <a className="ad-btn ad-btn--ghost" href="/" target="_blank" rel="noopener">Ver la web</a>
      </PageHead>

      <div className="tp-grid">
        {TEMAS.map((t: Tema) => {
          const usado = igual(t, enUso);
          return (
            <div key={t.id} className={`tp ${usado ? "on" : ""} ${igual(t, edit) && !usado ? "sel" : ""}`}>
              <button className="tp-prev" onClick={() => setEdit({ colorPrincipal: t.colorPrincipal, colorAcento: t.colorAcento, colorFondo: t.colorFondo, redondeo: t.redondeo, tipografiaTitulos: t.tipografiaTitulos })} aria-label={`Probar ${t.nombre}`}>
                <Mini a={t} img={img} nombre={nombre} />
              </button>
              <div className="tp-info">
                <div><b>{t.nombre}</b>{usado && <span className="tp-badge">En uso</span>}</div>
                <p>{t.para}</p>
                <div className="tp-dots">{[t.colorPrincipal, t.colorAcento, t.colorFondo].map((c) => <i key={c} style={{ background: c }} />)}<small>{t.tipografiaTitulos}</small></div>
                <button className="ad-btn ad-btn--sm" disabled={usado || guardando} onClick={() => publicar({ colorPrincipal: t.colorPrincipal, colorAcento: t.colorAcento, colorFondo: t.colorFondo, redondeo: t.redondeo, tipografiaTitulos: t.tipografiaTitulos }, t.nombre)}>
                  {usado ? "Aplicada" : "Usar esta plantilla"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ad-split">
        <Card title="Personalizar" desc={temaActual ? `Partiendo de “${temaActual.nombre}”. Ajustá lo que quieras y publicá.` : "Diseño personalizado."}>
          <p className="ad-an-vacio">Los colores de la marca (verde, dorado y crema) quedan fijos en todas las plantillas.</p>
          <div className="tp-field">
            <div><b>Redondeo</b><small>Esquinas de tarjetas y botones</small></div>
            <div className="ad-range"><input type="range" min={0} max={28} value={edit.redondeo} onChange={(e) => setEdit({ ...edit, redondeo: +e.target.value })} /><b>{edit.redondeo}px</b></div>
          </div>
          <div className="tp-field">
            <div><b>Tipografía de títulos</b></div>
            <select className="ad-select" value={edit.tipografiaTitulos} onChange={(e) => setEdit({ ...edit, tipografiaTitulos: e.target.value })}>
              {FUENTES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="ad-chips">
            <button className="ad-btn" disabled={!cambiado || guardando} onClick={() => publicar(edit)}>{guardando ? "Publicando…" : "Publicar en la web"}</button>
            {cambiado && <button className="ad-btn ad-btn--ghost" onClick={() => setEdit(enUso)}>Descartar</button>}
          </div>
        </Card>
        <div className="ad-sticky">
          <p className="ad-prev-label">{cambiado ? "Vista previa (sin publicar)" : "Así se ve ahora"}</p>
          <Mini a={edit} img={img} nombre={nombre} grande />
        </div>
      </div>
    </>
  );
}
