import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("C:/Users/jose-/ropa-app/tienda.db");
db.exec("PRAGMA busy_timeout = 5000");

db.exec(`
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  producto_id INTEGER REFERENCES productos(id),
  talla TEXT,
  total REAL NOT NULL,
  metodo TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  creado_en TEXT DEFAULT (datetime('now','localtime'))
);
`);

db.exec(`
UPDATE productos SET precio_venta =
  CAST(ROUND(precio_costo * 2.2 + 4) AS INTEGER) + 0.99
`);

const filas = db.prepare("SELECT nombre, precio_costo, precio_venta FROM productos ORDER BY id").all();
let suma = 0;
for (const f of filas) {
  console.log(`${f.nombre.padEnd(34)} costo $${f.precio_costo.toFixed(2)} -> venta $${f.precio_venta.toFixed(2)}`);
  suma += f.precio_venta;
}
console.log("prendas:", filas.length, "| ticket promedio: $" + (suma / filas.length).toFixed(2));
