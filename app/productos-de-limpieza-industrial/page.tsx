// Página pilar SEO (archivo nuevo). Contenido en lib/seo/landings.ts
import SeoLanding, { landingMetadata } from "@/components/seo/SeoLanding";

export const metadata = landingMetadata("productos-de-limpieza-industrial");
export default function Page() { return <SeoLanding slug="productos-de-limpieza-industrial" />; }
