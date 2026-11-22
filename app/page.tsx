import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { getCategorias, getDestacados, getProductos } from "@/lib/catalog";
import { faqs, glosario, ventajas } from "@/lib/content";
import { animaciones, banners, cuponesVisibles, escalas, kits, marcas, ofertaDelMes, ofertaPara, secciones, sellos } from "@/lib/promos";
import ProductCard from "@/components/ProductCard";
import KitCard, { type KitView } from "@/components/KitCard";
import { getKitViews } from "@/lib/kits";
import { getGuias } from "@/lib/guias";
import { ContactForm } from "@/components/Bits";
import { CountUp, Countdown, CouponCard, Marquee, OfertasSignup, RendimientoCalc } from "@/components/Fx";
import { HeroSlider } from "@/components/Shop";

const on = (k: string) => secciones[k] !== false;
import testimonios from "@/data/testimonios.json";

type Testimonio = { texto: string; nombre: string; cargo?: string };

const rubros = ["Hospitales", "Clínicas", "Organismos públicos", "Consorcios", "Gastronomía", "Hoteles", "Escuelas", "Industria", "Oficinas", "Comercios"];
const garantias = ["Entrega garantizada", "Factura A y B", "Stock permanente", "Comodato de dispensers", "Asesoramiento sin cargo", "Desde 1985"];

