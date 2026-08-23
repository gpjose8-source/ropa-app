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

  async function intentar(conSonido: boolean): Promise<boolean> {
    const a = ref.current;
    if (!a || songs.length === 0) return false;
    a.muted = !conSonido;
    try {
      await a.play();
      setSilencio(!conSonido);
      setActivo(true);
      return true;
    } catch {
      if (!conSonido && a.muted === false) a.muted = true;
      return false;
    }
  }

  useEffect(() => {
    if (songs.length === 0) return;
    const t = setTimeout(() => {
      intentar(true).then((ok) => {
        if (!ok) intentar(false);
      });
    }, 400);

    // Cualquier interacción del usuario activa el sonido
    const despertar = () => {
      intentar(true);
    };
    window.addEventListener("pointerdown", despertar);
    window.addEventListener("touchstart", despertar, { passive: true });
    window.addEventListener("keydown", despertar);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", despertar);
      window.removeEventListener("touchstart", despertar);
      window.removeEventListener("keydown", despertar);
    };
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
        preload="auto"
        className="hidden"
        onPlay={() => post(actual.id, "PLAY")}
        onEnded={() => {
          post(actual.id, "DONE");
          if (radio) avanzar(false);
        }}
      />

      {!silencio && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
            <div className="min-w-[150px] flex-1">
              <p className="truncate text-sm font-semibold">
                ♪ {actual.titulo}
                {actual.artista && (
                  <span className="font-normal text-slate-800"> — {actual.artista}</span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                GARAGE RADIO · tendencia · score {actual.score}
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
              ♥
            </button>

            <button
              onClick={() => avanzar(true)}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-red-100"
            >
              ⏭
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

            <button
              onClick={() => {
                const a = ref.current;
                if (!a) return;
                if (a.paused) a.play().catch(() => {});
                else a.pause();
              }}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-red-100"
            >
              ⏯
            </button>

            <button
              onClick={() => {
                ref.current?.pause();
                setActivo(false);
                setSilencio(true);
              }}
              className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-sm text-slate-800 hover:bg-red-600 hover:text-white"
              title="Apagar radio"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {silencio && songs.length > 0 && (
        <button
          onClick={() => intentar(true)}
          className="animate-pulse fixed bottom-5 left-1/2 z-[60] max-w-[92vw] -translate-x-1/2 truncate rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-7 py-4 text-base font-black text-white shadow-xl shadow-red-400/40 transition hover:scale-105"
        >
          🔊 Toca aquí para escuchar la música · {actual.titulo}
        </button>
      )}
    </>
  );
}
