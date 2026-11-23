# Auditoría e implementación SEO / GEO / AEO / SEM — 23/11/2026

Rama: `seo-auditoria-nov` · Base: `main` (commit 6cf6d7c, en producción) · **No se publicó a producción.**

## Etapa 1 — Inventario

**Stack:**
- Next.js 15.5 (App Router), React 19 y TypeScript.
- Generación estática (SSG): 116 páginas prerenderizadas.
- El contenido principal, los títulos y los enlaces están en el HTML inicial. No depende de JavaScript para indexarse.

**URLs rastreadas: 103 páginas públicas, todas con HTTP 200.**

| Tipo | Cantidad | Indexable |
|---|---|---|
| Inicio | 1 | Sí |
| Catálogo + categorías | 1 + 6 | Sí |
| Fichas de producto | 32 | Sí |
| Páginas de soluciones por intención o rubro | 11 | Sí |
| Kits por rubro | 1 + 10 | Sí |
| Guías | 1 + 15 | Sí |
| Promos por evento | 1 + 8 | Sí |
| Empresa (fábrica, quiénes somos, marca propia, novedades ×3, puntos) | 8 | Sí |
| Legales (privacidad, garantía) | 2 | Sí |
| Herramientas (carteles, etiquetas, compatibilidad, carga rápida, pedido programado) | 6 | Sí |
| `/catalogo` (versión para imprimir) | 1 | No (noindex, a propósito) |
| `/carrito-compartido` | 1 | No (noindex) |
| `/admin` | 1 | No (noindex + Disallow) |
| No hay rutas de API | — | — |

## Etapa 2 — Comparación

### A. Correcto y conservado sin cambios
- Un title y una meta description únicos por página: 0 duplicados en 103 URLs, todos los títulos de 65 caracteres o menos.
- Canonical propia en cada página: 0 errores y ninguna apuntando a otra URL.
- Un solo H1 por página (103/103).
- JSON-LD válido en el 100% de las páginas:
  - WholesaleStore + Organization con `@id`, WebSite y ContactPoint.
  - BreadcrumbList, Product, CollectionPage + ItemList, FAQPage, Article, NewsArticle, VideoObject y AboutPage.
- Ninguna página huérfana.
- Redirección `www` → dominio sin www (308).
- `llms.txt` (experimental, sin efecto de ranking comprobado).
- IndexNow, Consent Mode v2 y medición preparada.
- La verificación de Google Search Console ya existe en el DNS (registro TXT `google-site-verification`).

### B/C. Problemas confirmados y corregidos

| ID | Área | Problema (evidencia) | Solución | Archivos | Prioridad |
|---|---|---|---|---|---|
| T1 | Sitemap | Todas las URLs tenían `lastmod` con la hora del build, que no es una fecha real de cambio. | `lastmod` solo en guías y novedades, con su fecha real; en el resto se omite. | `app/sitemap.ts` | Alta |
| T2 | Robots | `/carrito-compartido` tenía `noindex` y también `Disallow`. El Disallow impedía que Google viera el noindex. | Se quitó el Disallow; se mantiene el noindex. | `app/robots.ts` | Media |
| T3 | Imágenes | Fotos con `alt=""`: portada de guía, novedad, productos de la barra lateral de guías y miniaturas de la galería. | `alt` con el título o el nombre del producto. Los logos decorativos siguen con `alt=""`. | `app/guias/*`, `app/novedades/[slug]`, `components/Bits.tsx` | Media |
| T4 | Meta | 3 descripciones cortas: jabón en pan (68 caracteres), repelente (66) y descartables (58). | Se completan con texto comercial real cuando la base es corta. | `app/producto/[slug]`, `app/productos/[categoria]` | Baja |
| T5 | Enlazado | 7 guías recibían un solo enlace interno, desde `/guias`. | Bloque "Guías para elegir y usar…" en cada ficha y "Guías sobre…" en cada categoría. Las guías relacionadas se ordenan por productos en común. | `app/producto/[slug]`, `app/productos/[categoria]`, `app/guias/[slug]` | Alta |
| T6 | Cobertura | Las bolsas mortuorias estaban en el catálogo viejo pero faltaban en la web nueva. Tienen sitio propio: bolsasmortuoriasibarra.com.ar. | Sección y FAQ en la página de hospitales, enlace en el footer y mención en `llms.txt`, todo apuntando al sitio propio. No se duplicaron fichas, para no competir entre los dos dominios. | `lib/seo/landings.ts`, `components/seo/SeoLanding.tsx`, `components/Footer.tsx`, `lib/seo/llms.ts` | Alta |
| P1 | Rendimiento | En la portada, el LCP era la foto de la planta de 1400 px mostrada a 379 px (89 KB de más). | `srcset` con una versión de 800 px (39 KB). | `components/Shop.tsx`, `public/img/marca/planta-800.webp` | Alta |
| P2 | Rendimiento | Logo `isotipo.png` de 83 KB mostrado a 36–48 px. | `isotipo.webp` de 4 KB en header, footer y catálogo. | `components/Header.tsx`, `Footer.tsx`, `app/catalogo` | Media |
| P3 | Rendimiento | En la ficha de producto, la imagen principal (LCP) arrancaba con una animación de opacidad. | Sin animación en la primera imagen y con `fetchPriority="high"`. | `components/Bits.tsx` | Alta |

