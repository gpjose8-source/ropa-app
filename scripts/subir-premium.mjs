import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("C:/Users/jose-/ropa-app/tienda.db");
db.exec("PRAGMA busy_timeout = 5000");

const PRECIOS = {
  "Polo Ralph Lauren": { camiseta: 154.99, gorra: 109.99 },
  "Levi's": { pantalon: 169.99, chaqueta: 189.99 },
  Nike: { camiseta: 109.99, pantalon: 149.99, gorra: 104.99 },
  "Under Armour": { chaqueta: 179.99 },
  Gap: { camiseta: 104.99 },
  Champion: { chaqueta: 129.99 },
  Carhartt: { camiseta: 139.99 },
  "The North Face": { chaqueta: 229.99 },
  "American Eagle": { camiseta: 104.99 },
  "Old Navy": { pantalon: 119.99 },
  Wrangler: { pantalon: 149.99 },
  "Tommy Hilfiger": { camiseta: 129.99, chaqueta: 199.99, pantalon: 159.99 },
  "Calvin Klein": { camiseta: 114.99, chaqueta: 169.99, pantalon: 149.99 },
  Hollister: { camiseta: 109.99, chaqueta: 134.99, pantalon: 144.99 },
  "Abercrombie & Fitch": { camiseta: 114.99, chaqueta: 149.99 },
  Nautica: { camiseta: 129.99 },
};

const upd = db.prepare(
  "UPDATE productos SET precio_venta=?, precio_costo=? WHERE marca=? AND categoria=? AND activo=1"
);
let n = 0;
for (const [marca, cats] of Object.entries(PRECIOS)) {
  for (const [cat, venta] of Object.entries(cats)) {
    const costo = Math.round(venta * 0.42 * 100) / 100;
    const r = upd.run(venta, costo, marca, cat);
    n += r.changes;
  }
}

const nuevas = [
  ["Camiseta A&F logo clásico", "camiseta", "M", "Abercrombie & Fitch", 48.0, 114.99, 3],
  ["Sudadera A&F heritage", "chaqueta", "L", "Abercrombie & Fitch", 63.0, 149.99, 2],
  ["Polo Nautica marino", "camiseta", "M", "Nautica", 54.0, 129.99, 3],
  ["Camisa Nautica deck", "camiseta", "L", "Nautica", 59.0, 139.99, 2],
];
const ins = db.prepare(
  `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
   SELECT ?, ?, ?, ?, 'A', ?, ?, ?
   WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre=? AND marca=?)`
);
for (const v of nuevas) ins.run(...v, v[0], v[3]);

const rango = db
  .prepare("SELECT MIN(precio_venta) min, MAX(precio_venta) max FROM productos WHERE activo=1")
  .get();
console.log(`precios actualizados en ${n} filas | rango activo: $${rango.min} - $${rango.max}`);
