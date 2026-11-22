// Página pilar SEO (archivo nuevo). Contenido en lib/seo/landings.ts
import SeoLanding, { landingMetadata } from "@/components/seo/SeoLanding";

export const metadata = landingMetadata("distribuidora-de-limpieza-en-caba-y-gba");
export default function Page() { return <SeoLanding slug="distribuidora-de-limpieza-en-caba-y-gba" />; }
