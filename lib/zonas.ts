/**
 * Landings de SEO local por barrio de CABA.
 * Cada página combina datos reales del barrio (comuna, avenidas, distancia a la planta,
 * barrios cercanos) con una búsqueda concreta (producto o rubro), para que no sean copias.
 */
import { escalas, envioGratis } from "@/lib/promos";

export type Barrio = { slug: string; nombre: string; comuna: number; lat: number; lng: number; avenidas: string[]; perfil: string };

const B = (slug: string, nombre: string, comuna: number, lat: number, lng: number, avenidas: string[], perfil: string): Barrio => ({ slug, nombre, comuna, lat, lng, avenidas, perfil });

/** Los 48 barrios oficiales de la Ciudad. Coordenadas aproximadas del centro de cada barrio. */
export const BARRIOS: Barrio[] = [
  B("parque-avellaneda", "Parque Avellaneda", 9, -34.647, -58.479, ["Av. Directorio", "Av. Eva Perón", "Av. Lacarra", "Av. Escalada", "Av. Olivera", "Av. Juan Bautista Alberdi"], "es nuestro barrio: acá están la planta y el depósito de Ibarra Insumos, rodeados de casas, comercios de barrio, escuelas, clubes y talleres"),
  B("flores", "Flores", 7, -34.633, -58.463, ["Av. Rivadavia", "Av. Directorio", "Av. Carabobo", "Av. Nazca"], "es uno de los barrios más grandes y comerciales de la Ciudad, con mucho comercio mayorista y minorista, edificios y escuelas"),
  B("floresta", "Floresta", 10, -34.628, -58.483, ["Av. Rivadavia", "Av. Avellaneda", "Av. Gaona"], "combina el polo comercial de la avenida Avellaneda con calles residenciales y muchos locales y talleres textiles"),
  B("velez-sarsfield", "Vélez Sarsfield", 10, -34.633, -58.493, ["Av. Juan B. Justo", "Av. Rivadavia", "Av. Directorio"], "es un barrio residencial del oeste con clubes, escuelas y comercios de cercanía"),
  B("villa-luro", "Villa Luro", 10, -34.637, -58.503, ["Av. Rivadavia", "Av. Juan B. Justo", "Av. Emilio Castro"], "es un barrio tranquilo de casas bajas, comercios de barrio, clubes y escuelas"),
  B("mataderos", "Mataderos", 9, -34.660, -58.504, ["Av. Lisandro de la Torre", "Av. Directorio", "Av. Eva Perón", "Av. Juan Bautista Alberdi"], "comparte la Comuna 9 con Parque Avellaneda y tiene mucha actividad industrial, frigorífica y comercial"),
  B("villa-lugano", "Villa Lugano", 8, -34.676, -58.473, ["Av. Fernández de la Cruz", "Av. Roca", "Av. Riestra", "Av. Escalada"], "es un barrio extenso del sur de la Ciudad, con grandes complejos de viviendas, escuelas, centros de salud e industrias"),
  B("villa-soldati", "Villa Soldati", 8, -34.664, -58.444, ["Av. Lafuente", "Av. Riestra", "Av. Mariano Acosta", "Av. Fernández de la Cruz"], "tiene una fuerte presencia de depósitos, talleres, escuelas y complejos habitacionales"),
  B("liniers", "Liniers", 9, -34.643, -58.520, ["Av. Rivadavia", "Av. General Paz", "Av. Juan B. Justo"], "es la puerta oeste de la Ciudad, con un centro comercial muy activo junto a la estación y la avenida Rivadavia"),
  B("parque-chacabuco", "Parque Chacabuco", 7, -34.636, -58.437, ["Av. Asamblea", "Av. Eva Perón", "Av. Emilio Mitre", "Av. La Plata"], "es un barrio residencial alrededor de su parque, con muchos edificios, colegios y comercios"),
  B("monte-castro", "Monte Castro", 10, -34.619, -58.507, ["Av. Álvarez Jonte", "Av. Segurola", "Av. Gaona"], "es un barrio residencial del oeste con casas bajas, clubes y comercios de cercanía"),
  B("versalles", "Versalles", 10, -34.630, -58.522, ["Av. General Paz", "Av. Juan B. Justo", "Av. Álvarez Jonte"], "es un barrio residencial chico, pegado a la General Paz, con casas, escuelas y clubes"),
  B("villa-real", "Villa Real", 10, -34.620, -58.524, ["Av. General Paz", "Av. Álvarez Jonte", "Av. Segurola"], "es uno de los barrios más chicos de la Ciudad, residencial y tranquilo, sobre el límite con la provincia"),
  B("villa-riachuelo", "Villa Riachuelo", 8, -34.690, -58.468, ["Av. General Paz", "Av. Fernández de la Cruz", "Av. 27 de Febrero"], "está en el extremo sur de la Ciudad, con el autódromo, industrias y zonas residenciales"),
  B("villa-santa-rita", "Villa Santa Rita", 11, -34.615, -58.481, ["Av. Álvarez Jonte", "Av. Gaona", "Av. Juan B. Justo"], "es un barrio residencial chico, de casas bajas, comercios de barrio y escuelas"),
  B("villa-general-mitre", "Villa General Mitre", 11, -34.611, -58.469, ["Av. San Martín", "Av. Gaona", "Av. Juan B. Justo"], "es un barrio residencial con comercios sobre sus avenidas y muchas escuelas y clubes"),
  B("villa-del-parque", "Villa del Parque", 11, -34.604, -58.491, ["Av. San Martín", "Av. Nazca", "Av. Álvarez Jonte"], "es un barrio residencial con un centro comercial propio, escuelas, clubes y la Facultad de Agronomía cerca"),
  B("villa-devoto", "Villa Devoto", 11, -34.601, -58.513, ["Av. Francisco Beiró", "Av. San Martín", "Av. Nazca"], "es un barrio residencial de casas amplias, con muchos colegios, clubes y comercios"),
  B("caballito", "Caballito", 6, -34.618, -58.443, ["Av. Rivadavia", "Av. Pedro Goyena", "Av. La Plata", "Av. Acoyte"], "es el centro geográfico de la Ciudad, muy poblado, con miles de edificios de departamentos, colegios, consultorios y comercios"),
  B("boedo", "Boedo", 5, -34.630, -58.418, ["Av. Boedo", "Av. San Juan", "Av. La Plata"], "es un barrio tradicional, con muchos bares, comercios, edificios y escuelas"),
  B("almagro", "Almagro", 5, -34.607, -58.421, ["Av. Rivadavia", "Av. Corrientes", "Av. Medrano"], "es un barrio muy denso, con edificios, gastronomía, institutos educativos y comercios"),
  B("nueva-pompeya", "Nueva Pompeya", 4, -34.650, -58.418, ["Av. Sáenz", "Av. Amancio Alcorta", "Av. Perito Moreno"], "tiene mucha actividad comercial, talleres e industrias, además de su zona residencial"),
  B("parque-patricios", "Parque Patricios", 4, -34.637, -58.401, ["Av. Caseros", "Av. Jujuy", "Av. Almafuerte"], "alberga el Distrito Tecnológico, con empresas y oficinas, además de hospitales, escuelas y zonas residenciales"),
  B("barracas", "Barracas", 4, -34.645, -58.381, ["Av. Montes de Oca", "Av. Regimiento de Patricios", "Av. Vélez Sarsfield"], "combina depósitos, industrias y oficinas con zonas residenciales y varios hospitales"),
  B("la-boca", "La Boca", 4, -34.634, -58.363, ["Av. Almirante Brown", "Av. Regimiento de Patricios", "Av. Pedro de Mendoza"], "es un barrio turístico y portuario, con gastronomía, comercios, clubes y viviendas"),
  B("constitucion", "Constitución", 1, -34.627, -58.384, ["Av. Brasil", "Av. Caseros", "Av. Entre Ríos"], "es un nudo de transporte con mucho comercio, hoteles, oficinas y edificios"),
  B("san-cristobal", "San Cristóbal", 3, -34.624, -58.401, ["Av. San Juan", "Av. Independencia", "Av. Entre Ríos", "Av. Jujuy"], "es un barrio céntrico y denso, con comercios, talleres, edificios y escuelas"),
  B("balvanera", "Balvanera", 3, -34.609, -58.405, ["Av. Rivadavia", "Av. Corrientes", "Av. Pueyrredón", "Av. Callao"], "incluye Once y el Abasto: una de las zonas comerciales mayoristas más grandes del país, con oficinas, edificios y escuelas"),
  B("san-telmo", "San Telmo", 1, -34.621, -58.372, ["Av. Paseo Colón", "Av. San Juan", "Av. Independencia"], "es un barrio histórico y turístico, con gastronomía, hostels, ferias, oficinas y edificios"),
  B("monserrat", "Monserrat", 1, -34.613, -58.381, ["Av. de Mayo", "Av. Belgrano", "Av. 9 de Julio"], "es el casco histórico, con organismos públicos, oficinas, hoteles y gastronomía"),
  B("san-nicolas", "San Nicolás", 1, -34.603, -58.380, ["Av. Corrientes", "Av. 9 de Julio", "Av. Córdoba"], "es el microcentro: miles de oficinas, bancos, organismos públicos, teatros, hoteles y comercios"),
  B("puerto-madero", "Puerto Madero", 1, -34.611, -58.362, ["Av. Alicia Moreau de Justo", "Av. Ingeniero Huergo"], "concentra torres de oficinas, hoteles, restaurantes y edificios de alta gama"),
  B("retiro", "Retiro", 1, -34.590, -58.375, ["Av. del Libertador", "Av. Santa Fe", "Av. Leandro N. Alem"], "reúne oficinas corporativas, hoteles, embajadas, terminales de transporte y edificios"),
  B("recoleta", "Recoleta", 2, -34.588, -58.397, ["Av. Santa Fe", "Av. Callao", "Av. Pueyrredón", "Av. Las Heras"], "es un barrio muy denso de edificios, consorcios, clínicas, consultorios, hoteles y gastronomía"),
  B("palermo", "Palermo", 14, -34.580, -58.425, ["Av. Santa Fe", "Av. Córdoba", "Av. Scalabrini Ortiz", "Av. del Libertador"], "es el barrio más grande de la Ciudad, con muchísima gastronomía, oficinas, hoteles, consorcios y clínicas"),
  B("villa-crespo", "Villa Crespo", 15, -34.598, -58.438, ["Av. Corrientes", "Av. Warnes", "Av. Scalabrini Ortiz", "Av. Juan B. Justo"], "combina outlets textiles, gastronomía, talleres y muchos edificios"),
  B("chacarita", "Chacarita", 15, -34.587, -58.454, ["Av. Corrientes", "Av. Federico Lacroze", "Av. Guzmán", "Av. Dorrego"], "es un barrio en crecimiento, con gastronomía, oficinas, talleres y edificios nuevos"),
  B("colegiales", "Colegiales", 13, -34.574, -58.450, ["Av. Federico Lacroze", "Av. Elcano", "Av. Álvarez Thomas"], "es residencial, con casas, edificios, productoras, colegios y gastronomía"),
  B("belgrano", "Belgrano", 13, -34.562, -58.456, ["Av. Cabildo", "Av. Juramento", "Av. del Libertador"], "es un barrio muy poblado, con un gran centro comercial sobre Cabildo, edificios, colegios y clínicas"),
  B("nunez", "Núñez", 13, -34.546, -58.459, ["Av. Cabildo", "Av. del Libertador", "Av. Congreso"], "combina edificios, oficinas, universidades, clubes y comercios"),
  B("coghlan", "Coghlan", 12, -34.560, -58.474, ["Av. Congreso", "Av. Ricardo Balbín"], "es un barrio residencial chico, de casas y edificios bajos, con comercios de cercanía"),
  B("saavedra", "Saavedra", 12, -34.554, -58.486, ["Av. Cabildo", "Av. General Paz", "Av. Ricardo Balbín", "Av. García del Río"], "es residencial, con parques, clubes, escuelas y un polo comercial sobre la General Paz"),
  B("villa-urquiza", "Villa Urquiza", 12, -34.573, -58.488, ["Av. Triunvirato", "Av. Olazábal", "Av. Congreso", "Av. Monroe"], "creció mucho en edificios y consorcios, con un centro comercial activo, colegios y gastronomía"),
  B("villa-pueyrredon", "Villa Pueyrredón", 12, -34.581, -58.505, ["Av. Mosconi", "Av. de los Constituyentes", "Av. General Paz"], "es un barrio residencial con comercios de cercanía, escuelas y clubes"),
  B("villa-ortuzar", "Villa Ortúzar", 15, -34.581, -58.469, ["Av. Triunvirato", "Av. de los Incas", "Av. Álvarez Thomas"], "es un barrio residencial chico, de casas bajas, talleres y comercios de barrio"),
  B("parque-chas", "Parque Chas", 15, -34.585, -58.479, ["Av. de los Constituyentes", "Av. Chorroarín"], "es famoso por sus calles circulares y es un barrio residencial y tranquilo"),
  B("agronomia", "Agronomía", 15, -34.592, -58.490, ["Av. San Martín", "Av. de los Constituyentes", "Av. Francisco Beiró"], "rodea a la Facultad de Agronomía, con zonas verdes, residencias y comercios"),
  B("la-paternal", "La Paternal", 15, -34.598, -58.469, ["Av. San Martín", "Av. Juan B. Justo", "Av. Warnes"], "es un barrio residencial con talleres, comercios y mucha vida de club"),
];

