import { q, one, run } from "./db";

export type CancionRanking = {
  id: number;
  archivo: string;
  titulo: string;
  artista: string;
  likes: number;
  plays: number;
  dones: number;
  skips: number;
  edad_dias: number;
  score: number;
  desglose: {
    momentum: number;
    likes: number;
    finalizacion: number;
    novedad: number;
    penalizacion: number;
  };
};

export function rankingTendencias(): CancionRanking[] {
  const base = q<{
    id: number;
    archivo: string;
    titulo: string;
    artista: string;
    likes: number;
    plays: number;
    dones: number;
    skips: number;
    edad_dias: number;
  }>(`
    SELECT c.id, c.archivo, c.titulo, c.artista, c.likes,
      (SELECT COUNT(*) FROM eventos_musica e WHERE e.cancion_id=c.id AND e.evento='PLAY') AS plays,
      (SELECT COUNT(*) FROM eventos_musica e WHERE e.cancion_id=c.id AND e.evento='DONE') AS dones,
      (SELECT COUNT(*) FROM eventos_musica e WHERE e.cancion_id=c.id AND e.evento='SKIP') AS skips,
      MAX(0, julianday('now','localtime') - julianday(c.agregada_en)) AS edad_dias
    FROM canciones c
  `);

  return base
    .map((c) => {
      const mrow = one<{ m: number | null }>(
        `SELECT SUM(exp(-(julianday('now','localtime') - julianday(creado_en)) * 24.0 / 36.0)) AS m
         FROM eventos_musica WHERE cancion_id=? AND evento IN ('PLAY','DONE')`,
        c.id
      );
      const momentum = Math.min(mrow?.m ?? 0, 20);
      const finTotal = c.dones + c.skips;
      const finalizacion = finTotal > 0 ? c.dones / finTotal : 0.5;
      const novedad = Math.max(0, 1 - c.edad_dias / 14);

      const dMomentum = (momentum / 20) * 50;
      const dLikes = (Math.min(c.likes, 10) / 10) * 15;
      const dFin = finalizacion * 20;
      const dNov = novedad * 10;
      const dPen = -(Math.min(c.skips, 10) / 10) * 5;

      return {
        ...c,
        edad_dias: Number(c.edad_dias.toFixed(1)),
        score: Math.max(0, Math.round(dMomentum + dLikes + dFin + dNov + dPen)),
        desglose: {
          momentum: Math.round(dMomentum),
          likes: Math.round(dLikes),
          finalizacion: Math.round(dFin),
          novedad: Math.round(dNov),
          penalizacion: Math.round(dPen),
        },
      };
    })
    .sort((a, b) => b.score - a.score || b.plays - a.plays);
}

const VALIDOS = new Set(["PLAY", "DONE", "SKIP", "LIKE"]);

export function registrarEvento(
  cancionId: number,
  evento: string
): { ok: boolean } {
  if (!Number.isInteger(cancionId) || !VALIDOS.has(evento)) return { ok: false };
  if (!one("SELECT id FROM canciones WHERE id=?", cancionId)) return { ok: false };
  run("INSERT INTO eventos_musica (cancion_id, evento) VALUES (?, ?)", cancionId, evento);
  if (evento === "LIKE") run("UPDATE canciones SET likes=likes+1 WHERE id=?", cancionId);
  return { ok: true };
}
