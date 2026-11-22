"use client";

import { useEffect, useMemo, useState } from "react";
import type { Categoria, Producto } from "@/lib/catalog";
import type tiendaJson from "@/data/tienda.json";
import { Card, Field, Icon, PageHead, Row, Toggle } from "./ui";

type Tienda = typeof tiendaJson;
type Sec =
  | "inicio" | "productos" | "categorias" | "combos" | "precios" | "promociones"
  | "home" | "barra" | "popup" | "eventos" | "guias" | "animaciones" | "apariencia" | "testimonios" | "medios"
  | "cotizaciones" | "analitica" | "usuarios" | "configuracion";

const NAV: { grupo: string; items: { id: Sec; label: string; icon: string }[] }[] = [
  { grupo: "", items: [{ id: "inicio", label: "Resumen", icon: "grid" }] },
  { grupo: "Catálogo", items: [
    { id: "productos", label: "Productos", icon: "box" },
    { id: "categorias", label: "Categorías", icon: "list" },
    { id: "combos", label: "Kits", icon: "gift" },
    { id: "precios", label: "Precios y escalas", icon: "dollar" },
    { id: "promociones", label: "Promociones", icon: "tag" },
  ] },
  { grupo: "Contenido", items: [
    { id: "home", label: "Página de inicio", icon: "home" },
    { id: "barra", label: "Barra superior", icon: "megaphone" },
    { id: "popup", label: "Popup", icon: "window" },
    { id: "eventos", label: "Eventos y fechas", icon: "megaphone" },
    { id: "guias", label: "Guías (blog)", icon: "list" },
    { id: "animaciones", label: "Animaciones", icon: "star" },
    { id: "apariencia", label: "Apariencia", icon: "palette" },
    { id: "testimonios", label: "Testimonios", icon: "quote" },
    { id: "medios", label: "Medios", icon: "image" },
  ] },
  { grupo: "Tienda", items: [
    { id: "cotizaciones", label: "Cotizaciones", icon: "receipt" },
    { id: "analitica", label: "Analítica", icon: "chart" },
    { id: "usuarios", label: "Usuarios", icon: "user" },
    { id: "configuracion", label: "Configuración", icon: "gear" },
  ] },
];

const SECCIONES_HOME: Record<string, string> = {
  sellos: "Sellos de confianza", rubros: "Rubros (banda animada)", ofertaDelMes: "Oferta del mes", categorias: "Categorías",
  combos: "Combos", descuentos: "Descuentos y cupones", destacados: "Productos destacados", comoComprar: "Cómo comprar",
  ventajas: "Por qué elegirnos", calculadora: "Calculadora de rendimiento", nosotros: "Nosotros", testimonios: "Testimonios",
  herramientas: "Herramientas", guias: "Guías", preguntas: "Preguntas frecuentes", glosario: "Glosario", suscripcion: "Suscripción a ofertas", contacto: "Contacto",
};

