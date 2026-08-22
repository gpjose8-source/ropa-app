import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("C:/Users/jose-/ropa-app/tienda.db");
db.exec("PRAGMA busy_timeout = 5000");

const hombres = [
  ["Camiseta HCO logo clásico", "camiseta", "M", "Hollister", 3.5, 8.5, 4],
  ["Camiseta HCO gráfica playa", "camiseta", "L", "Hollister", 4.0, 9.0, 3],
  ["Camiseta básica CK slim fit", "camiseta", "M", "Calvin Klein", 4.5, 10.0, 5],
  ["Camiseta CK cuello V negra", "camiseta", "L", "Calvin Klein", 4.5, 10.5, 3],
  ["Polo Tommy bandera clásica", "camiseta", "M", "Tommy Hilfiger", 6.0, 14.0, 4],
  ["Polo Tommy piqué azul", "camiseta", "L", "Tommy Hilfiger", 6.0, 14.5, 2],
  ["Camisa CK slim manga larga", "camiseta", "M", "Calvin Klein", 5.5, 13.0, 2],
  ["Sudadera HCO crew gris", "chaqueta", "L", "Hollister", 6.5, 15.0, 3],
  ["Chompa CK quarter-zip", "chaqueta", "M", "Calvin Klein", 8.0, 18.0, 2],
  ["Rompevientos Tommy retro", "chaqueta", "L", "Tommy Hilfiger", 8.5, 19.0, 2],
  ["Jeans Tommy recto original", "pantalon", "32", "Tommy Hilfiger", 7.0, 16.0, 3],
  ["Jeans HCO skinny moderno", "pantalon", "30", "Hollister", 6.0, 14.0, 3],
  ["Short HCO playa estampado", "pantalon", "M", "Hollister", 4.0, 9.5, 4],
  ["Jogger CK logo lateral", "pantalon", "L", "Calvin Klein", 6.5, 15.0, 2],
];

try {
  db.exec("DELETE FROM productos");
} catch {
  db.exec("UPDATE productos SET activo=0");
}

const ins = db.prepare(
  `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
   VALUES (?, ?, ?, ?, 'A', ?, ?, ?)`
);
for (const d of hombres) ins.run(...d);

const n = db.prepare("SELECT COUNT(*) c FROM productos").get().c;
console.log("productos hombre insertados:", n);
