import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { getCategorias } from "@/lib/catalog";
const SOLUCIONES: [string, string][] = [
  ["productos-de-limpieza-por-mayor", "Productos de limpieza por mayor"],
  ["fabrica-de-productos-de-limpieza", "Fábrica de productos de limpieza"],
  ["higiene-institucional", "Higiene institucional"],
  ["dispensers-en-comodato", "Dispensers en comodato"],
  ["insumos-de-limpieza-para-hospitales", "Para hospitales y clínicas"],
  ["insumos-de-limpieza-para-gastronomia", "Para gastronomía"],
  ["productos-de-limpieza-industrial", "Limpieza industrial"],
  ["insumos-de-limpieza-para-empresas", "Para empresas y oficinas"],
  ["proveedor-de-limpieza-para-consorcios", "Para consorcios"],
  ["insumos-de-limpieza-para-escuelas", "Para escuelas"],
  ["distribuidora-de-limpieza-en-caba-y-gba", "Distribuidora en CABA y GBA"],
];

export default async function Footer() {
  const cats = await getCategorias();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img src="/img/marca/isotipo.webp" alt="" width={48} height={58} style={{ marginBottom: 12 }} />
            <p><b style={{ color: "#fff" }}>Fabricantes y distribuidores</b> de productos de limpieza, higiene institucional y descartables. Empresa familiar desde {site.founded}.</p>
            {site.dataFiscalUrl && (
              <a href={site.dataFiscalUrl} target="_blank" rel="noopener" aria-label="Data fiscal">
                <img className="afip" src="/img/marca/afip.webp" alt="Data fiscal" width={64} height={88} loading="lazy" />
              </a>
            )}
          </div>
          <div>
            <h4>Productos</h4>
            <ul>{cats.map((c) => <li key={c.slug}><Link href={`/productos/${c.slug}`}>{c.nombre}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Soluciones</h4>
            <ul>{SOLUCIONES.map(([slug, label]) => <li key={slug}><Link href={`/${slug}`}>{label}</Link></li>)}<li><a href="https://www.bolsasmortuoriasibarra.com.ar/" target="_blank" rel="noopener">Bolsas mortuorias por mayor</a></li></ul>
          </div>
          <div>
            <h4>Empresa</h4>
            <ul>
              <li><Link href="/quienes-somos">Quiénes somos</Link></li>
              <li><Link href="/nuestra-fabrica">Nuestra fábrica</Link></li>
              <li><Link href="/marca-propia">Marca propia</Link></li>
              <li><Link href="/novedades">Novedades</Link></li>
              <li><Link href="/programa-de-puntos">Programa de puntos</Link></li>
              <li><Link href="/garantia-y-devoluciones">Garantía y devoluciones</Link></li>
              <li><Link href="/kits">Kits por rubro</Link></li>
              <li><Link href="/promos">Calendario de ofertas</Link></li>
              <li><Link href="/carga-rapida">Carga rápida de pedidos</Link></li>
              <li><Link href="/pedido-programado">Pedido programado</Link></li>
              <li><Link href="/guias">Guías</Link></li>
              <li><Link href="/#preguntas">Preguntas frecuentes</Link></li>
              <li><Link href="/compatibilidad">Compatibilidad de dispensers</Link></li>
              <li><Link href="/herramientas/carteles">Generador de carteles</Link></li>
              <li><Link href="/herramientas/etiquetas">Etiquetas personalizadas</Link></li>
              <li><Link href="/catalogo">Catálogo para imprimir / PDF</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href={waLink()} target="_blank" rel="noopener">WhatsApp {site.phoneDisplay}</a></li>
              <li><a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>{site.hours}</li>
              <li>{site.address.locality}, CABA</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span suppressHydrationWarning>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</span>
          <span><Link href="/privacidad">Privacidad</Link> · <Link href="/garantia-y-devoluciones#arrepentimiento">Botón de arrepentimiento</Link> · CABA · GBA · Provincia de Buenos Aires</span>
        </div>
      </div>
    </footer>
  );
}
