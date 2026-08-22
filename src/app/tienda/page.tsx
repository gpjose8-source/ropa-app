import { listarProductos } from "@/lib/db";
import Catalogo from "./Catalogo";

export const dynamic = "force-dynamic";

export default function TiendaPage() {
  const productos = listarProductos().map((p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    talla: p.talla,
    marca: p.marca,
    precio_venta: p.precio_venta,
    stock: p.stock,
  }));
  return <Catalogo productos={productos} />;
}
