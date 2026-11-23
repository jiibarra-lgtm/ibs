export const site = {
  name: "Ibarra Insumos",
  url: "https://ibarrainsumos.com.ar",
  tagline: "Fabricantes y distribuidores de productos de limpieza e higiene institucional",
  description:
    "Fabricantes y distribuidores mayoristas de productos de limpieza, higiene institucional y descartables en CABA y GBA. Precio directo de fábrica y más de 40 años abasteciendo hospitales, empresas, consorcios y organismos públicos.",
  founded: 1985,
  phoneDisplay: "+54 11 4440-2807",
  phoneE164: "+541144402807",
  whatsapp: "5491144402807",
  email: "info@ibarrainsumos.com.ar",
  address: { locality: "Parque Avellaneda", region: "Ciudad Autónoma de Buenos Aires", country: "AR" },
  // Pegá acá el link del QR de Data Fiscal de ARCA (con tu CUIT) para mostrar el sello en el footer
  dataFiscalUrl: "",
  hours: "Lunes a viernes de 8 a 17 hs",
  coverage: ["CABA completa", "Gran Buenos Aires", "Provincia de Buenos Aires"],
  // Cifras que se muestran en la portada. Poné solo números que puedas respaldar.
  stats: [
    { value: "Fábrica", label: "propia + distribución" },
    { value: "+40", label: "años en el mercado" },
    { value: "24–48 hs", label: "entrega en CABA y GBA" },
    { value: "A y B", label: "facturación" },
    { value: "Comodato", label: "de dispensers" },
  ],
};

export function waLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** URL absoluta para imágenes (locales o de Supabase). */
export const absUrl = (src: string) => (src.startsWith("http") ? src : `${site.url}${src}`);
