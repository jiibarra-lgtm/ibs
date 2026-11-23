/**
 * Páginas pilar de posicionamiento (SEO / AEO / GEO).
 * ARCHIVO NUEVO — no reemplaza ni modifica páginas existentes.
 * Todo el contenido usa solo datos reales de la empresa (lib/site.ts, FAQ y catálogo).
 */

export type Seccion = { h2: string; p?: string; items?: string[]; link?: { href: string; label: string } };
export type Tabla = { titulo: string; columnas: string[]; filas: string[][] };
export type Landing = {
  slug: string;
  title: string; // <= 60 caracteres aprox.
  description: string; // <= 155 caracteres aprox.
  h1: string;
  eyebrow: string;
  respuesta: string; // respuesta directa (AEO): primer párrafo
  secciones: Seccion[];
  tabla?: Tabla;
  productos: string[];
  categorias: string[];
  kits: string[];
  guias: string[];
  relacionadas: string[]; // otras landings
  faqs: { q: string; a: string }[];
  keywords: string[]; // solo documentación interna / mapa de palabras clave
};

const COMO_TRABAJAMOS: Seccion = {
  h2: "Cómo trabajamos",
  items: [
    "Fabricantes y distribuidores: fabricamos la mayoría de nuestros productos y distribuimos el resto.",
    "Entregas en 24 a 48 horas hábiles en CABA y GBA, con reparto propio.",
    "Factura A y B. Pago por transferencia, cheque o efectivo; financiación a 30, 60 y 90 días para cuentas corrientes.",
    "Sin pedido mínimo fijo. Cotización por WhatsApp con precios mayoristas.",
    "Dispensers en comodato para clientes con consumo regular.",
    "Empresa familiar desde 1985, proveedora de hospitales, empresas, consorcios y del Gobierno de la Ciudad de Buenos Aires.",
  ],
};

