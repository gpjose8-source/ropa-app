import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("C:/Users/jose-/ropa-app/tienda.db");
db.exec("PRAGMA busy_timeout = 5000");

const canciones = [
  ["Dj Sol - Verano Infinito.wav", "Dj Sol", 40, 8, 1, 5, [0, 48]],
  ["Kokoa - Ritmo Hawaiano.wav", "Kokoa", 25, 6, 2, 3, [12, 144]],
  ["Brissa - Vacaciones en la Playa.wav", "Brissa", 18, 4, 1, 2, [0, 72]],
  ["Los Palmeros - Atardecer Tropical.wav", "Los Palmeros", 10, 3, 0, 1, [96, 168]],
  ["Marea - Noche en la Orilla.wav", "Marea", 8, 2, 0, 0, [120, 168]],
  ["Coco Loco - Fiesta Playera.wav", "Coco Loco", 30, 6, 12, 2, [24, 160]],
];

for (const [archivo, artista] of canciones) {
  const titulo = archivo.replace(".wav", "").split(" - ")[1];
  db.prepare(
    `INSERT INTO canciones (archivo, titulo, artista) VALUES (?, ?, ?)
     ON CONFLICT(archivo) DO NOTHING`
  ).run(archivo, titulo, artista);
}

db.exec("DELETE FROM eventos_musica");

for (const [archivo, , plays, dones, skips, likes, [hMin, hMax]] of canciones) {
  const c = db.prepare("SELECT id FROM canciones WHERE archivo=?").get(archivo);
  if (!c) continue;
  const rand = () => Math.random();
  for (let i = 0; i < plays; i++) {
    const h = hMin + rand() * (hMax - hMin);
    db.prepare(
      `INSERT INTO eventos_musica (cancion_id, evento, creado_en)
       VALUES (?, 'PLAY', datetime('now','localtime','-' || ? || ' hours'))`
    ).run(c.id, h.toFixed(1));
  }
  for (let i = 0; i < dones; i++) {
    const h = hMin + rand() * (hMax - hMin);
    db.prepare(
      `INSERT INTO eventos_musica (cancion_id, evento, creado_en)
       VALUES (?, 'DONE', datetime('now','localtime','-' || ? || ' hours'))`
    ).run(c.id, h.toFixed(1));
  }
  for (let i = 0; i < skips; i++) {
    const h = hMin + rand() * (hMax - hMin);
    db.prepare(
      `INSERT INTO eventos_musica (cancion_id, evento, creado_en)
       VALUES (?, 'SKIP', datetime('now','localtime','-' || ? || ' hours'))`
    ).run(c.id, h.toFixed(1));
  }
  for (let i = 0; i < likes; i++) {
    db.prepare("UPDATE canciones SET likes = likes + 1 WHERE id=?").run(c.id);
  }
}

const total = db.prepare("SELECT COUNT(*) n FROM eventos_musica").get().n;
console.log("eventos insertados:", total);
