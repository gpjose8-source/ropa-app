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

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  producto_id INTEGER REFERENCES productos(id),
  talla TEXT,
  total REAL NOT NULL,
  metodo TEXT NOT NULL,
  envio TEXT DEFAULT 'recoger',
  ciudad TEXT DEFAULT '',
  direccion TEXT DEFAULT '',
  estado TEXT DEFAULT 'pendiente',
  creado_en TEXT DEFAULT (datetime('now','localtime'))
);
`;


export function db(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    _db.exec(SCHEMA);
    const colsPedidos = _db.prepare("PRAGMA table_info(pedidos)").all() as {
      name: string;
    }[];
    const tiene = (n: string) => colsPedidos.some((c) => c.name === n);
    if (!tiene("envio"))
      _db.exec("ALTER TABLE pedidos ADD COLUMN envio TEXT DEFAULT 'recoger'");
    if (!tiene("ciudad"))
      _db.exec("ALTER TABLE pedidos ADD COLUMN ciudad TEXT DEFAULT ''");
    if (!tiene("direccion"))
      _db.exec("ALTER TABLE pedidos ADD COLUMN direccion TEXT DEFAULT ''");

    const n = one<{ c: number }>("SELECT COUNT(*) c FROM productos");
    if ((n?.c ?? 0) === 0) {
      const demo: [string, string, string, string, number, number, number][] = [
        ["Camiseta HCO logo clásico", "camiseta", "M", "Hollister", 3.5, 12.99, 4],
        ["Camiseta HCO gráfica playa", "camiseta", "L", "Hollister", 4.0, 13.99, 3],
        ["Camiseta básica CK slim fit", "camiseta", "M", "Calvin Klein", 4.5, 14.99, 5],
        ["Camiseta CK cuello V negra", "camiseta", "L", "Calvin Klein", 4.5, 14.99, 3],
        ["Polo Tommy bandera clásica", "camiseta", "M", "Tommy Hilfiger", 6.0, 17.99, 4],
        ["Polo Tommy piqué azul", "camiseta", "L", "Tommy Hilfiger", 6.0, 17.99, 2],
        ["Camisa CK slim manga larga", "camiseta", "M", "Calvin Klein", 5.5, 16.99, 2],
        ["Sudadera HCO crew gris", "chaqueta", "L", "Hollister", 6.5, 18.99, 3],
        ["Chompa CK quarter-zip", "chaqueta", "M", "Calvin Klein", 8.0, 22.99, 2],
        ["Rompevientos Tommy retro", "chaqueta", "L", "Tommy Hilfiger", 8.5, 23.99, 2],
        ["Jeans Tommy recto original", "pantalon", "32", "Tommy Hilfiger", 7.0, 19.99, 3],
        ["Jeans HCO skinny moderno", "pantalon", "30", "Hollister", 6.0, 17.99, 3],
        ["Short HCO playa estampado", "pantalon", "M", "Hollister", 4.0, 13.99, 4],
        ["Jogger CK logo lateral", "pantalon", "L", "Calvin Klein", 6.5, 18.99, 2],
        ["Camiseta polo Big Pony clásica", "camiseta", "M", "Polo Ralph Lauren", 9.0, 23.99, 3],
        ["Camisa oxford RL slim fit", "camiseta", "L", "Polo Ralph Lauren", 7.5, 20.99, 2],
        ["Gorra RL pony bordado", "gorra", "Única", "Polo Ralph Lauren", 4.0, 12.99, 3],
        ["Jeans 501 original recto", "pantalon", "32", "Levi's", 9.5, 24.99, 3],
        ["Chaqueta trucker denim", "chaqueta", "M", "Levi's", 8.5, 22.99, 2],
        ["Camiseta Dry-Fit training", "camiseta", "M", "Nike", 4.5, 13.99, 4],
        ["Jogger tech fleece", "pantalon", "L", "Nike", 8.0, 21.99, 2],
        ["Gorra snapback swoosh", "gorra", "Única", "Nike", 3.5, 11.99, 3],
        ["Chompa UA storm coldgear", "chaqueta", "M", "Under Armour", 8.5, 22.99, 2],
        ["Camiseta logo Gap básica", "camiseta", "L", "Gap", 3.5, 11.99, 4],
        ["Sudadera Champion crewneck", "chaqueta", "L", "Champion", 6.0, 17.99, 3],
        ["Camisa franela trabajo", "camiseta", "XL", "Carhartt", 6.5, 18.99, 2],
        ["Rompevientos 1996 retro", "chaqueta", "L", "The North Face", 10.0, 25.99, 2],
        ["Camiseta gráfica supersoft", "camiseta", "M", "American Eagle", 4.0, 12.99, 3],
        ["Pantalón cargo relaxed", "pantalon", "34", "Old Navy", 5.5, 15.99, 3],
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
