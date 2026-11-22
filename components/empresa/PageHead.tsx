import Link from "next/link";

export default function PageHead({ crumb, title, sub, perks, parent }: { crumb: string; title: string; sub: string; perks?: string[]; parent?: { href: string; label: string } }) {
  return (
    <section className="page-head kits-head">
      <div className="wrap">
        <nav className="crumbs" aria-label="Migas de pan"><Link href="/">Inicio</Link> / {parent && <><Link href={parent.href}>{parent.label}</Link> / </>}<span>{crumb}</span></nav>
        <h1>{title}</h1>
        <p>{sub}</p>
        {perks && <div className="kits-perks">{perks.map((x) => <span key={x}>{x}</span>)}</div>}
      </div>
    </section>
  );
}

export function crumbsLd(items: { name: string; path: string }[], base: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${base}${it.path}` })),
  };
}

export function Ld({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
