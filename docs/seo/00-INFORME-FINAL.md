# Informe final — SEO, SEO local, GEO, AEO y SEM · Ibarra Insumos
Fecha: 20/11/2026 · Regla aplicada: **solo agregados; nada existente modificado.**

## 1. Qué tenía antes
Ver `01-auditoria-inventario.md`:
- 73 URLs en el sitemap; robots.txt y canonicals correctos.
- Datos estructurados WholesaleStore, Organization, FAQPage, Article y Product.
- FAQ, glosario, 6 guías, kits y promos.
- Sin analítica ni SEM.

## 2. Qué agregué (archivos nuevos)
| Qué | Archivos |
|---|---|
| 11 páginas pilar (por mayor, fábrica, institucional, comodato, hospitales, gastronomía, industrial, empresas, consorcios, escuelas, CABA y GBA) | `app/<slug>/page.tsx`, `lib/seo/landings.ts`, `components/seo/SeoLanding.tsx`, `landing.module.css` |
| Datos estructurados en las páginas nuevas | BreadcrumbList, CollectionPage + ItemList, FAQPage |
| Sitemaps complementarios | `/sitemap-seo.xml`, `/sitemap-imagenes.xml` |
| GEO | `/llms.txt`, `/llms-full.txt` (experimental, sin efecto de ranking comprobado) |
| IndexNow | clave en `public/` + `scripts/seo/indexnow.mjs` |
| Medición lista para activar | `components/seo/Measurement.tsx`, `ConsentBanner.tsx`, `lib/seo/track.ts`, `.env.example` |
| Control de calidad | `scripts/seo/verificar-seo.mjs` |
| 5 guías redactadas (borrador) | `content/borradores/guias-nuevas.json` |
| Estrategia | `docs/seo/02` a `10` |
| SEM | `marketing/google-ads/*` (110 palabras clave, 35 negativas, anuncios RSA validados, estructura) y `marketing/merchant-center/*` |

## 3. Qué optimicé
Nada de lo existente: la regla lo prohíbe. Los títulos de las páginas nuevas los ajusté a ≤63 caracteres.

## 4. Verificación
- `sha256sum` de los 99 archivos originales: **todos idénticos**.
- `git status`: **0 modificados, 0 borrados**; solo archivos nuevos.
- Build: 96 páginas estáticas, sin errores.

## 5. Cambios que requieren tu autorización
Ver `09-autorizaciones-pendientes.md`, puntos A1 a A12. Los más importantes:
- **A1:** enlazar las páginas nuevas.
- **A2:** declarar los sitemaps nuevos.
- **A3:** activar la medición.
- **A6:** dirección y schema.

## 6. Integraciones que requieren credenciales
GTM/GA4, Google Ads, Meta Pixel, Search Console (DNS), Bing Webmaster, Merchant Center y Google Business Profile.

## 7. Acciones externas pendientes (tuyas)
1. Verificar el dominio en Search Console y Bing, y enviar los 3 sitemaps.
2. Completar Google Business Profile y empezar a pedir reseñas reales.
3. Validar volúmenes en Keyword Planner con `02-mapa-palabras-clave.csv`.
4. Dar de alta la empresa en directorios de fábricas y pedir enlace a proveedores.
5. Decidir si publicás precios, que es lo que habilita Shopping.
6. Revisar y aprobar las 5 guías en borrador.

## 8. Resultados medibles (sin promesas de posiciones)
- Páginas indexadas (GSC).
- Impresiones y clics de las páginas pilar.
- CTR por título.
- Cotizaciones y clics de WhatsApp por canal.
- Visitas desde IA.
- Reseñas en GBP.
- Costo por cotización en Ads.

## 9. Prioridades (orden)
A1 → A2 → acciones externas 1 y 2 → A3 → A6 → A7 → A4/A5 → Ads Marca + Mayorista → contenido (2 guías por semana del plan de 100).

## 10. Mantenimiento periódico
- **Semanal:** publicar 1 o 2 guías; responder reseñas; publicación en GBP.
- **Mensual:**
  - revisar consultas en GSC para nuevas FAQ;
  - prueba manual en ChatGPT, Gemini, Perplexity y Copilot;
  - revisar negativas de Ads;
  - correr `verificar-seo.mjs`.
- **Por cada deploy:** `node scripts/seo/indexnow.mjs`.
- **Trimestral:** volver a auditar competidores y actualizar las fechas de las páginas pilar.
