import { escanearMusica } from "@/lib/db";
import { rankingTendencias } from "@/lib/trends";
import { escanearBiblioteca } from "@/actions/musica";

export const dynamic = "force-dynamic";

export default function Musica() {
  escanearMusica();
  const ranking = rankingTendencias();

  const canciones = ranking.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    artista: c.artista,
    score: c.score,
    url: `/music/${encodeURIComponent(c.archivo)}`,
  }));

  return (
    <div className="space-y-5 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MÃºsica & Tendencias</h1>
        <form action={escanearBiblioteca}>
          <button className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm hover:bg-gray-300">
            âŸ³ Escanear biblioteca
          </button>
        </form>
      </div>

      {canciones.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-slate-800">
          <p className="font-medium text-slate-200">Biblioteca vacÃ­a</p>
          <p className="mt-2">
            Copia tus archivos <code className="rounded bg-gray-100 px-1">.mp3</code> en la carpeta{" "}
            <code className="rounded bg-gray-100 px-1">C:\Users\jose-\ropa-app\public\music</code>{" "}
            con el formato <b>Artista - Titulo.mp3</b> y pulsa Â«Escanear bibliotecaÂ».
          </p>
        </div>
      ) : (
        <>
          <section className="rounded-xl border border-gray-200 bg-white p-4 text-xs text-slate-800">
            <span className="font-semibold text-slate-200">CÃ³mo se calcula la tendencia (score 0â€“100):</span>{" "}
            momentum por reproducciones recientes con decaimiento exponencial (vida media 36 h) hasta +50 Â·
            likes +15 Â· tasa de escuchas completadas vs. skips +20 Â· novedad (â‰¤14 dÃ­as) +10 Â· skips âˆ’5.
          </section>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-white text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">#</th><th className="p-3">CanciÃ³n</th>
                  <th className="p-3 text-center">Repr.</th><th className="p-3 text-center">OK</th>
                  <th className="p-3 text-center">Skip</th><th className="p-3 text-center">â™¥</th>
                  <th className="p-3 w-48">Score de tendencia</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((c, i) => {
                  const d = `momentum ${c.desglose.momentum} + likes ${c.desglose.likes} + finalizaciÃ³n ${c.desglose.finalizacion} + novedad ${c.desglose.novedad} ${c.desglose.penalizacion}`;
                  return (
                    <tr key={c.id} className="border-t border-gray-200/60 hover:bg-white/50">
                      <td className={`p-3 font-bold ${i < 3 ? "text-red-600" : "text-slate-500"}`}>{i + 1}</td>
                      <td className="p-3">
                        <span className="font-medium">{c.titulo}</span>
                        {c.artista && <span className="block text-xs text-slate-500">{c.artista}</span>}
                      </td>
                      <td className="text-center text-slate-800">{c.plays}</td>
                      <td className="text-center text-slate-800">{c.dones}</td>
                      <td className="text-center text-red-400">{c.skips}</td>
                      <td className="text-center text-amber-300">{c.likes}</td>
                      <td className="p-3" title={d}>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400" style={{ width: `${c.score}%` }} />
                          </div>
                          <span className="w-8 text-right font-bold">{c.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

