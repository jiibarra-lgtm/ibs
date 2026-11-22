# Cambios que requieren tu autorización

Ninguno de estos cambios fue aplicado. Todos tocan archivos existentes. Respondé con los números que autorizás (por ejemplo: "autorizo A1, A2 y A5").

Punto de restauración: tag de git `baseline-pre-seo` + `respaldo-ibarra-pre-seo.zip`.

---

## A1 · Enlazar las 11 páginas pilar nuevas desde el sitio (CRÍTICO)
- **Qué detecté:** las páginas nuevas (por ejemplo `/productos-de-limpieza-por-mayor`) no reciben enlaces desde las páginas existentes: son "huérfanas". Solo las encuentran Google (por el sitemap complementario) y los modelos de IA (por llms.txt).
- **Por qué modificarlo:** Google usa el enlazado interno para descubrir páginas y entender su importancia. Sin enlaces, pueden tardar mucho en indexarse o posicionar poco.
- **Beneficio:** indexación más rápida, autoridad interna repartida hacia las páginas que apuntan a las búsquedas de mayor volumen.
- **Riesgo:** bajo. Agrega enlaces; no cambia URLs ni contenido.
- **Modificación necesaria:** en `components/Footer.tsx`, agregar una columna "Soluciones" con los 11 enlaces. Opcionalmente, un enlace contextual desde cada categoría a su página pilar.

## A2 · Incluir las páginas nuevas en `/sitemap.xml` y declarar los sitemaps nuevos en `robots.txt`
- **Qué detecté:** las páginas nuevas están en `/sitemap-seo.xml` y las imágenes en `/sitemap-imagenes.xml`, pero `robots.txt` solo declara `/sitemap.xml`.
- **Beneficio:** descubrimiento automático por todos los buscadores, sin depender del envío manual.
- **Riesgo:** nulo.
- **Modificación necesaria:** en `app/robots.ts`, cambiar `sitemap` por una lista con los tres sitemaps. (Alternativa sin tocar nada: enviar los dos sitemaps nuevos a mano en Search Console y Bing.)

## A3 · Activar la medición (GA4, Tag Manager, Google Ads, Meta)
- **Qué detecté:** la web no tiene analítica ni etiquetas publicitarias. Ya dejé preparado `components/seo/Measurement.tsx` + `ConsentBanner.tsx`, sin conectar.
- **Beneficio:** medir tráfico orgánico, conversiones (cotizaciones, WhatsApp, teléfono), visitas que llegan desde ChatGPT/Perplexity/Gemini y el costo por lead de las campañas.
- **Riesgo:** bajo. Con consentimiento denegado por defecto (Consent Mode v2). Suma unos KB de JavaScript.
- **Modificación necesaria:** en `app/layout.tsx`, agregar `<Measurement />` y `<ConsentBanner />` dentro de `<body>`, y cargar las variables de `.env.example` en Vercel.

## A4 · Un solo H1 en la portada
- **Qué detecté:** la portada tiene **3 etiquetas H1** (una por banner del carrusel). `/catalogo` tiene 0.
- **Por qué:** Google tolera varios H1, pero uno solo y descriptivo deja más clara la temática principal.
- **Beneficio:** jerarquía de encabezados más limpia y mejor lectura para buscadores e IA.
- **Riesgo:** bajo. El diseño no cambia.
- **Modificación:** en `components/Shop.tsx`, renderizar como `<h1>` solo el primer banner y como `<h2>` los demás (con los mismos estilos). En `/catalogo`, agregar un H1.

## A5 · Títulos y descripciones demasiado largos (44 URLs)
- **Qué detecté:** 36 títulos superan los 65 caracteres (por ejemplo, `/kits` tiene 90) y 10 descripciones superan los 160 (la portada tiene 229). El listado completo está en `01-auditoria-inventario.md`.
- **Beneficio:** Google corta lo que no entra en el resultado; un título que se lee completo suele tener mejor CTR.
- **Riesgo:** medio-bajo. Cambiar títulos puede mover posiciones durante unas semanas. Se hace sin cambiar las URLs.
- **Modificación:** acortar cada `title` y `description` en su archivo (`app/page.tsx`, `app/kits/page.tsx`, etc.) manteniendo la palabra clave principal al inicio.

