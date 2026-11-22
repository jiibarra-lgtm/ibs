# Merchant Center, Shopping y Performance Max — requisitos

**Estado:** no se puede activar todavía. Google exige un **precio** y la **disponibilidad** en cada producto, y la web hoy funciona con cotización sin precios publicados. No inventé precios.

## Qué hace falta
1. Decidir si publicás precios (aunque sea un "precio desde" por unidad mínima).
2. Mostrar ese precio en la ficha del producto: Google compara el feed con la página.
3. Una cuenta de Merchant Center verificada con el dominio (por DNS o desde Search Console).
4. Políticas visibles: envíos (zonas, costos y plazos), devoluciones y datos de contacto.
5. Un feed (plantilla en `feed-plantilla.csv`): id, title, description, link, image_link, price, availability, brand, condition, google_product_category y el identificador (gtin o mpn; si no tiene, `identifier_exists = no`).
6. Agregar `offers` en los datos estructurados de cada producto (autorización A6).

## Después
- **Shopping estándar:** primero, con los productos de más margen.
- **Performance Max:** solo cuando GA4 o Google Ads ya registren conversiones reales (cotización o WhatsApp); sin conversiones, el algoritmo no tiene señal para optimizar.
- **Listados gratuitos:** se activan solos con el feed aprobado. No tienen costo.
