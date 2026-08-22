import path from "node:path";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

const DB_PATH =
  process.env.VERCEL === "1"
    ? "/tmp/tienda.db"
    : path.join(process.cwd(), "tienda.db");

let _db: DatabaseSync | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  talla TEXT NOT NULL DEFAULT 'M',
  marca TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'A',
  precio_costo REAL NOT NULL DEFAULT 0,
  precio_venta REAL NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  activo INTEGER NOT NULL DEFAULT 1,
  creado_en TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  creado_en TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS ventas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER REFERENCES clientes(id),
  total REAL NOT NULL DEFAULT 0,
  costo_total REAL NOT NULL DEFAULT 0,
  metodo_pago TEXT NOT NULL DEFAULT 'efectivo',
  fecha TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS venta_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unit REAL NOT NULL,
  costo_unit REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS canciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  archivo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  artista TEXT DEFAULT '',
  likes INTEGER NOT NULL DEFAULT 0,
  agregada_en TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS eventos_musica (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cancion_id INTEGER NOT NULL REFERENCES canciones(id) ON DELETE CASCADE,
  evento TEXT NOT NULL CHECK (evento IN ('PLAY','DONE','SKIP','LIKE')),
  creado_en TEXT DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_eventos_cancion ON eventos_musica(cancion_id, evento, creado_en);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
`;

export function db(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    _db.exec(SCHEMA);
    const n = one<{ c: number }>("SELECT COUNT(*) c FROM productos");
    if ((n?.c ?? 0) === 0) {
      const demo: [string, string, string, string, number, number, number][] = [
        ["Camiseta básica algodón premium", "camiseta", "M", "American Eagle", 2.5, 6.5, 4],
        ["Camiseta estampada retro", "camiseta", "L", "Hollister", 3.0, 7.5, 3],
        ["Camiseta deportiva dry-fit", "camiseta", "S", "Nike", 3.5, 8.0, 5],
        ["Jeans recto clásico", "pantalon", "32", "Levis", 5.0, 12.0, 3],
        ["Jean skinny moderno", "pantalon", "28", "Zara", 4.5, 11.0, 2],
        ["Pantalón cargo urbano", "pantalon", "34", "HM", 5.5, 13.0, 4],
        ["Chaqueta jean vintage", "chaqueta", "M", "Wrangler", 7.0, 15.0, 2],
        ["Chaqueta impermeable", "chaqueta", "L", "Columbia", 6.5, 14.0, 3],
        ["Vestido floral verano", "vestido", "S", "Forever21", 4.0, 9.5, 3],
        ["Vestido lino elegante", "vestido", "M", "Mango", 4.5, 10.5, 2],
        ["Blusa bordada artesanal", "blusa", "M", "Artesanal", 3.0, 7.5, 4],
        ["Blusa satén noche", "blusa", "P", "Bershka", 3.5, 8.0, 2],
        ["Zapatillas urbanas", "zapatos", "41", "Adidas", 6.0, 14.0, 2],
        ["Sandalias verano", "zapatos", "38", "Rack", 4.0, 9.0, 3],
      ];
      const ins = db().prepare(
        `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
         VALUES (?, ?, ?, ?, 'A', ?, ?, ?)`
      );
      for (const d of demo) ins.run(...d);
    }
  }
  return _db;
}

export function q<T>(sql: string, ...params: (string | number | null)[]): T[] {
  return db().prepare(sql).all(...params) as T[];
}

export function one<T>(
  sql: string,
  ...params: (string | number | null)[]
): T | null {
  return (db().prepare(sql).get(...params) as T) ?? null;
}

export function run(sql: string, ...params: (string | number | null)[]): void {
  db().prepare(sql).run(...params);
}

export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  talla: string;
  marca: string;
  estado: string;
  precio_costo: number;
  precio_venta: number;
  stock: number;
  activo: number;
};

export type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
};

export function listarProductos(soloStock = true): Producto[] {
  return q<Producto>(
    `SELECT * FROM productos WHERE activo=1 ${
      soloStock ? "AND stock > 0" : ""
    } ORDER BY categoria, nombre`
  );
}

export function listarClientes(): Cliente[] {
  return q<Cliente>("SELECT id, nombre, telefono FROM clientes ORDER BY nombre");
}

export function musicaDir(): string {
  return path.join(process.cwd(), "public", "music");
}

export function escanearMusica(): { agregadas: number; eliminadas: number } {
  const dir = musicaDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const archivos = new Set(
    fs.readdirSync(dir).filter((f) => /\.(mp3|wav)$/i.test(f))
  );

  const existentes = new Set(
    q<{ archivo: string }>("SELECT archivo FROM canciones").map((r) => r.archivo)
  );

  let agregadas = 0;
  for (const archivo of archivos) {
    if (!existentes.has(archivo)) {
      const limpio = archivo.replace(/\.(mp3|wav)$/i, "");
      const [artista, titulo] = limpio.includes(" - ")
        ? [limpio.split(" - ")[0].trim(), limpio.split(" - ").slice(1).join(" - ").trim()]
        : ["", limpio.trim()];
      run(
        "INSERT INTO canciones (archivo, titulo, artista) VALUES (?, ?, ?)",
        archivo,
        titulo || limpio,
        artista
      );
      agregadas++;
    }
  }

  let eliminadas = 0;
  for (const archivo of existentes) {
    if (!archivos.has(archivo)) {
      run("DELETE FROM canciones WHERE archivo=?", archivo);
      eliminadas++;
    }
  }
  return { agregadas, eliminadas };
}