export default async function Home() {
  const [cats, destacados, todos] = await Promise.all([getCategorias(), getDestacados(), getProductos()]);
  const bySlug = Object.fromEntries(todos.map((p) => [p.slug, p]));
  const nombres = Object.fromEntries(cats.map((c) => [c.slug, c.nombre]));
  const tests = testimonios as Testimonio[];
  const ofertas = ofertaDelMes.productos.map((s) => bySlug[s]).filter((p) => p && ofertaPara(p.slug) > 0);
  const guias = (await getGuias()).slice(0, 3);
  const kitViews: KitView[] = (await getKitViews()).filter((k) => k.tag).slice(0, 3);
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const heroImgs = ["dispenser-jabon-inox", "toallas-intercaladas", "lavandina-concentrada", "alcohol-en-gel"].map((s) => bySlug[s]?.imagenes[0]).filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <HeroSlider banners={banners} flotantes={heroImgs} segundos={animaciones.bannerAutoplaySeg} />

      {on("sellos") && sellos.length > 0 && (
        <div className="wrap">
          <div className="seals reveal">
            {sellos.map((x) => (
              <div className="seal" key={x.titulo}><span className="seal-ic">{x.icono}</span><div><b>{x.titulo}</b><small>{x.texto}</small></div></div>
            ))}
          </div>
        </div>
      )}

      {marcas.length > 0 && (
        <section className="brands">
          <p className="eyebrow" style={{ textAlign: "center" }}>Trabajamos con las mejores marcas</p>
          <div className="brands-track">{[...marcas, ...marcas].map((m, i) => <img key={i} src={m.logo} alt={m.nombre} loading="lazy" />)}</div>
        </section>
      )}

      {/* STATS */}
      <div className="wrap" style={{ marginTop: 56 }}>
        <div className="stats stats--flat reveal">
          <div className="stat"><b><CountUp to={40} prefix="+" /></b><span>años en el mercado</span></div>
          <div className="stat"><b><CountUp to={24} />–48 hs</b><span>entrega en CABA y GBA</span></div>
          <div className="stat"><b>−<CountUp to={escalas[escalas.length - 1].off} />%</b><span>comprando por cantidad</span></div>
          <div className="stat"><b><CountUp to={todos.length} />+</b><span>productos en catálogo</span></div>
        </div>
      </div>

      {on("rubros") && (
        <section className="section" style={{ paddingBottom: 24, paddingTop: 48 }}>
          <p className="eyebrow" style={{ textAlign: "center" }}>Abastecemos a</p>
          <Marquee items={rubros} variant="teal" />
        </section>
      )}

      {/* OFERTA DEL MES */}
      {on("ofertaDelMes") && ofertaDelMes.activa && ofertas.length > 0 && (
        <section className="section offer" id="ofertas">
          <div className="wrap">
            <div className="offer-head reveal">
              <div>
                <span className="pill pill-hot">🔥 Oferta del mes · −{ofertaDelMes.off}%</span>
                <h2 className="section-title">{ofertaDelMes.titulo}</h2>
                <p className="lead">{ofertaDelMes.bajada}</p>
              </div>
              <div className="offer-timer">
                <span>Termina en</span>
                <Countdown hasta={ofertaDelMes.hasta} />
              </div>
            </div>
            <div className="grid">
              {ofertas.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={nombres[p.categoria]} />)}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORÍAS */}
      {on("categorias") && (
      <section className="section" id="categorias">
        <div className="wrap">
          <div className="head reveal">
            <p className="eyebrow">Catálogo</p>
            <h2 className="section-title">¿Qué necesitás?</h2>
            <p className="lead">Elegí una categoría, armá tu lista y mandala por WhatsApp. Te respondemos con precios mayoristas en el día.</p>
          </div>
          <div className="cat-grid">
            {cats.map((c, i) => (
              <Link key={c.slug} href={`/productos/${c.slug}`} className="cat-tile reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="ic" aria-hidden>{c.icono}</span>
                <h3>{c.nombre}</h3>
                <p>{c.descripcion}</p>
                <span className="go">Ver productos <i>→</i></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* COMBOS */}
      {on("combos") && (
      <section className="section section--white" id="combos">
        <div className="wrap">
          <div className="head reveal">
            <p className="eyebrow">Kits por rubro</p>
            <h2 className="section-title">Kits listos según tu rubro</h2>
            <p className="lead">Cocina, restaurante, fábrica, baño, comercio, salud y más: todo en un solo pedido, con descuento incluido.</p>
          </div>
          <div className="kit-rubros reveal">
            {Array.from(new Set(kits.map((k) => k.rubro))).map((r) => {
              const k = kits.find((x) => x.rubro === r)!;
              return <Link key={r} href="/kits" className="kit-rubro-chip"><span>{k.icono}</span>{r}</Link>;
            })}
          </div>
          <div className="kits">{kitViews.map((k) => <KitCard key={k.slug} k={k} />)}</div>
          <div style={{ textAlign: "center", marginTop: 28 }}><Link className="btn btn-primary btn-lg btn-shine" href="/kits">Ver los {kits.length} kits →</Link></div>
        </div>
      </section>
      )}

      {/* ESCALAS + CUPONES */}
      {on("descuentos") && (
      <section className="section section--teal deals" id="descuentos">
        <div className="wrap">
          <div className="head reveal">
            <p className="eyebrow">Más llevás, menos pagás</p>
            <h2 className="section-title">Descuentos por cantidad en todo el catálogo</h2>
            <p className="lead">Se aplican solos en tu cotización según las unidades de cada producto.</p>
          </div>
          <div className="tiers">
            {escalas.filter((e) => e.off > 0).map((e, i) => (
              <div key={e.label} className={`tier reveal ${e.tag ? "tier--hot" : ""}`} style={{ transitionDelay: `${i * 90}ms` }}>
                {e.tag && <span className="tier-tag">{e.tag}</span>}
                <span className="tier-q">Desde {e.min} u.</span>
                <b>−{e.off}%</b>
                <div className="tier-bar"><i style={{ width: `${(e.off / Math.max(...escalas.map((x) => x.off))) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <h3 className="reveal" style={{ margin: "48px 0 18px", fontSize: "1.3rem" }}>🏷️ Cupones vigentes</h3>
          <div className="coupons">
            {cuponesVisibles.map((c) => <CouponCard key={c.code} {...c} />)}
          </div>
        </div>
      </section>
      )}

      {/* DESTACADOS */}
      {on("destacados") && (
      <section className="section">
        <div className="wrap">
          <div className="head reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="eyebrow">Más pedidos</p>
              <h2 className="section-title">Productos destacados</h2>
            </div>
            <Link className="btn btn-ghost btn-sm" style={{ color: "var(--teal)" }} href="/productos">Ver todo el catálogo →</Link>
          </div>
          <div className="grid">
            {destacados.map((p) => <ProductCard key={p.slug} p={p} categoriaNombre={nombres[p.categoria]} />)}
          </div>
          <div className="banner reveal" style={{ marginTop: 40 }}>
            <div>
              <span className="pill pill-gold">Sin costo</span>
              <h3>Dispensers en comodato</h3>
              <p>Te instalamos los dispensers gratis si comprás los insumos compatibles con nosotros.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-ghost btn-sm" style={{ color: "var(--teal)" }} href="/compatibilidad">Ver compatibilidad</Link>
              <a className="btn btn-primary btn-sm" href={waLink("Hola! Quiero consultar por dispensers en comodato.")} target="_blank" rel="noopener">Pedir comodato</a>
            </div>
          </div>
        </div>
      </section>
      )}

      <Marquee items={garantias} />

      {/* CÓMO COMPRAR */}
      {on("comoComprar") && (
      <section className="section section--white">
        <div className="wrap">
          <div className="head reveal" style={{ textAlign: "center" }}>
            <p className="eyebrow">Así de simple</p>
            <h2 className="section-title">Cómo comprar</h2>
          </div>
          <div className="steps">
            {[
              { n: 1, ic: "🛒", t: "Armá tu lista", d: "Sumá productos o combos. Los descuentos por cantidad se aplican solos." },
              { n: 2, ic: "💬", t: "Enviala por WhatsApp", d: "Te confirmamos precios, stock y fecha de entrega en el día." },
              { n: 3, ic: "🚚", t: "Recibí en 24–48 hs", d: "Reparto propio en CABA y GBA, con factura A o B." },
            ].map((s, i) => (
              <div key={s.n} className="step reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <span className="step-n">{s.n}</span>
                <span className="step-ic">{s.ic}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* VENTAJAS */}
      {on("ventajas") && (
      <section className="section section--teal">
        <div className="wrap">
          <div className="head reveal">
            <p className="eyebrow">Por qué elegirnos</p>
            <h2 className="section-title">Directo de fábrica, con un proveedor que cumple</h2>
          </div>
          <div className="features">
            {ventajas.map((v, i) => (
              <div className="feature reveal" key={v.t} style={{ transitionDelay: `${i * 80}ms` }}><div className="ic">{v.icono}</div><h3>{v.t}</h3><p>{v.d}</p></div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* CALCULADORA */}
      {on("calculadora") && (
      <section className="section">
        <div className="wrap">
          <div className="head reveal">
            <p className="eyebrow">Concentrados</p>
            <h2 className="section-title">¿Cuánto te rinde?</h2>
            <p className="lead">Los productos concentrados se diluyen: pagás por litro de producto, usás muchos litros de solución.</p>
          </div>
          <RendimientoCalc />
        </div>
      </section>
      )}

      {/* NOSOTROS */}
      {on("nosotros") && (
      <section className="section section--white" id="nosotros">
        <div className="wrap split">
          <div className="reveal reveal-left"><video className="about-video" src="/video/planta.mp4" poster="/video/planta-poster.webp" autoPlay muted loop playsInline preload="metadata" width={1152} height={576} aria-label="Vista aérea de la planta y depósito de Ibarra Insumos" /></div>
          <div className="reveal">
            <p className="eyebrow">Nosotros</p>
            <h2 className="section-title">Fabricantes y distribuidores desde hace más de 40 años</h2>
            <p className="lead">Somos una empresa familiar fundada en {site.founded}. <b>Fabricamos la mayoría de nuestros productos</b> y los distribuimos por mayor junto con el resto de la línea de limpieza institucional, higiene y descartables.</p>
            <p className="lead" style={{ marginTop: 12 }}>Proveemos a hospitales públicos y privados, organismos del Gobierno de la Ciudad, empresas, industrias, consorcios y comercios, con reparto propio y atención personalizada.</p>
            <ul className="checks">
              <li>Fábrica propia: precio directo y calidad controlada</li>
              <li>Reparto propio en CABA, GBA y Provincia</li>
              <li>Experiencia en compras públicas (BAC, Convenios Marco)</li>
              <li>Stock permanente y entregas programadas</li>
              <li>Asesoramiento sin cargo</li>
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <Link className="btn btn-primary btn-sm" href="/nuestra-fabrica">Conocé la fábrica</Link>
              <Link className="btn btn-sm btn-outline" href="/quienes-somos">Nuestra historia</Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {on("testimonios") && tests.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head reveal"><p className="eyebrow">Clientes</p><h2 className="section-title">Lo que dicen de nosotros</h2></div>
            <div className="tests">
              {tests.map((t) => (
                <figure className="test reveal" key={t.nombre}>
                  <div className="stars" aria-label="5 estrellas">★★★★★</div>
                  <blockquote>“{t.texto}”</blockquote>
                  <figcaption><b>{t.nombre}</b>{t.cargo && <small>{t.cargo}</small>}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HERRAMIENTAS */}
      {on("herramientas") && (
      <section className="section" id="herramientas">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Gratis</p><h2 className="section-title">Herramientas para tu institución</h2></div>
          <div className="tools">
            <div className="tool reveal"><span className="ic">🖨️</span><h3>Carteles para baños</h3><p>Personalizá un cartel con el nombre de tu empresa y descargalo listo para imprimir.</p><Link className="btn btn-primary btn-sm" href="/herramientas/carteles">Crear cartel</Link></div>
            <div className="tool reveal"><span className="ic">🏷️</span><h3>Etiquetas para dispensers</h3><p>Diseñá la etiqueta con tu marca y pedila junto con tus dispensers.</p><Link className="btn btn-primary btn-sm" href="/herramientas/etiquetas">Diseñar etiqueta</Link></div>
            <div className="tool reveal"><span className="ic">🔗</span><h3>Compatibilidad</h3><p>Fijate qué recarga va con cada dispenser antes de pedir.</p><Link className="btn btn-primary btn-sm" href="/compatibilidad">Consultar</Link></div>
          </div>
        </div>
      </section>
      )}

      {on("guias") && (
      <section className="section">
        <div className="wrap">
          <div className="head reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
            <div><p className="eyebrow">Guías</p><h2 className="section-title">Comprá mejor con nuestras guías</h2></div>
            <Link className="btn btn-ghost btn-sm" style={{ color: "var(--teal)" }} href="/guias">Ver todas →</Link>
          </div>
          <div className="g-grid">{guias.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`} className="g-card reveal"><div className="g-img"><img src={g.imagen} alt="" loading="lazy" aria-hidden="true" /></div><span className="kit-rubro">{g.categoria} · {g.minutos} min</span><h3>{g.titulo}</h3><p>{g.resumen}</p></Link>
          ))}</div>
        </div>
      </section>
      )}

      {/* FAQ */}
      {on("preguntas") && (
      <section className="section section--white" id="preguntas">
        <div className="wrap faq-layout">
          <div className="head reveal">
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2 className="section-title">Todo lo que necesitás saber</h2>
            <p className="lead">¿Te quedó alguna duda? Escribinos y te respondemos al toque.</p>
            <a className="btn btn-wa btn-sm" style={{ marginTop: 16 }} href={waLink("Hola! Tengo una consulta.")} target="_blank" rel="noopener">💬 Hacer una consulta</a>
          </div>
          <div className="faq reveal">
            {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>
      )}

      {on("glosario") && (
      <section className="section" id="glosario">
        <div className="wrap">
          <div className="head reveal"><p className="eyebrow">Glosario</p><h2 className="section-title">Términos de limpieza institucional</h2></div>
          <dl className="gloss">
            {glosario.map((g) => <div key={g.t} className="reveal"><dt>{g.t}</dt><dd>{g.d}</dd></div>)}
          </dl>
        </div>
      </section>
      )}

      {/* SUSCRIPCIÓN A OFERTAS */}
      {on("suscripcion") && (
      <section className="cta-band">
        <div className="wrap cta-inner reveal">
          <div>
            <h2>Recibí las ofertas mayoristas antes que nadie</h2>
            <p>Promos del mes, nuevos combos y cupones exclusivos por WhatsApp. Sin spam.</p>
          </div>
          <OfertasSignup />
        </div>
      </section>
      )}

      {/* CONTACTO */}
      {on("contacto") && (
      <section className="section section--teal" id="contacto">
        <div className="wrap contact">
          <div className="reveal">
            <p className="eyebrow">Contacto</p>
            <h2 className="section-title">Hablemos</h2>
            <p className="lead" style={{ marginBottom: 24 }}>Contanos qué necesitás y te pasamos precios y disponibilidad en el día.</p>
            <div className="contact-list">
              <div className="contact-item"><span className="ic">💬</span><div><small>WhatsApp</small><a href={waLink()} target="_blank" rel="noopener">{site.phoneDisplay}</a></div></div>
              <div className="contact-item"><span className="ic">✉️</span><div><small>Email</small><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
              <div className="contact-item"><span className="ic">🕗</span><div><small>Horario</small>{site.hours}</div></div>
              <div className="contact-item"><span className="ic">🚚</span><div><small>Cobertura</small>{site.coverage.join(" · ")}</div></div>
            </div>
            <iframe className="map" title="Zona de cobertura" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Parque+Avellaneda,+Buenos+Aires&z=11&output=embed" />
          </div>
          <div className="reveal"><ContactForm /></div>
        </div>
      </section>
      )}
    </>
  );
}
