import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ibarra Insumos", short_name: "Ibarra", start_url: "/", display: "standalone",
    background_color: "#f6f2ea", theme_color: "#1a4a44", lang: "es-AR",
    description: "Fabricantes y distribuidores de productos de limpieza e higiene institucional en CABA y GBA",
    icons: [{ src: "/img/marca/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
