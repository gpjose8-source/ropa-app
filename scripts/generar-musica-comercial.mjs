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
  add(inicioSec, durSec, fn, gain = 0.3, ataque = 200) {
    const ini = Math.floor(inicioSec * SR);
    const len = Math.floor(durSec * SR);
    for (let i = 0; i < len && ini + i < this.s.length; i++) {
      const t = i / SR;
      const env = Math.exp(-t * 3.5) * Math.min(1, t * ataque);
      this.s[ini + i] += fn(t) * env * gain;
    }
  }
  sostenido(inicioSec, durSec, fn, gain = 0.2) {
    const ini = Math.floor(inicioSec * SR);
    const len = Math.floor(durSec * SR);
    for (let i = 0; i < len && ini + i < this.s.length; i++) {
      const t = i / SR;
      const env = Math.min(1, t * 8) * Math.min(1, (durSec - t) * 6);
      this.s[ini + i] += fn(t) * env * gain;
    }
  }
  kick(inicio, g = 0.9) {
    this.add(inicio, 0.25, (t) => Math.sin(2 * Math.PI * (55 + 70 * Math.exp(-t * 25)) * t), g);
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
    this.add(inicio, 0.15, () => Math.random() * 2 - 1, 0.22);
  }
  nota(inicio, f, dur, wave = "tri", g = 0.25) {
    const waves = {
      tri: (p) => Math.abs(((p % 1) + 1) % 1 - 0.5) * 4 - 1,
      sine: (p) => Math.sin(p),
      saw: (p) => (((p % 1) + 1) % 1) * 2 - 1,
      pluck: (p) => (Math.sin(p) > 0 ? 1 : -1) * Math.pow(Math.abs(Math.sin(p)), 0.6),
    };
    this.add(inicio, dur, (t) => waves[wave](2 * Math.PI * f * t / (2 * Math.PI)), g);
  }
  acorde(inicio, notas, oct, dur, g = 0.10) {
    for (const n of notas) this.nota(inicio, freq(n, oct), dur, "tri", g);
  }
  pad(inicio, notas, oct, dur, g = 0.09) {
    for (const n of notas) {
      this.sostenido(inicio, dur, (t) => {
        const f = freq(n, oct);
        return Math.sin(2 * Math.PI * f * t) * 0.7 + Math.sin(2 * Math.PI * f * 1.005 * t) * 0.3;
      }, g);
    }
  }
  riser(inicioSec, durSec, g = 0.10) {
    const ini = Math.floor(inicioSec * SR);
    const len = Math.floor(durSec * SR);
    let last = 0;
    for (let i = 0; i < len && ini + i < this.s.length; i++) {
      const t = i / SR;
      const n = Math.random() * 2 - 1;
      const v = (n - last * 0.65) * (t / durSec);
      last = n;
      this.s[ini + i] += v * g;
    }
  }
}

// 1) BOUTIQUE — house suave 112 BPM: bienvenida, ritmo que acompaña al paso
function boutique(nombre) {
  const PROG = [
    ["C", "E", "G"],
    ["G", "B", "D"],
    ["A", "C", "E"],
    ["F", "A", "C"],
  ];
  const bpm = 112;
  const beat = 60 / bpm;
  const compases = 18;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.pad(b0, ch, 4, 4 * beat, 0.11);
    t.kick(b0, 0.7); t.kick(b0 + beat, 0.55); t.kick(b0 + 2 * beat, 0.7); t.kick(b0 + 3 * beat, 0.55);
    for (let h = 0; h < 8; h++) t.hat(b0 + h * beat * 0.5, h % 2 ? 0.07 : 0.12);
    for (let p = 0; p < 8; p++) {
      const n = ch[p % 3];
      t.nota(b0 + p * beat * 0.5 + beat * 0.125, freq(n, c >= 8 ? 5 : 4), 0.16, "pluck", p % 2 ? 0.13 : 0.19);
    }
    t.nota(b0, freq(ch[0], 2), beat * 0.9, "sine", 0.26);
    t.nota(b0 + 2 * beat, freq(ch[1], 2), beat * 0.9, "sine", 0.22);
    if (c === compases - 1) t.riser(b0 + 2 * beat, 2 * beat, 0.06);
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

// 2) ASCENSO — 118 BPM con lifts: deseo, urgencia positiva
function ascenso(nombre) {
  const PROG = [
    ["A", "C", "E"],
    ["F", "A", "C"],
    ["C", "E", "G"],
    ["G", "B", "D"],
  ];
  const bpm = 118;
  const beat = 60 / bpm;
  const compases = 18;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.acorde(b0, ch, c >= 10 ? 5 : 4, beat * 1.8, 0.085);
    t.kick(b0); t.kick(b0 + 2 * beat); t.kick(b0 + 3.5 * beat, 0.6);
    t.snare(b0 + beat); t.snare(b0 + 3 * beat);
    for (let h = 0; h < 16; h++) t.hat(b0 + h * beat * 0.25, h % 4 === 0 ? 0.11 : 0.05);
    // arpegio ascendente 1-3-5-8: sensación de subir
    [ch[0], ch[1], ch[2], ch[0]].forEach((n, i) => {
      t.nota(b0 + i * beat * 0.5, freq(n, i === 3 ? 5 : 4), 0.14, "tri", 0.17);
    });
    t.nota(b0, freq(ch[0], 2), beat * 1.4, "saw", 0.24);
    if (c % 4 === 3) {
      t.riser(b0 + 2 * beat, 2 * beat, 0.09);
      t.nota(b0 + 3 * beat, freq(ch[2], 6), beat, "tri", 0.10);
    }
    if (c >= 14) for (const n of ch) t.pad(b0, [n], 6, beat * 0.5, 0.05);
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

// 3) LUJO SUAVE — 96 BPM premium: confianza, elegancia (ropa $100+)
function lujo(nombre) {
  const PROG = [
    ["F", "A", "C"],
    ["C", "E", "G"],
    ["D", "F", "A"],
    ["G", "B", "D"],
  ];
  const bpm = 96;
  const beat = 60 / bpm;
  const compases = 15;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.pad(b0, ch, 3, 4 * beat, 0.13);
    t.kick(b0, 0.5); t.kick(b0 + 2.5 * beat, 0.45);
    t.hat(b0 + beat * 0.5, 0.06); t.hat(b0 + beat * 2, 0.08); t.hat(b0 + beat * 3.5, 0.05);
    t.nota(b0, freq(ch[0], 2), beat * 1.6, "sine", 0.27);
    // lead cálido con vibrato tipo sax suave
    const melodia = [[0, 0], [0.75, 1], [1.5, 2], [2.5, 1], [3, 0]];
    for (const [pb, ni] of melodia) {
      const f = freq(ch[ni], 5);
      t.add(b0 + pb * beat, beat * 0.7, (tt) => {
        const vib = 1 + Math.sin(2 * Math.PI * 5.5 * tt) * 0.004;
        return Math.sin(2 * Math.PI * f * vib * tt) * 0.8 + Math.sin(2 * Math.PI * f * 2 * tt) * 0.2;
      }, 0.14, 90);
    }
    if (c % 5 === 4) t.riser(b0 + 2 * beat, 1.5 * beat, 0.04);
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

boutique("Garage Gold - Tienda Abierta.wav");
ascenso("Garage Gold - Impulso Dorado.wav");
lujo("Garage Gold - Lujo Suave.wav");
console.log("OK ->", DIR);
