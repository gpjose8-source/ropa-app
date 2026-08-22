"use client";

import { useRef, useState } from "react";

type Song = {
  id: number;
  titulo: string;
  artista: string;
  score: number;
  url: string;
};

async function post(songId: number, event: string) {
  try {
    await fetch("/api/musica/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId, event }),
      keepalive: true,
    });
  } catch {}
}

export default function RadioGlobal({ songs }: { songs: Song[] }) {
  const [activo, setActivo] = useState(false);
  const [idx, setIdx] = useState(0);
  const [radio, setRadio] = useState(true);
  const [liked, setLiked] = useState<number[]>([]);
  const ref = useRef<HTMLAudioElement | null>(null);

  if (songs.length === 0) return null;
  const actual = songs[Math.min(idx, songs.length - 1)];

  function iniciar() {
    setActivo(true);
    setTimeout(() => ref.current?.play().catch(() => {}), 80);
  }

  function avanzar(registrarSkip: boolean) {
    if (registrarSkip && actual) post(actual.id, "SKIP");
    setIdx((i) => (i + 1) % songs.length);
    setTimeout(() => ref.current?.play().catch(() => {}), 80);
  }

  return (
    <>
      {!activo && (
        <button
          onClick={iniciar}
          className="fixed bottom-5 right-5 z-50 max-w-[90vw] truncate rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
        >
          🎧 Sonar tendencia #1: {actual.titulo} ({actual.score})
        </button>
      )}

      {activo && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
            <div className="min-w-[150px] flex-1">
              <p className="truncate text-sm font-semibold">
                ♪ {actual.titulo}
                {actual.artista && (
                  <span className="font-normal text-slate-400"> — {actual.artista}</span>
                )}
              </p>
              <p className="text-xs text-slate-500">Tendencia · score {actual.score}</p>
            </div>

            <button
              onClick={() => {
                if (!liked.includes(actual.id)) {
                  setLiked((l) => [...l, actual.id]);
                  post(actual.id, "LIKE");
                }
              }}
              disabled={liked.includes(actual.id)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 disabled:opacity-40"
            >
              ♥
            </button>

            <button
              onClick={() => avanzar(true)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700"
            >
              ⏭
            </button>

            <label className="flex items-center gap-1.5 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={radio}
                onChange={(e) => setRadio(e.target.checked)}
                className="accent-emerald-500"
              />
              Auto
            </label>

            <audio
              key={actual.url}
              ref={ref}
              src={actual.url}
              controls
              autoPlay
              className="h-8 min-w-[200px] flex-1"
              onPlay={() => post(actual.id, "PLAY")}
              onEnded={() => {
                post(actual.id, "DONE");
                if (radio) avanzar(false);
              }}
            />

            <button
              onClick={() => setActivo(false)}
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-sm text-slate-300 hover:bg-red-600 hover:text-white"
              title="Cerrar radio"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
