// Auditoría rápida local: recorre los sitemaps y revisa title, description, canonical, H1 y JSON-LD válido.
// Uso: npm run build && npx next start -p 3100  →  node scripts/seo/verificar-seo.mjs http://localhost:3100
const BASE = process.argv[2] ?? "http://localhost:3100";
const get = async (u) => (await fetch(BASE + u)).text();
const urls = new Set();
for (const sm of ["/sitemap.xml", "/sitemap-seo.xml"]) {
  for (const m of (await get(sm)).matchAll(/<loc>https?:\/\/[^/]+(.*?)<\/loc>/g)) urls.add(m[1] || "/");
}
let problemas = 0;
for (const u of urls) {
  const h = await get(u);
  const t = (h.match(/<title>(.*?)<\/title>/) || [])[1] ?? "";
  const d = (h.match(/<meta name="description" content="(.*?)"/) || [])[1] ?? "";
  const c = (h.match(/<link rel="canonical" href="(.*?)"/) || [])[1] ?? "";
  const h1 = (h.match(/<h1[ >]/g) || []).length;
  const ld = [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => { try { JSON.parse(m[1]); return "ok"; } catch { return "ERROR"; } });
  const avisos = [];
  if (!t) avisos.push("sin title"); if (t.length > 65) avisos.push(`title ${t.length} car.`);
  if (!d) avisos.push("sin description"); if (d.length > 160) avisos.push(`description ${d.length} car.`);
  if (!c) avisos.push("sin canonical"); if (h1 !== 1) avisos.push(`${h1} H1`); if (ld.includes("ERROR")) avisos.push("JSON-LD inválido");
  if (avisos.length) { problemas++; console.log(u, "→", avisos.join(" · ")); }
}
console.log(`\n${urls.size} URLs revisadas, ${problemas} con avisos.`);
