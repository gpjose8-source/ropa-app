import fs from "node:fs";
import path from "node:path";
import { listarProductos } from "@/lib/db";
import Catalogo from "./Catalogo";

export const dynamic = "force-dynamic";

const DIR_FOTOS = path.join(process.cwd(), "public", "img", "productos");

function fotoDe(id: number): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(DIR_FOTOS, `${id}.${ext}`)))
      return `/img/productos/${id}.${ext}`;
  }
  return null;
}

export default function TiendaPage() {
  fs.mkdirSync(DIR_FOTOS, { recursive: true });
  const productos = listarProductos().map((p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    talla: p.talla,
    marca: p.marca,
    precio_venta: p.precio_venta,
    stock: p.stock,
    foto: fotoDe(p.id),
  }));
  return <Catalogo productos={productos} />;
}
