// Página pilar SEO (archivo nuevo). Contenido en lib/seo/landings.ts
import SeoLanding, { landingMetadata } from "@/components/seo/SeoLanding";

export const metadata = landingMetadata("insumos-de-limpieza-para-gastronomia");
export default function Page() { return <SeoLanding slug="insumos-de-limpieza-para-gastronomia" />; }
