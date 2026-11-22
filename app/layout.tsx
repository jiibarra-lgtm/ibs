import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WaFloat } from "@/components/Bits";
import { RevealObserver } from "@/components/Fx";
import { PromoPopup, SmoothScroll } from "@/components/Shop";
import { getProductos } from "@/lib/catalog";
import { animaciones, apariencia, eventos, ofertaDelMes, ofertaPara, popup, shade } from "@/lib/promos";
import { EventStrip } from "@/components/Events";
import Measurement from "@/components/seo/Measurement";
import ConsentBanner from "@/components/seo/ConsentBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontClasses, headVar } from "./fonts";
import { sameAs } from "@/lib/empresa";

const metaDesc = "Fabricantes y distribuidores mayoristas de productos de limpieza e higiene institucional en CABA y GBA. Precio de fábrica y entrega en 24–48 hs.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Fabricante y distribuidor de limpieza`, template: `%s | ${site.name}` },
  description: metaDesc,
  alternates: { canonical: "/", languages: { "es-AR": "/" } },
  verification: {
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } } : {}),
  },
  openGraph: {
    type: "website", locale: "es_AR", siteName: site.name, url: site.url,
    title: `${site.name} — Fabricantes y distribuidores de limpieza institucional`,
    description: metaDesc,
    images: [{ url: "/img/marca/planta.webp", width: 1400, height: 1050, alt: "Planta y flota de reparto de Ibarra Insumos" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/img/marca/favicon.png", apple: "/img/marca/icon-512.png" },
  other: { "geo.region": "AR-C", "geo.placename": "Buenos Aires, Argentina" },
};

export const viewport: Viewport = { themeColor: "#1a4a44", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org",
  "@type": ["WholesaleStore", "Organization"],
  slogan: "Fabricantes y distribuidores de productos de limpieza",
  knowsAbout: ["Fabricación de productos de limpieza", "Distribución mayorista de insumos de limpieza", "Higiene institucional"],
  name: site.name,
  url: site.url,
  logo: `${site.url}/img/marca/icon-512.png`,
  image: [`${site.url}/img/marca/planta.webp`, `${site.url}/img/marca/deposito.webp`],
  "@id": `${site.url}/#empresa`,
  description: site.description,
  telephone: site.phoneE164,
  email: site.email,
  foundingDate: String(site.founded),
  address: { "@type": "PostalAddress", addressLocality: site.address.locality, addressRegion: site.address.region, addressCountry: site.address.country },
  areaServed: ["Ciudad Autónoma de Buenos Aires", "Gran Buenos Aires", "Provincia de Buenos Aires"],
  priceRange: "$$",
  currenciesAccepted: "ARS",
  paymentAccepted: "Transferencia, efectivo, cuenta corriente",
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: site.phoneE164, email: site.email, areaServed: "AR", availableLanguage: "es",
    hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" } }],
  ...(sameAs.length ? { sameAs } : {}),
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }],
};

const webLd = {
  "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#web`, name: site.name, url: site.url, inLanguage: "es-AR",
  publisher: { "@id": `${site.url}/#empresa` },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const productos = await getProductos();
  const ofertas = ofertaDelMes.productos
    .map((s) => productos.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ slug: p.slug, nombre: p.nombre, imagen: p.imagenes[0], off: ofertaPara(p.slug) }))
    .filter((o) => o.off > 0);
  const eventosView = eventos.map((e) => ({
    ...e,
    prods: e.productos.map((s) => productos.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p).map((p) => ({ slug: p.slug, nombre: p.nombre, imagen: p.imagenes[0] })),
  }));
  const a = apariencia;
  const vars = `:root{--teal:${a.colorPrincipal};--teal-2:${shade(a.colorPrincipal, 0.18)};--teal-3:${shade(a.colorPrincipal, 0.88)};--gold:${a.colorAcento};--gold-2:${shade(a.colorAcento, 0.3)};--cream:${a.colorFondo};--radius:${a.redondeo}px;--font-head:var(${headVar}),system-ui,sans-serif;--font-body:var(--f-lato),system-ui,sans-serif}`;
  return (
    <html lang="es-AR" className={fontClasses}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: vars }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgLd, webLd]) }} />
      </head>
      <body className={animaciones.activas ? "" : "no-anim"} data-fly={animaciones.productoVuelaAlCarrito ? "1" : "0"}>
        <CartProvider>
          <Header />
          <EventStrip eventos={eventos} />
          <main>{children}</main>
          <Footer />
          <WaFloat />
          <PromoPopup cfg={popup} ofertas={ofertas} eventos={eventosView} />
          <SmoothScroll enabled={animaciones.activas && animaciones.scrollSuave} />
          <RevealObserver />
        </CartProvider>
        <Measurement />
        <ConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
