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

export default function PlayerMusica({ songs }: { songs: Song[] }) {
  const [idx, setIdx] = useState(0);
  const [radio, setRadio] = useState(true);
  const [liked, setLiked] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (songs.length === 0) return null;
  const current = songs[idx];

  function avanzar(registrarSkip: boolean) {
    if (registrarSkip && current) post(current.id, "SKIP");
    setIdx((i) => (i + 1) % songs.length);
    setTimeout(() => audioRef.current?.play().catch(() => {}), 60);
  }

  function darLike() {
    if (!liked.includes(current.id)) {
      setLiked((l) => [...l, current.id]);
      post(current.id, "LIKE");
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="min-w-[160px] flex-1">
          <p className="truncate text-sm font-semibold">
            ♪ {current.titulo}
            {current.artista && <span className="font-normal text-slate-400"> — {current.artista}</span>}
          </p>
          <p className="text-xs text-slate-500">
            Tendencia #{idx + 1} · score {current.score}
          </p>
        </div>

        <button
          onClick={darLike}
          disabled={liked.includes(current.id)}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 disabled:opacity-40"
        >
          ♥ Like
        </button>

        <button
          onClick={() => avanzar(true)}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700"
        >
          ⏭ Siguiente
        </button>

        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={radio}
            onChange={(e) => setRadio(e.target.checked)}
            className="accent-emerald-500"
          />
          Radio auto
        </label>

        <audio
          key={current.url}
          ref={audioRef}
          src={current.url}
          controls
          autoPlay
          className="h-8 min-w-[220px] flex-1"
          onPlay={() => post(current.id, "PLAY")}
          onEnded={() => {
            post(current.id, "DONE");
            if (radio) avanzar(false);
          }}
        />
      </div>
    </div>
  );
}
