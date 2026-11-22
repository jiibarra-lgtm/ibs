export const faqs = [
  { q: "¿Son fabricantes o distribuidores?", a: "Las dos cosas. Fabricamos la mayoría de nuestros productos y distribuimos el resto, por eso podemos ofrecer precio directo de fábrica y stock permanente." },
  { q: "¿Hacen envíos a todo Buenos Aires y GBA?", a: "Sí. Hacemos entregas programadas en Capital Federal, todo el Gran Buenos Aires y la Provincia de Buenos Aires." },
  { q: "¿Tienen precio mayorista para empresas y hospitales?", a: "Sí, trabajamos con precios mayoristas. Pedí tu cotización sin cargo por WhatsApp." },
  { q: "¿Emiten factura A y B?", a: "Sí. Somos empresa inscripta en ARCA (ex AFIP) y emitimos factura A y B." },
  { q: "¿Cuál es el pedido mínimo?", a: "No exigimos un pedido mínimo fijo. Consultanos por WhatsApp según tu necesidad." },
  { q: "¿Ofrecen dispensers en comodato?", a: "Sí. Cedemos dispensers en comodato a empresas e instituciones que compran los insumos compatibles de forma regular." },
  { q: "¿Cuánto tarda la entrega?", a: "Entre 24 y 48 horas hábiles en CABA y GBA." },
  { q: "¿Qué medios de pago aceptan?", a: "Transferencia bancaria, cheque y efectivo. Para cuentas corrientes ofrecemos financiación a 30, 60 y 90 días." },
  { q: "¿Trabajan con organismos públicos?", a: "Sí. Somos proveedores del Gobierno de la Ciudad de Buenos Aires y participamos en compras públicas (BAC, Convenios Marco)." },
];

export const glosario = [
  { t: "Dispenser en comodato", d: "Equipo cedido en préstamo sin costo a cambio del consumo regular de los insumos compatibles." },
  { t: "Toallas intercaladas", d: "Toallas de papel dobladas en Z o V que salen de a una, lo que reduce el consumo." },
  { t: "Lavandina concentrada", d: "Hipoclorito de sodio de alta concentración. Se diluye antes de usar y rinde más por litro." },
  { t: "Desengrasante industrial", d: "Producto de alta potencia para quitar grasa en cocinas industriales y superficies duras." },
  { t: "Papel tissue institucional", d: "Papel de mayor gramaje para baños de empresas, hospitales y espacios de alto tránsito." },
  { t: "Jabón líquido antibacterial", d: "Jabón con agentes bactericidas, apto para salud, gastronomía e industria." },
];

export const ventajas = [
  { icono: "🏭", t: "Fabricantes y distribuidores", d: "Fabricamos la mayoría de lo que vendemos: precio directo de fábrica y calidad controlada." },
  { icono: "🏆", t: "Más de 40 años", d: "Empresa familiar desde 1985. Trayectoria y respaldo en cada entrega." },
  { icono: "🚚", t: "Entrega programada", d: "Stock permanente y reparto propio en CABA y GBA, de lunes a viernes." },
  { icono: "🤝", t: "Asesoramiento", d: "Te ayudamos a armar el pedido según el tipo de institución y consumo." },
  { icono: "💰", t: "Precio mayorista", d: "Condiciones para hospitales, empresas, consorcios y comercios." },
];

export const compat = {
  toallas: {
    icono: "🧻", nombre: "Dispenser de toallas",
    items: [
      { nombre: "Toallas intercaladas Z", detalle: "Hoja simple o doble.", estado: "ok" },
      { nombre: "Toallas intercaladas V", detalle: "Ideal para dispensers de apertura frontal.", estado: "ok" },
      { nombre: "Toallas en bobina", detalle: "Solo con dispensers de bobina.", estado: "warn" },
    ],
    wa: "Hola! Quiero cotizar toallas para dispenser.",
  },
  jabon: {
    icono: "🧴", nombre: "Dispenser de jabón",
    items: [
      { nombre: "Jabón líquido 1 L", detalle: "Para dispensers de tapa rosca.", estado: "ok" },
      { nombre: "Jabón líquido 5 L", detalle: "Recarga para dispensers de carga trasera.", estado: "ok" },
      { nombre: "Jabón espuma 800 ml", detalle: "Solo para dispensers de espuma.", estado: "warn" },
    ],
    wa: "Hola! Quiero cotizar jabón líquido para dispenser.",
  },
  papel: {
    icono: "🚻", nombre: "Dispenser de papel higiénico",
    items: [
      { nombre: "Papel higiénico jumbo", detalle: "Para dispensers jumbo.", estado: "ok" },
      { nombre: "Papel higiénico doble hoja", detalle: "Dispensers domésticos e institucionales básicos.", estado: "ok" },
      { nombre: "Jumbo de alta capacidad", detalle: "Solo dispensers jumbo de alta capacidad.", estado: "warn" },
    ],
    wa: "Hola! Quiero cotizar papel higiénico para dispenser.",
  },
  alcohol: {
    icono: "🧪", nombre: "Dispenser de alcohol en gel",
    items: [
      { nombre: "Alcohol en gel 500 ml", detalle: "Palanca o sensor automático.", estado: "ok" },
      { nombre: "Alcohol en gel 5 L", detalle: "Bidón para dispensers institucionales.", estado: "ok" },
      { nombre: "Alcohol al 70% líquido", detalle: "No es compatible con dispensers de gel.", estado: "no" },
    ],
    wa: "Hola! Quiero cotizar alcohol en gel para dispenser.",
  },
} as const;
