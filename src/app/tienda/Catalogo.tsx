"use client";

import { useMemo, useState } from "react";
import PrendaImg from "@/components/PrendaImg";
import GuiaTallas from "@/components/GuiaTallas";
import Checkout from "./Checkout";
import { TEMPORADA, WHATSAPP_TIENDA, ASESORIA_IMAGEN, precioFinal } from "@/lib/tienda";

const IG_USER = "garageclothingec";
const IG_URL = `https://www.instagram.com/${IG_USER}/`;
const IG_POSTS = ["https://www.instagram.com/reel/DGij1mIRHUi/"];

const VIDEOS = Array.from({ length: 18 }, (_, i) => `/videos/video-${String(i + 1).padStart(2, "0")}.mp4`);

type Prod = {
  id: number;
  nombre: string;
  categoria: string;
  talla: string;
  marca: string;
  precio_venta: number;
  stock: number;
  foto?: string | null;
};

const CHIP: Record<string, string> = {
  camiseta: "bg-sky-100 text-sky-700 ring-sky-200",
  pantalon: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  chaqueta: "bg-orange-100 text-orange-700 ring-orange-200",
  vestido: "bg-pink-100 text-pink-700 ring-pink-200",
  blusa: "bg-violet-100 text-violet-700 ring-violet-200",
  zapatos: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  gorra: "bg-amber-100 text-amber-700 ring-amber-200",
};

function igCode(url: string): string {
  const m = url.match(/(?:\/p\/|\/reel\/|\/tv\/)([A-Za-z0-9_-]+)/);
  return m ? m[1] : url.trim();
}

function wa(p: Prod, texto?: string): string {
  const msg =
    texto ??
    `Hola GARAGE ONLINE 👋 Me interesa: "${p.nombre}" (talla ${p.talla}, $${precioFinal(p.precio_venta).toFixed(2)}). ¿Sigue disponible?`;
  return `https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(msg)}`;
}

