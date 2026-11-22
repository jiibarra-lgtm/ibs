# GEO y AEO: buscadores con IA y respuestas directas

## Lo que dicen las plataformas (fuentes oficiales, noviembre 2026)

| Plataforma | Rastreador de búsqueda | Rastreador de entrenamiento | Qué recomiendan |
|---|---|---|---|
| Google (AI Overviews / AI Mode) | Googlebot | Google-Extended | No hay requisitos extra: rigen los fundamentos de SEO, contenido indexable y elegible para fragmento. [Google](https://developers.google.com/search/docs/appearance/ai-features) |
| OpenAI (ChatGPT) | OAI-SearchBot | GPTBot | Permitir OAI-SearchBot para aparecer en la búsqueda de ChatGPT. Se controlan por separado. ChatGPT-User es iniciado por el usuario y puede no respetar robots.txt. [OpenAI](https://developers.openai.com/api/docs/bots) |
| Anthropic (Claude) | Claude-SearchBot / Claude-User | ClaudeBot | Bloquear Claude-SearchBot o Claude-User reduce la visibilidad en búsquedas de Claude. [Anthropic](https://support.claude.com/en/articles/8896518) |
| Perplexity | PerplexityBot | (no entrena modelos base) | Permitir PerplexityBot y sus rangos de IP. Perplexity-User suele ignorar robots.txt por ser una petición del usuario. [Perplexity](https://docs.perplexity.ai/guides/bots) |
| Microsoft (Copilot / Bing) | Bingbot | — | Bing Webmaster Tools + IndexNow. |

**Estado actual de Ibarra Insumos:** `robots.txt` permite todos los rastreadores. No hace falta cambiar nada para ser elegible.

## Qué agregué (archivos nuevos)
- **`/llms.txt`** y **`/llms-full.txt`**: resumen de la empresa, páginas, catálogo, kits, FAQ y glosario en markdown. Es una **propuesta experimental** (llmstxt.org). **No es un factor de posicionamiento demostrado** y ninguna plataforma confirmó usarla para ranking. Se genera solo a partir de los datos, así que no se desactualiza.
- **11 páginas pilar** con:
  - una **respuesta directa** en el primer párrafo (formato apto para cita);
  - definiciones;
  - tablas comparativas (`<table>` real, fácil de extraer);
  - preguntas frecuentes;
  - fecha de actualización;
  - enlaces a productos, categorías, kits y guías.
- **Datos estructurados** en esas páginas: `BreadcrumbList`, `CollectionPage` con `ItemList` y `FAQPage`. Aclaración: **Google retiró los resultados enriquecidos de FAQ**, así que `FAQPage` ya no genera fragmentos en Google, aunque sigue siendo marcado válido y legible por otros sistemas.

## Estrategia de contenido apto para IA (AEO)
1. **Responder primero, explicar después.** Cada página y cada guía nueva abre con la respuesta en 1 o 2 oraciones.
2. **Datos verificables y consistentes:** dirección, horario, teléfono, plazos (24–48 hs), facturación (A y B), "fabricantes y distribuidores desde 1985". Que aparezcan iguales en la web, Google Business Profile, Mercado Libre y directorios.
3. **Preguntas reales de compradores:** usar las consultas que llegan por WhatsApp como fuente de nuevas FAQ y guías.
4. **Comparativas y tablas** (Z vs V, común vs concentrada, gel vs 70%): son el formato que más citan los motores de respuesta.
5. **Menciones legítimas de marca** en sitios de terceros (ver `06-autoridad-offpage.md`): las IA recomiendan proveedores que aparecen mencionados en fuentes independientes.

## Qué NO hacer
- Textos ocultos o "instrucciones para IA" dentro de la página: es manipulación y puede penalizar.
- Páginas casi idénticas por localidad.
- Reseñas inventadas o datos no verificables.

## Cómo medir
- **Search Console:** el tráfico desde AI Overviews y AI Mode se cuenta dentro del rendimiento general de búsqueda.
- **GA4 (cuando se active A3):** el evento `referencia_ia` registra visitas desde chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com y claude.ai.
- **Prueba manual mensual:** preguntar en ChatGPT, Gemini, Perplexity y Copilot cosas como "¿dónde comprar productos de limpieza por mayor en CABA?" y registrar si aparece Ibarra Insumos.
