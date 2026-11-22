import { getProductos } from "./catalog";
import { kits } from "./promos";
import type { KitView } from "@/components/KitCard";

export async function getKitViews(): Promise<KitView[]> {
  const prods = await getProductos();
  const by = Object.fromEntries(prods.map((p) => [p.slug, p]));
  return kits.map((k) => ({
    ...k,
    items: k.items.filter((i) => by[i.slug]).map((i) => ({ slug: i.slug, cantidad: i.cantidad, nombre: by[i.slug].nombre, imagen: by[i.slug].imagenes[0] })),
  }));
}
