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
