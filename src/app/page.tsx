import Link from "next/link";
import { one, q } from "@/lib/db";
import { seedDemo } from "@/lib/seed";
import { usd, fechaHora, pct } from "@/lib/format";
import KpiCard from "@/components/KpiCard";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const totalProductos = one<{ n: number }>(
    "SELECT COUNT(*) AS n FROM productos WHERE activo=1"
  )?.n ?? 0;

  if (totalProductos === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-xl font-bold">Bienvenido a RopaFlow</h1>
        <p className="mt-2 text-sm text-slate-400">
          Tu base de datos está vacía. Carga datos de ejemplo (productos de ropa
          americana, clientes y 14 días de ventas) para explorar el sistema.
        </p>
        <form action={seedDemo} className="mt-6">
          <button className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400">
            Cargar datos de ejemplo
          </button>
        </form>
      </div>
    );
  }

  const hoy = one<{ n: number; t: number; c: number }>(
    `SELECT COUNT(*) AS n, COALESCE(SUM(total),0) AS t, COALESCE(SUM(costo_total),0) AS c
     FROM ventas WHERE date(fecha)=date('now','localtime')`
  )!;
  const mes = one<{ n: number; t: number; c: number }>(
    `SELECT COUNT(*) AS n, COALESCE(SUM(total),0) AS t, COALESCE(SUM(costo_total),0) AS c
     FROM ventas WHERE strftime('%Y-%m', fecha)=strftime('%Y-%m','now','localtime')`
  )!;
  const stockBajo = one<{ n: number }>(
    "SELECT COUNT(*) AS n FROM productos WHERE activo=1 AND stock<=2"
  )?.n ?? 0;
  const topCat = q<{ categoria: string; unidades: number; ingreso: number }>(
    `SELECT p.categoria, SUM(i.cantidad) AS unidades, SUM(i.cantidad*i.precio_unit) AS ingreso
     FROM venta_items i
     JOIN productos p ON p.id=i.producto_id
     JOIN ventas v ON v.id=i.venta_id
     WHERE v.fecha >= datetime('now','localtime','-30 days')
     GROUP BY p.categoria ORDER BY ingreso DESC LIMIT 5`
  );
  const ultimas = q<{
    id: number; total: number; metodo_pago: string; fecha: string; cliente: string | null;
  }>(
    `SELECT v.id, v.total, v.metodo_pago, v.fecha, c.nombre AS cliente
     FROM ventas v LEFT JOIN clientes c ON c.id=v.cliente_id
     ORDER BY v.id DESC LIMIT 8`
  );

  const margenMes = pct(mes.t - mes.c, mes.t);
  const maxIngreso = Math.max(...topCat.map((c) => c.ingreso), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Ventas hoy" value={usd(hoy.t)} sub={`${hoy.n} transacciones`} tone="good" />
        <KpiCard label="Ticket promedio hoy" value={usd(hoy.n ? hoy.t / hoy.n : 0)} />
        <KpiCard
          label="Margen del mes"
          value={`${margenMes}%`}
          sub={`Ingresos ${usd(mes.t)} · Costo ${usd(mes.c)}`}
          tone={margenMes >= 50 ? "good" : margenMes >= 30 ? "warn" : "bad"}
        />
        <KpiCard
          label="Stock bajo (≤2)"
          value={String(stockBajo)}
          sub={stockBajo > 0 ? "Reponer pronto" : "Todo bien"}
          tone={stockBajo > 3 ? "bad" : stockBajo > 0 ? "warn" : "default"}
        />
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 font-semibold">Top categorías · últimos 30 días</h2>
        {topCat.length === 0 && (
          <p className="text-sm text-slate-500">Aún no hay ventas registradas.</p>
        )}
        <div className="space-y-2">
          {topCat.map((c) => (
            <div key={c.categoria} className="flex items-center gap-3 text-sm">
              <span className="w-28 shrink-0 truncate text-slate-300">{c.categoria}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(c.ingreso / maxIngreso) * 100}%` }}
                />
              </div>
              <span className="w-20 shrink-0 text-right font-medium">{usd(c.ingreso)}</span>
              <span className="w-16 shrink-0 text-right text-slate-500">{c.unidades} u.</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Últimas ventas</h2>
          <Link href="/vender" className="text-sm text-emerald-400 hover:text-emerald-300">
            + Nueva venta
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="pb-2">#</th><th className="pb-2">Cliente</th>
              <th className="pb-2">Método</th><th className="pb-2">Fecha</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ultimas.map((v) => (
              <tr key={v.id} className="border-t border-slate-800/60">
                <td className="py-1.5">{v.id}</td>
                <td>{v.cliente ?? <span className="text-slate-500">Ocasional</span>}</td>
                <td className="capitalize">{v.metodo_pago}</td>
                <td className="text-slate-400">{fechaHora(v.fecha)}</td>
                <td className="text-right font-medium">{usd(v.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
