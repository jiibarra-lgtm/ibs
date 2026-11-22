// Página pilar SEO (archivo nuevo). Contenido en lib/seo/landings.ts
import SeoLanding, { landingMetadata } from "@/components/seo/SeoLanding";

export const metadata = landingMetadata("proveedor-de-limpieza-para-consorcios");
export default function Page() { return <SeoLanding slug="proveedor-de-limpieza-para-consorcios" />; }
