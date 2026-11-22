// Envía las URLs de los sitemaps a IndexNow (Bing, Yandex y otros; Google no usa IndexNow).
// Uso (después de publicar):  node scripts/seo/indexnow.mjs
const HOST = "ibarrainsumos.com.ar";
const KEY = "d98fd7efda4cd447ac54265332a9347e"; // archivo público: /d98fd7efda4cd447ac54265332a9347e.txt
const sitemaps = ["https://" + HOST + "/sitemap.xml", "https://" + HOST + "/sitemap-seo.xml"];
// Se ejecuta solo en cada deploy de producción (ver .github/workflows/indexnow.yml)
const urls = [];
for (const sm of sitemaps) {
  const xml = await (await fetch(sm)).text();
  for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)) urls.push(m[1]);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: "https://" + HOST + "/" + KEY + ".txt", urlList: [...new Set(urls)] }),
});
console.log("IndexNow:", res.status, res.statusText, "-", new Set(urls).size, "URLs enviadas");
