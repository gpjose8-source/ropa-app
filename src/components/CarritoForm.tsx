"use client";

import { useMemo, useState } from "react";
import { crearVenta } from "@/actions/ventas";
import { usd } from "@/lib/format";
import type { Cliente, Producto } from "@/lib/db";

type Fila = { pid: number; cant: number };

export default function CarritoForm({
  productos,
  clientes,
}: {
  productos: Producto[];
  clientes: Cliente[];
}) {
  const [filas, setFilas] = useState<Fila[]>([{ pid: productos[0].id, cant: 1 }]);
  const [enviando, setEnviando] = useState(false);

  const porId = useMemo(
    () => new Map(productos.map((p) => [p.id, p])),
    [productos]
  );

  const total = filas.reduce((acc, f) => {
    const p = porId.get(f.pid);
    return acc + (p ? p.precio_venta * f.cant : 0);
  }, 0);

  const inputCls =
    "rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm outline-none focus:border-emerald-500";

  function actualizar(i: number, cambios: Partial<Fila>) {
    setFilas((fs) => fs.map((f, j) => (j === i ? { ...f, ...cambios } : f)));
  }

  return (
    <form
      action={crearVenta}
      onSubmit={() => setEnviando(true)}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4"
    >
      <input type="hidden" name="lineas" value={JSON.stringify(filas)} />

      <div className="space-y-2">
        {filas.map((f, i) => {
          const p = porId.get(f.pid)!;
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <select
                value={f.pid}
                onChange={(e) => actualizar(i, { pid: Number(e.target.value) })}
                className={`${inputCls} min-w-[220px] flex-1`}
              >
                {productos.map((pr) => (
                  <option key={pr.id} value={pr.id}>
                    {pr.nombre} · {pr.talla} · {usd(pr.precio_venta)} (stock {pr.stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={p.stock}
                value={f.cant}
                onChange={(e) =>
                  actualizar(i, {
                    cant: Math.min(Math.max(1, Number(e.target.value) || 1), p.stock),
                  })
                }
                className={`${inputCls} w-20 text-center`}
              />
              <span className="w-24 text-right text-sm font-medium">
                {usd(p.precio_venta * f.cant)}
              </span>
              {filas.length > 1 && (
                <button
                  type="button"
                  onClick={() => setFilas((fs) => fs.filter((_, j) => j !== i))}
                  className="rounded-lg bg-slate-700 px-2 py-1 text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          setFilas((fs) => [...fs, { pid: productos[0].id, cant: 1 }])
        }
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
      >
        + Agregar prenda
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <div className="flex flex-wrap gap-2">
          <select name="cliente_id" className={inputCls} defaultValue="">
            <option value="">Cliente ocasional</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <select name="metodo_pago" className={inputCls}>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-emerald-400">{usd(total)}</span>
          <button
            disabled={enviando || total === 0}
            className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            Cobrar
          </button>
        </div>
      </div>
    </form>
  );
}
