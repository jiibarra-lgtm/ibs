# Ibarra Insumos — web nueva (Next.js)

Reescritura completa de ibarrainsumos.com.ar.

## Correr local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
```

## Estructura

- `lib/site.ts` — datos de la empresa (teléfono, WhatsApp, mail, horario, cifras de portada, link Data Fiscal)
- `lib/promos.ts` — **todo lo comercial**: franja de anuncios, descuentos por cantidad, cupones, cupón de bienvenida, oferta del mes (con fecha de fin), combos y "Completá tu kit"
- `lib/content.ts` — FAQ, glosario, ventajas, compatibilidad de dispensers
- `lib/catalog.ts` — capa de datos del catálogo (hoy lee JSON; acá se conecta Supabase)
- `data/productos.json` / `data/categorias.json` — catálogo. Campos opcionales por producto: `badge` ("Más vendido", "Nuevo"…) y `precio` (si lo cargás, se muestran precios tachados y total estimado)
- `data/testimonios.json` — testimonios reales (la sección se oculta si está vacío)
  formato: `[{ "texto": "...", "nombre": "...", "cargo": "..." }]`
- `public/img/` — imágenes optimizadas en WebP

## Panel de control (/admin)

Edita toda la tienda: productos, categorías, combos, precios y escalas, promociones y cupones, banners, sellos, secciones visibles, barra superior, popup, animaciones, apariencia (colores, bordes, tipografía), testimonios.
Hasta conectar la base de datos, el botón **Exportar** descarga `tienda.json`, `productos.json`, `categorias.json` y `testimonios.json`: reemplazalos en `/data` y publicá.

## Novedades
- **Fabricantes y distribuidores** en toda la web. Por producto, el interruptor “Fabricación propia” del panel muestra la etiqueta 🏭.
- **Eventos** (`tienda.json → eventos`): Black Friday, Cyber Monday, Cierre de año, Verano, Vuelta a clases, Día de la Higiene de Manos, Hot Sale, Invierno. Cada uno con popup propio, cupón, franja y página `/promo/<slug>`; calendario en `/promos`. Fechas de Cyber Monday y Hot Sale: a confirmar.
- **Carga rápida** (`/carga-rapida`): pegar una lista y armar la cotización.
- **Pedido programado**: opción en la cotización + página `/pedido-programado`.
- **Guías** (`/guias`, `data/guias.json`): 6 artículos, editables desde el panel.

## Páginas

`/` · `/productos` · `/productos/[categoria]` · `/producto/[slug]` · `/compatibilidad` ·
`/herramientas/carteles` · `/herramientas/etiquetas` · `/catalogo` (imprimir/PDF) · `/admin` (placeholder) ·
`/sitemap.xml` · `/robots.txt`

## Deploy en Vercel

1. Subir esta carpeta a un repo nuevo de GitHub.
2. Vercel → Add New Project → importar el repo (framework: Next.js, sin configurar nada).
3. Probar en la URL `*.vercel.app`.
4. Cuando esté OK: en el proyecto viejo quitar el dominio `ibarrainsumos.com.ar` y agregarlo al nuevo
   (también `www.ibarrainsumos.com.ar`, que redirige solo al dominio sin www).
5. Recién ahí borrar/archivar el proyecto viejo.

Las URLs viejas (`/index.html`, `/producto.html`, `/admin.html`) redirigen a las nuevas.

## Pendiente: conectar Supabase

- Reemplazar el cuerpo de las funciones de `lib/catalog.ts` por consultas a Supabase.
- Admin con Supabase Auth (login real) + RLS: lectura pública, escritura solo para usuarios admin.
- Nunca poner contraseñas ni claves de escritura en el frontend.
