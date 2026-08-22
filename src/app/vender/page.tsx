import { listarClientes, listarProductos } from "@/lib/db";
import CarritoForm from "@/components/CarritoForm";

export const dynamic = "force-dynamic";

export default function Vender() {
  const productos = listarProductos(true).map((p) => ({ ...p }));
  const clientes = listarClientes().map((c) => ({ ...c }));

  if (productos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
        No hay prendas con stock disponible. Agrega productos en{" "}
        <a href="/inventario" className="text-emerald-400 hover:underline">Inventario</a>.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Nueva venta</h1>
      <CarritoForm productos={productos} clientes={clientes} />
    </div>
  );
}
