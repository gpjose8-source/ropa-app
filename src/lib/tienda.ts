export const TEMPORADA = {
  nombre: "🔥 REBAJAS DE TEMPORADA",
  detalle: "Hasta 15% OFF en toda la ropa americana",
  pct: 15,
};

export function precioFinal(precio: number): number {
  return Math.round(precio * (1 - TEMPORADA.pct / 100) * 100) / 100;
}

export const WHATSAPP_TIENDA = "593999999999";

export const ASESORIA_IMAGEN = {
  titulo: "Asesoría de Imagen Personal",
  precio: 15,
  gratisDesde: 150,
  incluye: [
    "Evaluación de tu estilo y tipo de cuerpo",
    "Paleta de colores según tu tono de piel",
    "Combinación de prendas para cada ocasión",
    "Guía de tallas perfectas para ti",
  ],
};

export const COSTO_ENVIO = 3.5;
export const ENVIO_GRATIS_DESDE = 40;

export const CIUDADES = [
  "Quito", "Guayaquil", "Cuenca", "Manta", "Ambato", "Santo Domingo",
  "Machala", "Loja", "Esmeraldas", "Riobamba", "Milagro", "Ibarra",
  "Portoviejo", "Babahoyo", "Tulcán", "Quevedo", "Latacunga", "Nueva Loja",
];

export function fechaEntrega(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" });
}

export const CUENTA_BANCARIA = {
  banco: "Banco Pichincha",
  tipo: "Ahorros",
  numero: "2200 1234 5678",
  titular: "GARAGE ONLINE Cía. Ltda.",
  cedula: "1712345678",
};

const TALLAS_ROPA = [
  { talla: "S", pecho: "92-97", ancho: "48", largo: "66" },
  { talla: "M", pecho: "98-103", ancho: "51", largo: "69" },
  { talla: "L", pecho: "104-109", ancho: "54", largo: "72" },
  { talla: "XL", pecho: "110-115", ancho: "57", largo: "75" },
];

const TALLAS_PANTALON = [
  { talla: "28", cintura: "71-74", cadera: "89-92", largo: "78" },
  { talla: "30", cintura: "76-79", cadera: "94-97", largo: "79" },
  { talla: "32", cintura: "81-84", cadera: "99-102", largo: "80" },
  { talla: "34", cintura: "86-89", cadera: "104-107", largo: "81" },
];

const TALLAS_ZAPATO = [
  { talla: "38", plantilla: "24.0" },
  { talla: "40", plantilla: "25.5" },
  { talla: "41", plantilla: "26.5" },
  { talla: "42", plantilla: "27.0" },
];

export function guiaTallas(categoria: string) {
  if (categoria === "pantalon") return { titulo: "Pantalones y shorts (cm)", filas: TALLAS_PANTALON, cols: ["Talla", "Cintura", "Cadera", "Largo"] };
  if (categoria === "zapatos") return { titulo: "Calzado (cm de plantilla)", filas: TALLAS_ZAPATO, cols: ["Talla EU", "Plantilla"] };
  return { titulo: "Camisetas, polos y chaquetas (cm)", filas: TALLAS_ROPA, cols: ["Talla", "Pecho", "Ancho", "Largo"] };
}
