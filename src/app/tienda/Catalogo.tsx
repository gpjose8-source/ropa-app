"use client";

import { useMemo, useState } from "react";
import PrendaImg from "@/components/PrendaImg";

const IG_USER = "garageclothingec";
const IG_URL = `https://www.instagram.com/${IG_USER}/`;
const IG_POSTS = [
  "https://www.instagram.com/reel/DGij1mIRHUi/",
];
const WHATSAPP = "593999999999";

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

function igCode(url: string): string {
  const m = url.match(/(?:\/p\/|\/reel\/|\/tv\/)([A-Za-z0-9_-]+)/);
  return m ? m[1] : url.trim();
}

function waLink(p: Prod): string {
  const txt = encodeURIComponent(
    `Hola GARAGE ONLINE ðŸ‘‹ Me interesa: "${p.nombre}" (talla ${p.talla}, $${p.precio_venta.toFixed(2)}). Â¿Sigue disponible?`
  );
  return `https://wa.me/${WHATSAPP}?text=${txt}`;
}

export default function Catalogo({ productos }: { productos: Prod[] }) {
  const [cat, setCat] = useState("todas");
  const [talla, setTalla] = useState("todas");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Prod | null>(null);

  const cats = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria))),
    [productos]
  );
  const tallas = useMemo(
    () => Array.from(new Set(productos.map((p) => p.talla))),
    [productos]
  );

  const lista = productos.filter(
    (p) =>
      (cat === "todas" || p.categoria === cat) &&
      (talla === "todas" || p.talla === talla) &&
      (q === "" ||
        `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-rose-600 p-[1px]">
        <div className="rounded-3xl bg-white/90 px-6 py-10 text-center sm:px-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-red-600">
            Ropa americana Â· Original Â· Segunda mano premium
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            GARAGE <span className="text-red-600">ONLINE</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-800 sm:text-base">
            Elige tu prenda, resÃ©rvala por WhatsApp y recÃ³gela en tienda.
            Piezas Ãºnicas seleccionadas una a una. Â¡Vuelan rÃ¡pido!
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola! Quiero ver el catÃ¡logo de hoy ðŸ”¥")}`}
              target="_blank"
              className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              ðŸ’¬ Escribir por WhatsApp
            </a>
            <a
              href={IG_URL}
              target="_blank"
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold transition hover:border-pink-500 hover:text-pink-400"
            >
              ðŸ“¸ @{IG_USER}
            </a>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section>
        <h2 className="mb-4 text-xl font-bold">ðŸ“¸ Mira la ropa en acciÃ³n</h2>
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
          <a
            href={IG_URL}
            target="_blank"
            className="flex flex-1 flex-col rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px]"
          >
            <span className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl bg-white px-6 py-8 text-center">
              <span className="text-3xl">ðŸ“¸</span>
              <span className="font-bold">SÃ­guenos en Instagram</span>
              <span className="text-sm text-slate-800">@{IG_USER}</span>
              <span className="mt-1 text-xs text-slate-500">
                Nuevas prendas cada semana en stories
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* FILTROS */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">ðŸ›ï¸ CatÃ¡logo ({lista.length})</h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar prenda o marca..."
            className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-red-500"
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {["todas", ...cats].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                cat === c
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-slate-800 hover:bg-red-100"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="mx-2 w-px self-stretch bg-gray-100" />
          {["todas", ...tallas].map((t) => (
            <button
              key={t}
              onClick={() => setTalla(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                talla === t
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-slate-800 hover:bg-red-100"
              }`}
            >
              T-{t}
            </button>
          ))}
        </div>

        {/* GRID PRODUCTOS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <article
              key={p.id}
              onClick={() => setSel(p)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-red-400 hover:shadow-lg hover:shadow-red-100"
            >
              <div className="relative">
                {p.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.foto}
                    alt={p.nombre}
                    className="aspect-square w-full bg-white object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <PrendaImg
                    categoria={p.categoria}
                    marca={p.marca}
                    className="aspect-square w-full transition group-hover:scale-105"
                  />
                )}
                {p.stock <= 2 && (
                  <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold">
                    Â¡Ãšltimas {p.stock}!
                  </span>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs uppercase tracking-wide text-slate-500">{p.marca}</p>
                <h3 className="truncate text-sm font-semibold">{p.nombre}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-red-600">
                    ${p.precio_venta.toFixed(2)}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-slate-800">
                    T-{p.talla}
                  </span>
                </div>
              </div>
            </article>
          ))}
          {lista.length === 0 && (
            <p className="col-span-full py-16 text-center text-slate-500">
              No hay prendas con ese filtro ðŸ˜¢ prueba otro
            </p>
          )}
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["ðŸšš", "Entrega rÃ¡pida", "Quito Â· Guayaquil"],
          ["ðŸ”„", "Cambios fÃ¡ciles", "Dentro de 48h"],
          ["âœ¨", "Calidad revisada", "Pieza por pieza"],
          ["ðŸ’µ", "Precios justos", "Desde $6.00"],
        ].map(([e, t, s]) => (
          <div key={t} className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl">{e}</p>
            <p className="mt-1 text-sm font-bold">{t}</p>
            <p className="text-xs text-slate-500">{s}</p>
          </div>
        ))}
      </section>

      {/* MODAL PRODUCTO */}
      {sel && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setSel(null)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-t-3xl border border-gray-300 bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sel.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sel.foto} alt={sel.nombre} className="mx-auto h-52 w-52 rounded-2xl object-cover" />
            ) : (
              <PrendaImg categoria={sel.categoria} marca={sel.marca} className="mx-auto h-44 w-44" />
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{sel.marca}</p>
              <h3 className="text-xl font-bold">{sel.nombre}</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-gray-100 px-3 py-1">Talla {sel.talla}</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1 capitalize">{sel.categoria}</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1">{sel.stock} disponibles</span>
            </div>
            <p className="text-3xl font-black text-red-600">
              ${sel.precio_venta.toFixed(2)}
            </p>
            <a
              href={waLink(sel)}
              target="_blank"
              className="block rounded-xl bg-red-600 py-3 text-center font-bold text-white transition hover:bg-red-500"
            >
              ðŸ’¬ Reservar por WhatsApp
            </a>
            <button
              onClick={() => setSel(null)}
              className="w-full rounded-xl bg-gray-100 py-2 text-sm text-slate-800 hover:bg-red-100"
            >
              Seguir viendo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
