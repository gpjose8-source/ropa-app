import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "music");
fs.mkdirSync(DIR, { recursive: true });

const SR = 44100;

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((v * 32767) | 0, 44 + i * 2);
  }
  return buf;
}

const NOTE = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440.0, B: 493.88 };
function freq(nota, oct = 4) {
  return NOTE[nota] * Math.pow(2, oct - 4);
}

class Track {
  constructor(segundos) {
    this.s = new Float32Array(Math.floor(SR * segundos));
    this.dur = segundos;
  }
  add(inicioSec, durSec, fn, gain = 0.3) {
    const ini = Math.floor(inicioSec * SR);
    const len = Math.floor(durSec * SR);
    for (let i = 0; i < len && ini + i < this.s.length; i++) {
      const t = i / SR;
      const env = Math.exp(-t * 3.5) * Math.min(1, t * 200);
      this.s[ini + i] += fn(t) * env * gain;
    }
  }
  kick(inicio) {
    this.add(inicio, 0.25, (t) => Math.sin(2 * Math.PI * (55 + 70 * Math.exp(-t * 25)) * t), 0.9);
  }
  hat(inicio, g = 0.12) {
    let last = 0;
    this.add(inicio, 0.05, (t) => {
      const n = Math.random() * 2 - 1;
      const v = n - last * 0.7;
      last = n;
      return v;
    }, g);
  }
  snare(inicio) {
    this.add(inicio, 0.15, () => Math.random() * 2 - 1, 0.25);
  }
  nota(inicio, f, dur, wave = "tri", g = 0.25) {
    const waves = {
      tri: (p) => Math.abs(((p % 1) + 1) % 1 - 0.5) * 4 - 1,
      sine: (p) => Math.sin(p),
      saw: (p) => (((p % 1) + 1) % 1) * 2 - 1,
    };
    this.add(inicio, dur, (t) => waves[wave](2 * Math.PI * f * t / (2 * Math.PI)), g);
  }
  acorde(inicio, notas, oct, dur, g = 0.10) {
    for (const n of notas) this.nota(inicio, freq(n, oct), dur, "tri", g);
  }
}

const PROG = [
  ["A", "C", "E"],
  ["F", "A", "C"],
  ["C", "E", "G"],
  ["G", "B", "D"],
];

function base(progresion, bpm, compases, estilo, nombreArchivo) {
  const beat = 60 / bpm;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = progresion[c % progresion.length];
    t.acorde(b0, ch, 4, 4 * beat);

    if (estilo === "dembow") {
      t.kick(b0); t.kick(b0 + 2 * beat);
      t.snare(b0 + beat); t.snare(b0 + 3 * beat);
      for (let h = 0; h < 8; h++) t.hat(b0 + h * beat * 0.5);
      t.nota(b0, freq(ch[0], 2), beat * 0.8, "saw", 0.30);
      t.nota(b0 + 1.5 * beat, freq(ch[0], 2), beat * 0.5, "saw", 0.22);
      t.nota(b0 + 2.5 * beat, freq(ch[1], 2), beat * 0.6, "saw", 0.22);
      if (c % 2 === 0) t.nota(b0 + 0.5 * beat, freq(ch[2], 5), beat * 0.7, "tri", 0.18);
    } else if (estilo === "isla") {
      for (let p = 0; p < 8; p++) {
        const n = ch[p % 3];
        t.nota(b0 + p * beat * 0.5, freq(n, 4), 0.18, "tri", p % 2 ? 0.14 : 0.20);
      }
      t.kick(b0); t.kick(b0 + 2.5 * beat);
      t.hat(b0 + beat * 0.75); t.hat(b0 + beat * 2.75);
    } else if (estilo === "chill") {
      t.kick(b0); t.kick(b0 + 2 * beat);
      t.hat(b0 + beat); t.hat(b0 + 3 * beat, 0.08);
      t.nota(b0, freq(ch[0], 2), 2 * beat, "sine", 0.30);
      t.nota(b0 + 2 * beat, freq(ch[1], 3), 2 * beat, "sine", 0.22);
      t.nota(b0 + beat * 0.5, freq(ch[2], 5), beat, "tri", 0.13);
    } else {
      for (let p = 0; p < 4; p++) t.kick(b0 + p * beat);
      t.snare(b0 + beat * 0.5); t.snare(b0 + beat * 2.5);
      for (let h = 0; h < 16; h++) t.hat(b0 + h * beat * 0.25, 0.07);
      t.nota(b0, freq(ch[0], 2), beat, "saw", 0.28);
      t.nota(b0 + beat * 2, freq(ch[1], 2), beat, "saw", 0.28);
      t.nota(b0 + beat * 3.5, freq(ch[2], 5), beat * 0.4, "saw", 0.15);
    }
  }
  fs.writeFileSync(path.join(DIR, nombreArchivo), wav(t.s));
  console.log("generado:", nombreArchivo);
}

base(PROG, 92, 12, "dembow", "Dj Sol - Verano Infinito.wav");
base(PROG, 96, 12, "isla", "Kokoa - Ritmo Hawaiano.wav");
base(PROG, 100, 12, "isla", "Brissa - Vacaciones en la Playa.wav");
base([["A", "C", "E"], ["F", "A", "C"]], 78, 10, "chill", "Los Palmeros - Atardecer Tropical.wav");
base([["C", "E", "G"], ["G", "B", "D"]], 74, 10, "chill", "Marea - Noche en la Orilla.wav");
base(PROG, 124, 12, "fiesta", "Coco Loco - Fiesta Playera.wav");

console.log("OK ->", DIR);