**Lighthouse (laboratorio, móvil simulado, servidor local; no son datos reales de usuarios):**

| Página | Antes | Después |
|---|---|---|
| `/` | Rendimiento 71 · LCP 4,0 s · TBT 570 ms | **83** · LCP 3,3 s · TBT 360 ms |
| `/producto/toallas-intercaladas` | 72 · LCP 4,9 s · TBT 380 ms | **94** · LCP 2,7 s · TBT 160 ms |
| `/productos-de-limpieza-por-mayor` | 94 · LCP 3,1 s | (sin cambios) |

En las tres páginas, SEO da 100, accesibilidad 95–97, buenas prácticas 96 y CLS 0.

### D. Oportunidades detectadas que **no** se implementaron (requieren datos o autorización)
1. **Fichas sin especificaciones técnicas.** Ningún producto tiene medidas, metros, hojas por paquete, cantidad por caja, litros ni color. No las inventé. Hacen falta los datos reales: por ejemplo, toallas 20×24 o 20×36, 1.400 o 2.500 hojas, papel jumbo de 60 o 100 m, bidones de 5 L. Es la mejora de mayor impacto pendiente para SEO de producto y para responder consultas en IA.
2. **Bolsas de residuos.** No están en el catálogo y no encontré evidencia publicada de que se vendan. Si las venden, pasame medidas (50×70, 60×90, 80×110) y micronaje, y armo la categoría.
3. **Bolsas mortuorias: medidas.** Ni este sitio ni bolsasmortuoriasibarra.com.ar publican medidas ni micrones. Los datos de referencia (1×2,30 m; 1,50×2,60 m; PVC de 200 micrones) hay que confirmarlos antes de publicarlos. Además, en ese sitio los contadores muestran "0+" años y "0%". Parece un bug de ese proyecto.
4. **Product sin `offers`.** Es schema.org válido, pero Google no muestra fichas enriquecidas sin precio, y Search Console puede marcarlo como "falta offers". Solo se resuelve publicando precios, que es una decisión comercial.
5. **Dirección exacta y redes** para `PostalAddress`, `geo` y `sameAs`. Hoy figura solo el barrio.
6. **Contraste** del texto "eyebrow" dorado sobre crema y de las etiquetas "Oferta" (Lighthouse). Arreglarlo cambia colores de la marca, así que necesita tu OK.
7. **JavaScript:** el hilo principal trabaja 2,7–4,6 s en móvil simulado por animaciones, Lenis y carrusel. Bajarlo implica quitar o diferir animaciones, que son una decisión de diseño.

### E. No verificable con el acceso disponible
- Indexación real, consultas, CTR y posiciones: requieren acceso a Search Console. El dominio ya está verificado, pero no tengo acceso a la cuenta.
- Core Web Vitals de usuarios reales: aparecerán en Vercel Speed Insights y CrUX con tráfico.
- Perfil de Google Business, backlinks y autoridad: requieren acceso o herramientas pagas.
- **Competidores pedidos** (More Clean, Distribuidora Delta, Distribuidora Central, Distrimali, Indusnort): no encontré sitios identificables con esos nombres en búsquedas públicas. "Delta" y "Central" dan resultados de otros rubros. Para compararlos hacen falta sus URLs exactas.

## Keyword → URL objetivo (productos estratégicos)

| Búsqueda | Intención | URL objetivo | Estado |
|---|---|---|---|
| productos de limpieza por mayor | Comercial | `/productos-de-limpieza-por-mayor` | Existe |
| distribuidora de limpieza CABA / GBA | Local | `/distribuidora-de-limpieza-en-caba-y-gba` | Existe |
| toallas intercaladas por mayor | Transaccional | `/producto/toallas-intercaladas` | Existe; faltan medidas y hojas |
| papel higiénico jumbo / institucional | Transaccional | `/producto/papel-higienico-jumbo` + guía jumbo vs. común | Existe; faltan metros |
| dispensers en comodato | Comercial | `/dispensers-en-comodato` | Existe |
| insumos de limpieza para hospitales | B2B | `/insumos-de-limpieza-para-hospitales` | Existe (+ bolsas mortuorias) |
| bolsas mortuorias por mayor | Transaccional | bolsasmortuoriasibarra.com.ar | Sitio propio; enlazado desde acá |
| bolsas de residuos por mayor | Transaccional | — | Pendiente de confirmar el producto |

