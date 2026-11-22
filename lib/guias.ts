import guias from "@/data/guias.json";
export type Guia = { slug: string; titulo: string; resumen: string; categoria: string; fecha: string; minutos: number; imagen: string; productos: string[]; kit?: string; contenido: string };
export async function getGuias(): Promise<Guia[]> { return (guias as Guia[]).slice().sort((a, b) => b.fecha.localeCompare(a.fecha)); }
export async function getGuia(slug: string) { return (await getGuias()).find((g) => g.slug === slug) ?? null; }
