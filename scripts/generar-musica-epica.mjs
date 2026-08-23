import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "music");
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

class T {
  constructor(seg) {
    this.s = new Float32Array(Math.floor(SR * seg));
  }
  add(i0, d, fn, g = 0.3, atk = 200) {
    const i = Math.floor(i0 * SR), L = Math.floor(d * SR);
    for (let k = 0; k < L && i + k < this.s.length; k++) {
      const t = k / SR;
      this.s[i + k] += fn(t) * Math.exp(-t * 3.2) * Math.min(1, t * atk) * g;
    }
  }
  sus(i0, d, fn, g = 0.2) {
    const i = Math.floor(i0 * SR), L = Math.floor(d * SR);
    for (let k = 0; k < L && i + k < this.s.length; k++) {
      const t = k / SR;
      this.s[i + k] += fn(t) * Math.min(1, t * 10) * Math.min(1, (d - t) * 8) * g;
    }
  }
  kick(t, g = 0.95) {
    this.add(t, 0.28, (x) => Math.sin(2 * Math.PI * (52 + 80 * Math.exp(-x * 22)) * x), g);
  }
  hat(t, g = 0.12) {
    let l = 0;
    this.add(t, 0.05, () => {
      const n = Math.random() * 2 - 1;
      const v = n - l * 0.65;
      l = n;
      return v;
    }, g);
  }
  snare(t, g = 0.25) {
    this.add(t, 0.16, () => Math.random() * 2 - 1, g);
  }
  nota(t, f, d, w = "saw", g = 0.22) {
    const W = {
      saw: (p) => (((p % 1) + 1) % 1) * 2 - 1,
      tri: (p) => Math.abs(((p % 1) + 1) % 1 - 0.5) * 4 - 1,
      sine: (p) => Math.sin(p),
      superSaw: (p) => {
        let v = 0;
        for (const dt of [0.997, 1.0, 1.004]) v += ((p * dt % 1) + 1) % 1 * 2 - 1;
        return v / 3;
      },
    };
    this.add(t, d, (t2) => W[w](2 * Math.PI * f * t2 / (2 * Math.PI)), g);
  }
  pad(t, notas, oct, d, g = 0.09) {
    for (const n of notas) {
      const f = freq(n, oct);
      this.sus(t, d, (t2) =>
        Math.sin(2 * Math.PI * f * t2) * 0.6 + Math.sin(2 * Math.PI * f * 1.005 * t2) * 0.4, g);
    }
  }
  riser(t0, d, g = 0.14) {
    const i = Math.floor(t0 * SR), L = Math.floor(d * SR);
    let l = 0;
    for (let k = 0; k < L && i + k < this.s.length; k++) {
      const t = k / SR;
      const n = Math.random() * 2 - 1;
      const v = (n - l * 0.6) * Math.pow(t / d, 2);
      l = n;
      this.s[i + k] += v * g;
    }
  }
}

// MODA ÉPICA — 124 BPM: acordes gigantes, redoble antes del drop, ascenso constante
function epica(nombre) {
  const PROG = [
    ["A", "C", "E"],
    ["F", "A", "C"],
    ["C", "E", "G"],
    ["G", "B", "D"],
  ];
  const bpm = 124, beat = 60 / bpm, compases = 16;
  const t = new T(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    // muro de sonido
    for (const n of ch) t.nota(b0, freq(n, c >= 8 ? 4 : 3), beat * 3.8, "superSaw", 0.11);
    t.pad(b0, ch, 5, beat * 4, 0.07);
    t.kick(b0); t.kick(b0 + beat, 0.7); t.kick(b0 + 2 * beat); t.kick(b0 + 3 * beat, 0.7);
    t.snare(b0 + beat * 2);
    for (let h = 0; h < 16; h++) t.hat(b0 + h * beat * 0.25, h % 4 === 0 ? 0.13 : 0.06);
    // bajo impulsor octava baja
    t.nota(b0, freq(ch[0], 1), beat * 0.9, "saw", 0.30);
    t.nota(b0 + beat * 1.5, freq(ch[0], 1), beat * 0.45, "saw", 0.24);
    t.nota(b0 + beat * 2, freq(ch[1], 1), beat * 0.9, "saw", 0.26);
    // melodía heroica
    [[0, 2, 4], [1, 1, 3], [2, 2, 5], [3.5, 0, 5]].forEach(([pb, ni, oc]) => {
      t.nota(b0 + pb * beat, freq(ch[ni], oc), beat * 0.7, "tri", 0.15);
    });
    // redoble + riser cada 4 compases -> euforia
    if (c % 4 === 3) {
      [0, 0.25, 0.5, 0.75].forEach((p, j) => t.snare(b0 + 3 * beat + p * beat, 0.18 + j * 0.08));
      t.riser(b0 + 2 * beat, 2 * beat, 0.16);
    }
    if (c === 7 || c === 15) for (const n of ch) t.nota(b0 + 3 * beat, freq(n, 6), beat, "tri", 0.10);
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

epica("Garage Gold - Moda Epica.wav");
console.log("OK ->", DIR);
