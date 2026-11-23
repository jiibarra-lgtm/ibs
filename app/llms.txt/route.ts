// /llms.txt — propuesta experimental (llmstxt.org). No es un factor de posicionamiento demostrado. ARCHIVO NUEVO.
import { llmsTxt } from "@/lib/seo/llms";
export const revalidate = 3600;
export async function GET() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
