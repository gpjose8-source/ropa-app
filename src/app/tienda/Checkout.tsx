import { useState } from "react";
import {
  CUENTA_BANCARIA,
  TEMPORADA,
  WHATSAPP_TIENDA,
  COSTO_ENVIO,
  ENVIO_GRATIS_DESDE,
  CIUDADES,
  fechaEntrega,
  precioFinal,
} from "@/lib/tienda";

type Prod = {
  id: number;
  nombre: string;
  talla: string;
  marca: string;
  precio_venta: number;
};

const METODOS = [
  { id: "tarjeta", icono: "💳", titulo: "Tarjeta de crédito/débito", detalle: "Visa · Mastercard · Diners" },
  { id: "transferencia", icono: "🏦", titulo: "Transferencia bancaria", detalle: "Pichincha · Guayaquil · Interbank" },
  { id: "efectivo", icono: "💵", titulo: "Efectivo al recoger", detalle: "Paga en tienda al recoger" },
];

function fmtNum(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function fmtExp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function Checkout({
  producto,
  onClose,
}: {
  producto: Prod;
  onClose: () => void;
}) {
  const [paso, setPaso] = useState(0);
  const [cliente, setCliente] = useState("");
  const [tel, setTel] = useState("");
  const [envio, setEnvio] = useState<"recoger" | "nacional">("recoger");
  const [ciudad, setCiudad] = useState("");
  const [dir, setDir] = useState("");
  const [metodo, setMetodo] = useState("tarjeta");
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [resultado, setResultado] = useState<{ pedido: string; costoEnvio: number; total: number } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const final = precioFinal(producto.precio_venta);
  const envioGratis = final >= ENVIO_GRATIS_DESDE;
  const costoEnvio = envio === "nacional" ? (envioGratis ? 0 : COSTO_ENVIO) : 0;
  const total = Math.round((final + costoEnvio) * 100) / 100;

  const tarjetaOk =
    num.replace(/\s/g, "").length === 16 && /^\d{2}\/\d{2}$/.test(exp) && cvv.length === 3;
  const datosOk = cliente.trim().length >= 2;
  const direccionOk = envio === "recoger" || (ciudad !== "" && dir.trim().length >= 5);

  async function confirmar() {
    setEnviando(true);
    try {
      const r = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente,
          telefono: tel,
          productoId: producto.id,
          talla: producto.talla,
          metodo,
          envio,
          ciudad,
          direccion: dir,
        }),
      });
      const j = await r.json();
      setResultado({
        pedido: j.pedido ?? `GO-${Date.now() % 9999}`,
        costoEnvio: j.costoEnvio ?? costoEnvio,
        total: j.total ?? total,
      });
      setPaso(2);
    } catch {
      setResultado({ pedido: `GO-${Date.now() % 9999}`, costoEnvio, total });
      setPaso(2);
    }
    setEnviando(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-gray-300 bg-white p-6 shadow-2xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-black text-black">🛒 Finalizar compra</h3>
          <button onClick={onClose} className="rounded-lg bg-gray-100 px-3 py-1 font-bold text-slate-800 hover:bg-red-50">✕</button>
        </div>

        {paso < 2 && (
          <div className="mb-4 flex items-center gap-2 text-xs font-bold">
            {["1 Datos", "2 Pago"].map((s, i) => (
              <span key={s} className={`flex-1 rounded-full py-1.5 text-center ${paso >= i ? "bg-red-600 text-white" : "bg-gray-100 text-slate-800"}`}>
                {s}
              </span>
            ))}
            <span className="flex-1 rounded-full bg-gray-100 py-1.5 text-center text-slate-800">3 Listo</span>
          </div>
        )}

        <div className="mb-5 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 p-4 ring-1 ring-red-100">
          <p className="text-sm font-bold text-black">{producto.nombre}</p>
          <p className="text-xs uppercase tracking-wide text-slate-800">{producto.marca} · Talla {producto.talla}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">${final.toFixed(2)}</span>
            <span className="text-sm text-slate-500 line-through">${producto.precio_venta.toFixed(2)}</span>
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">-{TEMPORADA.pct}% HOY</span>
          </div>
          {envioGratis ? (
            <p className="mt-1 text-xs font-bold text-green-700">🎉 ¡Envío nacional GRATIS incluido!</p>
          ) : (
            <p className="mt-1 text-xs text-slate-800">
              🚚 Te faltan <b>${(ENVIO_GRATIS_DESDE - final).toFixed(2)}</b> para envío gratis
            </p>
          )}
        </div>

        {paso === 0 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-black">Tu nombre *</label>
              <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Ej: José Pérez"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-black">WhatsApp de contacto</label>
              <input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="09XX XXX XXX"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 outline-none focus:border-red-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setEnvio("recoger")}
                className={`rounded-2xl border-2 p-3 text-left transition ${envio === "recoger" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                <span className="text-2xl">🏬</span>
                <span className="block text-sm font-black text-black">Recoger en tienda</span>
                <span className="block text-[11px] text-slate-800">Gratis · hoy mismo</span>
              </button>
              <button onClick={() => setEnvio("nacional")}
                className={`rounded-2xl border-2 p-3 text-left transition ${envio === "nacional" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                <span className="text-2xl">🚚</span>
                <span className="block text-sm font-black text-black">Envío a todo el Ecuador</span>
                <span className="block text-[11px] text-slate-800">{envioGratis ? "GRATIS 🎉" : `$${COSTO_ENVIO.toFixed(2)} · 24-72h`}</span>
              </button>
            </div>

            {envio === "nacional" && (
              <div className="space-y-3 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <div>
                  <label className="mb-1 block text-sm font-bold text-black">Ciudad *</label>
                  <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-red-500">
                    <option value="">Selecciona tu ciudad...</option>
                    {CIUDADES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-black">Dirección exacta *</label>
                  <input value={dir} onChange={(e) => setDir(e.target.value)} placeholder="Calle principal, número, referencias"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 outline-none focus:border-red-500" />
                </div>
                <p className="text-[11px] text-slate-800">📦 Entrega estimada: <b>{fechaEntrega()}</b></p>
              </div>
            )}

            <button disabled={!datosOk || !direccionOk} onClick={() => setPaso(1)}
              className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-500 disabled:opacity-40">
              Continuar al pago →
            </button>
          </div>
        )}

        {paso === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-slate-800">
              <span>{envio === "nacional" ? `🚚 Envío a ${ciudad}` : "🏬 Recoges en tienda"}</span>
              <span>{costoEnvio === 0 ? "GRATIS" : `$${costoEnvio.toFixed(2)}`}</span>
            </div>

            {METODOS.map((m) => (
              <button key={m.id} onClick={() => setMetodo(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${metodo === m.id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                <span className="text-3xl">{m.icono}</span>
                <span>
                  <span className="block font-bold text-black">{m.titulo}</span>
                  <span className="block text-xs text-slate-800">{m.detalle}</span>
                </span>
              </button>
            ))}

            {metodo === "tarjeta" && (
              <div className="space-y-3 rounded-2xl bg-slate-900 p-4">
                <input value={num} onChange={(e) => setNum(fmtNum(e.target.value))} placeholder="4242 4242 4242 4242" inputMode="numeric"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-red-500" />
                <div className="flex gap-3">
                  <input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} placeholder="MM/AA" inputMode="numeric"
                    className="w-24 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-red-500" />
                  <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="CVV" inputMode="numeric"
                    className="w-20 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-red-500" />
                  <span className="ml-auto self-center text-2xl">💳</span>
                </div>
                <p className="text-[11px] text-slate-400">🔒 Pago seguro simulado — no se guardan datos de la tarjeta.</p>
              </div>
            )}

            {metodo === "transferencia" && (
              <div className="space-y-1 rounded-2xl bg-blue-50 p-4 text-sm ring-1 ring-blue-100">
                <p className="font-bold text-black">🏦 {CUENTA_BANCARIA.banco} — {CUENTA_BANCARIA.tipo}</p>
                <p>Cta. <b>{CUENTA_BANCARIA.numero}</b></p>
                <p>{CUENTA_BANCARIA.titular} · RUC/CI {CUENTA_BANCARIA.cedula}</p>
                <p className="pt-1 text-xs text-slate-800">Después envía el comprobante por WhatsApp para preparar tu paquete.</p>
              </div>
            )}

            <div className="rounded-xl bg-black px-4 py-2.5 text-right">
              <span className="text-sm text-white">Total: </span>
              <span className="text-xl font-black text-red-500">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setPaso(0)} className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-slate-800 hover:bg-gray-200">← Atrás</button>
              <button disabled={!tarjetaOk || enviando} onClick={confirmar}
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-500 disabled:opacity-40">
                {enviando ? "Procesando..." : `✅ Confirmar $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}

        {paso === 2 && resultado && (
          <div className="space-y-4 text-center">
            <p className="text-5xl">🎉</p>
            <h4 className="text-2xl font-black text-black">¡Pedido confirmado!</h4>
            <p className="rounded-xl bg-green-50 py-2 text-lg font-black text-green-700 ring-1 ring-green-200">#{resultado.pedido}</p>
            <div className="rounded-2xl bg-gray-100 p-4 text-left text-sm text-slate-800">
              <div className="flex justify-between"><span>Producto (con -{TEMPORADA.pct}%)</span><b>${final.toFixed(2)}</b></div>
              <div className="flex justify-between"><span>Envío</span><b>{resultado.costoEnvio === 0 ? "GRATIS" : `$${resultado.costoEnvio.toFixed(2)}`}</b></div>
              <div className="mt-1 flex justify-between border-t border-gray-200 pt-1 text-base"><b>Total pagado</b><b className="text-red-600">${resultado.total.toFixed(2)}</b></div>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {envio === "nacional"
                ? `📦 Llega a ${ciudad} alrededor del ${fechaEntrega()}`
                : "🏬 Coordinamos tu recogida para hoy mismo"}
            </p>
            <a href={`https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(`Hola! Soy ${cliente}. Compré "${producto.nombre}" (talla ${producto.talla}) — pedido #${resultado.pedido}. ${envio === "nacional" ? `Envío a ${ciudad}: ${dir}` : "Paso por la tienda"} ✅`)}`}
              target="_blank"
              className="block rounded-xl bg-green-500 py-3 font-bold text-white transition hover:bg-green-400">
              💬 Confirmar por WhatsApp
            </a>
            <button onClick={onClose} className="w-full rounded-xl bg-gray-100 py-2.5 font-semibold text-slate-800 hover:bg-gray-200">Seguir comprando</button>
          </div>
        )}
      </div>
    </div>
  );
}
