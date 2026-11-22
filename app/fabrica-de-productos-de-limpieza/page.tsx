// Página pilar SEO (archivo nuevo). Contenido en lib/seo/landings.ts
import SeoLanding, { landingMetadata } from "@/components/seo/SeoLanding";

export const metadata = landingMetadata("fabrica-de-productos-de-limpieza");
export default function Page() { return <SeoLanding slug="fabrica-de-productos-de-limpieza" />; }
