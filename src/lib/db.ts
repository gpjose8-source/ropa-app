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

    const colsProductos = _db.prepare("PRAGMA table_info(productos)").all() as {
      name: string;
    }[];
    if (!colsProductos.some((c) => c.name === "video"))
      _db.exec("ALTER TABLE productos ADD COLUMN video TEXT DEFAULT NULL");

    const n = one<{ c: number }>("SELECT COUNT(*) c FROM productos");
    if ((n?.c ?? 0) === 0) {
      const demo: [string, string, string, string, number, number, number][] = [
        ["Camiseta HCO logo clásico", "camiseta", "M", "Hollister", 46.0, 109.99, 4],
        ["Camiseta HCO gráfica playa", "camiseta", "L", "Hollister", 46.0, 109.99, 3],
        ["Camiseta básica CK slim fit", "camiseta", "M", "Calvin Klein", 48.0, 114.99, 5],
        ["Camiseta CK cuello V negra", "camiseta", "L", "Calvin Klein", 48.0, 114.99, 3],
        ["Polo Tommy bandera clásica", "camiseta", "M", "Tommy Hilfiger", 55.0, 129.99, 4],
        ["Polo Tommy piqué azul", "camiseta", "L", "Tommy Hilfiger", 55.0, 129.99, 2],
        ["Camisa CK slim manga larga", "camiseta", "M", "Calvin Klein", 48.0, 114.99, 2],
        ["Sudadera HCO crew gris", "chaqueta", "L", "Hollister", 57.0, 134.99, 3],
        ["Chompa CK quarter-zip", "chaqueta", "M", "Calvin Klein", 71.0, 169.99, 2],
        ["Rompevientos Tommy retro", "chaqueta", "L", "Tommy Hilfiger", 84.0, 199.99, 2],
        ["Jeans Tommy recto original", "pantalon", "32", "Tommy Hilfiger", 67.0, 159.99, 3],
        ["Jeans HCO skinny moderno", "pantalon", "30", "Hollister", 61.0, 144.99, 3],
        ["Short HCO playa estampado", "pantalon", "M", "Hollister", 46.0, 109.99, 4],
        ["Jogger CK logo lateral", "pantalon", "L", "Calvin Klein", 63.0, 149.99, 2],
        ["Camiseta polo Big Pony clásica", "camiseta", "M", "Polo Ralph Lauren", 65.0, 154.99, 3],
        ["Camisa oxford RL slim fit", "camiseta", "L", "Polo Ralph Lauren", 65.0, 154.99, 2],
        ["Gorra RL pony bordado", "gorra", "Única", "Polo Ralph Lauren", 46.0, 109.99, 3],
        ["Jeans 501 original recto", "pantalon", "32", "Levi's", 71.0, 169.99, 3],
        ["Chaqueta trucker denim", "chaqueta", "M", "Levi's", 80.0, 189.99, 2],
        ["Camiseta Dry-Fit training", "camiseta", "M", "Nike", 46.0, 109.99, 4],
        ["Jogger tech fleece", "pantalon", "L", "Nike", 63.0, 149.99, 2],
        ["Gorra snapback swoosh", "gorra", "Única", "Nike", 44.0, 104.99, 3],
        ["Chompa UA storm coldgear", "chaqueta", "M", "Under Armour", 76.0, 179.99, 2],
        ["Camiseta logo Gap básica", "camiseta", "L", "Gap", 44.0, 104.99, 4],
        ["Sudadera Champion crewneck", "chaqueta", "L", "Champion", 55.0, 129.99, 3],
        ["Camisa franela trabajo", "camiseta", "XL", "Carhartt", 59.0, 139.99, 2],
        ["Rompevientos 1996 retro", "chaqueta", "L", "The North Face", 97.0, 229.99, 2],
        ["Camiseta gráfica supersoft", "camiseta", "M", "American Eagle", 44.0, 104.99, 3],
        ["Pantalón cargo relaxed", "pantalon", "34", "Old Navy", 50.0, 119.99, 3],
        ["Camiseta A&F logo clásico", "camiseta", "M", "Abercrombie & Fitch", 48.0, 114.99, 3],
        ["Sudadera A&F heritage", "chaqueta", "L", "Abercrombie & Fitch", 63.0, 149.99, 2],
        ["Polo Nautica marino", "camiseta", "M", "Nautica", 54.0, 129.99, 3],
        ["Camisa Nautica deck", "camiseta", "L", "Nautica", 59.0, 139.99, 2],
        ["Blazer RL lana azul marino", "chaqueta", "M", "Polo Ralph Lauren", 126.0, 299.99, 2],
        ["Abrigo camel clásico", "chaqueta", "L", "Polo Ralph Lauren", 147.0, 349.99, 2],
        ["Suéter merino cuello V", "chaqueta", "M", "Nautica", 105.0, 249.99, 2],
        ["Camisa de vestir CK slim negra", "camiseta", "M", "Calvin Klein", 109.0, 259.99, 2],
        ["Chino sartorial Tommy", "pantalon", "32", "Tommy Hilfiger", 101.0, 239.99, 2],
        ["Sudadera A&F cashmere blend", "chaqueta", "L", "Abercrombie & Fitch", 118.0, 279.99, 2],
      ];
      const ins = db().prepare(
        `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
         VALUES (?, ?, ?, ?, 'A', ?, ?, ?)`
      );
      for (const d of demo) ins.run(...d);
    }

    // Asignar los 15 videos reales a las prendas más caras (orden determinista)
    const tops = q<{ id: number }>(
      "SELECT id FROM productos WHERE activo=1 ORDER BY precio_venta DESC LIMIT 15"
    );
    tops.forEach((r, i) => {
      run("UPDATE productos SET video=? WHERE id=?", `video-${String(i + 1).padStart(2, "0")}.mp4`, r.id);
    });
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
  video?: string | null;
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
