"use client";

import { useState } from "react";
import { site, waLink } from "@/lib/site";
import { useCart } from "./CartProvider";
import { PackSelector } from "./Fx";

export function WaFloat() {
  return (
    <a className="wa-float no-print" href={waLink("Hola! Quiero hacer una consulta.")} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.3.6 4.5 1.8 6.4L3 29l7.2-1.9c1.8 1 3.9 1.5 5.9 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23.2c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.1-4.1-.3-.4c-1-1.6-1.6-3.6-1.6-5.6C5.2 9.8 10 5.1 16 5.1s10.8 4.7 10.8 10.5S21.9 26.2 16 26.2Zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>
    </a>
  );
}

export function ContactForm() {
  const [f, setF] = useState({ nombre: "", empresa: "", tipo: "Hospital / clínica", mensaje: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Hola! Soy ${f.nombre}${f.empresa ? ` de ${f.empresa}` : ""} (${f.tipo}).\n\n${f.mensaje}`;
    window.open(waLink(msg), "_blank", "noopener");
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <h3 style={{ fontSize: "1.15rem" }}>Pedí tu cotización</h3>
      <div className="form-row">
        <div className="field"><label htmlFor="f-n">Nombre</label><input id="f-n" required value={f.nombre} onChange={set("nombre")} autoComplete="name" /></div>
        <div className="field"><label htmlFor="f-e">Empresa / institución</label><input id="f-e" value={f.empresa} onChange={set("empresa")} autoComplete="organization" /></div>
      </div>
      <div className="field">
        <label htmlFor="f-t">Tipo de cliente</label>
        <select id="f-t" value={f.tipo} onChange={set("tipo")}>
          {["Hospital / clínica", "Organismo público", "Empresa / oficina", "Consorcio", "Gastronomía", "Comercio", "Industria", "Particular"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field"><label htmlFor="f-m">¿Qué necesitás?</label><textarea id="f-m" rows={4} required value={f.mensaje} onChange={set("mensaje")} placeholder="Ej: 20 cajas de toallas intercaladas y 10 bidones de lavandina por mes" /></div>
      <button className="btn btn-wa btn-block" type="submit">Enviar por WhatsApp</button>
      <p className="note">También podés escribirnos a <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>{site.email}</a></p>
    </form>
  );
}

function Gallery({ nombre, imagenes }: { nombre: string; imagenes: string[] }) {
  const [img, setImg] = useState(0);
  return (
    <div className="pdp-gallery">
      <div className="gallery-main"><img key={img} className={img ? "fade-in" : undefined} src={imagenes[img]} alt={nombre} width={600} height={600} fetchPriority={img ? undefined : "high"} /></div>
      {imagenes.length > 1 && (
        <div className="thumbs">
          {imagenes.map((src, i) => (
            <button key={src} className={i === img ? "on" : ""} onClick={() => setImg(i)} aria-label={`Ver imagen ${i + 1} de ${nombre}`}><img src={src} alt={`${nombre}, imagen ${i + 1}`} /></button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductView(props: { slug: string; nombre: string; imagenes: string[]; precio?: number; children: React.ReactNode }) {
  const { toast } = useCart();
  async function share() {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: props.nombre, url }); } catch {} }
    else { try { await navigator.clipboard.writeText(url); toast("🔗 Link copiado"); } catch {} }
  }
  return (
    <div className="pdp">
      <Gallery nombre={props.nombre} imagenes={props.imagenes} />
      <div>
        {props.children}
        <PackSelector slug={props.slug} nombre={props.nombre} imagen={props.imagenes[0]} precio={props.precio} />
        <div className="pdp-actions">
          <a className="btn btn-wa" href={waLink(`Hola! Quiero consultar por ${props.nombre}`)} target="_blank" rel="noopener">💬 Consultar por WhatsApp</a>
          <button className="btn btn-sm" style={{ color: "var(--teal)" }} onClick={share}>📤 Compartir</button>
        </div>
        <div className="perks">
          <div>Fabricantes y distribuidores: precio directo</div>
          <div>Entrega en 24–48 hs hábiles en CABA y GBA</div>
          <div>Factura A y B</div>
          <div>Financiación a 30, 60 y 90 días para cuentas corrientes</div>
          <div>Si no cumplimos el plazo de entrega, lo resolvemos en el día</div>
        </div>
      </div>
    </div>
  );
}

export function PrintButton({ label = "🖨️ Imprimir / Guardar PDF" }: { label?: string }) {
  return <button className="btn btn-primary no-print" onClick={() => window.print()}>{label}</button>;
}
