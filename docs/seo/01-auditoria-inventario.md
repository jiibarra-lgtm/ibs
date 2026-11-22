# Auditoría e inventario del SEO existente (antes de esta etapa)

Punto de restauración: tag git `baseline-pre-seo`, 99 archivos con huella SHA-256. **Ninguno fue modificado.**

## Inventario (se conserva intacto)
| Elemento | Estado encontrado |
|---|---|
| Títulos y descripciones | Uno por página, sin duplicados |
| Canonical | Presente en todas las páginas indexables |
| Open Graph | Presente (título, descripción, imagen) |
| `sitemap.xml` | 73 URLs (`app/sitemap.ts`) |
| `robots.txt` | Permite todo, bloquea `/admin` y declara el sitemap |
| Redirecciones | `/index.html` → `/` (308) |
| Datos estructurados | WholesaleStore + Organization en todo el sitio; FAQPage (1 página); Article (6 guías); Product (32 fichas) |
| Contenido | FAQ, glosario, 6 guías, 10 kits, 8 promos de evento, categorías y fichas |
| Geo | `geo.region AR-C`, zona de servicio en el schema, mapa embebido |
| Analítica / SEM | Nada instalado (ni GA, GTM, píxel ni verificaciones) |

## Hallazgos (NO corregidos; ver `09-autorizaciones-pendientes.md`)
1. **3 H1 en la portada** (carrusel) y **0 H1 en /catalogo**. → A4
2. **36 títulos de más de 65 caracteres** (por ejemplo `/kits` con 90, `/productos` con 88, `/promo/higiene-de-manos` con 95). → A5
3. **10 descripciones de más de 160 caracteres** (la portada tiene 229, `/productos/dispensers` 217). → A5
4. **623 de 1017 imágenes con alt vacío.** Parte son decorativas, pero las de kits y del carrusel deberían describirse. → A9
5. **Falta en los datos estructurados:** BreadcrumbList, WebSite, ContactPoint, dirección completa, geo, sameAs y Product.offers. → A6
6. **Fuentes por `<link>`** de Google Fonts, no `next/font`. → A8
7. **Sin medición ni verificación** de buscadores. → A3 y A11
8. **/catalogo** (imprimible) es indexable y duplica el catálogo. → A10

El listado de títulos y descripciones largos por URL sale de correr `node scripts/seo/verificar-seo.mjs <url>`.