export const landings: Landing[] = [
  {
    slug: "productos-de-limpieza-por-mayor",
    title: "Productos de limpieza por mayor en Bs. As.",
    description: "Productos de limpieza por mayor de fabricación propia: papeles, químicos, dispensers y descartables. Entrega 24–48 hs en CABA y GBA. Factura A y B.",
    h1: "Productos de limpieza por mayor",
    eyebrow: "Mayorista · Fabricantes y distribuidores",
    respuesta: "Ibarra Insumos vende productos de limpieza por mayor en CABA y Gran Buenos Aires: papeles institucionales, químicos de limpieza, dispensers y descartables. Somos fabricantes y distribuidores desde 1985, entregamos en 24 a 48 horas hábiles y facturamos A y B, sin pedido mínimo fijo.",
    secciones: [
      { h2: "Qué productos de limpieza vendemos por mayor", items: ["Papeles: toallas intercaladas, toalla en rollo, bobinas y papel higiénico jumbo y en bulto.", "Químicos: lavandina concentrada, cloro, detergente y desengrasante profesional, limpiadores multiuso y limpiavidrios.", "Dispensers de toallas, papel higiénico, jabón y alcohol en gel, también en comodato.", "Higiene: alcohol en gel, alcohol al 70%, jabón y artículos de higiene de manos.", "Elementos y descartables: escobillones, baldes, trapos de piso, esponjas, guantes y señalización."] },
      { h2: "Ventajas de comprar directo a fabricante", p: "Al fabricar la mayoría de lo que vendemos, controlamos la calidad y podemos ofrecer precio directo, sin intermediarios. Además, el descuento por cantidad se aplica automáticamente en la cotización según las unidades de cada producto." },
      COMO_TRABAJAMOS,
    ],
    tabla: { titulo: "Por mayor vs. compra minorista", columnas: ["", "Compra por mayor", "Compra minorista"], filas: [["Presentaciones", "Bultos, cajas y bidones", "Unidades sueltas"], ["Precio", "Mayorista, con descuento por cantidad", "Precio de lista"], ["Facturación", "Factura A y B", "Generalmente B o ticket"], ["Entrega", "Reparto programado 24–48 hs (CABA y GBA)", "Retiro o envío puntual"], ["Dispensers", "Comodato con consumo regular", "Compra del equipo"]] },
    productos: ["toallas-intercaladas", "papel-higienico-jumbo", "lavandina-concentrada", "desengrasante-profesional", "alcohol-en-gel-5-litros", "dispenser-toallas-intercaladas", "guantes-industriales", "detergente-profesional"],
    categorias: ["dispensers", "papeles", "limpieza", "limpieza-institucional", "higiene", "descartables"],
    kits: ["kit-bano-institucional", "kit-fabrica", "kit-comercio"],
    guias: ["cuanto-papel-higienico-necesita-una-institucion", "lavandina-concentrada-como-leer-el-rotulo"],
    relacionadas: ["fabrica-de-productos-de-limpieza", "higiene-institucional", "distribuidora-de-limpieza-en-caba-y-gba"],
    faqs: [
      { q: "¿Hay pedido mínimo para comprar por mayor?", a: "No exigimos un pedido mínimo fijo. Las condiciones mayoristas y los descuentos por cantidad se confirman en la cotización." },
      { q: "¿Venden productos de limpieza por mayor a particulares?", a: "Sí. Trabajamos principalmente con empresas e instituciones, pero cualquier cliente puede pedir cotización por WhatsApp." },
      { q: "¿En cuánto tiempo entregan?", a: "Entre 24 y 48 horas hábiles en CABA y GBA, con reparto propio." },
      { q: "¿Qué medios de pago aceptan?", a: "Transferencia bancaria, cheque y efectivo. Para cuentas corrientes ofrecemos financiación a 30, 60 y 90 días." },
    ],
    keywords: ["productos de limpieza por mayor", "mayorista de limpieza", "artículos de limpieza por mayor", "insumos de limpieza mayorista", "productos de limpieza al por mayor buenos aires"],
  },
  {
    slug: "fabrica-de-productos-de-limpieza",
    title: "Fábrica de productos de limpieza",
    description: "Somos fábrica y distribuidora de productos de limpieza en Buenos Aires. Precio directo de fábrica para empresas, instituciones y revendedores.",
    h1: "Fábrica y distribuidora de productos de limpieza",
    eyebrow: "Fabricantes y distribuidores desde 1985",
    respuesta: "Ibarra Insumos es fabricante y distribuidor de productos de limpieza en Buenos Aires: fabricamos la mayoría de los productos que vendemos y distribuimos el resto de la línea institucional. Vendemos directo de fábrica a empresas, instituciones, comercios y organismos públicos de CABA y GBA.",
    secciones: [
      { h2: "Fabricante y distribuidor: qué significa para tu compra", items: ["Precio directo, sin intermediarios en los productos de fabricación propia.", "Calidad controlada en origen y continuidad de stock.", "Una sola orden para productos propios y complementarios de distribución.", "Atención directa con quien fabrica: consultas técnicas, presentaciones y volúmenes."] },
      { h2: "Para quién fabricamos y distribuimos", items: ["Hospitales, clínicas y centros de salud.", "Organismos públicos (compras por BAC y Convenios Marco).", "Empresas, oficinas e industrias.", "Consorcios y administraciones.", "Gastronomía, hotelería, escuelas y comercios."] },
      COMO_TRABAJAMOS,
    ],
    productos: ["lavandina-concentrada", "desengrasante-profesional", "detergente-profesional", "limpiador-multiuso", "cloro", "toallas-intercaladas"],
    categorias: ["limpieza", "limpieza-institucional", "papeles"],
    kits: ["kit-fabrica", "kit-consorcio"],
    guias: ["lavandina-concentrada-como-leer-el-rotulo"],
    relacionadas: ["productos-de-limpieza-por-mayor", "productos-de-limpieza-industrial", "distribuidora-de-limpieza-en-caba-y-gba"],
    faqs: [
      { q: "¿Ibarra Insumos fabrica sus productos?", a: "Sí. Fabricamos la mayoría de los productos que vendemos y distribuimos el resto de la línea de limpieza e higiene institucional." },
      { q: "¿Venden a revendedores y comercios?", a: "Sí. Consultanos por WhatsApp las condiciones mayoristas según el volumen." },
      { q: "¿Dónde están ubicados?", a: "En Parque Avellaneda, Ciudad Autónoma de Buenos Aires, con reparto propio en CABA, GBA y Provincia." },
    ],
    keywords: ["fábrica de productos de limpieza", "fabricante de productos de limpieza", "productos de limpieza directo de fábrica", "fábrica de artículos de limpieza buenos aires", "distribuidora de productos de limpieza"],
  },
  {
    slug: "higiene-institucional",
    title: "Higiene institucional: insumos por mayor",
    description: "Insumos de higiene institucional: toallas, papel jumbo, jabón, alcohol en gel y dispensers en comodato. Fabricantes y distribuidores. CABA y GBA.",
    h1: "Higiene institucional",
    eyebrow: "Baños, manos y espacios comunes",
    respuesta: "La higiene institucional es el conjunto de insumos y equipos que mantienen limpios e higiénicos los baños, las manos y los espacios comunes de empresas, hospitales, escuelas y organismos. Incluye papeles institucionales, jabón, alcohol en gel, dispensers y productos de desinfección para alto tránsito.",
    secciones: [
      { h2: "Qué incluye un sistema de higiene institucional", items: ["Secado de manos: toallas intercaladas, en rollo o bobina, con su dispenser.", "Papel higiénico jumbo o en bulto, con dispensers de alta capacidad.", "Higiene de manos: jabón y alcohol en gel con dispensers recargables.", "Desinfección de superficies: lavandina concentrada y limpiadores.", "Señalización y elementos para el equipo de limpieza."] },
      { h2: "Por qué conviene un sistema con dispensers", p: "Los dispensers controlan el consumo (las toallas intercaladas salen de a una), reducen el desperdicio y hacen previsible la reposición. Con consumo regular, los cedemos en comodato." },
      COMO_TRABAJAMOS,
    ],
    tabla: { titulo: "Qué recarga va con cada dispenser", columnas: ["Dispenser", "Recarga compatible"], filas: [["Toallas intercaladas", "Toallas intercaladas en Z o V"], ["Toalla en rollo", "Toalla en rollo para dispenser"], ["Papel higiénico jumbo", "Rollos de papel higiénico jumbo"], ["Jabón", "Jabón líquido según tipo de carga"], ["Alcohol en gel", "Alcohol en gel (no alcohol líquido al 70%)"]] },
    productos: ["dispenser-toallas-intercaladas", "toallas-intercaladas", "dispenser-papel-higienico-jumbo", "papel-higienico-jumbo", "dispenser-jabon-inox", "alcohol-en-gel-5-litros"],
    categorias: ["dispensers", "papeles", "higiene"],
    kits: ["kit-bano-institucional", "kit-equipamiento-bano", "kit-salud"],
    guias: ["toallas-intercaladas-rollo-o-bobina", "dispensers-en-comodato-como-funciona", "cuanto-papel-higienico-necesita-una-institucion"],
    relacionadas: ["dispensers-en-comodato", "insumos-de-limpieza-para-hospitales", "insumos-de-limpieza-para-empresas"],
    faqs: [
      { q: "¿Qué es la higiene institucional?", a: "Son los insumos y equipos para baños, manos y espacios comunes de instituciones: papeles, jabón, alcohol en gel, dispensers y productos de desinfección." },
      { q: "¿Cuál es la diferencia entre higiene institucional y doméstica?", a: "La institucional usa presentaciones de mayor rendimiento (rollos jumbo, bidones, cajas) y dispensers que controlan el consumo en espacios de alto tránsito." },
      { q: "¿Dan los dispensers en comodato?", a: "Sí, a clientes con consumo regular de los insumos compatibles." },
    ],
    keywords: ["higiene institucional", "insumos de higiene institucional", "productos de higiene institucional", "higiene institucional por mayor", "papel institucional"],
  },
  {
    slug: "dispensers-en-comodato",
    title: "Dispensers en comodato para empresas",
    description: "Dispensers de toallas, papel higiénico, jabón y alcohol en gel en comodato, comprando los insumos compatibles. CABA y GBA. Pedí tu propuesta.",
    h1: "Dispensers en comodato",
    eyebrow: "Sin costo de equipo",
    respuesta: "Un dispenser en comodato es un equipo que el proveedor cede en préstamo sin costo, a cambio de que la institución compre regularmente los insumos compatibles. Ibarra Insumos ofrece dispensers de toallas, papel higiénico, jabón y alcohol en gel en comodato para empresas e instituciones de CABA y GBA.",
    secciones: [
      { h2: "Cómo funciona el comodato", items: ["Nos contás cuántos baños tenés y cuánta gente circula.", "Te proponemos los dispensers adecuados.", "Los entregamos con las primeras recargas.", "Reponés los insumos con nosotros de forma regular."] },
      { h2: "Qué tenés que saber", items: ["Los dispensers siguen siendo del proveedor; si se discontinúa la compra se coordina la devolución.", "Las recargas deben ser compatibles con el modelo.", "Podés pedir etiquetas con el nombre de tu empresa para los dispensers."] },
      COMO_TRABAJAMOS,
    ],
    productos: ["dispenser-toallas-intercaladas", "dispenser-papel-higienico-jumbo", "dispenser-jabon-inox", "dispenser-jabon-tecla", "dispenser-toalla-en-rollo", "dispenser-porta-bobina"],
    categorias: ["dispensers"],
    kits: ["kit-equipamiento-bano", "kit-bano-institucional"],
    guias: ["dispensers-en-comodato-como-funciona", "toallas-intercaladas-rollo-o-bobina"],
    relacionadas: ["higiene-institucional", "insumos-de-limpieza-para-empresas"],
    faqs: [
      { q: "¿Qué significa dispenser en comodato?", a: "Que el proveedor presta el dispenser sin costo y la institución compra con él los insumos compatibles de forma regular." },
      { q: "¿Quién puede pedir dispensers en comodato?", a: "Empresas, hospitales, escuelas, consorcios y comercios con consumo regular de insumos." },
      { q: "¿Qué pasa si dejo de comprar los insumos?", a: "Se coordina la devolución de los dispensers, que siguen siendo del proveedor." },
    ],
    keywords: ["dispenser en comodato", "dispensers en comodato", "comodato de dispensers", "dispenser papel higiénico comodato", "dispenser toallas intercaladas comodato"],
  },
  {
    slug: "insumos-de-limpieza-para-hospitales",
    title: "Insumos de limpieza e higiene para hospitales",
    description: "Insumos de limpieza para hospitales, clínicas y consultorios: alcohol en gel, papeles, lavandina y dispensers. Proveedores de instituciones de salud.",
    h1: "Insumos de limpieza para hospitales y clínicas",
    eyebrow: "Instituciones de salud",
    respuesta: "Ibarra Insumos provee insumos de limpieza e higiene a hospitales públicos y privados, clínicas, consultorios y geriátricos de CABA y GBA: alcohol en gel y al 70%, papeles institucionales, lavandina concentrada, guantes y dispensers. Los protocolos de limpieza y desinfección los define cada institución; nosotros abastecemos los insumos.",
    secciones: [
      { h2: "Insumos más pedidos por instituciones de salud", items: ["Alcohol en gel en bidón para recarga de dispensers y alcohol al 70% líquido.", "Toallas intercaladas y papel higiénico jumbo.", "Lavandina concentrada para desinfección de superficies, según rótulo.", "Guantes y elementos para el equipo de limpieza.", "Dispensers de jabón, alcohol en gel y papeles."] },
      { h2: "Compras públicas", p: "Somos proveedores del Gobierno de la Ciudad de Buenos Aires y participamos en compras públicas (BAC y Convenios Marco). Emitimos factura A y B." },
      { h2: "Bolsas mortuorias (bolsas de óbito)", p: "También vendemos por mayor bolsas mortuorias de PVC para instituciones de salud: adulto, adulto obeso (PVC reforzado), pediátrica y neonatal, en negro y en rojo. El rojo se usa en protocolos de patologías infectocontagiosas. Tienen su propio catálogo con cotización.", link: { href: "https://www.bolsasmortuoriasibarra.com.ar/", label: "Ver bolsas mortuorias por mayor" } },
      COMO_TRABAJAMOS,
    ],
    productos: ["alcohol-en-gel-5-litros", "alcohol-70-bidon", "toallas-intercaladas", "papel-higienico-jumbo", "lavandina-concentrada", "guantes-domesticos"],
    categorias: ["higiene", "papeles", "dispensers"],
    kits: ["kit-salud", "kit-bano-institucional"],
    guias: ["lavandina-concentrada-como-leer-el-rotulo", "cuanto-papel-higienico-necesita-una-institucion"],
    relacionadas: ["higiene-institucional", "dispensers-en-comodato"],
    faqs: [
      { q: "¿Proveen a hospitales públicos?", a: "Sí. Somos proveedores del Gobierno de la Ciudad de Buenos Aires y participamos en compras públicas (BAC y Convenios Marco)." },
      { q: "¿Qué alcohol en gel conviene para dispensers?", a: "Alcohol en gel en bidón para recarga. El alcohol al 70% líquido no es compatible con dispensers de gel." },
      { q: "¿Venden bolsas mortuorias?", a: "Sí, bolsas mortuorias de PVC por mayor en versiones adulto, adulto obeso, pediátrica y neonatal, en negro y en rojo. Se cotizan en bolsasmortuoriasibarra.com.ar o por WhatsApp." },
    ],
    keywords: ["insumos hospitalarios de limpieza", "insumos de limpieza para hospitales", "productos de limpieza para clínicas", "proveedor de limpieza hospitalaria", "alcohol en gel por mayor hospitales"],
  },
  {
    slug: "insumos-de-limpieza-para-gastronomia",
    title: "Insumos de limpieza para gastronomía",
    description: "Desengrasantes, detergentes, bobinas y guantes para restaurantes, bares y comedores. Fabricantes y distribuidores, entrega 24–48 hs en CABA y GBA.",
    h1: "Insumos de limpieza para gastronomía",
    eyebrow: "Restaurantes, bares, comedores y hoteles",
    respuesta: "Para limpiar una cocina gastronómica se necesitan principalmente desengrasante profesional, detergente para vajilla, bobinas de papel, esponjas, guantes y elementos para pisos, además de higiene de manos para el personal y el salón. Ibarra Insumos los vende por mayor con entrega en 24 a 48 horas en CABA y GBA.",
    secciones: [
      { h2: "Insumos por sector", items: ["Cocina: desengrasante profesional, detergente, esponjas, bobinas y guantes.", "Pisos: trapos de piso, baldes, escobillones y señalización de piso mojado.", "Salón y baños: alcohol en gel, toallas, papel higiénico y limpiavidrios."] },
      { h2: "Frecuencias de limpieza", p: "Organizar tareas diarias, semanales y mensuales evita la acumulación de grasa. Seguí siempre las normas de bromatología de tu municipio." },
      COMO_TRABAJAMOS,
    ],
    productos: ["desengrasante-profesional", "detergente-profesional", "toalla-en-bobina", "esponja", "guantes-industriales", "cono-piso-mojado"],
    categorias: ["limpieza", "limpieza-institucional", "descartables"],
    kits: ["kit-restaurante", "kit-cocina"],
    guias: ["checklist-limpieza-restaurante"],
    relacionadas: ["productos-de-limpieza-por-mayor", "productos-de-limpieza-industrial"],
    faqs: [
      { q: "¿Qué producto se usa para desengrasar una cocina industrial?", a: "Un desengrasante profesional, aplicado según las indicaciones del rótulo sobre campanas, planchas y superficies con grasa." },
      { q: "¿Tienen un kit para restaurantes?", a: "Sí, el Kit Restaurante reúne cocina, salón y baño con descuento incluido, y se pueden ajustar las cantidades." },
    ],
    keywords: ["insumos de limpieza para gastronomía", "productos de limpieza para restaurantes", "desengrasante para cocina industrial", "limpieza gastronómica", "productos de limpieza para bares"],
  },
  {
    slug: "productos-de-limpieza-industrial",
    title: "Productos de limpieza industrial por mayor",
    description: "Productos de limpieza industrial: desengrasantes, cloro, guantes de alta resistencia, bobinas y elementos. Fabricantes y distribuidores en Buenos Aires.",
    h1: "Productos de limpieza industrial",
    eyebrow: "Plantas, talleres y depósitos",
    respuesta: "Los productos de limpieza industrial son químicos y elementos de alto rendimiento para plantas, talleres y depósitos: desengrasantes, cloro, guantes de alta resistencia, bobinas de papel con soporte, escobillones y baldes. Ibarra Insumos los fabrica y distribuye por mayor en CABA y GBA.",
    secciones: [
      { h2: "Qué incluye la limpieza industrial", items: ["Desengrase de máquinas, pisos y superficies duras.", "Desinfección con cloro según rótulo.", "Protección del personal: guantes industriales.", "Secado y limpieza general: bobinas con porta bobina de pie o pared."] },
      COMO_TRABAJAMOS,
    ],
    productos: ["desengrasante-profesional", "cloro", "guantes-industriales", "toalla-en-bobina", "dispenser-porta-bobina", "escobillon", "balde"],
    categorias: ["limpieza-institucional", "descartables"],
    kits: ["kit-fabrica"],
    guias: ["lavandina-concentrada-como-leer-el-rotulo"],
    relacionadas: ["fabrica-de-productos-de-limpieza", "insumos-de-limpieza-para-empresas"],
    faqs: [
      { q: "¿Qué diferencia hay entre limpieza industrial e institucional?", a: "La industrial apunta a suciedad pesada (grasa, polvo de planta) con productos de alto rendimiento; la institucional, a baños, manos y espacios comunes de alto tránsito." },
    ],
    keywords: ["productos de limpieza industrial", "limpieza industrial por mayor", "desengrasante industrial", "insumos de limpieza para fábricas", "guantes industriales por mayor"],
  },
  {
    slug: "insumos-de-limpieza-para-empresas",
    title: "Insumos de limpieza para empresas y oficinas",
    description: "Proveedor de insumos de limpieza para empresas y oficinas: papeles, higiene de manos, limpiadores y dispensers en comodato. Factura A, CABA y GBA.",
    h1: "Insumos de limpieza para empresas y oficinas",
    eyebrow: "Proveedor corporativo",
    respuesta: "Ibarra Insumos es proveedor de insumos de limpieza para empresas y oficinas en CABA y GBA: papel higiénico y toallas, alcohol en gel, limpiadores, limpiavidrios y dispensers en comodato, con factura A, entrega programada y financiación para cuentas corrientes.",
    secciones: [
      { h2: "Qué necesita una oficina", items: ["Baños: papel higiénico, toallas y jabón con dispensers.", "Higiene de manos en accesos y espacios comunes.", "Superficies y vidrios: limpiador multiuso y limpiavidrios.", "Elementos para el personal de limpieza."] },
      { h2: "Compras recurrentes sin faltantes", p: "Podés armar un pedido programado para recibir los mismos insumos cada 15 días, todos los meses o cada dos meses, y ajustarlo antes de cada entrega." },
      COMO_TRABAJAMOS,
    ],
    productos: ["papel-higienico-48-rollos", "toallas-intercaladas", "alcohol-en-gel", "limpiador-multiuso", "limpiavidrios", "dispenser-toallas-intercaladas"],
    categorias: ["papeles", "limpieza", "dispensers"],
    kits: ["kit-oficina", "kit-comercio"],
    guias: ["cuanto-papel-higienico-necesita-una-institucion", "dispensers-en-comodato-como-funciona"],
    relacionadas: ["higiene-institucional", "dispensers-en-comodato"],
    faqs: [
      { q: "¿Emiten factura A a empresas?", a: "Sí, emitimos factura A y B." },
      { q: "¿Pueden entregar todos los meses?", a: "Sí, con un pedido programado cada 15 días, mensual o bimestral." },
    ],
    keywords: ["productos de limpieza para empresas", "insumos de limpieza para oficinas", "proveedor de productos de limpieza", "proveedor de limpieza para empresas", "artículos de limpieza para oficinas"],
  },
  {
    slug: "proveedor-de-limpieza-para-consorcios",
    title: "Proveedor de limpieza para consorcios",
    description: "Insumos de limpieza para consorcios: lavandina concentrada, limpiadores, trapos, escobillones y baldes por mayor. Factura a nombre del consorcio.",
    h1: "Proveedor de insumos de limpieza para consorcios",
    eyebrow: "Administraciones y encargados",
    respuesta: "Un consorcio necesita principalmente limpiador para pisos, lavandina, trapos de piso, escobillones, baldes y limpiavidrios. Comprarlos en una orden mensual por mayor baja el costo; Ibarra Insumos factura a nombre del consorcio y entrega en CABA y GBA.",
    secciones: [
      { h2: "Lo básico de un edificio", items: ["Palieres y halls: limpiador multiuso.", "Cocheras, residuos y áreas comunes: lavandina concentrada.", "Trapos de piso, escobillones y baldes.", "Entrada y ascensores: limpiavidrios."] },
      COMO_TRABAJAMOS,
    ],
    productos: ["lavandina-concentrada", "limpiador-multiuso", "trapo-de-piso", "escobillon", "balde", "limpiavidrios"],
    categorias: ["limpieza", "limpieza-institucional"],
    kits: ["kit-consorcio"],
    guias: ["insumos-de-limpieza-para-consorcios", "lavandina-concentrada-como-leer-el-rotulo"],
    relacionadas: ["productos-de-limpieza-por-mayor", "distribuidora-de-limpieza-en-caba-y-gba"],
    faqs: [
      { q: "¿Facturan a nombre del consorcio?", a: "Sí, emitimos factura A o B a nombre del consorcio." },
      { q: "¿Cómo calculo cuánto comprar por mes?", a: "Anotá durante un mes qué se termina y armá un pedido fijo con esas cantidades; después podés programarlo." },
    ],
    keywords: ["productos de limpieza para consorcios", "insumos de limpieza para edificios", "proveedor de limpieza para consorcios", "lavandina por mayor consorcios"],
  },
  {
    slug: "insumos-de-limpieza-para-escuelas",
    title: "Insumos de limpieza para escuelas e institutos",
    description: "Insumos de limpieza e higiene para escuelas, jardines e institutos: papel, jabón, alcohol en gel y lavandina por mayor. CABA y GBA.",
    h1: "Insumos de limpieza para escuelas",
    eyebrow: "Escuelas, jardines e institutos",
    respuesta: "Las escuelas necesitan sobre todo papel higiénico y toallas, jabón y alcohol en gel para la higiene de manos, y lavandina y trapos para aulas y baños. Ibarra Insumos los vende por mayor con entrega en CABA y GBA y factura A o B.",
    secciones: [
      { h2: "Insumos por espacio", items: ["Baños: papel higiénico, toallas y jabón.", "Aulas y pasillos: lavandina concentrada, trapos de piso y baldes.", "Accesos y comedor: alcohol en gel."] },
      COMO_TRABAJAMOS,
    ],
    productos: ["papel-higienico-48-rollos", "toallas-intercaladas", "jabon-en-pan", "alcohol-en-gel", "lavandina-concentrada", "trapo-de-piso"],
    categorias: ["papeles", "higiene", "limpieza"],
    kits: ["kit-escuela"],
    guias: ["cuanto-papel-higienico-necesita-una-institucion"],
    relacionadas: ["higiene-institucional", "insumos-de-limpieza-para-empresas"],
    faqs: [{ q: "¿Tienen un kit para escuelas?", a: "Sí, el Kit Escuela reúne papeles, higiene de manos y limpieza de aulas con descuento incluido." }],
    keywords: ["productos de limpieza para escuelas", "insumos de limpieza para colegios", "higiene escolar por mayor"],
  },
  {
    slug: "distribuidora-de-limpieza-en-caba-y-gba",
    title: "Distribuidora de limpieza en CABA y GBA",
    description: "Distribuidora de productos de limpieza con reparto propio en CABA, zona sur, oeste y norte del GBA. Entrega 24–48 hs hábiles. Desde Parque Avellaneda.",
    h1: "Distribuidora de productos de limpieza en CABA y GBA",
    eyebrow: "Cobertura y entregas",
    respuesta: "Ibarra Insumos es una distribuidora y fábrica de productos de limpieza ubicada en Parque Avellaneda (CABA), con reparto propio en toda la Ciudad de Buenos Aires, el Gran Buenos Aires y la Provincia de Buenos Aires. En CABA y GBA entregamos en 24 a 48 horas hábiles, de lunes a viernes.",
    secciones: [
      { h2: "Dónde entregamos", items: ["Ciudad Autónoma de Buenos Aires: todos los barrios.", "Gran Buenos Aires: zona sur, zona oeste y zona norte.", "Provincia de Buenos Aires: entregas programadas (consultá plazos)."] },
      { h2: "Horarios y contacto", items: ["Atención de lunes a viernes de 8 a 17 hs.", "Cotizaciones por WhatsApp al +54 11 4440-2807.", "Email: info@ibarrainsumos.com.ar"] },
      COMO_TRABAJAMOS,
    ],
    productos: ["toallas-intercaladas", "papel-higienico-jumbo", "lavandina-concentrada", "alcohol-en-gel-5-litros"],
    categorias: ["papeles", "limpieza", "higiene"],
    kits: ["kit-bano-institucional", "kit-consorcio"],
    guias: [],
    relacionadas: ["productos-de-limpieza-por-mayor", "fabrica-de-productos-de-limpieza"],
    faqs: [
      { q: "¿Hacen envíos a zona sur, oeste y norte?", a: "Sí, con reparto propio en todo el Gran Buenos Aires y entregas en 24 a 48 horas hábiles." },
      { q: "¿Dónde están ubicados?", a: "En Parque Avellaneda, Ciudad Autónoma de Buenos Aires." },
    ],
    keywords: ["distribuidora de limpieza caba", "distribuidora de productos de limpieza zona sur", "productos de limpieza zona oeste", "mayorista de limpieza gba", "distribuidora de limpieza parque avellaneda"],
  },
];

export const getLanding = (slug: string) => landings.find((l) => l.slug === slug) ?? null;
