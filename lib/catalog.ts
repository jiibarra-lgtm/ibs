/**
 * Capa de datos del catálogo.
 *
 * Hoy lee los JSON de /data. Cuando conectes Supabase, solo hay que
 * reemplazar el cuerpo de estas funciones (getProductos / getCategorias)
 * por consultas a la base: el resto del sitio no cambia.
 */
import productosData from "@/data/productos.json";
import categoriasData from "@/data/categorias.json";

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
};

export type Categoria = {
  slug: string;
  nombre: string;
  icono: string;
  descripcion: string;
  intro?: string;
  faqs?: { q: string; a: string }[];
};

export async function getProductos(): Promise<Producto[]> {
  return productosData as Producto[];
}

export async function getCategorias(): Promise<Categoria[]> {
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
