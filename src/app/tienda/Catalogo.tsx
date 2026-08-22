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
    `Hola GARAGE ONLINE 👋 Me interesa: "${p.nombre}" (talla ${p.talla}, $${p.precio_venta.toFixed(2)}). ¿Sigue disponible?`
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
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-[1px]">
        <div className="rounded-3xl bg-slate-950/80 px-6 py-10 text-center sm:px-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
            Ropa americana · Original · Segunda mano premium
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            GARAGE <span className="text-emerald-400">ONLINE</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            Elige tu prenda, resérvala por WhatsApp y recógela en tienda.
            Piezas únicas seleccionadas una a una. ¡Vuelan rápido!
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola! Quiero ver el catálogo de hoy 🔥")}`}
              target="_blank"
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              💬 Escribir por WhatsApp
            </a>
            <a
              href={IG_URL}
              target="_blank"
              className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-semibold transition hover:border-pink-500 hover:text-pink-400"
            >
              📸 @{IG_USER}
            </a>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section>
        <h2 className="mb-4 text-xl font-bold">📸 Mira la ropa en acción</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {IG_POSTS.map((url) => (
            <iframe
              key={url}
              src={`https://www.instagram.com/reel/${igCode(url)}/embed`}
              className="min-h-[480px] w-full rounded-2xl border border-slate-800 bg-slate-900"
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
            <span className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl bg-slate-950 px-6 py-8 text-center">
              <span className="text-3xl">📸</span>
              <span className="font-bold">Síguenos en Instagram</span>
              <span className="text-sm text-slate-400">@{IG_USER}</span>
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
          <h2 className="text-xl font-bold">🛍️ Catálogo ({lista.length})</h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar prenda o marca..."
            className="w-56 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {["todas", ...cats].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                cat === c
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="mx-2 w-px self-stretch bg-slate-800" />
          {["todas", ...tallas].map((t) => (
            <button
              key={t}
              onClick={() => setTalla(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                talla === t
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
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
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="relative">
                {p.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.foto}
                    alt={p.nombre}
                    className="aspect-square w-full bg-slate-950 object-cover transition duration-300 group-hover:scale-105"
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
                    ¡Últimas {p.stock}!
                  </span>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs uppercase tracking-wide text-slate-500">{p.marca}</p>
                <h3 className="truncate text-sm font-semibold">{p.nombre}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-emerald-400">
                    ${p.precio_venta.toFixed(2)}
                  </span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                    T-{p.talla}
                  </span>
                </div>
              </div>
            </article>
          ))}
          {lista.length === 0 && (
            <p className="col-span-full py-16 text-center text-slate-500">
              No hay prendas con ese filtro 😢 prueba otro
            </p>
          )}
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["🚚", "Entrega rápida", "Quito · Guayaquil"],
          ["🔄", "Cambios fáciles", "Dentro de 48h"],
          ["✨", "Calidad revisada", "Pieza por pieza"],
          ["💵", "Precios justos", "Desde $6.00"],
        ].map(([e, t, s]) => (
          <div key={t} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
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
            className="w-full max-w-md space-y-4 rounded-t-3xl border border-slate-700 bg-slate-900 p-6 sm:rounded-3xl"
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
              <span className="rounded-lg bg-slate-800 px-3 py-1">Talla {sel.talla}</span>
              <span className="rounded-lg bg-slate-800 px-3 py-1 capitalize">{sel.categoria}</span>
              <span className="rounded-lg bg-slate-800 px-3 py-1">{sel.stock} disponibles</span>
            </div>
            <p className="text-3xl font-black text-emerald-400">
              ${sel.precio_venta.toFixed(2)}
            </p>
            <a
              href={waLink(sel)}
              target="_blank"
              className="block rounded-xl bg-emerald-500 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              💬 Reservar por WhatsApp
            </a>
            <button
              onClick={() => setSel(null)}
              className="w-full rounded-xl bg-slate-800 py-2 text-sm text-slate-300 hover:bg-slate-700"
            >
              Seguir viendo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
