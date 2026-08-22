import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("C:/Users/jose-/ropa-app/tienda.db");
db.exec("PRAGMA busy_timeout = 5000");

const premium = [
  ["Blazer RL lana azul marino", "chaqueta", "M", "Polo Ralph Lauren", 126.0, 299.99],
  ["Abrigo camel clásico", "chaqueta", "L", "Polo Ralph Lauren", 147.0, 349.99],
  ["Suéter merino cuello V", "chaqueta", "M", "Nautica", 105.0, 249.99],
  ["Camisa de vestir CK slim negra", "camiseta", "M", "Calvin Klein", 109.0, 259.99],
  ["Chino sartorial Tommy", "pantalon", "32", "Tommy Hilfiger", 101.0, 239.99],
  ["Sudadera A&F cashmere blend", "chaqueta", "L", "Abercrombie & Fitch", 118.0, 279.99],
];

const ins = db.prepare(
  `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
   SELECT ?, ?, ?, ?, 'A', ?, ?, ?
   WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre=? AND marca=?)`
);
for (const [nombre, cat, talla, marca, costo, venta] of premium) {
  ins.run(nombre, cat, talla, marca, costo, venta, 2, nombre, marca);
}

const rango = db
  .prepare("SELECT MAX(precio_venta) max FROM productos WHERE activo=1")
  .get();
console.log("linea premium agregada | maximo catalogo: $" + rango.max);
