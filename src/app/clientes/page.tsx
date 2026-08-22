import { q } from "@/lib/db";
import { usd } from "@/lib/format";
import { crearCliente } from "@/actions/clientes";

export const dynamic = "force-dynamic";

export default function Clientes() {
  const clientes = q<{
    id: number; nombre: string; telefono: string;
    compras: number; gastado: number; ultima: string | null;
  }>(
    `SELECT c.id, c.nombre, c.telefono,
       COUNT(v.id) AS compras,
       COALESCE(SUM(v.total),0) AS gastado,
       MAX(v.fecha) AS ultima
     FROM clientes c LEFT JOIN ventas v ON v.cliente_id = c.id
     GROUP BY c.id ORDER BY gastado DESC`
  );

  const inputCls =
    "w-full rounded-lg border border-gray-300 bg-gray-100 px-2 py-1.5 text-sm outline-none focus:border-red-500";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Clientes</h1>

      <details className="rounded-xl border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-red-600">+ Nuevo cliente</summary>
        <form action={crearCliente} className="mt-4 flex flex-wrap gap-3">
          <input name="nombre" required placeholder="Nombre *" className={`${inputCls} max-w-xs flex-1`} />
          <input name="telefono" placeholder="TelÃ©fono" className={`${inputCls} max-w-[180px]`} />
          <button className="rounded-lg bg-red-600 px-4 py-1.5 font-semibold text-white hover:bg-red-500">
            Guardar
          </button>
        </form>
      </details>

      <div className="grid gap-3 md:grid-cols-2">
        {clientes.map((c, i) => (
          <div key={c.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              i === 0 ? "bg-amber-500/20 text-amber-400" : "bg-gray-100 text-slate-800"
            }`}>
              {c.nombre.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{c.nombre}</p>
              <p className="text-xs text-slate-500">
                {c.compras} compras Â· Ãšltima: {c.ultima ? c.ultima.slice(0, 10) : "â€”"}
                {c.telefono && ` Â· ${c.telefono}`}
              </p>
            </div>
            <span className="shrink-0 font-semibold text-red-600">{usd(c.gastado)}</span>
          </div>
        ))}
        {clientes.length === 0 && (
          <p className="text-sm text-slate-500">Sin clientes registrados todavÃ­a.</p>
        )}
      </div>
    </div>
  );
}
