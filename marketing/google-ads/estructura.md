# Google Ads — estructura propuesta (no publicada)

No creé campañas ni generé costos. Todo está listo para cargar cuando lo autorices y conectes la cuenta.

## Campañas (palabras clave en `palabras-clave.csv`)
| Campaña | Objetivo | URL destino principal |
|---|---|---|
| Marca | Proteger búsquedas de "Ibarra Insumos" | / |
| Mayorista y fabricante | Compras por mayor | /productos-de-limpieza-por-mayor y /fabrica-de-productos-de-limpieza |
| Productos | Toallas, papel, lavandina, alcohol en gel | Fichas de producto |
| Dispensers y comodato | Contratos recurrentes | /dispensers-en-comodato |
| Rubros | Gastronomía, salud, escuelas, consorcios, empresas | Página pilar de cada rubro |
| Kits | Compra armada por tipo de negocio | /kits/* |

## Configuración sugerida
- **Red:** solo Búsqueda (sin Display ni socios de búsqueda al comienzo).
- **Ubicación:** CABA y GBA, por "presencia" (personas ubicadas en la zona), no por "interés".
- **Horario:** lunes a viernes de 8 a 17 hs. Opcionalmente, anuncios fuera de horario con un mensaje de WhatsApp.
- **Concordancia:** frase y exacta. No usar amplia hasta tener al menos 30 conversiones.
- **Puja:**
  1. Arrancar con "Maximizar clics" con CPC máximo.
  2. Pasar a "Maximizar conversiones" cuando la medición (A3) registre conversiones.
  3. Después, CPA objetivo.
- **Negativas:** lista compartida `palabras-negativas.csv` (casero, receta, gratis, empleo, etc.).
- **Anuncios:** RSA en `anuncios-rsa.csv`. Sumar extensiones de llamada, ubicación (vinculando GBP) y sitelinks a las páginas pilar.
- **Presupuesto:** a definir por vos. Repartirlo según los volúmenes reales de Keyword Planner; no estimé montos.

## Conversiones a crear (con GTM, después de A3)
- **Primarias:** solicitud_cotizacion, click_whatsapp, click_telefono.
- **Secundarias:** agregar_kit, pedido_programado.

## KPIs
CTR, CPC, tasa de conversión, costo por cotización y cotizaciones que terminan en venta (registro manual o en el CRM).
