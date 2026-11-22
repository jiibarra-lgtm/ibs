import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Cuando se conecte Supabase, las fotos vienen del bucket "productos"
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async redirects() {
    return [
      // URLs de la web vieja → nuevas (no perder lo que Google ya indexó)
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/producto.html", destination: "/productos", permanent: true },
      { source: "/admin.html", destination: "/admin", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "www.ibarrainsumos.com.ar" }], destination: "https://ibarrainsumos.com.ar/:path*", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ],
    }];
  },
};
export default config;