## A6 · Datos estructurados complementarios en páginas existentes
- **Qué detecté:** las páginas existentes no tienen `BreadcrumbList`, `WebSite`, `ItemList` en categorías, `ContactPoint`, `PostalAddress` completa ni `geo`. El `Product` no tiene `url` ni `offers` (sin precio publicado no hay `offers` válido).
- **Beneficio:** mejor comprensión de la estructura y de la empresa (Knowledge Graph e IA). Las migas de pan pueden aparecer en el resultado de Google.
- **Riesgo:** bajo, siempre que se usen datos reales.
- **Modificación:** agregar JSON-LD en `app/layout.tsx` (WebSite, ContactPoint), en `app/productos/[categoria]/page.tsx` (BreadcrumbList + ItemList), en `app/producto/[slug]/page.tsx` (BreadcrumbList + `url`) y en `app/guias/[slug]/page.tsx` (BreadcrumbList, `dateModified`). **Necesito tu dirección exacta** para `PostalAddress` y `geo`, y los perfiles de redes para `sameAs`.

## A7 · Publicar las 5 guías nuevas (borradores)
- **Qué hay:** `content/borradores/guias-nuevas.json` tiene 5 artículos redactados en el mismo formato que las guías actuales.
- **Beneficio:** más cobertura semántica para "toallas intercaladas Z o V", "lavandina concentrada vs común", "alcohol en gel vs 70%", "productos de limpieza para restaurantes" y "fabricante o distribuidor".
- **Riesgo:** nulo para lo existente. Revisá vos el contenido técnico antes de publicar.
- **Modificación:** agregar los 5 objetos al final de `data/guias.json` (sin el campo `estado`).

## A8 · Tipografías con `next/font` (Core Web Vitals)
- **Qué detecté:** las fuentes se cargan con un `<link>` a Google Fonts, que bloquea el renderizado y puede afectar el LCP y el CLS.
- **Beneficio:** carga más rápida y sin saltos de texto.
- **Riesgo:** bajo. Probar antes que la tipografía se vea igual.
- **Modificación:** en `app/layout.tsx`, reemplazar el `<link>` por `next/font/google`, manteniendo Montserrat y Lato y el selector de tipografía del panel.

## A9 · Textos alternativos en imágenes de kits y carrusel
- **Qué detecté:** 623 de 1017 imágenes del sitio tienen `alt=""`. Muchas son decorativas, lo cual está bien, pero las fotos de productos dentro de kits, del collage del kit y de los productos flotantes del carrusel deberían describir el producto.
- **Beneficio:** SEO de imágenes (Google Imágenes y resultados con IA) y accesibilidad.
- **Riesgo:** nulo.
- **Modificación:** en `components/KitCard.tsx`, `components/KitDetail.tsx` y `components/Shop.tsx`, usar `alt={nombre del producto}`.

## A10 · `noindex` en páginas sin valor de búsqueda o temporales
- **Qué detecté:** `/catalogo` (versión para imprimir, que duplica el catálogo) y `/carga-rapida` se indexan. Las promociones de eventos terminados siguen indexables.
- **Beneficio:** el presupuesto de rastreo se concentra en las páginas que venden. Menos contenido duplicado.
- **Riesgo:** bajo.
- **Modificación:** `robots: { index: false }` en `/catalogo`. En `/promo/[slug]`, evaluar `noindex` fuera de fecha o mantenerlas con un mensaje de "próxima edición" (recomiendo lo segundo).

## A11 · Verificación en Search Console y Bing
- **Opción sin tocar código (recomendada):** verificación por **DNS** (registro TXT en tu proveedor de dominio). No requiere autorización de código.
- **Opción con código:** agregar `verification: { google: "...", other: { "msvalidate.01": "..." } }` en los metadatos de `app/layout.tsx`.

## A12 · Reglas explícitas para rastreadores de IA en robots.txt
- **Qué detecté:** hoy `robots.txt` permite todo (`User-Agent: *  Allow: /`), así que GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot y Google-Extended ya pueden rastrear.
- **Recomendación:** no cambiar nada por ahora. Si en algún momento querés impedir el uso para **entrenamiento** sin perder visibilidad en **búsqueda con IA**, se bloquean solo GPTBot, ClaudeBot y Google-Extended, y se dejan permitidos OAI-SearchBot, Claude-SearchBot y PerplexityBot. Es una decisión de negocio tuya.