export type Busqueda = {
  id: string; corto: string; h1: string; eyebrow: string; intro: string; detalle: string;
  categorias: string[]; productos: string[]; usos: string[]; rubros: string[];
  faqs: { q: string; a: string }[];
};

/** Las 20 búsquedas. {b} = barrio. */
export const BUSQUEDAS: Busqueda[] = [
  { id: "productos-de-limpieza-por-mayor", corto: "Productos de limpieza por mayor", h1: "Productos de limpieza por mayor en {b}", eyebrow: "Mayorista de limpieza",
    intro: "comprar productos de limpieza por mayor en {b} directo a la fábrica te ahorra intermediarios: precio de fábrica, stock permanente y entrega con reparto propio",
    detalle: "Trabajamos papeles (toallas intercaladas, bobinas, papel higiénico jumbo y en rollo), químicos (lavandina concentrada, detergente, desengrasante, limpiadores), dispensers, descartables, bolsas de residuos, cestos y carros. Todo en presentaciones mayoristas pensadas para quien limpia todos los días.",
    categorias: ["papeles", "limpieza", "dispensers", "descartables"], productos: ["lavandina-concentrada", "toallas-intercaladas", "papel-higienico-jumbo", "detergente-profesional", "limpiador-multiuso", "bolsa-de-residuos-negra-consorcio", "alcohol-en-gel-5-litros", "guantes-domesticos"],
    usos: ["Reponer el stock mensual de limpieza de tu empresa o institución", "Abastecer un comercio o revender", "Equipar baños de alto tránsito", "Armar el pedido completo en una sola compra"],
    rubros: ["empresas y oficinas", "consorcios", "comercios", "escuelas", "clínicas", "gastronomía"],
    faqs: [{ q: "¿Venden productos de limpieza por mayor en {b}?", a: "Sí. Somos fabricantes y distribuidores y entregamos en {b} con reparto propio, en 24 a 48 horas hábiles. Pedís la cotización por WhatsApp y te confirmamos precio y fecha en el día." }, { q: "¿Qué productos de limpieza por mayor tienen?", a: "Papeles, químicos, dispensers, descartables, bolsas de residuos, cestos y carros de limpieza. Podés ver todo el catálogo en la web y armar tu lista." }] },
  { id: "distribuidora-de-limpieza", corto: "Distribuidora de limpieza", h1: "Distribuidora de productos de limpieza en {b}", eyebrow: "Distribuidora con reparto propio",
    intro: "si buscás una distribuidora de productos de limpieza que llegue a {b} con su propia flota, que facture A y B y que tenga stock todo el año, somos fabricantes y distribuidores desde 1985",
    detalle: "Como distribuidora con fábrica propia, combinamos lo mejor de los dos mundos: productos que fabricamos nosotros y marcas que distribuimos, todo en un solo pedido y con una sola factura.",
    categorias: ["limpieza", "papeles", "higiene", "limpieza-institucional"], productos: ["lavandina-concentrada", "papel-higienico-jumbo", "toallas-intercaladas", "desengrasante-profesional", "limpiavidrios", "trapo-de-piso", "escobillon", "alcohol-en-gel"],
    usos: ["Tener un único proveedor para toda la limpieza", "Recibir en fecha sin tener que ir a buscar", "Ordenar la compra mensual con pedidos programados"],
    rubros: ["empresas", "consorcios", "instituciones", "comercios", "hoteles"],
    faqs: [{ q: "¿Son distribuidora o fábrica?", a: "Las dos cosas: fabricamos la mayoría de nuestros productos y distribuimos el resto. Por eso podemos ofrecer precio directo y surtido completo en {b}." }, { q: "¿Tienen reparto propio a {b}?", a: "Sí. La entrega la hacemos con nuestras camionetas, no con terceros, en 24 a 48 horas hábiles." }] },
  { id: "fabrica-de-productos-de-limpieza", corto: "Fábrica de productos de limpieza", h1: "Fábrica de productos de limpieza cerca de {b}", eyebrow: "Fabricantes",
    intro: "nuestra fábrica está en Parque Avellaneda y desde ahí abastecemos {b} con productos de fabricación propia a precio directo, sin intermediarios",
    detalle: "Fabricar nosotros mismos nos permite controlar la calidad, mantener el stock y sostener el precio. Lo que no fabricamos lo distribuimos, así tu pedido sale completo.",
    categorias: ["limpieza", "limpieza-institucional", "papeles"], productos: ["lavandina-concentrada", "lavandina-concentrada-1-litro", "detergente-profesional", "desengrasante-profesional", "limpiador-multiuso", "limpiador-desodorante-5-litros", "limpiavidrios", "limpiador-cremoso-5-litros"],
    usos: ["Comprar químicos de limpieza a precio de fábrica", "Asegurar el abastecimiento todo el año", "Revender con buen margen"],
    rubros: ["revendedores", "empresas de limpieza", "consorcios", "industrias"],
    faqs: [{ q: "¿Dónde está la fábrica?", a: "La planta y el depósito están en Parque Avellaneda, Ciudad de Buenos Aires, y desde ahí repartimos a {b} y al resto de CABA y GBA." }, { q: "¿Venden a revendedores de {b}?", a: "Sí. Vendemos por mayor a comercios y revendedores, con descuentos por cantidad que se aplican solos en la cotización." }] },
  { id: "insumos-de-limpieza-para-empresas", corto: "Insumos para empresas y oficinas", h1: "Insumos de limpieza para empresas y oficinas en {b}", eyebrow: "Proveedor para empresas",
    intro: "para las empresas y oficinas de {b} armamos la compra de limpieza completa: papeles, higiene de manos, limpiadores y dispensers en comodato, con factura A",
    detalle: "Una oficina gasta todos los meses en papel, toallas, jabón, alcohol en gel y limpiadores. Con un pedido programado lo recibís en fecha sin tener que acordarte.",
    categorias: ["papeles", "higiene", "dispensers"], productos: ["toallas-intercaladas", "papel-higienico-jumbo", "dispenser-toallas-intercaladas", "dispenser-jabon-inox", "alcohol-en-gel", "limpiador-multiuso", "limpiavidrios", "bolsa-de-residuos-negra-consorcio"],
    usos: ["Baños de oficina con dispensers en comodato", "Higiene de manos en recepciones y comedores", "Reposición mensual programada"],
    rubros: ["oficinas", "estudios profesionales", "coworkings", "empresas de servicios"],
    faqs: [{ q: "¿Facturan A a empresas de {b}?", a: "Sí, emitimos factura A y B. Las cuentas corrientes pueden tener financiación a 30, 60 y 90 días." }, { q: "¿Instalan dispensers en la oficina?", a: "Para clientes con consumo regular ofrecemos dispensers en comodato: los instalamos sin costo y vos comprás los insumos compatibles." }] },
  { id: "insumos-de-limpieza-para-consorcios", corto: "Insumos para consorcios", h1: "Insumos de limpieza para consorcios en {b}", eyebrow: "Consorcios y edificios",
    intro: "los consorcios de {b} necesitan lavandina, limpiadores, bolsas de consorcio, trapos y escobillones todos los meses: te los llevamos por mayor y con factura a nombre del consorcio",
    detalle: "Trabajamos con administradores y encargados. Armamos la lista mensual del edificio y la entregamos en fecha, con comprobante para la rendición de gastos.",
    categorias: ["limpieza", "bolsas-de-residuos", "limpieza-institucional"], productos: ["lavandina-concentrada", "limpiador-desodorante-5-litros", "bolsa-de-residuos-negra-consorcio", "bolsa-de-residuos-verde-consorcio", "trapo-de-piso", "escobillon", "balde-reforzado-con-asa", "contenedor-de-residuos-120-litros-con-ruedas"],
    usos: ["Limpieza de palieres, cocheras y halls", "Recolección de residuos con bolsas de consorcio", "Separación de reciclables con bolsas verdes"],
    rubros: ["administraciones de consorcios", "encargados de edificio", "countries y barrios cerrados"],
    faqs: [{ q: "¿Facturan a nombre del consorcio?", a: "Sí, emitimos la factura a nombre del consorcio de {b} para la rendición de expensas." }, { q: "¿Qué medidas de bolsas de consorcio tienen?", a: "Bolsas de residuos tipo consorcio en negro, rojo y verde, en medidas de 45x60 a 90x120 cm." }] },
  { id: "insumos-de-limpieza-para-gastronomia", corto: "Insumos para gastronomía", h1: "Insumos de limpieza para restaurantes y bares en {b}", eyebrow: "Gastronomía",
    intro: "los restaurantes, bares y cafeterías de {b} necesitan desengrasante, detergente, bobinas, guantes y sanitizantes que rindan: te los llevamos por mayor",
    detalle: "En una cocina profesional la limpieza es diaria y la grasa no perdona. Productos concentrados, bobinas de secado y guantes resistentes hacen la diferencia en tiempo y en costo.",
    categorias: ["limpieza-institucional", "descartables", "papeles"], productos: ["desengrasante-profesional", "detergente-profesional", "toalla-en-bobina", "dispenser-porta-bobina", "guantes-descartables-nitrilo-negro-x100", "lavandina-concentrada", "esponja", "cesto-de-residuos-a-pedal-60-litros"],
    usos: ["Desengrasar campanas, planchas y freidoras", "Secado de manos y superficies con bobina", "Manipulación de alimentos con guantes descartables"],
    rubros: ["restaurantes", "bares", "cafeterías", "rotiserías", "comedores"],
    faqs: [{ q: "¿Tienen desengrasante para cocina industrial?", a: "Sí, desengrasante profesional en presentación mayorista, ideal para campanas, planchas y pisos de cocina." }, { q: "¿Entregan a restaurantes de {b}?", a: "Sí, con reparto propio en 24 a 48 horas hábiles. Podés programar la entrega para que llegue siempre el mismo día." }] },
  { id: "insumos-de-limpieza-para-escuelas", corto: "Insumos para escuelas", h1: "Insumos de limpieza para escuelas y colegios en {b}", eyebrow: "Escuelas",
    intro: "las escuelas, jardines e institutos de {b} gastan mucho papel, jabón y lavandina: te los llevamos por mayor y con dispensers en comodato para los baños",
    detalle: "En una escuela los baños se usan cientos de veces por día. Papel jumbo y toallas intercaladas con dispenser bajan el desperdicio y el costo por uso.",
    categorias: ["papeles", "higiene", "limpieza"], productos: ["papel-higienico-jumbo", "dispenser-papel-higienico-jumbo", "toallas-intercaladas", "dispenser-jabon-tecla", "alcohol-en-gel-5-litros", "lavandina-concentrada", "trapo-de-piso", "cesto-de-residuos-34-litros-negro"],
    usos: ["Baños de alumnos y docentes", "Limpieza diaria de aulas y patios", "Higiene de manos en comedores"],
    rubros: ["escuelas", "jardines de infantes", "institutos", "universidades"],
    faqs: [{ q: "¿Trabajan con escuelas de {b}?", a: "Sí, abastecemos escuelas, jardines e institutos con papeles, higiene y limpieza por mayor, con factura A o B." }, { q: "¿Qué papel conviene para el baño de una escuela?", a: "El papel higiénico jumbo con su dispenser rinde más por rollo y se repone menos que el rollo común." }] },
  { id: "insumos-de-limpieza-para-clinicas", corto: "Insumos para clínicas y consultorios", h1: "Insumos de limpieza para clínicas y consultorios en {b}", eyebrow: "Salud",
    intro: "clínicas, consultorios, laboratorios y geriátricos de {b} necesitan alcohol, lavandina, papeles, guantes y bolsas rojas de residuos: los entregamos por mayor",
    detalle: "Abastecemos instituciones de salud públicas y privadas. Además de limpieza e higiene, tenemos bolsas de óbito de PVC y bolsas rojas para residuos patogénicos.",
    categorias: ["higiene", "descartables", "bolsas-de-residuos", "bolsas-de-obito"], productos: ["alcohol-70-bidon", "alcohol-en-gel-5-litros", "guantes-descartables-latex-x100", "bolsa-de-residuos-roja-consorcio", "lavandina-concentrada", "toallas-intercaladas", "dispenser-alcohol-en-gel", "bolsa-de-obito-adulto-negra"],
    usos: ["Desinfección de superficies y consultorios", "Higiene de manos del personal y pacientes", "Gestión de residuos con bolsas rojas"],
    rubros: ["clínicas", "consultorios", "laboratorios", "geriátricos", "veterinarias"],
    faqs: [{ q: "¿Tienen bolsas rojas para residuos patogénicos?", a: "Sí, bolsas rojas tipo consorcio, además de bolsas de óbito de PVC en varias medidas." }, { q: "¿Entregan en clínicas de {b}?", a: "Sí, con reparto propio en 24 a 48 horas hábiles y factura A o B." }] },
  { id: "papel-higienico-jumbo-por-mayor", corto: "Papel higiénico jumbo por mayor", h1: "Papel higiénico jumbo por mayor en {b}", eyebrow: "Papeles",
    intro: "el papel higiénico jumbo es el que más rinde en baños de alto tránsito: lo llevamos por mayor a {b} junto con el dispenser en comodato",
    detalle: "Un rollo jumbo reemplaza a muchos rollos comunes, se repone menos y evita que el baño quede sin papel. Si además usás dispenser, bajás el desperdicio.",
    categorias: ["papeles", "dispensers"], productos: ["papel-higienico-jumbo", "dispenser-papel-higienico-jumbo", "papel-higienico-48-rollos", "papel-higienico-rollo-blanco", "papel-higienico-rollo-beige", "dispenser-papel-higienico-doble"],
    usos: ["Baños de oficinas, escuelas y clínicas", "Locales con mucho público", "Edificios y espacios comunes"],
    rubros: ["oficinas", "escuelas", "clínicas", "comercios", "industrias"],
    faqs: [{ q: "¿Conviene el jumbo o el rollo común?", a: "En baños con mucho uso conviene el jumbo: rinde más por rollo y se repone menos. En baños de poco uso, el rollo común alcanza." }, { q: "¿Me prestan el dispenser de jumbo en {b}?", a: "Para clientes con consumo regular, el dispenser va en comodato comprando el papel compatible." }] },
  { id: "toallas-intercaladas-por-mayor", corto: "Toallas intercaladas por mayor", h1: "Toallas intercaladas por mayor en {b}", eyebrow: "Papeles",
    intro: "las toallas intercaladas se dispensan de a una y bajan el consumo: las llevamos por mayor a {b}, en 20x24 y 20x36 cm, con dispenser en comodato",
    detalle: "Tenemos toallas intercaladas blancas y naturales, toalla en rollo y toalla en bobina, para que elijas según el baño y el presupuesto.",
    categorias: ["papeles", "dispensers"], productos: ["toallas-intercaladas", "toallas-intercaladas-blancas-20x24", "toallas-intercaladas-blancas-20x36", "dispenser-toallas-intercaladas", "dispenser-toallas-elite", "toalla-en-rollo", "dispenser-toalla-en-rollo", "toalla-en-bobina"],
    usos: ["Secado de manos en baños públicos", "Cocinas y office", "Consultorios"],
    rubros: ["oficinas", "gastronomía", "clínicas", "escuelas", "comercios"],
    faqs: [{ q: "¿Qué medidas de toallas intercaladas tienen?", a: "Toallas intercaladas de 20x24 y 20x36 cm, además de toalla en rollo de 100 m y toalla en bobina." }, { q: "¿Entregan toallas intercaladas en {b}?", a: "Sí, por mayor y con reparto propio en 24 a 48 horas hábiles." }] },
  { id: "dispensers-en-comodato", corto: "Dispensers en comodato", h1: "Dispensers en comodato en {b}", eyebrow: "Comodato",
    intro: "instalamos dispensers de toallas, papel higiénico, jabón y alcohol en gel en {b} sin costo, en comodato, comprando los insumos compatibles",
    detalle: "El comodato es un préstamo: el dispenser sigue siendo nuestro, vos lo usás y nos comprás las recargas. Es la forma más simple de equipar un baño sin invertir.",
    categorias: ["dispensers"], productos: ["dispenser-toallas-intercaladas", "dispenser-papel-higienico-jumbo", "dispenser-jabon-inox", "dispenser-jabon-tecla", "dispenser-alcohol-en-gel", "dispenser-toalla-en-rollo", "dispenser-porta-bobina", "dispenser-toallas-elite"],
    usos: ["Equipar baños nuevos sin inversión", "Renovar dispensers rotos o viejos", "Unificar insumos en toda la empresa"],
    rubros: ["empresas", "escuelas", "clínicas", "gastronomía", "industrias"],
    faqs: [{ q: "¿Cómo funciona el comodato de dispensers en {b}?", a: "Te instalamos los dispensers sin costo y vos comprás los insumos compatibles. Es para clientes con consumo regular." }, { q: "¿Qué dispensers tienen?", a: "Toallas intercaladas, toalla en rollo, bobina, papel higiénico jumbo y doble, jabón líquido y alcohol en gel." }] },
  { id: "lavandina-por-mayor", corto: "Lavandina por mayor", h1: "Lavandina concentrada por mayor en {b}", eyebrow: "Químicos",
    intro: "la lavandina concentrada rinde más por litro que la común: la fabricamos y la llevamos por mayor a {b} en bidones de 5 litros y en litro",
    detalle: "Por tener más cloro activo por litro, la concentrada se diluye más y el costo real por limpieza baja. Siempre se usa sola, nunca mezclada con otros productos.",
    categorias: ["limpieza"], productos: ["lavandina-concentrada", "lavandina-concentrada-1-litro", "trapo-de-piso", "balde", "guantes-domesticos", "escobillon"],
    usos: ["Desinfección de pisos y baños", "Limpieza de consorcios", "Cocinas y depósitos"],
    rubros: ["consorcios", "empresas de limpieza", "escuelas", "clínicas", "comercios"],
    faqs: [{ q: "¿En qué presentación viene la lavandina?", a: "Lavandina concentrada en bidón de 5 litros y en botella de 1 litro." }, { q: "¿Se puede mezclar la lavandina con otros productos?", a: "No. Mezclarla con detergentes, amoníaco o ácidos puede liberar gases tóxicos. Usala siempre sola y diluida en agua." }] },
  { id: "alcohol-en-gel-por-mayor", corto: "Alcohol en gel por mayor", h1: "Alcohol en gel y alcohol al 70% por mayor en {b}", eyebrow: "Higiene",
    intro: "llevamos alcohol en gel por mayor a {b} en 1 litro y 5 litros, y alcohol al 70% en bidón, con dispensers para pared en comodato",
    detalle: "El alcohol en gel va en el dispenser para las manos; el alcohol al 70% en pulverizador para superficies. Tener los dos cubre la higiene completa.",
    categorias: ["higiene", "dispensers"], productos: ["alcohol-en-gel", "alcohol-en-gel-5-litros", "alcohol-70-bidon", "dispenser-alcohol-en-gel", "dispenser-jabon-inox", "jabon-en-pan"],
    usos: ["Higiene de manos en recepciones", "Desinfección de superficies", "Consultorios y comercios"],
    rubros: ["clínicas", "oficinas", "escuelas", "comercios", "gimnasios"],
    faqs: [{ q: "¿Qué diferencia hay entre alcohol en gel y alcohol al 70%?", a: "El gel es para las manos y se usa en dispenser; el alcohol al 70% se usa con pulverizador para superficies." }, { q: "¿Venden alcohol en gel por bidón en {b}?", a: "Sí, en bidón de 5 litros y en botella de 1 litro, con entrega en 24 a 48 horas hábiles." }] },
  { id: "bolsas-de-residuos-por-mayor", corto: "Bolsas de residuos por mayor", h1: "Bolsas de residuos y de consorcio por mayor en {b}", eyebrow: "Residuos",
    intro: "llevamos a {b} bolsas de residuos tipo consorcio en negro, rojo y verde, más cestos y contenedores, por mayor",
    detalle: "Las bolsas negras van para residuos generales, las verdes para reciclables y las rojas para residuos patogénicos en salud.",
    categorias: ["bolsas-de-residuos", "cestos-de-residuos"], productos: ["bolsa-de-residuos-negra-consorcio", "bolsa-de-residuos-verde-consorcio", "bolsa-de-residuos-roja-consorcio", "contenedor-de-residuos-120-litros-con-ruedas", "cesto-de-residuos-a-pedal-60-litros", "cesto-de-residuos-verde-69-litros-con-tapa", "cesto-de-residuos-34-litros-negro"],
    usos: ["Recolección diaria en edificios", "Separación de residuos", "Residuos patogénicos en salud"],
    rubros: ["consorcios", "comercios", "clínicas", "industrias", "escuelas"],
    faqs: [{ q: "¿Qué colores de bolsas de consorcio tienen?", a: "Negro, rojo y verde, en medidas de 45x60 a 90x120 cm." }, { q: "¿Tienen contenedores para {b}?", a: "Sí, contenedores de 120 litros con tapa y ruedas, cestos a pedal y cestos con tapa." }] },
  { id: "detergente-y-desengrasante-por-mayor", corto: "Detergente y desengrasante por mayor", h1: "Detergente y desengrasante profesional por mayor en {b}", eyebrow: "Químicos",
    intro: "fabricamos detergente y desengrasante profesional y los llevamos por mayor a {b} para cocinas, industrias y limpieza institucional",
    detalle: "El detergente profesional corta la grasa del lavado diario; el desengrasante es para la suciedad pesada de campanas, planchas, máquinas y pisos de taller.",
    categorias: ["limpieza", "limpieza-institucional"], productos: ["detergente-profesional", "desengrasante-profesional", "limpiador-multiuso", "limpiador-cremoso-5-litros", "esponja", "guantes-industriales"],
    usos: ["Cocinas industriales", "Talleres y depósitos", "Limpieza de pisos con grasa"],
    rubros: ["gastronomía", "industrias", "talleres", "empresas de limpieza"],
    faqs: [{ q: "¿El desengrasante sirve para campanas de cocina?", a: "Sí, es un desengrasante profesional para campanas, planchas y superficies con grasa acumulada." }, { q: "¿Lo fabrican ustedes?", a: "Sí, somos fabricantes. Por eso tenemos stock y precio directo para {b}." }] },
  { id: "articulos-de-limpieza-para-oficinas", corto: "Artículos de limpieza para oficinas", h1: "Artículos de limpieza para oficinas en {b}", eyebrow: "Oficinas",
    intro: "todo lo que necesita la limpieza de una oficina en {b}: limpiavidrios, multiuso, trapos, papeles, jabón y bolsas, en un solo pedido",
    detalle: "Para el personal de limpieza de la oficina armamos un kit mensual con los productos de uso diario, así no falta nada a mitad de mes.",
    categorias: ["limpieza", "papeles", "limpieza-institucional"], productos: ["limpiavidrios", "limpiador-multiuso", "limpiador-desodorante-5-litros", "trapo-de-piso-blanco", "toallas-intercaladas", "papel-higienico-jumbo", "bolsa-de-residuos-negra-consorcio", "carro-de-limpieza-tres-bandejas"],
    usos: ["Limpieza diaria de escritorios y vidrios", "Baños y office", "Reposición del carro de limpieza"],
    rubros: ["oficinas", "estudios", "bancos", "coworkings"],
    faqs: [{ q: "¿Arman kits de limpieza para oficinas?", a: "Sí, tenemos kits por rubro con descuento y también armamos el pedido a medida." }, { q: "¿Entregan en oficinas de {b}?", a: "Sí, con reparto propio en 24 a 48 horas hábiles, de lunes a viernes." }] },
  { id: "guantes-y-descartables-por-mayor", corto: "Guantes y descartables por mayor", h1: "Guantes y descartables por mayor en {b}", eyebrow: "Descartables",
    intro: "llevamos guantes descartables de látex y nitrilo, guantes domésticos e industriales por mayor a {b}",
    detalle: "Los descartables de nitrilo y látex vienen por 100 unidades; los domésticos y reforzados son reutilizables para limpieza, y los industriales para trabajos pesados.",
    categorias: ["descartables"], productos: ["guantes-descartables-nitrilo-negro-x100", "guantes-descartables-latex-x100", "guantes-domesticos", "guantes-domesticos-reforzados", "guantes-industriales"],
    usos: ["Manipulación de alimentos", "Limpieza con químicos", "Salud y estética", "Trabajos industriales"],
    rubros: ["gastronomía", "salud", "estética", "industrias", "empresas de limpieza"],
    faqs: [{ q: "¿Qué guantes descartables tienen?", a: "Guantes de látex y de nitrilo negro, en cajas de 100 unidades." }, { q: "¿Venden guantes por caja en {b}?", a: "Sí, por mayor y con descuentos por cantidad." }] },
  { id: "carros-y-cestos-de-limpieza", corto: "Carros y cestos de limpieza", h1: "Carros de limpieza y cestos de residuos en {b}", eyebrow: "Equipamiento",
    intro: "equipamos al personal de limpieza de {b} con carros prensamopas, carros multiservicio y de hotelería, baldes con ruedas, cestos y contenedores",
    detalle: "Un buen carro ordena el trabajo, ahorra viajes y cuida la espalda del personal. Los cestos y contenedores adecuados mantienen los residuos bajo control.",
    categorias: ["carros-de-limpieza", "cestos-de-residuos"], productos: ["carro-prensamopas-doble-top-30", "carro-prensamopas-50-litros-top", "carro-multiservicio-top", "carro-hotel-3-bandejas-2-bolsas", "balde-con-ruedas-25-litros", "contenedor-de-residuos-120-litros-con-ruedas", "cesto-de-residuos-a-pedal-60-litros", "cono-piso-mojado"],
    usos: ["Limpieza de pisos en grandes superficies", "Hotelería y habitaciones", "Señalización de piso mojado"],
    rubros: ["hoteles", "hospitales", "empresas de limpieza", "edificios", "shoppings"],
    faqs: [{ q: "¿Qué carros de limpieza tienen?", a: "Carros prensamopas de 20, 30 y 50 litros, carros multiservicio, carro de hotelería y carro de tres bandejas." }, { q: "¿Entregan carros en {b}?", a: "Sí, con reparto propio. Te recomendamos el modelo según la superficie a limpiar." }] },
  { id: "higiene-institucional", corto: "Higiene institucional", h1: "Higiene institucional en {b}", eyebrow: "Instituciones",
    intro: "proveemos higiene institucional a organismos, hospitales, escuelas y empresas de {b}: papeles, jabones, alcohol, dispensers y limpieza",
    detalle: "Somos proveedores de instituciones públicas y privadas. Entendemos de licitaciones, órdenes de compra y entregas programadas.",
    categorias: ["higiene", "papeles", "dispensers", "limpieza"], productos: ["toallas-intercaladas", "papel-higienico-jumbo", "alcohol-en-gel-5-litros", "dispenser-jabon-inox", "lavandina-concentrada", "bolsa-de-residuos-negra-consorcio", "guantes-descartables-latex-x100", "dispenser-alcohol-en-gel"],
    usos: ["Abastecimiento de organismos públicos", "Baños institucionales", "Entregas programadas"],
    rubros: ["organismos públicos", "hospitales", "escuelas", "universidades", "empresas"],
    faqs: [{ q: "¿Trabajan con organismos públicos?", a: "Sí, abastecemos instituciones públicas y privadas con higiene y limpieza por mayor." }, { q: "¿Hacen entregas programadas en {b}?", a: "Sí, con el pedido programado recibís cada 15 días, todos los meses o cada 2 meses." }] },
  { id: "productos-de-limpieza-con-envio", corto: "Productos de limpieza con envío", h1: "Productos de limpieza con envío a {b}", eyebrow: "Envíos",
    intro: "pedí tus productos de limpieza por WhatsApp y te los llevamos a {b} con nuestra propia flota, en 24 a 48 horas hábiles",
    detalle: "No tenés que ir a buscar nada: armás la lista en la web, la mandás por WhatsApp, te confirmamos precio y fecha, y la camioneta pasa por tu dirección.",
    categorias: ["limpieza", "papeles", "higiene"], productos: ["lavandina-concentrada", "papel-higienico-48-rollos", "toallas-intercaladas", "detergente-profesional", "alcohol-en-gel", "bolsa-de-residuos-negra-consorcio", "limpiador-multiuso", "esponja"],
    usos: ["Recibir la compra mensual sin moverte", "Reponer urgente", "Pedidos programados"],
    rubros: ["empresas", "comercios", "consorcios", "instituciones"],
    faqs: [{ q: "¿Cuánto tarda el envío a {b}?", a: "Entre 24 y 48 horas hábiles desde que confirmás el pedido." }, { q: "¿Tiene costo el envío a {b}?", a: "El envío es gratis en compras desde el mínimo vigente en CABA y GBA; por debajo te informamos el costo al cotizar." }] },
];

