import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { listarProductos } from "@/lib/db";
import Catalogo from "./Catalogo";

export const dynamic = "force-dynamic";

const URL_TIENDA = process.env.URL_PUBLICA_TIENDA ?? "https://ropa-app-three.vercel.app/tienda";

const DIR_FOTOS = path.join(process.cwd(), "public", "img", "productos");

function fotoDe(id: number): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(DIR_FOTOS, `${id}.${ext}`)))
      return `/img/productos/${id}.${ext}`;
  }
  return null;
}

export default async function TiendaPage() {
  fs.mkdirSync(DIR_FOTOS, { recursive: true });
  const qr = await QRCode.toDataURL(URL_TIENDA, {
    width: 420,
    margin: 1,
    color: { dark: "#111111", light: "#ffffff" },
  });
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
  return <Catalogo productos={productos} qr={qr} urlTienda={URL_TIENDA} />;
}
