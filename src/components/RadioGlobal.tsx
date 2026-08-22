"use client";

import { useEffect, useRef, useState } from "react";

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
  const [silencio, setSilencio] = useState(true);
  const [idx, setIdx] = useState(0);
  const [radio, setRadio] = useState(true);
  const [liked, setLiked] = useState<number[]>([]);
  const ref = useRef<HTMLAudioElement | null>(null);

  async function intentar(muted: boolean): Promise<boolean> {
    const a = ref.current;
    if (!a) return false;
    a.muted = muted;
    try {
      await a.play();
      setSilencio(muted);
      setActivo(true);
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (songs.length === 0) return;
    const t = setTimeout(async () => {
      if (await intentar(false)) return;
      await intentar(true);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (songs.length === 0) return null;
  const actual = songs[Math.min(idx, songs.length - 1)];

  function avanzar(registrarSkip: boolean) {
    if (registrarSkip && actual) post(actual.id, "SKIP");
    setIdx((i) => (i + 1) % songs.length);
    setTimeout(() => ref.current?.play().catch(() => {}), 80);
  }

  return (
    <>
      <audio
        key={actual.url}
        ref={ref}
        src={actual.url}
        loop={false}
        className="hidden"
        onPlay={() => post(actual.id, "PLAY")}
        onEnded={() => {
          post(actual.id, "DONE");
          if (radio) avanzar(false);
        }}
      />

      {!activo && (
        <button
          onClick={() => intentar(false)}
          className="fixed bottom-5 right-5 z-50 max-w-[90vw] truncate rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-300 transition hover:bg-red-500"
        >
          ðŸŽ§ Escuchar tendencia #1: {actual.titulo}
        </button>
      )}

      {activo && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
            {silencio && (
              <button
                onClick={() => intentar(false)}
                className="animate-pulse rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-white"
              >
                ðŸ”Š Activar sonido
              </button>
            )}

            <div className="min-w-[150px] flex-1">
              <p className="truncate text-sm font-semibold">
                â™ª {actual.titulo}
                {actual.artista && (
                  <span className="font-normal text-slate-800"> â€” {actual.artista}</span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                GARAGE RADIO Â· tendencia Â· score {actual.score}
              </p>
            </div>

            <button
              onClick={() => {
                if (!liked.includes(actual.id)) {
                  setLiked((l) => [...l, actual.id]);
                  post(actual.id, "LIKE");
                }
              }}
              disabled={liked.includes(actual.id)}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-red-100 disabled:opacity-40"
            >
              â™¥
            </button>

            <button
              onClick={() => avanzar(true)}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-red-100"
            >
              â­
            </button>

            <label className="flex items-center gap-1.5 text-xs text-slate-800">
              <input
                type="checkbox"
                checked={radio}
                onChange={(e) => setRadio(e.target.checked)}
                className="accent-red-600"
              />
              Auto
            </label>

            {!silencio && (
              <button
                onClick={() => {
                  const a = ref.current;
                  if (!a) return;
                  if (a.paused) a.play().catch(() => {});
                  else a.pause();
                }}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-red-100"
              >
                â¯
              </button>
            )}

            <button
              onClick={() => {
                ref.current?.pause();
                setActivo(false);
              }}
              className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-sm text-slate-800 hover:bg-red-600 hover:text-white"
              title="Apagar radio"
            >
              âœ•
            </button>
          </div>
        </div>
      )}
    </>
  );
}
