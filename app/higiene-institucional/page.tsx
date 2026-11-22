// Página pilar SEO (archivo nuevo). Contenido en lib/seo/landings.ts
import SeoLanding, { landingMetadata } from "@/components/seo/SeoLanding";

export const metadata = landingMetadata("higiene-institucional");
export default function Page() { return <SeoLanding slug="higiene-institucional" />; }
