import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eventos } from "@/lib/promos";
import { getProductos } from "@/lib/catalog";
import { getKitViews } from "@/lib/kits";
import ProductCard from "@/components/ProductCard";
import KitCard from "@/components/KitCard";
import { EventHero } from "@/components/Events";
import { Marquee } from "@/components/Fx";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return eventos.map((e) => ({ slug: e.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const e = eventos.find((x) => x.slug === slug);
  if (!e) return {};
  return {
    title: `${e.nombre}: ofertas en limpieza por mayor`.length > 46 ? { absolute: `${e.nombre}: ofertas en limpieza`.slice(0, 62) } : `${e.nombre}: ofertas en limpieza por mayor`,
    description: (() => { const d = `${e.bajada} −${e.off}% con el cupón ${e.cupon}.`; return d.length > 158 ? `${e.bajada.slice(0, 120).replace(/\s+\S*$/, "")}… −${e.off}% con ${e.cupon}.` : d; })(),
    alternates: { canonical: `/promo/${e.slug}` },
  };
}

export default async function PromoPage({ params }: Props) {
  const slug = (await params).slug;
  const e = eventos.find((x) => x.slug === slug);
  if (!e) notFound();
  const [prods, kits] = await Promise.all([getProductos(), getKitViews()]);
  const ps = e.productos.map((s) => prods.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
  const ks = e.kits.map((s) => kits.find((k) => k.slug === s)).filter((k): k is NonNullable<typeof k> => !!k);
  return (
    <>
      <EventHero e={e} />
      <Marquee items={[`${e.emoji} ${e.nombre}`, `−${e.off}% con ${e.cupon}`, "Fabricantes y distribuidores", "Entrega 24–48 hs", "Factura A y B"]} />
      {ks.length > 0 && (
        <section className="section section--white">
          <div className="wrap">
            <div className="head reveal"><p className="eyebrow">Kits en oferta</p><h2 className="section-title">Kits {e.nombre}</h2><p className="lead">El descuento del kit se suma al cupón {e.cupon}.</p></div>
            <div className="kits">{ks.map((k) => <KitCard key={k.slug} k={k} />)}</div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Productos</p><h2 className="section-title">Lo más pedido en {e.nombre}</h2></div>
          <div className="grid">{ps.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          <div style={{ textAlign: "center", marginTop: 30 }}><Link className="btn btn-ghost" style={{ color: "var(--teal)" }} href="/promos">Ver calendario de ofertas</Link></div>
        </div>
      </section>
    </>
  );
}
