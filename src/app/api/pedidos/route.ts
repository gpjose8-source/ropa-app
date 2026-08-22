import { NextResponse } from "next/server";
import { run, one } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cliente = String(body.cliente ?? "").trim();
    const telefono = String(body.telefono ?? "").trim();
    const productoId = Number(body.productoId ?? 0);
    const talla = String(body.talla ?? "").trim();
    const total = Number(body.total ?? 0);
    const metodo = String(body.metodo ?? "efectivo").trim();

    if (!cliente || !productoId || total <= 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    run(
      `INSERT INTO pedidos (cliente, telefono, producto_id, talla, total, metodo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      cliente,
      telefono,
      productoId,
      talla,
      total,
      metodo
    );
    const row = one<{ id: number }>("SELECT last_insert_rowid() AS id");
    return NextResponse.json({ ok: true, pedido: `GO-${1000 + (row?.id ?? 0)}` });
  } catch (e) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