/* ───────── utilidades ───────── */
const PA = BARRIOS[0];
export const rad = (d: number) => (d * Math.PI) / 180;
export function km(a: Barrio, b: Barrio) {
  const R = 6371, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
export function rumbo(desde: Barrio, hacia: Barrio) {
  const dy = hacia.lat - desde.lat, dx = (hacia.lng - desde.lng) * Math.cos(rad(desde.lat));
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI; // 0 = este, 90 = norte
  const dirs = ["este", "noreste", "norte", "noroeste", "oeste", "sudoeste", "sur", "sudeste"];
  return dirs[Math.round(((ang + 360) % 360) / 45) % 8];
}
export const cercanos = (b: Barrio, n = 5) => BARRIOS.filter((x) => x.slug !== b.slug).sort((x, y) => km(b, x) - km(b, y)).slice(0, n);
const h = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const pick = <T,>(arr: T[], seed: string) => arr[h(seed) % arr.length];
const lista = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}`);
const fill = (s: string, b: Barrio) => s.replaceAll("{b}", b.nombre);

/* ───────── qué páginas existen ───────── */
const CERCANOS_PA = ["flores", "floresta", "velez-sarsfield", "villa-luro", "mataderos", "villa-lugano", "villa-soldati", "liniers", "parque-chacabuco", "monte-castro"];
const NUCLEO = ["productos-de-limpieza-por-mayor", "distribuidora-de-limpieza"];
const ROTA = ["insumos-de-limpieza-para-empresas", "insumos-de-limpieza-para-consorcios", "insumos-de-limpieza-para-gastronomia", "papel-higienico-jumbo-por-mayor", "dispensers-en-comodato", "productos-de-limpieza-con-envio", "insumos-de-limpieza-para-clinicas", "insumos-de-limpieza-para-escuelas"];

export type Zona = { slug: string; barrio: Barrio; busqueda: Busqueda };

function armar(): Zona[] {
  const out: Zona[] = [];
  const add = (b: Barrio, id: string) => { const q = BUSQUEDAS.find((x) => x.id === id)!; out.push({ slug: `${q.id}-en-${b.slug}`, barrio: b, busqueda: q }); };
  // Parque Avellaneda: las 20 búsquedas
  BUSQUEDAS.forEach((q) => add(PA, q.id));
  // 10 barrios más cercanos: 2 búsquedas cada uno (20 páginas)
  CERCANOS_PA.forEach((s) => NUCLEO.forEach((id) => add(BARRIOS.find((b) => b.slug === s)!, id)));
  // resto de los barrios: 3 búsquedas cada uno
  BARRIOS.filter((b) => b.slug !== PA.slug && !CERCANOS_PA.includes(b.slug)).forEach((b, i) => {
    NUCLEO.forEach((id) => add(b, id));
    add(b, ROTA[i % ROTA.length]);
  });
  return out;
}
export const ZONAS = armar();
export const getZona = (slug: string) => ZONAS.find((z) => z.slug === slug);

/* ───────── contenido de cada página ───────── */
export type Seccion = { h2: string; p?: string[]; items?: string[] };

export function contenido(z: Zona) {
  const { barrio: b, busqueda: q } = z;
  const esPA = b.slug === PA.slug;
  const d = km(PA, b);
  const dist = esPA ? "" : `a unos ${Math.max(1, Math.round(d * 1.3))} km al ${rumbo(PA, b)} de nuestra planta de Parque Avellaneda`;
  const cerca = cercanos(b, 5);
  const maxOff = Math.max(...escalas.map((e) => e.off));
  const envio = envioGratis.activo ? `envío gratis en compras desde $${envioGratis.minimo.toLocaleString("es-AR")}` : "envío a cotizar";
  const kw = q.corto.toLowerCase();

  const title = `${fill(q.h1, b)} | Ibarra Insumos`.length <= 65 ? `${fill(q.h1, b)} | Ibarra Insumos` : fill(q.h1, b);
  const descLarga = `${q.corto} en ${b.nombre} (Comuna ${b.comuna}) directo de fábrica: reparto propio en 24–48 hs, ${envio} y hasta −${maxOff}% por cantidad.`;
  const description = descLarga.length <= 160 ? descLarga : `${q.corto} en ${b.nombre} directo de fábrica: reparto propio en 24–48 hs y hasta −${maxOff}% por cantidad.`;

  const respuesta = pick([
    `Sí, en Ibarra Insumos ${fill(q.intro, b)}. Entregamos en ${b.nombre} con reparto propio en 24 a 48 horas hábiles, con ${envio} en CABA y GBA, descuentos de hasta ${maxOff}% por cantidad y factura A o B. Pedís tu cotización por WhatsApp y te confirmamos precio, stock y fecha en el día.`,
    `En corto: ${fill(q.intro, b)}. Llegamos a ${b.nombre} (Comuna ${b.comuna}) con nuestras camionetas en 24 a 48 horas hábiles, hay ${envio} y el precio baja hasta un ${maxOff}% según la cantidad. Facturamos A y B y respondemos la cotización por WhatsApp en el día.`,
    `Somos fabricantes y distribuidores desde 1985 y ${fill(q.intro, b)}. Para ${b.nombre} el plazo de entrega es de 24 a 48 horas hábiles, con ${envio}; los descuentos por cantidad llegan al ${maxOff}% y se aplican solos. Escribinos por WhatsApp y te pasamos precio y fecha hoy mismo.`,
  ], z.slug + "a");

  const aperturas = [
    `${b.nombre} ${b.perfil}.`,
    `Pocas zonas de la Ciudad son como ${b.nombre}: ${b.perfil}.`,
    `Conocemos bien ${b.nombre}, que ${b.perfil}.`,
  ];
  const ubic = esPA
    ? `Nuestra planta y depósito están en Parque Avellaneda, en la Comuna 9, así que para los clientes del barrio somos literalmente el proveedor de la esquina: la camioneta sale de nuestro depósito y llega en minutos.`
    : `El barrio pertenece a la Comuna ${b.comuna} y está ${dist}, así que nuestras camionetas llegan en el mismo recorrido de reparto que cubre ${lista(cerca.slice(0, 3).map((c) => c.nombre))}.`;

  const secciones: Seccion[] = [
    {
      h2: `${q.corto} en ${b.nombre}, directo de fábrica`,
      p: [
        `${pick(aperturas, z.slug)} ${ubic}`,
        `${q.detalle} Si estás buscando ${kw} en ${b.nombre}, comprarle directamente a quien fabrica significa precio sin intermediarios, stock permanente y alguien que responde cuando lo necesitás.`,
      ],
    },
    {
      h2: `Para qué usan ${kw} en ${b.nombre}`,
      p: [`Estos son los usos más comunes que vemos entre nuestros clientes de ${b.nombre} y de la Comuna ${b.comuna}:`],
      items: q.usos.map((u) => `${u}.`),
    },
    {
      h2: `Reparto propio en ${b.nombre}`,
      p: [
        `Repartimos en ${b.nombre} de lunes a viernes, con nuestras propias camionetas, y entregamos en ${pick(["la puerta de tu negocio, oficina o edificio", "tu dirección, sin que tengas que ir a buscar nada", "el lugar que nos indiques dentro del barrio"], z.slug + "r")}. Cubrimos todo el barrio, incluyendo las zonas de ${lista(b.avenidas.slice(0, 4))}.`,
        pick([
          `El plazo es de 24 a 48 horas hábiles desde que confirmás el pedido, con ${envio} en CABA y GBA. Si querés olvidarte de reponer, activá el pedido programado y te llevamos lo mismo cada 15 días, todos los meses o cada 2 meses.`,
          `Confirmado el pedido, lo recibís en ${b.nombre} en 24 a 48 horas hábiles. Hay ${envio}, y con el pedido programado podés recibir automáticamente cada 15 días, cada mes o cada 2 meses.`,
          `Las entregas en ${b.nombre} salen en 24 a 48 horas hábiles. Tenés ${envio}; y si tu consumo es fijo, el pedido programado te deja todo resuelto con entregas quincenales, mensuales o bimestrales.`,
        ], z.slug + "e"),
        esPA
          ? `Además de Parque Avellaneda, todos los días entregamos en los barrios vecinos: ${lista(cerca.map((c) => c.nombre))}.`
          : `En el mismo recorrido también llegamos a los barrios vecinos de ${b.nombre}: ${lista(cerca.map((c) => c.nombre))}.`,
      ],
    },
    {
      h2: `Quiénes nos compran en ${b.nombre}`,
      p: [pick([
        `En ${b.nombre} trabajamos con ${lista(q.rubros)}. A cada uno le armamos la compra según su consumo real, para que no sobre ni falte.`,
        `Nuestros clientes en ${b.nombre} son, sobre todo, ${lista(q.rubros)}. Lo que buscan es lo mismo: no quedarse sin stock y pagar precio de fábrica.`,
        `${lista(q.rubros).replace(/^./, (c) => c.toUpperCase())}: ese es el tipo de cliente que más atendemos en ${b.nombre}, y para todos vale lo mismo:`,
      ], z.slug + "q")],
      items: [
        `Precio de fábrica en ${kw}, sin intermediarios.`,
        `Descuentos automáticos por cantidad: ${escalas.filter((e) => e.off > 0).map((e) => `−${e.off}% desde ${e.min} unidades`).join(", ")}.`,
        `Factura A y B; las cuentas corrientes pueden tener financiación a 30, 60 y 90 días.`,
        `Dispensers en comodato para clientes con consumo regular.`,
        `Atención por WhatsApp de lunes a viernes de 8 a 17 hs.`,
      ],
    },
    {
      h2: `Cómo pedir ${kw} desde ${b.nombre}`,
      items: pick([
        [`Armá tu lista en la web con los productos que necesitás (los descuentos por cantidad se aplican solos).`, `Enviá la cotización por WhatsApp con tu dirección en ${b.nombre}.`, `Te confirmamos precio, stock y día de entrega en el mismo día.`, `Recibís con nuestro reparto propio en 24 a 48 horas hábiles, con tu factura.`],
        [`Elegí los productos en el catálogo o usá la carga rápida si ya sabés lo que querés.`, `Tocá “Enviar cotización por WhatsApp” e indicá que la entrega es en ${b.nombre}.`, `Te respondemos con el precio final, el stock y el día que pasa la camioneta por ${b.nombre}.`, `Recibís en 24 a 48 horas hábiles y pagás por transferencia, cheque o efectivo.`],
        [`Escribinos por WhatsApp con tu lista o armala en la web.`, `Contanos la dirección en ${b.nombre} y si necesitás factura A o B.`, `Confirmamos precio, descuentos por cantidad y fecha de entrega.`, `La camioneta de Ibarra Insumos te entrega en ${b.nombre} en 24 a 48 horas hábiles.`],
      ], z.slug + "c"),
    },
    {
      h2: `Por qué conviene un fabricante cerca de ${b.nombre}`,
      p: [
        esPA
          ? `Estar en el mismo barrio tiene ventajas concretas: entregas más rápidas, la posibilidad de resolver una urgencia en el día si hay stock y un trato directo con quienes fabrican. Somos una empresa familiar de Parque Avellaneda desde 1985.`
          : pick([
            `Que ${b.nombre} esté ${dist} nos permite llegar seguido y planificar las entregas. Somos una empresa familiar, fabricantes y distribuidores desde 1985, con planta, depósito y flota propios.`,
            `Desde Parque Avellaneda hasta ${b.nombre} hay unos ${Math.max(1, Math.round(d * 1.3))} km: una distancia que nuestra flota recorre todas las semanas. Eso, sumado a fabricar nosotros, hace que el servicio sea previsible.`,
            `Con ${b.nombre} ${dist.replace("a unos", "a solo unos")}, el barrio entra en nuestras rutas habituales de reparto. Somos fabricantes y distribuidores desde 1985 y no dependemos de terceros para entregar.`,
          ], z.slug + "p"),
        `A diferencia de un revendedor, controlamos la producción y el stock, así que el precio y la disponibilidad de ${kw} se mantienen estables todo el año.`,
      ],
    },
  ];

  secciones.splice(3, 0, {
    h2: `Datos de entrega en ${b.nombre}`,
    items: [
      `Barrio: ${b.nombre}, Comuna ${b.comuna} de la Ciudad Autónoma de Buenos Aires.`,
      esPA ? `Distancia a la planta: estamos en el mismo barrio.` : `Distancia aproximada a nuestra planta en Parque Avellaneda: ${Math.max(1, Math.round(d * 1.3))} km por calle (${d.toFixed(1).replace(".", ",")} km en línea recta, hacia el ${rumbo(PA, b)}).`,
      `Principales avenidas que recorremos: ${lista(b.avenidas)}.`,
      `Barrios vecinos que también cubrimos: ${cerca.map((c) => `${c.nombre} (${km(b, c).toFixed(1).replace(".", ",")} km)`).join(", ")}.`,
      `Plazo de entrega: 24 a 48 horas hábiles, de lunes a viernes.`,
    ],
  });

  const faqs = [
    ...q.faqs.map((f) => ({ q: fill(f.q, b), a: fill(f.a, b) })),
    { q: `¿Hacen envíos a ${b.nombre}?`, a: pick([`Sí. Entregamos en todo ${b.nombre} (Comuna ${b.comuna}) con reparto propio, de lunes a viernes, en 24 a 48 horas hábiles.`, `Sí, ${b.nombre} está dentro de nuestra zona de reparto propio. Llegamos en 24 a 48 horas hábiles, de lunes a viernes.`, `Claro. Cubrimos ${b.nombre} y los barrios vecinos (${lista(cerca.slice(0, 3).map((c) => c.nombre))}) con nuestras camionetas, en 24 a 48 horas hábiles.`], z.slug + "f") },
    { q: `¿El envío a ${b.nombre} es gratis?`, a: envioGratis.activo ? `El envío es gratis en compras desde $${envioGratis.minimo.toLocaleString("es-AR")} en CABA y GBA. Para pedidos menores te informamos el costo al cotizar.` : `Te informamos el costo de envío al cotizar.` },
    { q: `¿Tienen descuentos por cantidad?`, a: `Sí: ${escalas.filter((e) => e.off > 0).map((e) => `${e.off}% desde ${e.min} unidades`).join(", ")}. Se aplican solos al armar tu cotización.` },
    { q: `¿Cómo pago?`, a: `Transferencia, cheque o efectivo. Las cuentas corrientes pueden tener financiación a 30, 60 y 90 días. Emitimos factura A y B.` },
  ];

  return { title, description, respuesta, secciones, faqs, cerca, dist, esPA };
}
