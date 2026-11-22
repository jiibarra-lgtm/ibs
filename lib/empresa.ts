import data from "@/data/empresa.json";

export type Novedad = { slug: string; fecha: string; titulo: string; resumen: string; imagen: string; video?: string; texto: string };
export type Miembro = { nombre: string; rol: string; foto: string };
export type Cliente = { nombre: string; logo: string };

export const redes = data.redes as Record<string, string>;
export const sameAs = Object.values(redes).filter(Boolean);
export const googleResenasUrl = data.googleResenasUrl as string;
export const equipo = data.equipo as Miembro[];
export const clientes = data.clientes as Cliente[];
export const hitos = data.hitos as { anio: string; titulo: string; texto: string }[];
export const novedades = (data.novedades as Novedad[]).slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
export const getNovedad = (slug: string) => novedades.find((n) => n.slug === slug);
export const fechaLarga = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
