"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { one, run } from "@/lib/db";

type Linea = { pid: number; cant: number };

export async function crearVenta(fd: FormData): Promise<void> {
  let lineas: Linea[] = [];
  try {
    lineas = JSON.parse(String(fd.get("lineas") || "[]")) as Linea[];
  } catch {
    return;
  }
  const clienteId = Number(fd.get("cliente_id")) || null;
  const metodo = String(fd.get("metodo_pago") || "efectivo");
  if (!lineas.length) return;

  let total = 0;
  let costoTotal = 0;
  const det: { pid: number; cant: number; pu: number; cu: number }[] = [];

  for (const l of lineas) {
    const p = one<{ precio_venta: number; precio_costo: number; stock: number }>(
      "SELECT precio_venta, precio_costo, stock FROM productos WHERE id=? AND activo=1",
      l.pid
    );
    if (!p) continue;
    const cant = Math.min(Math.max(1, Math.floor(l.cant) || 1), p.stock);
    if (cant <= 0) continue;
    total += p.precio_venta * cant;
    costoTotal += p.precio_costo * cant;
    det.push({ pid: l.pid, cant, pu: p.precio_venta, cu: p.precio_costo });
  }
  if (!det.length) return;

  run(
    "INSERT INTO ventas (cliente_id, total, costo_total, metodo_pago) VALUES (?, ?, ?, ?)",
    clienteId,
    total,
    costoTotal,
    metodo
  );
  const ventaId = one<{ id: number }>("SELECT last_insert_rowid() AS id")!.id;

  for (const d of det) {
    run(
      "INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unit, costo_unit) VALUES (?,?,?,?,?)",
      ventaId,
      d.pid,
      d.cant,
      d.pu,
      d.cu
    );
    run("UPDATE productos SET stock = stock - ? WHERE id=?", d.cant, d.pid);
  }

  revalidatePath("/");
  revalidatePath("/ventas");
  revalidatePath("/inventario");
  redirect(`/ventas?v=${ventaId}`);
}
