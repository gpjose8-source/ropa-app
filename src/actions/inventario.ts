"use server";

import { revalidatePath } from "next/cache";
import { run } from "@/lib/db";

export async function crearProducto(fd: FormData): Promise<void> {
  const nombre = String(fd.get("nombre") || "").trim();
  if (!nombre) return;
  run(
    `INSERT INTO productos (nombre,categoria,talla,marca,estado,precio_costo,precio_venta,stock)
     VALUES (?,?,?,?,?,?,?,?)`,
    nombre,
    String(fd.get("categoria") || "Otros").trim(),
    String(fd.get("talla") || "U").trim(),
    String(fd.get("marca") || "").trim(),
    String(fd.get("estado") || "A"),
    Number(fd.get("precio_costo")) || 0,
    Number(fd.get("precio_venta")) || 0,
    Math.max(0, Math.floor(Number(fd.get("stock")) || 0))
  );
  revalidatePath("/inventario");
  revalidatePath("/");
}

export async function eliminarProducto(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  if (!id) return;
  run("UPDATE productos SET activo=0 WHERE id=?", id);
  revalidatePath("/inventario");
}

export async function ajustarStock(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const delta = Number(fd.get("delta"));
  if (!id || !Number.isFinite(delta)) return;
  run("UPDATE productos SET stock = MAX(0, stock + ?) WHERE id=?", delta, id);
  revalidatePath("/inventario");
}