export default function Catalogo({
  productos,
  qr,
  urlTienda,
}: {
  productos: Prod[];
  qr: string;
  urlTienda: string;
}) {
  const [cat, setCat] = useState("todas");
  const [talla, setTalla] = useState("todas");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Prod | null>(null);
  const [compra, setCompra] = useState<Prod | null>(null);
  const [guia, setGuia] = useState<string | null>(null);
  const [qrGrande, setQrGrande] = useState(false);

  const cats = useMemo(() => Array.from(new Set(productos.map((p) => p.categoria))), [productos]);
  const tallas = useMemo(() => Array.from(new Set(productos.map((p) => p.talla))), [productos]);

  const lista = productos.filter(
    (p) =>
      (cat === "todas" || p.categoria === cat) &&
      (talla === "todas" || p.talla === talla) &&
      (q === "" || `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-rose-600 p-[1px]">
        <div className="rounded-3xl bg-white px-6 py-10 text-center sm:px-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-red-600">
            Ropa americana · Original · Segunda mano premium
          </p>
          <h1 className="text-3xl font-black tracking-tight text-black sm:text-5xl">
            GARAGE <span className="text-red-600">ONLINE</span>
          </h1>
          <div className="mx-auto mt-4 inline-block animate-pulse rounded-full bg-red-600 px-5 py-1.5 text-sm font-black text-white shadow-lg shadow-red-300">
            {TEMPORADA.nombre} · {TEMPORADA.detalle}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => setCompra(lista[0] ?? productos[0])}
              className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500">
              🛒 Comprar ahora
            </button>
            <a href={IG_URL} target="_blank"
              className="rounded-full border-2 border-gray-200 px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-pink-500 hover:text-pink-600">
              📸 @{IG_USER}
            </a>
          </div>
          {qr && (
            <button onClick={() => setQrGrande(true)}
              className="mt-6 mx-auto flex items-center gap-4 rounded-2xl bg-white p-3 shadow-xl ring-2 ring-red-200 transition hover:scale-[1.02]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR tienda" className="h-24 w-24 rounded-lg" />
              <span className="pr-2 text-left">
                <span className="block text-base font-black text-black">📱 Compra desde tu celular</span>
                <span className="block text-xs text-slate-800">Escanea el QR → entra a la tienda → pide en 1 minuto</span>
                <span className="mt-0.5 block text-[11px] font-bold text-red-600 underline">Ver código más grande</span>
              </span>
            </button>
          )}
        </div>
      </section>

      {/* ASESORÍA DE IMAGEN */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-gray-900 to-black p-[2px] shadow-2xl">
        <div className="flex flex-col items-start gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="text-5xl">👑</span>
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400">Servicio exclusivo</p>
            <h2 className="text-xl font-black text-white sm:text-2xl">
              {ASESORIA_IMAGEN.titulo} <span className="text-amber-400">GARAGE</span>
            </h2>
            <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slate-300 sm:grid-cols-2">
              {ASESORIA_IMAGEN.incluye.map((i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-amber-400">✦</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-amber-400/10 px-4 py-1.5 text-center ring-1 ring-amber-400/50">
              <span className="block text-2xl font-black text-amber-400">${ASESORIA_IMAGEN.precio}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                sesión 1 a 1
              </span>
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent("Hola! Quiero agendar una Asesoría de Imagen Personal 👑")}`}
              target="_blank"
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 px-5 py-2.5 text-sm font-black text-black shadow-lg transition hover:brightness-110"
            >
              Agendar por WhatsApp
            </a>
            <span className="max-w-[190px] text-center text-[10px] font-semibold text-slate-400">
              GRATIS con compras desde ${ASESORIA_IMAGEN.gratisDesde}
            </span>
          </div>
        </div>
      </section>

      {/* VIDEOS REALES DE LAS PRENDAS */}
      <section>
        <h2 className="mb-1 text-xl font-black text-black">📹 Videos reales de la ropa</h2>
        <p className="mb-4 text-sm text-slate-800">
          Mira el detalle, la tela y la caída de cada prenda antes de comprar
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <video
              key={v}
              src={v}
              controls
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-[9/16] w-full rounded-xl border border-gray-200 bg-black object-cover"
              aria-label={`Video de prenda ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section>
        <h2 className="mb-4 text-xl font-black text-black">📸 Mira la ropa en acción</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {IG_POSTS.map((url) => (
            <iframe
              key={url}
              src={`https://www.instagram.com/reel/${igCode(url)}/embed`}
              className="min-h-[480px] w-full rounded-2xl border border-gray-200 bg-white"
              frameBorder={0}
              scrolling="no"
              allowFullScreen
              title="Instagram reel"
            />
          ))}
          <a href={IG_URL} target="_blank"
            className="flex flex-1 flex-col rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px]">
            <span className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl bg-white px-6 py-8 text-center">
              <span className="text-4xl">📸</span>
              <span className="font-black text-black">Síguenos en Instagram</span>
              <span className="text-sm font-semibold text-pink-600">@{IG_USER}</span>
              <span className="mt-1 text-xs text-slate-800">Nuevas prendas cada semana en stories</span>
            </span>
          </a>
        </div>
      </section>

      {/* FILTROS */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-black">🛍️ Catálogo ({lista.length})</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Buscar prenda o marca..."
            className="w-56 rounded-xl border-2 border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-red-500" />
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {["todas", ...cats].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ring-1 transition ${
                cat === c ? "bg-red-600 text-white ring-red-600"
                  : `bg-white text-slate-800 ${CHIP[c] ?? "bg-gray-100 ring-gray-200"} hover:ring-red-300`
              }`}>
              {c === "todas" ? "⭐ Todas" : c}
            </button>
          ))}
          <span className="mx-2 w-px self-stretch bg-gray-200" />
          {["todas", ...tallas].map((t) => (
            <button key={t} onClick={() => setTalla(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition ${
                talla === t ? "bg-black text-white ring-black" : "bg-white text-slate-800 ring-gray-200 hover:ring-black"
              }`}>
              T-{t}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => {
            const fin = precioFinal(p.precio_venta);
            return (
              <article key={p.id}
                onClick={() => setSel(p)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-red-400 hover:shadow-xl hover:shadow-red-100">
                <div className="relative">
                  {p.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto} alt={p.nombre} className="aspect-square w-full bg-slate-950 object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <PrendaImg categoria={p.categoria} marca={p.marca} className="aspect-square w-full transition group-hover:scale-105" />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white shadow">
                    -{TEMPORADA.pct}%
                  </span>
                  <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                    {p.precio_venta >= 200 && (
                      <span className="rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 px-2 py-0.5 text-[10px] font-black text-black shadow ring-1 ring-yellow-600/60">
                        👑 PREMIUM
                      </span>
                    )}
                    {p.stock <= 2 && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-red-600 shadow ring-1 ring-red-200">
                        ¡Últimas {p.stock}!
                      </span>
                    )}
                  </div>
                  <span className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ring-1 ${CHIP[p.categoria] ?? "bg-gray-100 text-slate-800 ring-gray-200"}`}>
                    {p.categoria}
                  </span>
                </div>
                <div className="space-y-1.5 p-3">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-800">{p.marca}</p>
                  <h3 className="truncate text-sm font-bold text-black">{p.nombre}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-red-600">${fin.toFixed(2)}</span>
                    <span className="text-xs text-slate-500 line-through">${p.precio_venta.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setCompra(p)}
                      className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-black text-white transition hover:bg-red-500">
                      🛒 Comprar
                    </button>
                    <a href={wa(p)} target="_blank"
                      className="rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-black text-white transition hover:bg-green-400">💬</a>
                  </div>
                </div>
              </article>
            );
          })}
          {lista.length === 0 && (
            <p className="col-span-full py-16 text-center font-semibold text-slate-800">
              No hay prendas con ese filtro 😢 prueba otro
            </p>
          )}
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["🚚", "Entrega rápida", "Quito · Guayaquil", "from-sky-500 to-blue-600"],
          ["🔄", "Cambios fáciles", "Dentro de 48h", "from-violet-500 to-purple-600"],
          ["✨", "Calidad revisada", "Pieza por pieza", "from-emerald-500 to-teal-600"],
          ["💳", "Paga como quieras", "Tarjeta · Transferencia", "from-red-500 to-rose-600"],
        ].map(([e, t, s, g]) => (
          <div key={t} className={`rounded-2xl bg-gradient-to-br ${g} p-[2px]`}>
            <div className="rounded-2xl bg-white p-4 text-center">
              <p className="text-3xl">{e}</p>
              <p className="mt-1 text-sm font-black text-black">{t}</p>
              <p className="text-xs font-semibold text-slate-800">{s}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ASESORÍA FLOTANTE */}
      <a href={`https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent("Hola! Quiero asesoría para elegir mi talla y prenda 👕")}`}
        target="_blank"
        className="fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-green-300 transition hover:scale-105 hover:bg-green-400">
        🧑‍💼 Asesoría gratis
      </a>

      {/* MODAL PRODUCTO */}
      {sel && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={() => setSel(null)}>
          <div className="max-h-[92vh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-3xl border border-gray-300 bg-white p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {sel.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sel.foto} alt={sel.nombre} className="mx-auto h-52 w-52 rounded-2xl object-cover" />
            ) : (
              <PrendaImg categoria={sel.categoria} marca={sel.marca} className="mx-auto h-44 w-44" />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800">{sel.marca}</p>
              <h3 className="text-xl font-black text-black">{sel.nombre}</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className={`rounded-lg px-3 py-1 font-bold capitalize ring-1 ${CHIP[sel.categoria] ?? "bg-gray-100 text-slate-800 ring-gray-200"}`}>{sel.categoria}</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1 font-bold text-slate-800">Talla {sel.talla}</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1 font-bold text-slate-800">{sel.stock} disponibles</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-600">${precioFinal(sel.precio_venta).toFixed(2)}</span>
              <span className="text-sm text-slate-500 line-through">${sel.precio_venta.toFixed(2)}</span>
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">-{TEMPORADA.pct}% HOY</span>
            </div>
            <button onClick={() => { setCompra(sel); setSel(null); }}
              className="w-full rounded-xl bg-red-600 py-3 text-center font-black text-white transition hover:bg-red-500">
              🛒 Comprar ahora
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a href={wa(sel)} target="_blank"
                className="rounded-xl bg-green-500 py-2.5 text-center text-sm font-black text-white transition hover:bg-green-400">💬 Reservar</a>
              <button onClick={() => setGuia(sel.categoria)}
                className="rounded-xl bg-black py-2.5 text-sm font-black text-white transition hover:bg-slate-800">📏 Guía de tallas</button>
            </div>
            <button onClick={() => setSel(null)} className="w-full rounded-xl bg-gray-100 py-2 text-sm font-semibold text-slate-800 hover:bg-gray-200">
              Seguir viendo
            </button>
          </div>
        </div>
      )}

      {compra && <Checkout producto={compra} onClose={() => setCompra(null)} />}
      {guia && <GuiaTallas categoria={guia} onClose={() => setGuia(null)} />}

      {qrGrande && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setQrGrande(false)}>
          <div className="max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-black">📱 Escanea y compra</h3>
            <p className="mt-1 text-sm text-slate-800">Apunta la cámara de tu celular al código:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR de la tienda" className="mx-auto mt-4 w-64 rounded-2xl ring-4 ring-red-500" />
            <p className="mt-4 break-all rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-slate-800">{urlTienda}</p>
            <p className="mt-3 text-xs text-slate-800">
              Perfecto para ponerlo en el vidrio de la tienda física, volantes o publicaciones 🖨️
            </p>
            <button onClick={() => setQrGrande(false)} className="mt-4 w-full rounded-xl bg-black py-2.5 font-bold text-white hover:bg-slate-800">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
