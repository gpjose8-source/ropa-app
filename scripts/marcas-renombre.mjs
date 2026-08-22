import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("C:/Users/jose-/ropa-app/tienda.db");
db.exec("PRAGMA busy_timeout = 5000");

const marcas = [
  "Polo Ralph Lauren", "Levi's", "Nike", "Under Armour", "Gap",
  "Champion", "Carhartt", "The North Face", "American Eagle",
  "Old Navy", "Wrangler",
];

const ph = marcas.map(() => "?").join(",");
db.prepare(`DELETE FROM productos WHERE marca IN (${ph})`).run(...marcas);

const items = [
  ["Camiseta polo Big Pony clásica", "camiseta", "M", "Polo Ralph Lauren", 9.0],
  ["Camisa oxford RL slim fit", "camiseta", "L", "Polo Ralph Lauren", 7.5],
  ["Gorra RL pony bordado", "gorra", "Única", "Polo Ralph Lauren", 4.0],
  ["Jeans 501 original recto", "pantalon", "32", "Levi's", 9.5],
  ["Chaqueta trucker denim", "chaqueta", "M", "Levi's", 8.5],
  ["Camiseta Dry-Fit training", "camiseta", "M", "Nike", 4.5],
  ["Jogger tech fleece", "pantalon", "L", "Nike", 8.0],
  ["Gorra snapback swoosh", "gorra", "Única", "Nike", 3.5],
  ["Chompa UA storm coldgear", "chaqueta", "M", "Under Armour", 8.5],
  ["Camiseta logo Gap básica", "camiseta", "L", "Gap", 3.5],
  ["Sudadera Champion crewneck", "chaqueta", "L", "Champion", 6.0],
  ["Camisa franela trabajo", "camiseta", "XL", "Carhartt", 6.5],
  ["Rompevientos 1996 retro", "chaqueta", "L", "The North Face", 10.0],
  ["Camiseta gráfica supersoft", "camiseta", "M", "American Eagle", 4.0],
  ["Pantalón cargo relaxed", "pantalon", "34", "Old Navy", 5.5],
];

const ins = db.prepare(
  `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
   VALUES (?, ?, ?, ?, 'A', ?, ?, ?)`
);
for (const [nombre, cat, talla, marca, costo] of items) {
  const venta = Math.round(costo * 2.2 + 4) + 0.99;
  ins.run(nombre, cat, talla, marca, costo, venta, 3);
}

const total = db.prepare("SELECT COUNT(*) c FROM productos").get().c;
console.log("prendas de renombre agregadas:", items.length, "| total catalogo:", total);