function download(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Guia = { slug: string; titulo: string; resumen: string; categoria: string; fecha: string; minutos: number; imagen: string; productos: string[]; kit?: string; contenido: string };

export default function AdminApp(props: { tienda: Tienda; productos: Producto[]; categorias: Categoria[]; testimonios: { texto: string; nombre: string; cargo?: string }[]; guias: Guia[] }) {
  const [sec, setSec] = useState<Sec>("inicio");
  const [menu, setMenu] = useState(false);
  const [t, setT] = useState<Tienda>(props.tienda);
  const [productos, setProductos] = useState(props.productos);
  const [categorias, setCategorias] = useState(props.categorias);
  const [tests, setTests] = useState(props.testimonios);
  const [guias, setGuias] = useState<Guia[]>(props.guias);
  const [gEdit, setGEdit] = useState<number | null>(null);
  const [evOpen, setEvOpen] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");
  const [edit, setEdit] = useState<Producto | null>(null);
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("todas");

  const ok = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const upd = <K extends keyof Tienda>(k: K, v: Tienda[K]) => { setT((p) => ({ ...p, [k]: v })); setDirty(true); };
  const setProds = (f: (p: Producto[]) => Producto[]) => { setProductos(f); setDirty(true); };
  const catName = useMemo(() => Object.fromEntries(categorias.map((c) => [c.slug, c.nombre])), [categorias]);
  const pName = (s: string) => productos.find((p) => p.slug === s)?.nombre ?? s;
  const go = (s: Sec) => { setSec(s); setMenu(false); window.scrollTo(0, 0); };

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  function exportar() {
    const codes = new Set(t.cupones.map((c) => c.code));
    const extra = t.eventos.filter((e) => !codes.has(e.cupon)).map((e) => ({ code: e.cupon, off: e.off, desc: `${e.off}% OFF ${e.nombre}`, desde: e.desde, vence: e.hasta, oculto: true }));
    const cupones = t.cupones.map((c) => {
      const e = t.eventos.find((x) => x.cupon === c.code);
      return e ? { ...c, off: e.off, desde: e.desde, vence: e.hasta, oculto: true } : c;
    });
    download("tienda.json", { ...t, cupones: [...cupones, ...extra] });
    setTimeout(() => download("productos.json", productos), 300);
    setTimeout(() => download("categorias.json", categorias), 600);
    setTimeout(() => download("testimonios.json", tests), 900);
    setTimeout(() => download("guias.json", guias), 1200);
    setDirty(false);
    ok("✓ Archivos descargados — reemplazalos en /data y publicá");
  }

  const label = NAV.flatMap((g) => g.items).find((i) => i.id === sec)?.label;

  return (
    <div className="ad">
      {/* SIDEBAR */}
      <div className={`ad-scrim ${menu ? "on" : ""}`} onClick={() => setMenu(false)} />
      <aside className={`ad-side ${menu ? "on" : ""}`}>
        <div className="ad-brand">
          <span className="ad-logo"><img src="/img/marca/isotipo.png" alt="" width={26} height={32} /></span>
          <b>Ibarra Insumos</b>
          <button className="ad-close" onClick={() => setMenu(false)} aria-label="Cerrar menú"><Icon n="x" /></button>
        </div>
        <nav className="ad-nav" data-lenis-prevent>
          {NAV.map((g) => (
            <div key={g.grupo || "root"}>
              {g.grupo && <p className="ad-group">{g.grupo}</p>}
              {g.items.map((it) => (
                <button key={it.id} className={sec === it.id ? "on" : ""} onClick={() => go(it.id)}>
                  <Icon n={it.icon} /> {it.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="ad-me">
          <b>Juani</b>
          <small>Superadmin · {"info@ibarrainsumos.com.ar"}</small>
          <button className="ad-logout" disabled title="Disponible al conectar el login">Cerrar sesión</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ad-main">
        <div className="ad-top">
          <button className="ad-burger" onClick={() => setMenu(true)} aria-label="Abrir menú"><Icon n="menu" /></button>
          <span className="ad-crumb">Panel / <b>{label}</b></span>
          <div className="ad-top-act">
            <a className="ad-btn ad-btn--ghost" href="/" target="_blank" rel="noopener"><Icon n="external" size={16} /> <span>Ver tienda</span></a>
            <button className={`ad-btn ${dirty ? "ad-btn--pulse" : ""}`} onClick={exportar}><Icon n="download" size={16} /> <span>{dirty ? "Exportar cambios" : "Exportar"}</span></button>
          </div>
        </div>

        <div className="ad-content">
          {dirty && <div className="ad-note">Tenés cambios sin exportar. Hasta conectar la base, “Exportar” descarga los archivos para reemplazar en <code>/data</code>.</div>}

          {/* ───────── RESUMEN ───────── */}
          {sec === "inicio" && (
            <>
              <PageHead title="Buen día, Juani 👋" desc="Todo lo de la tienda se maneja desde acá." />
              <div className="ad-kpis">
                <div className="ad-kpi"><span>Productos</span><b>{productos.length}</b><small>{productos.filter((p) => p.destacado).length} destacados</small></div>
                <div className="ad-kpi"><span>Oferta del mes</span><b>{t.ofertaDelMes.activa ? `−${t.ofertaDelMes.off}%` : "Apagada"}</b><small>hasta {new Date(t.ofertaDelMes.hasta).toLocaleDateString("es-AR")}</small></div>
                <div className="ad-kpi"><span>Cupones</span><b>{t.cupones.length}</b><small>{t.cupones.map((c) => c.code).join(" · ")}</small></div>
                <div className="ad-kpi"><span>Popup</span><b>{t.popup.activo ? "Activo" : "Apagado"}</b><small>{t.popup.titulo}</small></div>
              </div>
              <div className="ad-grid2">
                <Card title="Accesos rápidos">
                  <div className="ad-quick">
                    {([["productos", "box", "Cargar producto"], ["promociones", "tag", "Crear cupón"], ["popup", "window", "Editar popup"], ["home", "home", "Cambiar banners"], ["apariencia", "palette", "Colores de la tienda"], ["combos", "gift", "Armar kit"]] as const).map(([id, ic, l]) => (
                      <button key={id} onClick={() => go(id)}><Icon n={ic} /> {l}</button>
                    ))}
                  </div>
                </Card>
                <Card title="Productos por categoría">
                  {categorias.map((c) => {
                    const n = productos.filter((p) => p.categoria === c.slug).length;
                    return <div className="ad-bar" key={c.slug}><span>{c.nombre}</span><i><em style={{ width: `${Math.min(100, (n / Math.max(1, productos.length)) * 300)}%` }} /></i><b>{n}</b></div>;
                  })}
                </Card>
              </div>
            </>
          )}

          {/* ───────── PRODUCTOS ───────── */}
          {sec === "productos" && (
            <>
              <PageHead title="Productos" desc={`${productos.length} publicados`}>
                <button className="ad-btn" onClick={() => setEdit({ slug: "", nombre: "", descripcion: "", categoria: categorias[0].slug, imagenes: [] })}><Icon n="plus" size={16} /> Nuevo producto</button>
              </PageHead>
              <div className="ad-tools">
                <input placeholder="Buscar producto…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select value={fCat} onChange={(e) => setFCat(e.target.value)}>
                  <option value="todas">Todas las categorías</option>
                  {categorias.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="ad-list">
                {productos.filter((p) => (fCat === "todas" || p.categoria === fCat) && p.nombre.toLowerCase().includes(q.toLowerCase())).map((p) => {
                  const idx = productos.indexOf(p);
                  return (
                    <div className="ad-item" key={p.slug}>
                      <div className="ad-order">
                        <button disabled={idx === 0} onClick={() => setProds((a) => { const b = [...a]; [b[idx - 1], b[idx]] = [b[idx], b[idx - 1]]; return b; })} aria-label="Subir"><Icon n="up" size={14} /></button>
                        <button disabled={idx === productos.length - 1} onClick={() => setProds((a) => { const b = [...a]; [b[idx + 1], b[idx]] = [b[idx], b[idx + 1]]; return b; })} aria-label="Bajar"><Icon n="down" size={14} /></button>
                      </div>
                      <img src={p.imagenes[0]} alt="" />
                      <div className="ad-item-main">
                        <b>{p.nombre}</b>
                        <small>{catName[p.categoria]}{p.fabricacionPropia ? " · 🏭 Propio" : ""}{p.badge ? ` · ${p.badge}` : ""}{typeof p.precio === "number" ? ` · $${p.precio.toLocaleString("es-AR")}` : ""}</small>
                      </div>
                      <label className="ad-inline"><small>Destacado</small><Toggle on={!!p.destacado} onChange={(v) => setProds((a) => a.map((x) => x.slug === p.slug ? { ...x, destacado: v } : x))} /></label>
                      <button className="ad-link" onClick={() => setEdit(p)}>Editar</button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ───────── CATEGORÍAS ───────── */}
          {sec === "categorias" && (
            <>
              <PageHead title="Categorías" desc="El orden de acá es el orden en la tienda.">
                <button className="ad-btn" onClick={() => { setCategorias([...categorias, { slug: `categoria-${categorias.length + 1}`, nombre: "Nueva categoría", icono: "📦", descripcion: "" }]); setDirty(true); }}><Icon n="plus" size={16} /> Nueva</button>
              </PageHead>
              <div className="ad-stack">
                {categorias.map((c, i) => (
                  <Card key={c.slug}>
                    <div className="ad-cat">
                      <div className="ad-order">
                        <button disabled={i === 0} onClick={() => { const b = [...categorias]; [b[i - 1], b[i]] = [b[i], b[i - 1]]; setCategorias(b); setDirty(true); }}><Icon n="up" size={14} /></button>
                        <button disabled={i === categorias.length - 1} onClick={() => { const b = [...categorias]; [b[i + 1], b[i]] = [b[i], b[i + 1]]; setCategorias(b); setDirty(true); }}><Icon n="down" size={14} /></button>
                      </div>
                      <input className="ad-emoji" value={c.icono} onChange={(e) => { setCategorias(categorias.map((x, j) => j === i ? { ...x, icono: e.target.value } : x)); setDirty(true); }} />
                      <div className="ad-cat-f">
                        <input value={c.nombre} onChange={(e) => { setCategorias(categorias.map((x, j) => j === i ? { ...x, nombre: e.target.value } : x)); setDirty(true); }} />
                        <textarea rows={2} value={c.descripcion} placeholder="Descripción (aparece en la tienda y en Google)" onChange={(e) => { setCategorias(categorias.map((x, j) => j === i ? { ...x, descripcion: e.target.value } : x)); setDirty(true); }} />
                      </div>
                      <small className="ad-mut">{productos.filter((p) => p.categoria === c.slug).length} productos</small>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ───────── COMBOS ───────── */}
          {sec === "combos" && (
            <>
              <datalist id="ad-rubros">{Array.from(new Set(t.kits.map((k) => k.rubro))).map((r) => <option key={r} value={r} />)}</datalist>
              <PageHead title="Kits" desc="Kits por rubro con descuento. Se muestran en /kits y los marcados con etiqueta, en la portada.">
                <button className="ad-btn" onClick={() => upd("kits", [...t.kits, { slug: `kit-${t.kits.length + 1}`, nombre: "Nuevo kit", rubro: "Comercio", para: "", icono: "🎁", off: 5, descripcion: "", items: [] }] as Tienda["kits"])}><Icon n="plus" size={16} /> Nuevo kit</button>
              </PageHead>
              <div className="ad-stack">
                {t.kits.map((k, i) => {
                  const set = (patch: Partial<typeof k>) => upd("kits", t.kits.map((x, j) => j === i ? { ...x, ...patch } : x) as Tienda["kits"]);
                  return (
                    <Card key={k.slug} title={`${k.icono} ${k.nombre}`} right={<button className="ad-link ad-danger" onClick={() => upd("kits", t.kits.filter((_, j) => j !== i))}>Eliminar</button>}>
                      <div className="ad-form3">
                        <Field label="Nombre"><input value={k.nombre} onChange={(e) => set({ nombre: e.target.value, slug: slugify(e.target.value) })} /></Field>
                        <Field label="Rubro"><input value={k.rubro} list="ad-rubros" onChange={(e) => set({ rubro: e.target.value })} /></Field>
                        <Field label="Para quién"><input value={k.para} onChange={(e) => set({ para: e.target.value })} /></Field>
                        <Field label="Descuento %"><input type="number" value={k.off} onChange={(e) => set({ off: +e.target.value })} /></Field>
                        <Field label="Ícono"><input value={k.icono} onChange={(e) => set({ icono: e.target.value })} /></Field>
                        <Field label="Etiqueta"><select value={("tag" in k && k.tag) || ""} onChange={(e) => set({ tag: e.target.value || undefined } as Partial<typeof k>)}>{["", "Más elegido", "Mejor precio", "Nuevo"].map((x) => <option key={x} value={x}>{x || "Sin etiqueta"}</option>)}</select></Field>
                      </div>
                      <Field label="Descripción"><textarea rows={2} value={k.descripcion} onChange={(e) => set({ descripcion: e.target.value })} /></Field>
                      <div className="ad-kit-items">
                        {k.items.map((it, j) => (
                          <div key={j} className="ad-kit-item">
                            <input type="number" min={1} value={it.cantidad} onChange={(e) => set({ items: k.items.map((x, n) => n === j ? { ...x, cantidad: +e.target.value } : x) })} />
                            <select value={it.slug} onChange={(e) => set({ items: k.items.map((x, n) => n === j ? { ...x, slug: e.target.value } : x) })}>{productos.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}</select>
                            <button onClick={() => set({ items: k.items.filter((_, n) => n !== j) })} aria-label="Quitar"><Icon n="trash" size={16} /></button>
                          </div>
                        ))}
                        <button className="ad-add" onClick={() => set({ items: [...k.items, { slug: productos[0].slug, cantidad: 1 }] })}><Icon n="plus" size={14} /> Agregar producto</button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* ───────── PRECIOS ───────── */}
          {sec === "precios" && (
            <>
              <PageHead title="Precios y escalas" desc="Precio opcional por producto y descuentos automáticos por cantidad." />
              <Card title="Descuento por cantidad" desc="Se aplica solo en la cotización, según las unidades de cada producto.">
                {t.escalas.map((e, i) => (
                  <div className="ad-tier" key={i}>
                    <Field label="Etiqueta"><input value={e.label} onChange={(ev) => upd("escalas", t.escalas.map((x, j) => j === i ? { ...x, label: ev.target.value } : x))} /></Field>
                    <Field label="Desde (u.)"><input type="number" value={e.min} onChange={(ev) => upd("escalas", t.escalas.map((x, j) => j === i ? { ...x, min: +ev.target.value } : x))} /></Field>
                    <Field label="Descuento %"><input type="number" value={e.off} onChange={(ev) => upd("escalas", t.escalas.map((x, j) => j === i ? { ...x, off: +ev.target.value } : x))} /></Field>
                    <Field label="Cartelito"><input value={("tag" in e && e.tag) || ""} placeholder="Ej: Más elegido" onChange={(ev) => upd("escalas", t.escalas.map((x, j) => j === i ? { ...x, tag: ev.target.value || undefined } : x) as Tienda["escalas"])} /></Field>
                  </div>
                ))}
              </Card>
              <Card title="Precios por producto" desc="Dejalo vacío para mostrar “Consultar”. Si cargás precio, la tienda muestra precio tachado y total.">
                <div className="ad-prices">
                  {productos.map((p) => (
                    <div key={p.slug} className="ad-price">
                      <img src={p.imagenes[0]} alt="" /><span>{p.nombre}</span>
                      <input type="number" placeholder="Consultar" value={p.precio ?? ""} onChange={(e) => setProds((a) => a.map((x) => x.slug === p.slug ? { ...x, precio: e.target.value ? +e.target.value : undefined } : x))} />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* ───────── PROMOCIONES ───────── */}
          {sec === "promociones" && (
            <>
              <PageHead title="Promociones" desc="Oferta del mes con cuenta regresiva y cupones." />
              <Card title="🔥 Oferta del mes" right={<Toggle on={t.ofertaDelMes.activa} onChange={(v) => upd("ofertaDelMes", { ...t.ofertaDelMes, activa: v })} label="Oferta activa" />}>
                <div className="ad-form2">
                  <Field label="Título"><input value={t.ofertaDelMes.titulo} onChange={(e) => upd("ofertaDelMes", { ...t.ofertaDelMes, titulo: e.target.value })} /></Field>
                  <Field label="Descuento %"><input type="number" value={t.ofertaDelMes.off} onChange={(e) => upd("ofertaDelMes", { ...t.ofertaDelMes, off: +e.target.value })} /></Field>
                  <Field label="Bajada"><textarea rows={2} value={t.ofertaDelMes.bajada} onChange={(e) => upd("ofertaDelMes", { ...t.ofertaDelMes, bajada: e.target.value })} /></Field>
                  <Field label="Termina el" hint="La cuenta regresiva llega a cero en esta fecha y la oferta se apaga sola."><input type="date" value={t.ofertaDelMes.hasta.slice(0, 10)} onChange={(e) => upd("ofertaDelMes", { ...t.ofertaDelMes, hasta: `${e.target.value}T23:59:59-03:00` })} /></Field>
                </div>
                <Field label="Productos en oferta">
                  <div className="ad-chips">
                    {t.ofertaDelMes.productos.map((s) => <span key={s} className="ad-chip">{pName(s)}<button onClick={() => upd("ofertaDelMes", { ...t.ofertaDelMes, productos: t.ofertaDelMes.productos.filter((x) => x !== s) })}>✕</button></span>)}
                    <select value="" onChange={(e) => e.target.value && upd("ofertaDelMes", { ...t.ofertaDelMes, productos: [...t.ofertaDelMes.productos, e.target.value] })}>
                      <option value="">+ Agregar producto</option>
                      {productos.filter((p) => !t.ofertaDelMes.productos.includes(p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
                    </select>
                  </div>
                </Field>
              </Card>
              <Card title="🏷️ Cupones" right={<button className="ad-btn ad-btn--sm" onClick={() => upd("cupones", [...t.cupones, { code: "NUEVO", off: 5, desc: "" }] as Tienda["cupones"])}><Icon n="plus" size={14} /> Nuevo cupón</button>}>
                {t.cupones.map((c, i) => {
                  const set = (patch: Record<string, unknown>) => upd("cupones", t.cupones.map((x, j) => j === i ? { ...x, ...patch } : x) as Tienda["cupones"]);
                  return (
                    <div key={i} className="ad-coupon">
                      <Field label="Código"><input className="ad-mono" value={c.code} onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/\s/g, "") })} /></Field>
                      <Field label="% OFF"><input type="number" value={c.off} onChange={(e) => set({ off: +e.target.value })} /></Field>
                      <Field label="Mínimo u."><input type="number" placeholder="Sin mínimo" value={("minUnidades" in c && c.minUnidades) || ""} onChange={(e) => set({ minUnidades: e.target.value ? +e.target.value : undefined })} /></Field>
                      <Field label="Descripción"><input value={c.desc} onChange={(e) => set({ desc: e.target.value })} /></Field>
                      <button className="ad-icon-btn ad-danger" onClick={() => upd("cupones", t.cupones.filter((_, j) => j !== i))} aria-label="Eliminar cupón"><Icon n="trash" size={16} /></button>
                    </div>
                  );
                })}
              </Card>
            </>
          )}

          {/* ───────── PÁGINA DE INICIO ───────── */}
          {sec === "home" && (
            <>
              <PageHead title="Página de inicio" desc="Banners, sellos de confianza y qué secciones se muestran." />
              <Card title="Banners del carrusel" right={<button className="ad-btn ad-btn--sm" onClick={() => upd("banners", [...t.banners, { ...t.banners[0], titulo: "Nuevo banner", destacado: "" }])}><Icon n="plus" size={14} /> Banner</button>}>
                <div className="ad-banners">
                  {t.banners.map((b, i) => {
                    const set = (patch: Partial<typeof b>) => upd("banners", t.banners.map((x, j) => j === i ? { ...x, ...patch } : x));
                    return (
                      <div key={i} className={`ad-banner ad-banner--${b.tema}`}>
                        <div className="ad-banner-prev">
                          <div><small>{b.etiqueta}</small><b>{b.titulo}</b></div>
                          <img src={b.imagen} alt="" />
                        </div>
                        <div className="ad-form2">
                          <Field label="Etiqueta chica"><input value={b.etiqueta} onChange={(e) => set({ etiqueta: e.target.value })} /></Field>
                          <Field label="Palabra resaltada" hint="Tiene que estar dentro del título"><input value={b.destacado} onChange={(e) => set({ destacado: e.target.value })} /></Field>
                          <Field label="Título"><input value={b.titulo} onChange={(e) => set({ titulo: e.target.value })} /></Field>
                          <Field label="Estilo"><select value={b.tema} onChange={(e) => set({ tema: e.target.value })}><option value="teal">Verde</option><option value="gold">Dorado</option><option value="dark">Oscuro</option></select></Field>
                          <Field label="Bajada"><textarea rows={2} value={b.bajada} onChange={(e) => set({ bajada: e.target.value })} /></Field>
                          <Field label="Imagen"><select value={b.imagen} onChange={(e) => set({ imagen: e.target.value })}>{["/img/marca/planta.webp", "/img/marca/deposito.webp", "/img/marca/camioneta.webp", ...productos.map((p) => p.imagenes[0])].map((src) => <option key={src} value={src}>{src.split("/").pop()}</option>)}</select></Field>
                          <Field label="Botón principal"><input value={b.cta} onChange={(e) => set({ cta: e.target.value })} /></Field>
                          <Field label="Link botón principal"><input value={b.ctaHref} onChange={(e) => set({ ctaHref: e.target.value })} /></Field>
                          <Field label="Botón secundario"><input value={b.cta2} onChange={(e) => set({ cta2: e.target.value })} /></Field>
                          <Field label="Link botón secundario"><input value={b.cta2Href} onChange={(e) => set({ cta2Href: e.target.value })} /></Field>
                        </div>
                        <div className="ad-banner-act">
                          <button className="ad-link" disabled={i === 0} onClick={() => { const a = [...t.banners]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; upd("banners", a); }}>↑ Subir</button>
                          <button className="ad-link ad-danger" onClick={() => upd("banners", t.banners.filter((_, j) => j !== i))}>Eliminar</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <div className="ad-grid2">
                <Card title="Sellos de confianza" desc="La barra blanca debajo del banner.">
                  {t.sellos.map((s, i) => (
                    <div key={i} className="ad-seal">
                      <input className="ad-emoji" value={s.icono} onChange={(e) => upd("sellos", t.sellos.map((x, j) => j === i ? { ...x, icono: e.target.value } : x))} />
                      <input value={s.titulo} onChange={(e) => upd("sellos", t.sellos.map((x, j) => j === i ? { ...x, titulo: e.target.value } : x))} />
                      <input value={s.texto} onChange={(e) => upd("sellos", t.sellos.map((x, j) => j === i ? { ...x, texto: e.target.value } : x))} />
                      <button className="ad-icon-btn ad-danger" onClick={() => upd("sellos", t.sellos.filter((_, j) => j !== i))}><Icon n="trash" size={16} /></button>
                    </div>
                  ))}
                  <button className="ad-add" onClick={() => upd("sellos", [...t.sellos, { icono: "⭐", titulo: "Nuevo sello", texto: "" }])}><Icon n="plus" size={14} /> Agregar sello</button>
                </Card>
                <Card title="Secciones visibles" desc="Prendé o apagá cada bloque de la portada.">
                  {Object.entries(SECCIONES_HOME).map(([k, l]) => (
                    <Row key={k} label={l}><Toggle on={(t.secciones as Record<string, boolean>)[k] !== false} onChange={(v) => upd("secciones", { ...t.secciones, [k]: v })} /></Row>
                  ))}
                </Card>
              </div>
            </>
          )}

          {/* ───────── BARRA SUPERIOR ───────── */}
          {sec === "barra" && (
            <>
              <PageHead title="Barra superior" desc="La franja dorada que pasa en bucle arriba de todo." />
              <div className="ad-preview-bar" aria-hidden><div>{[...t.barraSuperior.mensajes, ...t.barraSuperior.mensajes].map((m, i) => <span key={i}>{m}</span>)}</div></div>
              <Card title="Mensajes" right={<Toggle on={t.barraSuperior.activa} onChange={(v) => upd("barraSuperior", { ...t.barraSuperior, activa: v })} label="Barra activa" />}>
                {t.barraSuperior.mensajes.map((m, i) => (
                  <div key={i} className="ad-msg">
                    <input value={m} onChange={(e) => upd("barraSuperior", { ...t.barraSuperior, mensajes: t.barraSuperior.mensajes.map((x, j) => j === i ? e.target.value : x) })} />
                    <button className="ad-icon-btn ad-danger" onClick={() => upd("barraSuperior", { ...t.barraSuperior, mensajes: t.barraSuperior.mensajes.filter((_, j) => j !== i) })}><Icon n="trash" size={16} /></button>
                  </div>
                ))}
                <button className="ad-add" onClick={() => upd("barraSuperior", { ...t.barraSuperior, mensajes: [...t.barraSuperior.mensajes, "✨ Nuevo mensaje"] })}><Icon n="plus" size={14} /> Agregar mensaje</button>
              </Card>
            </>
          )}

          {/* ───────── POPUP ───────── */}
          {sec === "popup" && (
            <>
              <PageHead title="Popup" desc="El popup general. Durante un evento (Black Friday, Cyber Monday…) se muestra el popup del evento." />
              <div className="ad-split">
                <Card title="Configuración" right={<Toggle on={t.popup.activo} onChange={(v) => upd("popup", { ...t.popup, activo: v })} label="Popup activo" />}>
                  <div className="ad-form2">
                    <Field label="Aparece a los (segundos)"><input type="number" min={0} value={t.popup.retrasoSeg} onChange={(e) => upd("popup", { ...t.popup, retrasoSeg: +e.target.value })} /></Field>
                    <Field label="Frecuencia"><select value={t.popup.frecuencia} onChange={(e) => upd("popup", { ...t.popup, frecuencia: e.target.value })}><option value="siempre">Cada vez que entra</option><option value="sesion">Una vez por visita</option><option value="una-vez">Una sola vez</option></select></Field>
                  </div>
                  <Field label="Etiqueta"><input value={t.popup.etiqueta} onChange={(e) => upd("popup", { ...t.popup, etiqueta: e.target.value })} /></Field>
                  <Field label="Título"><input value={t.popup.titulo} onChange={(e) => upd("popup", { ...t.popup, titulo: e.target.value })} /></Field>
                  <Field label="Texto"><textarea rows={2} value={t.popup.texto} onChange={(e) => upd("popup", { ...t.popup, texto: e.target.value })} /></Field>
                  <div className="ad-form2">
                    <Field label="Cupón que ofrece"><select value={t.popup.cupon} onChange={(e) => upd("popup", { ...t.popup, cupon: e.target.value })}><option value="">Sin cupón</option>{t.cupones.map((c) => <option key={c.code} value={c.code}>{c.code} (−{c.off}%)</option>)}</select></Field>
                    <Field label="Texto del botón"><input value={t.popup.cta} onChange={(e) => upd("popup", { ...t.popup, cta: e.target.value })} /></Field>
                  </div>
                  <Field label="Link del botón"><input value={t.popup.ctaHref} onChange={(e) => upd("popup", { ...t.popup, ctaHref: e.target.value })} /></Field>
                  <Row label="Mostrar productos en oferta" desc="Toma los de la oferta del mes"><Toggle on={t.popup.mostrarOfertas} onChange={(v) => upd("popup", { ...t.popup, mostrarOfertas: v })} /></Row>
                </Card>
                <div className="ad-sticky">
                  <p className="ad-prev-label">Vista previa</p>
                  <div className={`ad-pop ${t.popup.activo ? "" : "ad-pop--off"}`}>
                    <div className="ad-pop-top"><span>🎁</span><small>{t.popup.etiqueta}</small><b>{t.popup.titulo}</b><p>{t.popup.texto}</p></div>
                    <div className="ad-pop-body">
                      {t.popup.cupon && <div className="ad-pop-code">{t.popup.cupon}</div>}
                      {t.popup.mostrarOfertas && (
                        <div className="ad-pop-offers">{t.ofertaDelMes.productos.slice(0, 4).map((s) => <img key={s} src={productos.find((p) => p.slug === s)?.imagenes[0]} alt="" />)}</div>
                      )}
                      <div className="ad-pop-cta">{t.popup.cta}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ───────── EVENTOS ───────── */}
          {sec === "eventos" && (
            <>
              <PageHead title="Eventos y fechas" desc="Cada evento tiene su popup, su cupón, su franja arriba y su página. Se activan solos entre las fechas.">
                <button className="ad-btn" onClick={() => {
                  const ev = { ...t.eventos[0], slug: `evento-${t.eventos.length + 1}`, nombre: "Nuevo evento", titulo: "Nuevo evento", cupon: `EVENTO${t.eventos.length + 1}` };
                  upd("eventos", [...t.eventos, ev]); setEvOpen(ev.slug);
                }}><Icon n="plus" size={16} /> Nuevo evento</button>
              </PageHead>
              <div className="ad-note" style={{ background: "rgba(63,182,160,.08)", borderColor: "rgba(63,182,160,.3)", color: "#b9efe4" }}>Mientras un evento está en curso, su popup reemplaza al popup general. Revisá las fechas marcadas como “a confirmar”.</div>
              <div className="ad-stack">
                {[...t.eventos].sort((a, b) => +new Date(a.desde) - +new Date(b.desde)).map((e) => {
                  const i = t.eventos.findIndex((x) => x.slug === e.slug);
                  const set = (patch: Record<string, unknown>) => upd("eventos", t.eventos.map((x, j) => j === i ? { ...x, ...patch } : x) as Tienda["eventos"]);
                  const now = new Date();
                  const st = now < new Date(e.desde) ? "Próximo" : now > new Date(e.hasta) ? "Terminado" : "En curso";
                  const open = evOpen === e.slug;
                  const cup = t.cupones.find((c) => c.code === e.cupon);
                  return (
                    <Card key={e.slug}>
                      <div className="ad-ev-h" onClick={() => setEvOpen(open ? null : e.slug)}>
                        <span className={`ad-ev-dot ad-ev-${e.tema}`}>{e.emoji}</span>
                        <div><b>{e.nombre}</b><small>{new Date(e.desde).toLocaleDateString("es-AR")} → {new Date(e.hasta).toLocaleDateString("es-AR")} · −{e.off}% · {e.cupon}</small></div>
                        <span className={`ad-st ad-st--${st === "En curso" ? "on" : st === "Próximo" ? "next" : "off"}`}>{st}</span>
                        <span onClick={(ev) => ev.stopPropagation()}><Toggle on={e.activo} onChange={(v) => set({ activo: v })} label="Evento activo" /></span>
                      </div>
                      {open && (
                        <div className="ad-ev-body">
                          <div className="ad-form3">
                            <Field label="Nombre"><input value={e.nombre} onChange={(x) => set({ nombre: x.target.value })} /></Field>
                            <Field label="Emoji"><input value={e.emoji} onChange={(x) => set({ emoji: x.target.value })} /></Field>
                            <Field label="Colores"><select value={e.tema} onChange={(x) => set({ tema: x.target.value })}>{[["black", "Negro (Black Friday)"], ["cyber", "Violeta (Cyber)"], ["navidad", "Rojo/verde (fiestas)"], ["verano", "Naranja (verano)"], ["escuela", "Azul (escuelas)"], ["manos", "Turquesa (salud)"], ["hot", "Rojo (Hot Sale)"], ["invierno", "Celeste (invierno)"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
                            <Field label="Desde"><input type="date" value={e.desde.slice(0, 10)} onChange={(x) => set({ desde: `${x.target.value}T00:00:00-03:00` })} /></Field>
                            <Field label="Hasta"><input type="date" value={e.hasta.slice(0, 10)} onChange={(x) => set({ hasta: `${x.target.value}T23:59:59-03:00` })} /></Field>
                          </div>
                          <div className="ad-form2">
                            <Field label="Título de la página"><input value={e.titulo} onChange={(x) => set({ titulo: x.target.value })} /></Field>
                            <Field label="Etiqueta"><input value={e.etiqueta} onChange={(x) => set({ etiqueta: x.target.value })} /></Field>
                          </div>
                          <Field label="Bajada"><textarea rows={2} value={e.bajada} onChange={(x) => set({ bajada: x.target.value })} /></Field>
                          <div className="ad-form2">
                            <Field label="Cupón del evento" hint={cup ? `Vigente ${new Date(cup.desde ?? e.desde).toLocaleDateString("es-AR")} – ${new Date(cup.vence ?? e.hasta).toLocaleDateString("es-AR")}` : "Se crea al exportar"}><input className="ad-mono" value={e.cupon} onChange={(x) => set({ cupon: x.target.value.toUpperCase().replace(/\s/g, "") })} /></Field>
                            <Field label="Descuento %"><input type="number" value={e.off} onChange={(x) => set({ off: +x.target.value })} /></Field>
                          </div>
                          <p className="ad-sub">Popup del evento</p>
                          <Row label="Mostrar popup durante el evento"><Toggle on={e.popup.activo} onChange={(v) => set({ popup: { ...e.popup, activo: v } })} /></Row>
                          <div className="ad-form2">
                            <Field label="Título del popup"><input value={e.popup.titulo} onChange={(x) => set({ popup: { ...e.popup, titulo: x.target.value } })} /></Field>
                            <Field label="Botón"><input value={e.popup.cta} onChange={(x) => set({ popup: { ...e.popup, cta: x.target.value } })} /></Field>
                          </div>
                          <Field label="Texto del popup"><input value={e.popup.texto} onChange={(x) => set({ popup: { ...e.popup, texto: x.target.value } })} /></Field>
                          <Field label="Productos del evento">
                            <div className="ad-chips">
                              {e.productos.map((s2) => <span key={s2} className="ad-chip">{pName(s2)}<button onClick={() => set({ productos: e.productos.filter((x) => x !== s2) })}>✕</button></span>)}
                              <select value="" onChange={(x) => x.target.value && set({ productos: [...e.productos, x.target.value] })}><option value="">+ Producto</option>{productos.filter((p) => !e.productos.includes(p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}</select>
                            </div>
                          </Field>
                          <Field label="Kits del evento">
                            <div className="ad-chips">
                              {e.kits.map((k) => <span key={k} className="ad-chip">{t.kits.find((x) => x.slug === k)?.nombre ?? k}<button onClick={() => set({ kits: e.kits.filter((x) => x !== k) })}>✕</button></span>)}
                              <select value="" onChange={(x) => x.target.value && set({ kits: [...e.kits, x.target.value] })}><option value="">+ Kit</option>{t.kits.filter((k) => !e.kits.includes(k.slug)).map((k) => <option key={k.slug} value={k.slug}>{k.nombre}</option>)}</select>
                            </div>
                          </Field>
                          <div className="ad-banner-act" style={{ padding: 0 }}>
                            <a className="ad-link" href={`/promo/${e.slug}`} target="_blank" rel="noopener">Ver página ↗</a>
                            <button className="ad-link ad-danger" onClick={() => upd("eventos", t.eventos.filter((_, j) => j !== i))}>Eliminar evento</button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* ───────── GUÍAS ───────── */}
          {sec === "guias" && (
            <>
              <PageHead title="Guías (blog)" desc="Artículos que posicionan en Google y ayudan a vender.">
                <button className="ad-btn" onClick={() => { setGuias([{ slug: `nueva-guia-${guias.length + 1}`, titulo: "Nueva guía", resumen: "", categoria: "General", fecha: new Date().toISOString().slice(0, 10), minutos: 3, imagen: productos[0].imagenes[0], productos: [], contenido: "Primer párrafo.\n\n## Subtítulo\n- Punto 1\n- Punto 2" }, ...guias]); setGEdit(0); setDirty(true); }}><Icon n="plus" size={16} /> Nueva guía</button>
              </PageHead>
              {gEdit === null ? (
                <div className="ad-list">
                  {guias.map((g, i) => (
                    <div className="ad-item ad-item--g" key={g.slug}>
                      <img src={g.imagen} alt="" />
                      <div className="ad-item-main"><b>{g.titulo}</b><small>{g.categoria} · {g.minutos} min · {g.fecha}</small></div>
                      <a className="ad-link" href={`/guias/${g.slug}`} target="_blank" rel="noopener">Ver</a>
                      <button className="ad-link" onClick={() => setGEdit(i)}>Editar</button>
                    </div>
                  ))}
                </div>
              ) : (() => {
                const g = guias[gEdit];
                const set = (patch: Partial<Guia>) => { setGuias(guias.map((x, j) => j === gEdit ? { ...x, ...patch } : x)); setDirty(true); };
                return (
                  <Card title="Editar guía" right={<button className="ad-btn ad-btn--sm" onClick={() => setGEdit(null)}>✓ Listo</button>}>
                    <Field label="Título"><input value={g.titulo} onChange={(e) => set({ titulo: e.target.value, slug: slugify(e.target.value) })} /></Field>
                    <Field label="Resumen (aparece en Google)"><textarea rows={2} value={g.resumen} onChange={(e) => set({ resumen: e.target.value })} /></Field>
                    <div className="ad-form3">
                      <Field label="Categoría"><input value={g.categoria} onChange={(e) => set({ categoria: e.target.value })} /></Field>
                      <Field label="Minutos de lectura"><input type="number" value={g.minutos} onChange={(e) => set({ minutos: +e.target.value })} /></Field>
                      <Field label="Fecha"><input type="date" value={g.fecha} onChange={(e) => set({ fecha: e.target.value })} /></Field>
                      <Field label="Imagen"><select value={g.imagen} onChange={(e) => set({ imagen: e.target.value })}>{Array.from(new Set(productos.flatMap((p) => p.imagenes))).map((src) => <option key={src} value={src}>{src.split("/").pop()}</option>)}</select></Field>
                      <Field label="Kit sugerido"><select value={g.kit ?? ""} onChange={(e) => set({ kit: e.target.value || undefined })}><option value="">Ninguno</option>{t.kits.map((k) => <option key={k.slug} value={k.slug}>{k.nombre}</option>)}</select></Field>
                    </div>
                    <Field label="Contenido" hint="## Subtítulo · - punto de lista · 1. paso · **negrita** · > nota destacada"><textarea rows={16} className="ad-mono-area" value={g.contenido} onChange={(e) => set({ contenido: e.target.value })} /></Field>
                    <Field label="Productos relacionados">
                      <div className="ad-chips">
                        {g.productos.map((s2) => <span key={s2} className="ad-chip">{pName(s2)}<button onClick={() => set({ productos: g.productos.filter((x) => x !== s2) })}>✕</button></span>)}
                        <select value="" onChange={(e) => e.target.value && set({ productos: [...g.productos, e.target.value] })}><option value="">+ Producto</option>{productos.filter((p) => !g.productos.includes(p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}</select>
                      </div>
                    </Field>
                    <button className="ad-link ad-danger" onClick={() => { setGuias(guias.filter((_, j) => j !== gEdit)); setGEdit(null); setDirty(true); }}>Eliminar guía</button>
                  </Card>
                );
              })()}
            </>
          )}

          {/* ───────── ANIMACIONES ───────── */}
          {sec === "animaciones" && (
            <>
              <PageHead title="Animaciones" desc="Movimiento y efectos de la tienda." />
              <Card>
                <Row label="Animaciones" desc="Apariciones al hacer scroll, banners, contadores, brillos"><Toggle on={t.animaciones.activas} onChange={(v) => upd("animaciones", { ...t.animaciones, activas: v })} /></Row>
                <Row label="Scroll suave" desc="Desplazamiento fluido tipo app"><Toggle on={t.animaciones.scrollSuave} onChange={(v) => upd("animaciones", { ...t.animaciones, scrollSuave: v })} /></Row>
                <Row label="Producto vuela al carrito" desc="La foto viaja hasta el botón de cotización al agregar"><Toggle on={t.animaciones.productoVuelaAlCarrito} onChange={(v) => upd("animaciones", { ...t.animaciones, productoVuelaAlCarrito: v })} /></Row>
                <Row label="Cambio de banner cada" desc="Segundos entre banners del carrusel">
                  <div className="ad-range"><input type="range" min={3} max={15} value={t.animaciones.bannerAutoplaySeg} onChange={(e) => upd("animaciones", { ...t.animaciones, bannerAutoplaySeg: +e.target.value })} /><b>{t.animaciones.bannerAutoplaySeg}s</b></div>
                </Row>
              </Card>
            </>
          )}

          {/* ───────── APARIENCIA ───────── */}
          {sec === "apariencia" && (
            <>
              <PageHead title="Apariencia" desc="Colores, bordes y tipografía de la tienda." />
              <div className="ad-split">
                <Card>
                  {([["colorPrincipal", "Color principal", "Header, botones, secciones oscuras"], ["colorAcento", "Color de acento", "Dorado: etiquetas, botón catálogo, barra superior"], ["colorFondo", "Color de fondo", "Fondo general de la tienda"]] as const).map(([k, l, d]) => (
                    <Row key={k} label={l} desc={d}>
                      <div className="ad-color"><input type="color" value={t.apariencia[k]} onChange={(e) => upd("apariencia", { ...t.apariencia, [k]: e.target.value })} /><code>{t.apariencia[k]}</code></div>
                    </Row>
                  ))}
                  <Row label="Redondeo de bordes" desc="Esquinas de tarjetas y cajas">
                    <div className="ad-range"><input type="range" min={0} max={28} value={t.apariencia.redondeo} onChange={(e) => upd("apariencia", { ...t.apariencia, redondeo: +e.target.value })} /><b>{t.apariencia.redondeo}px</b></div>
                  </Row>
                  <Row label="Tipografía de títulos">
                    <select className="ad-select" value={t.apariencia.tipografiaTitulos} onChange={(e) => upd("apariencia", { ...t.apariencia, tipografiaTitulos: e.target.value })}>
                      {["Montserrat", "Poppins", "Inter", "Outfit", "Plus Jakarta Sans", "DM Sans"].map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </Row>
                  <button className="ad-link" onClick={() => upd("apariencia", { colorPrincipal: "#1a4a44", colorAcento: "#b08a3a", colorFondo: "#f6f2ea", redondeo: 14, tipografiaTitulos: "Montserrat" })}>Restaurar colores originales</button>
                </Card>
                <div className="ad-sticky">
                  <p className="ad-prev-label">Vista previa</p>
                  <div className="ad-theme" style={{ background: t.apariencia.colorFondo, borderRadius: t.apariencia.redondeo + 6 }}>
                    <div className="ad-theme-bar" style={{ background: t.apariencia.colorAcento }}>🚚 Entrega en 24–48 hs</div>
                    <div className="ad-theme-hero" style={{ background: t.apariencia.colorPrincipal }}>
                      <small style={{ color: t.apariencia.colorAcento }}>DESDE 1985</small>
                      <b style={{ fontFamily: t.apariencia.tipografiaTitulos }}>Especialistas en limpieza</b>
                      <span style={{ background: t.apariencia.colorAcento, borderRadius: 999 }}>Ver catálogo</span>
                    </div>
                    <div className="ad-theme-card" style={{ borderRadius: t.apariencia.redondeo }}>
                      <img src={productos[0]?.imagenes[0]} alt="" />
                      <small style={{ color: t.apariencia.colorAcento }}>DISPENSERS</small>
                      <b style={{ color: t.apariencia.colorPrincipal, fontFamily: t.apariencia.tipografiaTitulos }}>{productos[0]?.nombre}</b>
                      <span style={{ background: t.apariencia.colorPrincipal, borderRadius: 999 }}>+ Cotizar</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ───────── TESTIMONIOS ───────── */}
          {sec === "testimonios" && (
            <>
              <PageHead title="Testimonios" desc="Solo reseñas reales de clientes. Si no hay ninguno, la sección no aparece.">
                <button className="ad-btn" onClick={() => { setTests([...tests, { texto: "", nombre: "", cargo: "" }]); setDirty(true); }}><Icon n="plus" size={16} /> Agregar</button>
              </PageHead>
              {tests.length === 0 && <Card><p className="ad-mut">Todavía no cargaste testimonios. Podés copiar las reseñas reales de Google Maps.</p></Card>}
              <div className="ad-stack">
                {tests.map((x, i) => (
                  <Card key={i} right={<button className="ad-link ad-danger" onClick={() => { setTests(tests.filter((_, j) => j !== i)); setDirty(true); }}>Eliminar</button>}>
                    <Field label="Texto"><textarea rows={3} value={x.texto} onChange={(e) => { setTests(tests.map((y, j) => j === i ? { ...y, texto: e.target.value } : y)); setDirty(true); }} /></Field>
                    <div className="ad-form2">
                      <Field label="Nombre"><input value={x.nombre} onChange={(e) => { setTests(tests.map((y, j) => j === i ? { ...y, nombre: e.target.value } : y)); setDirty(true); }} /></Field>
                      <Field label="Cargo / empresa"><input value={x.cargo} onChange={(e) => { setTests(tests.map((y, j) => j === i ? { ...y, cargo: e.target.value } : y)); setDirty(true); }} /></Field>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ───────── MEDIOS ───────── */}
          {sec === "medios" && (
            <>
              <PageHead title="Medios" desc="Imágenes de la tienda.">
                <button className="ad-btn" disabled title="Disponible al conectar el almacenamiento"><Icon n="plus" size={16} /> Subir imágenes</button>
              </PageHead>
              <div className="ad-media">
                {["/img/marca/planta.webp", "/img/marca/deposito.webp", "/img/marca/camioneta.webp", ...productos.flatMap((p) => p.imagenes)].map((src) => (
                  <figure key={src}><img src={src} alt="" loading="lazy" /><figcaption>{src.split("/").pop()}</figcaption></figure>
                ))}
              </div>
            </>
          )}

          {/* ───────── COTIZACIONES / ANALÍTICA / USUARIOS ───────── */}
          {(sec === "cotizaciones" || sec === "analitica" || sec === "usuarios") && (
            <>
              <PageHead title={label ?? ""} />
              <Card>
                <div className="ad-empty">
                  <Icon n={sec === "cotizaciones" ? "receipt" : sec === "analitica" ? "chart" : "users"} size={36} />
                  <b>{sec === "cotizaciones" ? "Registro de cotizaciones" : sec === "analitica" ? "Visitas y productos más vistos" : "Usuarios del panel"}</b>
                  <p>{sec === "cotizaciones"
                    ? "Cada cotización que un cliente envíe por WhatsApp va a quedar registrada acá, con productos, cupón y estado (nueva, respondida, cerrada)."
                    : sec === "analitica"
                      ? "Visitas, productos más vistos y más cotizados, cupones usados y de dónde llegan los clientes."
                      : "Altas de usuarios con roles (superadmin, editor) e inicio de sesión con email."}</p>
                  <small>Se habilita al conectar la base de datos.</small>
                </div>
              </Card>
            </>
          )}

          {/* ───────── CONFIGURACIÓN ───────── */}
          {sec === "configuracion" && (
            <>
              <PageHead title="Configuración" desc="Datos de la empresa que aparecen en toda la web." />
              <Card desc="Hoy se editan en lib/site.ts. Al conectar la base, se editan desde acá.">
                {[["Nombre", "Ibarra Insumos"], ["Actividad", "Fabricantes y distribuidores"], ["WhatsApp", "+54 11 4440-2807"], ["Email", "info@ibarrainsumos.com.ar"], ["Horario", "Lunes a viernes de 8 a 17 hs"], ["Zona", "Parque Avellaneda, CABA"], ["Dominio", "ibarrainsumos.com.ar"]].map(([k, v]) => (
                  <Row key={k} label={k}><span className="ad-mut">{v}</span></Row>
                ))}
              </Card>
            </>
          )}
        </div>
      </main>

      {/* EDITAR PRODUCTO */}
      {edit && (
        <>
          <div className="ad-scrim on" onClick={() => setEdit(null)} />
          <aside className="ad-drawer" data-lenis-prevent>
            <header><h3>{edit.slug ? "Editar producto" : "Nuevo producto"}</h3><button onClick={() => setEdit(null)} aria-label="Cerrar"><Icon n="x" /></button></header>
            <div className="ad-drawer-body">
              <div className="ad-imgs">
                {edit.imagenes.map((src) => <img key={src} src={src} alt="" />)}
                <select value="" onChange={(e) => e.target.value && setEdit({ ...edit, imagenes: [...edit.imagenes, e.target.value] })}>
                  <option value="">+ Imagen</option>
                  {Array.from(new Set(productos.flatMap((p) => p.imagenes))).map((src) => <option key={src} value={src}>{src.split("/").pop()}</option>)}
                </select>
              </div>
              <Field label="Nombre"><input value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></Field>
              <Field label="Descripción"><textarea rows={4} value={edit.descripcion} onChange={(e) => setEdit({ ...edit, descripcion: e.target.value })} /></Field>
              <Field label="Texto largo de la ficha (SEO)"><textarea rows={4} value={edit.detalle ?? ""} placeholder="Para qué sirve, dónde se usa, cómo elegirlo" onChange={(e) => setEdit({ ...edit, detalle: e.target.value })} /></Field>
              <Field label="Usos recomendados (uno por línea)"><textarea rows={3} value={(edit.usos ?? []).join("\n")} onChange={(e) => setEdit({ ...edit, usos: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} /></Field>
              <div className="ad-form2">
                <Field label="Categoría"><select value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>{categorias.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}</select></Field>
                <Field label="Subcategoría"><input value={edit.subcategoria ?? ""} onChange={(e) => setEdit({ ...edit, subcategoria: e.target.value })} /></Field>
                <Field label="Etiqueta"><select value={edit.badge ?? ""} onChange={(e) => setEdit({ ...edit, badge: e.target.value || undefined })}>{["", "Más vendido", "Nuevo", "Rinde más", "Últimas unidades"].map((b) => <option key={b} value={b}>{b || "Sin etiqueta"}</option>)}</select></Field>
                <Field label="Precio (opcional)"><input type="number" placeholder="Consultar" value={edit.precio ?? ""} onChange={(e) => setEdit({ ...edit, precio: e.target.value ? +e.target.value : undefined })} /></Field>
              </div>
              <Row label="Destacado en portada"><Toggle on={!!edit.destacado} onChange={(v) => setEdit({ ...edit, destacado: v })} /></Row>
              <Row label="🏭 Fabricación propia" desc="Muestra la etiqueta en la tarjeta y la ficha"><Toggle on={!!edit.fabricacionPropia} onChange={(v) => setEdit({ ...edit, fabricacionPropia: v })} /></Row>
            </div>
            <footer>
              {edit.slug && <button className="ad-link ad-danger" onClick={() => { setProds((a) => a.filter((p) => p.slug !== edit.slug)); setEdit(null); ok("Producto eliminado"); }}>Eliminar</button>}
              <button className="ad-btn" disabled={!edit.nombre.trim()} onClick={() => {
                const p = { ...edit, slug: edit.slug || slugify(edit.nombre) };
                setProds((a) => a.some((x) => x.slug === p.slug) ? a.map((x) => x.slug === p.slug ? p : x) : [p, ...a]);
                setEdit(null); ok("✓ Producto guardado");
              }}>Guardar producto</button>
            </footer>
          </aside>
        </>
      )}

      <div className={`ad-toast ${toast ? "on" : ""}`}>{toast}</div>
    </div>
  );
}
