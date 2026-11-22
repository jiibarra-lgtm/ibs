"use client";

import Link from "next/link";
import { useKitAdd, type KitView } from "./KitCard";
import { QtyInput } from "./CartProvider";
import { waLink } from "@/lib/site";

export default function KitDetail({ k }: { k: KitView }) {
  const { qty, setQty, unidades, custom, agregar } = useKitAdd(k);
  return (
    <div className="kd">
      <div className="kd-collage">
        {k.items.slice(0, 6).map((i, n) => (
          <Link key={i.slug} href={`/producto/${i.slug}`} className={`kd-img kd-img-${n}`}><img src={i.imagen} alt={i.nombre} /><span>{qty[i.slug]}×</span></Link>
        ))}
        <span className="kd-off">−{k.off}%</span>
      </div>
      <div>
        <span className="kit-rubro">{k.icono} {k.rubro}{k.tag ? ` · ${k.tag}` : ""}</span>
        <h1 className="kd-title">{k.nombre}</h1>
        <p className="desc">{k.descripcion} Ideal para {k.para.toLowerCase()}.</p>
        <div className="kd-box">
          <div className="kd-box-h"><b>Qué incluye</b><span>Ajustá las cantidades</span></div>
          {k.items.map((i) => (
            <div key={i.slug} className={`kd-row ${qty[i.slug] === 0 ? "off" : ""}`}>
              <img src={i.imagen} alt={i.nombre} />
              <Link href={`/producto/${i.slug}`}>{i.nombre}</Link>
              <QtyInput value={qty[i.slug]} onChange={(n) => setQty({ ...qty, [i.slug]: n })} />
              <button className="kd-rm" onClick={() => setQty({ ...qty, [i.slug]: 0 })} aria-label="Quitar">✕</button>
            </div>
          ))}
          <div className="kd-total"><span>{unidades} unidades{custom ? " · personalizado" : ""}</span><b>−{k.off}% en todo el kit</b></div>
          <button className="btn btn-primary btn-block btn-lg btn-shine" disabled={!unidades} onClick={() => agregar(document.querySelector<HTMLImageElement>(".kd-img img"))}>Agregar kit a la cotización</button>
          <a className="btn btn-wa btn-block" href={waLink(`Hola! Quiero consultar por el ${k.nombre}.`)} target="_blank" rel="noopener">💬 Consultar por WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
