# Medición

## Preparado (sin conectar; requiere A3)
- `components/seo/Measurement.tsx`:
  - carga GTM, GA4, Google Ads y Meta solo si hay variables de entorno;
  - Consent Mode v2 con todo denegado por defecto.
- `components/seo/ConsentBanner.tsx`: aceptar todo, solo medición o rechazar.
- `lib/seo/track.ts`: función `track()` y detección de referencias de IA.

## Eventos
| Evento | Cuándo se dispara |
|---|---|
| solicitud_cotizacion | Al enviar la cotización por WhatsApp |
| click_whatsapp, click_telefono, click_email | Clic en wa.me, tel: o mailto: |
| agregar_producto, agregar_kit, aplicar_cupon | Acciones del carrito |
| ver_producto, ver_categoria, ver_kit, ver_landing_seo | Vista según el tipo de página |
| lectura_articulo | 75% de scroll en /guias/* |
| referencia_ia | Visita desde ChatGPT, Perplexity, Gemini, Copilot o Claude, o con utm_source de IA |
| carga_rapida, pedido_programado | Uso de esas herramientas |

## Credenciales que necesito (variables en Vercel, ver `.env.example`)
- `NEXT_PUBLIC_GTM_ID` (GTM-XXXX) **o** `NEXT_PUBLIC_GA4_ID` (G-XXXX)
- `NEXT_PUBLIC_GADS_ID` (AW-XXXX), cuando haya cuenta de Ads
- `NEXT_PUBLIC_META_PIXEL_ID`, opcional

## Tablero sugerido (Looker Studio, gratis)
Search Console (clics, impresiones, CTR y posición por página pilar) + GA4 (conversiones por canal, incluido "IA").

## Privacidad
- Sin datos personales en los eventos (no se envían nombre, teléfono ni contenido del pedido).
- `ads_data_redaction` activo mientras no haya consentimiento.
- Recomiendo sumar una página de privacidad que mencione las cookies de medición. Sería una página nueva: avisame si la querés.
