import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKitViews } from "@/lib/kits";
import { kits } from "@/lib/promos";
import KitCard from "@/components/KitCard";
import KitDetail from "@/components/KitDetail";
import { Marquee } from "@/components/Fx";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return kits.map((k) => ({ slug: k.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const kit = kits.find((x) => x.slug === slug);
  if (!kit) return {};
  return {
    title: `${kit.nombre} con ${kit.off}% de descuento`,
    description: (() => { const d = `${kit.descripcion} ${kit.off}% de descuento incluido. Entrega en CABA y GBA.`; return d.length > 158 ? `${kit.descripcion.slice(0, 120).replace(/\s+\S*$/, "")}… −${kit.off}%, CABA y GBA.` : d; })(),
    alternates: { canonical: `/kits/${kit.slug}` },
  };
}

export default async function KitPage({ params }: Props) {
  const slug = (await params).slug;
  const all = await getKitViews();
  const k = all.find((x) => x.slug === slug);
  if (!k) notFound();
  const otros = all.filter((x) => x.slug !== k.slug && x.rubro === k.rubro).concat(all.filter((x) => x.rubro !== k.rubro)).slice(0, 3);
  return (
    <>
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="wrap">
          <nav className="crumbs" style={{ color: "var(--muted)", marginBottom: 20 }} aria-label="Migas">
            <Link href="/">Inicio</Link> / <Link href="/kits">Kits</Link> / <span>{k.nombre}</span>
          </nav>
          <KitDetail k={k} />
        </div>
      </section>
      <Marquee items={["Descuento incluido", "Cantidades a medida", "Entrega 24–48 hs", "Factura A y B", "Comodato de dispensers"]} />
      <section className="section section--white">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Más kits</p><h2 className="section-title">También te puede servir</h2></div>
          <div className="kits">{otros.map((o) => <KitCard key={o.slug} k={o} />)}</div>
        </div>
      </section>
    </>
  );
}
