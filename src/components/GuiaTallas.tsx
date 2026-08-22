import { guiaTallas } from "@/lib/tienda";

export default function GuiaTallas({
  categoria,
  onClose,
}: {
  categoria: string;
  onClose: () => void;
}) {
  const guia = guiaTallas(categoria);
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-black">📏 {guia.titulo}</h3>
          <button onClick={onClose} className="rounded-lg bg-gray-100 px-3 py-1 font-bold text-slate-800 hover:bg-red-50">✕</button>
        </div>
        <table className="w-full overflow-hidden rounded-xl text-sm ring-1 ring-gray-200">
          <thead>
            <tr className="bg-red-600 text-left text-white">
              {guia.cols.map((c) => (
                <th key={c} className="px-3 py-2 font-bold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guia.filas.map((f, i) => (
              <tr key={i} className={i % 2 ? "bg-red-50/50" : "bg-white"}>
                {Object.values(f).map((v, j) => (
                  <td key={j} className={`px-3 py-2 ${j === 0 ? "font-black text-black" : "text-slate-800"}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-slate-800 ring-1 ring-amber-200">
          💡 <b>Consejo:</b> si estás entre dos tallas, elige la mayor — la ropa americana suele quedar ajustada.
          ¿Dudas? Escríbenos y te asesora un vendedor real.
        </p>
      </div>
    </div>
  );
}
