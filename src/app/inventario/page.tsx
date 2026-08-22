import { q } from "@/lib/db";
import { usd, pct } from "@/lib/format";
import { crearProducto, eliminarProducto, ajustarStock } from "@/actions/inventario";

export const dynamic = "force-dynamic";

export default async function Inventario({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const { q: busqueda = "", cat = "" } = await searchParams;

  const productos = q<{
    id: number; nombre: string; categoria: string; talla: string; marca: string;
    estado: string; precio_costo: number; precio_venta: number; stock: number;
  }>(
    `SELECT * FROM productos WHERE activo=1
     AND (?='' OR nombre LIKE '%'||?||'%' OR marca LIKE '%'||?||'%')
     AND (?='' OR categoria=?)
     ORDER BY categoria, nombre`,
    busqueda, busqueda, busqueda, cat, cat
  );

  const categorias = q<{ categoria: string }>(
    "SELECT DISTINCT categoria FROM productos WHERE activo=1 ORDER BY categoria"
  );

  const inputCls =
    "w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm outline-none focus:border-emerald-500";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventario</h1>

      <form method="get" className="flex flex-wrap gap-2">
        <input name="q" defaultValue={busqueda} placeholder="Buscar nombre o marca…" className={`${inputCls} max-w-xs flex-1`} />
        <select name="cat" defaultValue={cat} className={inputCls}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.categoria} value={c.categoria}>{c.categoria}</option>
          ))}
        </select>
        <button className="rounded-lg bg-slate-700 px-4 py-1.5 text-sm hover:bg-slate-600">Filtrar</button>
      </form>

      <details className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <summary className="cursor-pointer font-semibold text-emerald-400">+ Nueva prenda</summary>
        <form action={crearProducto} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <input name="nombre" required placeholder="Nombre *" className={`${inputCls} col-span-2`} />
          <input name="categoria" placeholder="Categoría" className={inputCls} />
          <input name="marca" placeholder="Marca" className={inputCls} />
          <input name="talla" placeholder="Talla (S/M/L/32…)" className={inputCls} />
          <select name="estado" className={inputCls}>
            <option value="A">Estado A</option><option value="B">Estado B</option><option value="C">Estado C</option>
          </select>
          <input name="precio_costo" type="number" step="0.01" min="0" placeholder="Costo $" className={inputCls} />
          <input name="precio_venta" type="number" step="0.01" min="0" placeholder="Venta $" className={inputCls} />
          <input name="stock" type="number" min="0" placeholder="Stock" className={inputCls} />
          <button className="col-span-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400 md:col-span-1">
            Guardar
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-900 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Prenda</th><th className="p-3">Cat.</th><th className="p-3">Talla</th>
              <th className="p-3">Estado</th><th className="p-3 text-right">Costo</th>
              <th className="p-3 text-right">Venta</th><th className="p-3 text-right">Margen</th>
              <th className="p-3 text-center">Stock</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const margen = pct(p.precio_venta - p.precio_costo, p.precio_venta);
              return (
                <tr key={p.id} className="border-t border-slate-800/60 hover:bg-slate-900/50">
                  <td className="p-3">
                    <span className="font-medium">{p.nombre}</span>
                    {p.marca && <span className="block text-xs text-slate-500">{p.marca}</span>}
                  </td>
                  <td className="text-slate-300">{p.categoria}</td>
                  <td>{p.talla}</td>
                  <td><BadgeEstado e={p.estado} /></td>
                  <td className="text-right text-slate-400">{usd(p.precio_costo)}</td>
                  <td className="text-right font-medium">{usd(p.precio_venta)}</td>
                  <td className={`text-right ${margen >= 55 ? "text-emerald-400" : margen >= 40 ? "text-amber-300" : "text-red-400"}`}>
                    {margen}%
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <form action={ajustarStock}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="delta" value="-1" />
                        <button className="h-6 w-6 rounded bg-slate-700 hover:bg-slate-600">−</button>
                      </form>
                      <span className={`w-8 text-center font-semibold ${p.stock <= 2 ? "text-red-400" : ""}`}>{p.stock}</span>
                      <form action={ajustarStock}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="delta" value="1" />
                        <button className="h-6 w-6 rounded bg-slate-700 hover:bg-slate-600">+</button>
                      </form>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <form action={eliminarProducto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {productos.length === 0 && (
              <tr><td colSpan={9} className="p-6 text-center text-slate-500">Sin resultados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BadgeEstado({ e }: { e: string }) {
  const cls =
    e === "A"
      ? "bg-emerald-500/15 text-emerald-400"
      : e === "B"
      ? "bg-amber-500/15 text-amber-400"
      : "bg-red-500/15 text-red-400";
  return <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${cls}`}>{e}</span>;
}
