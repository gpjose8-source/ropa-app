import { NextResponse } from "next/server";
import { run, one } from "@/lib/db";
import { precioFinal, COSTO_ENVIO, ENVIO_GRATIS_DESDE } from "@/lib/tienda";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cliente = String(body.cliente ?? "").trim();
    const telefono = String(body.telefono ?? "").trim();
    const productoId = Number(body.productoId ?? 0);
    const talla = String(body.talla ?? "").trim();
    const metodo = String(body.metodo ?? "efectivo").trim();
    const envio = String(body.envio ?? "recoger").trim();
    const ciudad = String(body.ciudad ?? "").trim();
    const direccion = String(body.direccion ?? "").trim();

    if (!cliente || !productoId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (envio === "nacional" && (!ciudad || direccion.length < 5)) {
      return NextResponse.json({ error: "Completa ciudad y dirección" }, { status: 400 });
    }

    const prod = one<{ id: number; precio_venta: number; stock: number }>(
      "SELECT id, precio_venta, stock FROM productos WHERE id=? AND activo=1",
      productoId
    );
    if (!prod || prod.stock <= 0) {
      return NextResponse.json({ error: "Producto agotado" }, { status: 409 });
    }

    const subtotal = precioFinal(prod.precio_venta);
    const costoEnvio =
      envio === "nacional" ? (subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO) : 0;
    const total = Math.round((subtotal + costoEnvio) * 100) / 100;

    run(
      `INSERT INTO pedidos (cliente, telefono, producto_id, talla, total, metodo, envio, ciudad, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      cliente,
      telefono,
      productoId,
      talla,
      total,
      metodo,
      envio,
      envio === "nacional" ? ciudad : "",
      envio === "nacional" ? direccion : ""
    );
    run("UPDATE productos SET stock = stock - 1 WHERE id=?", productoId);

    const row = one<{ id: number }>("SELECT last_insert_rowid() AS id");
    return NextResponse.json({
      ok: true,
      pedido: `GO-${1000 + (row?.id ?? 0)}`,
      subtotal,
      costoEnvio,
      total,
    });
  } catch (e) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
