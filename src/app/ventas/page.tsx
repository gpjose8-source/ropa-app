import { q } from "@/lib/db";
import { usd, fechaHora } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Ventas({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;

  const ventas = q<{
    id: number;
    cliente: string | null;
    total: number;
    metodo_pago: string;
    fecha: string;
    detalle: string;
  }>(
    `SELECT v.id, c.nombre AS cliente, v.total, v.metodo_pago, v.fecha,
       COALESCE((
         SELECT GROUP_CONCAT(p.nombre || ' x' || i.cantidad, ' Â· ')
         FROM venta_items i JOIN productos p ON p.id = i.producto_id
         WHERE i.venta_id = v.id
       ), '') AS detalle
     FROM ventas v LEFT JOIN clientes c ON c.id = v.cliente_id
     ORDER BY v.id DESC LIMIT 100`
  );

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Historial de ventas</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-white text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">#</th><th className="p-3">Cliente</th>
              <th className="p-3">Detalle</th><th className="p-3">MÃ©todo</th>
              <th className="p-3">Fecha</th><th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((vta) => (
              <tr
                key={vta.id}
                className={`border-t border-gray-200/60 ${
                  String(vta.id) === v ? "bg-red-600/10" : "hover:bg-white/50"
                }`}
              >
                <td className="p-3">{vta.id}</td>
                <td>{vta.cliente ?? <span className="text-slate-500">Ocasional</span>}</td>
                <td className="max-w-[280px] truncate text-slate-800">{vta.detalle}</td>
                <td className="capitalize">{vta.metodo_pago}</td>
                <td className="text-slate-800">{fechaHora(vta.fecha)}</td>
                <td className="p-3 text-right font-semibold">{usd(vta.total)}</td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-500">
                AÃºn no hay ventas registradas.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
