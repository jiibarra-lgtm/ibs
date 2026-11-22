import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { fechaLarga, getNovedad, novedades } from "@/lib/empresa";
import Md from "@/components/Md";
import { crumbsLd, Ld } from "@/components/empresa/PageHead";

export function generateStaticParams() { return novedades.map((n) => ({ slug: n.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = getNovedad((await params).slug);
  if (!n) return {};
  return { title: n.titulo.length > 48 ? { absolute: n.titulo.slice(0, 62) } : n.titulo, description: n.resumen, alternates: { canonical: `/novedades/${n.slug}` }, openGraph: { type: "article", images: [n.imagen] } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNovedad((await params).slug);
  if (!n) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "NewsArticle", headline: n.titulo, description: n.resumen,
    image: [`${site.url}${n.imagen}`], datePublished: n.fecha, dateModified: n.fecha,
    author: { "@type": "Organization", name: site.name, url: `${site.url}/quienes-somos` },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/img/marca/icon-512.png` } },
    mainEntityOfPage: `${site.url}/novedades/${n.slug}`,
  };
  return (
    <>
      <Ld data={[crumbsLd([{ name: "Inicio", path: "/" }, { name: "Novedades", path: "/novedades" }, { name: n.titulo, path: `/novedades/${n.slug}` }], site.url), ld]} />
      <article className="section">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <nav className="crumbs"><Link href="/">Inicio</Link> / <Link href="/novedades">Novedades</Link> / <span>{n.titulo}</span></nav>
          <p className="eyebrow" style={{ marginTop: 18 }}>{fechaLarga(n.fecha)}</p>
          <h1 className="section-title">{n.titulo}</h1>
          {n.video
            ? <video className="about-video" src={n.video} poster={n.imagen} autoPlay muted loop playsInline preload="metadata" style={{ margin: "20px 0" }} />
            : <img src={n.imagen} alt="" style={{ width: "100%", borderRadius: 20, margin: "20px 0" }} />}
          <Md src={n.texto} />
          <p style={{ marginTop: 28 }}><Link href="/novedades" className="btn btn-sm btn-outline">← Todas las novedades</Link></p>
        </div>
      </article>
    </>
  );
}
