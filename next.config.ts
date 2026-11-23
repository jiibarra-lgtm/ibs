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
    }, {
      source: "/admin",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        { key: "Cache-Control", value: "no-store" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};
export default config;
