/**
 * Capa de datos del catálogo.
 *
 * Lee productos y categorías de Supabase (se actualiza solo al guardar desde el panel).
 * Si la base no responde, usa los JSON de /data como respaldo para que la web nunca se caiga.
 */
import productosData from "@/data/productos.json";
import categoriasData from "@/data/categorias.json";
import { SB_KEY, SB_URL } from "./supabase";

export type Producto = {
  slug: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
  imagenes: string[];
  destacado?: boolean;
  /** Etiqueta en la tarjeta: "Más vendido", "Nuevo", etc. */
  badge?: string;
  /** true si es de fabricación propia (se marca desde el panel) */
  fabricacionPropia?: boolean;
  /** Precio de lista por unidad (opcional). Si está, se muestran precios y totales. */
  precio?: number;
  /** Texto largo para la ficha (SEO) */
  detalle?: string;
  /** Usos recomendados */
  usos?: string[];
  /** false = oculto en la web (se puede volver a mostrar desde el panel) */
  visible?: boolean;
};

export type Categoria = {
  slug: string;
  nombre: string;
  icono: string;
  descripcion: string;
  intro?: string;
  faqs?: { q: string; a: string }[];
};

type Opciones = { todos?: boolean; fresco?: boolean };

async function sb<T>(path: string, o: Opciones = {}): Promise<T | null> {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      headers: { apikey: SB_KEY },
      ...(o.fresco ? { cache: "no-store" as const } : { next: { revalidate: 300, tags: ["catalogo"] } }),
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

type FilaProducto = {
  slug: string | null; nombre: string; descripcion: string | null; categoria: string; subcategoria: string | null;
  imagen_url: string | null; visible: boolean | null; destacado: boolean | null; badge: string | null;
  fabricacion_propia: boolean | null; detalle: string | null; usos: string[] | null; orden: number | null;
  producto_imagenes: { imagen_url: string; orden: number | null }[] | null;
};

const aProducto = (f: FilaProducto): Producto => {
  const extra = (f.producto_imagenes ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).map((x) => x.imagen_url);
  const imagenes = extra.length ? extra : f.imagen_url ? [f.imagen_url] : ["/img/marca/isotipo.webp"];
  return {
    slug: f.slug!, nombre: f.nombre.trim(), descripcion: (f.descripcion ?? "").trim(), categoria: f.categoria,
    ...(f.subcategoria ? { subcategoria: f.subcategoria } : {}), imagenes,
    ...(f.destacado ? { destacado: true } : {}), ...(f.badge ? { badge: f.badge } : {}),
    ...(f.fabricacion_propia ? { fabricacionPropia: true } : {}), ...(f.detalle ? { detalle: f.detalle } : {}),
    ...(f.usos?.length ? { usos: f.usos } : {}), visible: f.visible !== false,
  };
};

export async function getProductos(o: Opciones = {}): Promise<Producto[]> {
  const filtro = o.todos ? "" : "&visible=eq.true";
  const filas = await sb<FilaProducto[]>(`productos?select=slug,nombre,descripcion,categoria,subcategoria,imagen_url,visible,destacado,badge,fabricacion_propia,detalle,usos,orden,producto_imagenes(imagen_url,orden)&slug=not.is.null${filtro}&order=orden.asc,id.asc`, o);
  if (filas && filas.length) return filas.map(aProducto);
  return productosData as Producto[];
}

export async function getCategorias(o: Opciones = {}): Promise<Categoria[]> {
  const filas = await sb<{ slug: string; nombre: string; icono: string | null; descripcion: string | null; intro: string | null; faqs: { q: string; a: string }[] | null }[]>("categorias?select=slug,nombre,icono,descripcion,intro,faqs&slug=not.is.null&order=orden.asc", o);
  if (filas && filas.length) {
    return filas.map((c) => ({ slug: c.slug, nombre: c.nombre, icono: c.icono ?? "📦", descripcion: c.descripcion ?? "", ...(c.intro ? { intro: c.intro } : {}), ...(c.faqs?.length ? { faqs: c.faqs } : {}) }));
  }
  return categoriasData as Categoria[];
}

export async function getProducto(slug: string) {
  return (await getProductos()).find((p) => p.slug === slug) ?? null;
}

export async function getCategoria(slug: string) {
  return (await getCategorias()).find((c) => c.slug === slug) ?? null;
}

export async function getProductosPorCategoria(slug: string) {
  return (await getProductos()).filter((p) => p.categoria === slug);
}

export async function getDestacados() {
  return (await getProductos()).filter((p) => p.destacado);
}