Mapa completo: `02-mapa-palabras-clave.csv`. Volúmenes: pendientes de Keyword Planner (no se inventaron).

## Verificaciones ejecutadas
- `next build`: OK, 116 páginas, sin errores de TypeScript.
- **Lint: el proyecto no tiene ESLint configurado.** No se ejecutó; el chequeo de tipos corre en el build.
- **Crawler propio** (103 URLs, antes y después): 0 errores HTTP, 0 canonical incorrectas, 0 títulos o descripciones duplicados o fuera de rango, H1 único en todas, 0 JSON-LD inválidos, 0 huérfanas.
- Sitemap: XML válido, URLs absolutas HTTPS, sin noindex ni redirecciones. Robots: responde y declara los 3 sitemaps.
- **Prueba funcional (Playwright):** agregar al carrito → "Enviar cotización" abre `wa.me/5491144402807` con el pedido; 8 enlaces de WhatsApp en la ficha; enlace a bolsas mortuorias presente; guías relacionadas presentes.
- Lighthouse antes y después (tabla arriba).
- Ninguna URL cambió, ninguna canonical cambió, no se borró contenido y no se agregaron dependencias.

## Control de calidad (25 puntos)
1. **Ya estaba bien:** títulos, descripciones, canonical, H1, JSON-LD, robots, redirección www y SSG.
2. **Sin modificar:** todo lo anterior, salvo los 3 textos cortos (T4).
3. **Problemas comprobados:** T1–T6 y P1–P3.
4. **Corregidos:** los 9.
5. **Archivos modificados:**
   - `app/sitemap.ts`, `app/robots.ts`
   - `app/guias/page.tsx`, `app/guias/[slug]/page.tsx`
   - `app/novedades/[slug]/page.tsx`
   - `app/producto/[slug]/page.tsx`, `app/productos/[categoria]/page.tsx`, `app/catalogo/page.tsx`
   - `components/Bits.tsx`, `components/Footer.tsx`, `components/Header.tsx`, `components/Shop.tsx`, `components/seo/SeoLanding.tsx`
   - `lib/seo/landings.ts`, `lib/seo/llms.ts`
   - Más 2 imágenes nuevas.
6. **¿Se duplicó funcionalidad?** No.
7. **¿Se alteró alguna canonical?** No.
8. **¿Se modificaron URLs?** No.
9. **¿El sitemap es válido?** Sí.
10. **¿Robots funciona?** Sí.
11. **¿Las páginas comerciales siguen siendo indexables?** Sí.
12. **¿El contenido es accesible para rastreadores?** Sí, está en el HTML inicial.
13. **¿Los datos estructurados son válidos?** Sí. Product no es elegible para fichas enriquecidas porque no tiene precio.
14. **¿Se agregaron datos inventados?** No. Los datos de bolsas mortuorias salen de bolsasmortuoriasibarra.com.ar.
15. **¿Los formularios siguen funcionando?** No hay formularios con envío; la cotización va por WhatsApp.
16. **¿WhatsApp sigue funcionando?** Sí, probado.
17. **¿Las fichas de producto siguen funcionando?** Sí.
18. **¿El proyecto compila?** Sí.
19. **Pruebas ejecutadas:** build, crawler, Lighthouse y Playwright.
20. **Pendientes:** sección D.
21. **Requieren datos comerciales:** D1, D2, D3, D4 y D5.
22. **Requieren Search Console:** indexación real, consultas, CTR y envío de sitemaps.
23. **Requieren autorización:** publicar esta rama a producción, D6 y D7.
24. **Medición de resultados:** Search Console (impresiones, clics y CTR por URL), GA4 (eventos `solicitud_cotizacion`, `click_whatsapp` y `referencia_ia`, cuando se carguen los IDs), Vercel Speed Insights (CWV reales) y una prueba mensual en ChatGPT, Gemini, Perplexity y Copilot.
25. **Beneficio de cada cambio:**
    - T1: Google confía en `lastmod`.
    - T2: el noindex se respeta.
    - T3: SEO de imágenes y accesibilidad.
    - T4: snippets completos.
    - T5: más autoridad interna hacia las guías y más contexto para IA.
    - T6: recupera una línea de producto que se había perdido.
    - P1–P3: carga más rápida en celulares (LCP de 4,9 a 2,7 s en la ficha).
