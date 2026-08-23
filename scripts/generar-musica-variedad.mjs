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
  }
  add(inicioSec, durSec, fn, gain = 0.3, ataque = 200) {
    const ini = Math.floor(inicioSec * SR);
    const len = Math.floor(durSec * SR);
    for (let i = 0; i < len && ini + i < this.s.length; i++) {
      const t = i / SR;
      this.s[ini + i] += fn(t) * Math.exp(-t * 3.5) * Math.min(1, t * ataque) * gain;
    }
  }
  sostenido(inicioSec, durSec, fn, gain = 0.2) {
    const ini = Math.floor(inicioSec * SR);
    const len = Math.floor(durSec * SR);
    for (let i = 0; i < len && ini + i < this.s.length; i++) {
      const t = i / SR;
      this.s[ini + i] += fn(t) * Math.min(1, t * 8) * Math.min(1, (durSec - t) * 6) * gain;
    }
  }
  kick(inicio, g = 0.85) {
    this.add(inicio, 0.25, (t) => Math.sin(2 * Math.PI * (55 + 70 * Math.exp(-t * 25)) * t), g);
  }
  hat(inicio, g = 0.12) {
    let last = 0;
    this.add(inicio, 0.05, () => {
      const n = Math.random() * 2 - 1;
      const v = n - last * 0.7;
      last = n;
      return v;
    }, g);
  }
  snare(inicio, g = 0.2) {
    this.add(inicio, 0.15, () => Math.random() * 2 - 1, g);
  }
  nota(inicio, f, dur, wave = "tri", g = 0.25) {
    const waves = {
      tri: (p) => Math.abs(((p % 1) + 1) % 1 - 0.5) * 4 - 1,
      sine: (p) => Math.sin(p),
      saw: (p) => (((p % 1) + 1) % 1) * 2 - 1,
      pluck: (p) => (Math.sin(p) > 0 ? 1 : -1) * Math.pow(Math.abs(Math.sin(p)), 0.6),
      campana: (p) => Math.sin(p) + Math.sin(p * 2.76) * 0.35,
    };
    this.add(inicio, dur, (t) => waves[wave](2 * Math.PI * f * t / (2 * Math.PI)), g);
  }
  acorde(inicio, notas, oct, dur, g = 0.10) {
    for (const n of notas) this.nota(inicio, freq(n, oct), dur, "tri", g);
  }
  pad(inicio, notas, oct, dur, g = 0.09) {
    for (const n of notas) {
      const f = freq(n, oct);
      this.sostenido(inicio, dur, (t) =>
        Math.sin(2 * Math.PI * f * t) * 0.7 + Math.sin(2 * Math.PI * f * 1.004 * t) * 0.3, g);
    }
  }
  bajo(inicio, f, dur, g = 0.28) {
    this.sostenido(inicio, dur, (t) => {
      const env = 1 + Math.sin(2 * Math.PI * f / 8 * t) * 0.05;
      return Math.sin(2 * Math.PI * f * t) * env * 0.8 + Math.sin(2 * Math.PI * f * 0.5 * t) * 0.2;
    }, g);
  }
}

// 1) CONFIANZA TOTAL — house cálido 108 BPM con séptimas: solidez y apertura
function confianza(nombre) {
  const PROG = [
    ["C", "E", "G", "B"],
    ["A", "C", "E", "G"],
    ["F", "A", "C", "E"],
    ["G", "B", "D", "F"],
  ];
  const bpm = 108, beat = 60 / bpm, compases = 14;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.pad(b0, ch.slice(0, 3), 4, 4 * beat, 0.12);
    t.bajo(b0, freq(ch[0], 2), beat * 3.6, 0.26);
    t.kick(b0); t.kick(b0 + 2 * beat); t.kick(b0 + 3.5 * beat, 0.5);
    t.snare(b0 + beat); t.snare(b0 + 3 * beat);
    for (let h = 0; h < 8; h++) t.hat(b0 + h * beat * 0.5, h % 2 ? 0.06 : 0.11);
    [ch[0], ch[2], ch[3], ch[1]].forEach((n, i) =>
      t.nota(b0 + i * beat, freq(n, i === 2 ? 5 : 4), 0.3, "campana", 0.13));
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

// 2) ESTILO URBANO — trap suave 100 BPM: moderno, cercano, con brillo de campanas
function urbano(nombre) {
  const PROG = [
    ["A", "C", "E"],
    ["F", "A", "C"],
    ["C", "E", "G"],
    ["G", "B", "D"],
  ];
  const bpm = 100, beat = 60 / bpm, compases = 14;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.pad(b0, ch, 4, 4 * beat, 0.10);
    const sub = (iniSec, f, g = 0.5) => {
      const ini = Math.floor(iniSec * SR);
      const len = Math.floor(beat * SR);
      for (let i = 0; i < len && ini + i < t.s.length; i++) {
        const tt = i / SR;
        t.s[ini + i] += Math.sin(2 * Math.PI * f * Math.exp(-tt * 0.7) * tt) * g * Math.min(1, tt * 90);
      }
    };
    sub(b0, freq(ch[0], 1));
    sub(b0 + beat * 2.5, freq(ch[1], 1));
    t.kick(b0, 0.75); t.kick(b0 + beat * 1.75, 0.6); t.kick(b0 + beat * 3, 0.65);
    t.snare(b0 + beat * 2);
    for (let h = 0; h < 16; h++) if (h % 4 !== 2) t.hat(b0 + h * beat * 0.25, 0.08);
    t.nota(b0 + beat * 0.5, freq(ch[2], 5), beat * 1.2, "campana", 0.14);
    t.nota(b0 + beat * 2.75, freq(ch[0], 6), beat * 0.8, "campana", 0.10);
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

// 3) AMANECER DORADO — plucks ascendentes 115 BPM: optimismo, día perfecto
function amanecer(nombre) {
  const PROG = [
    ["C", "E", "G"],
    ["G", "B", "D"],
    ["A", "C", "E"],
    ["F", "A", "C"],
  ];
  const bpm = 115, beat = 60 / bpm, compases = 14;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.pad(b0, ch, 4, 4 * beat, 0.10);
    t.kick(b0, 0.65); t.kick(b0 + 2 * beat, 0.55);
    for (let h = 0; h < 8; h++) t.hat(b0 + h * beat * 0.5, h === 3 ? 0.13 : 0.07);
    [ch[0], ch[1], ch[2], ch[1], ch[0], ch[2]].forEach((n, i) =>
      t.nota(b0 + i * beat * 0.66, freq(n, i >= 4 ? 5 : 4), 0.18, "pluck", i % 2 ? 0.12 : 0.18));
    if (c % 4 === 3) {
      let last = 0;
      const ini = Math.floor((b0 + 2 * beat) * SR);
      const len = Math.floor(2 * beat * SR);
      for (let i = 0; i < len && ini + i < t.s.length; i++) {
        const n = Math.random() * 2 - 1;
        last = (n - last * 0.65) * (i / len);
        t.s[ini + i] += last * 0.08;
      }
    }
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

// 4) SOFISTICADO — lounge 88 BPM con contrabajo: elegancia relajada
function sofisticado(nombre) {
  const PROG = [
    ["D", "F", "A", "C"],
    ["G", "B", "D", "F"],
    ["C", "E", "G", "B"],
    ["A", "C", "E", "G"],
  ];
  const bpm = 88, beat = 60 / bpm, compases = 12;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.pad(b0, ch.slice(0, 3), 4, 4 * beat, 0.11);
    // contrabajo caminante
    t.nota(b0, freq(ch[0], 2), beat * 0.9, "sine", 0.30);
    t.nota(b0 + beat, freq(ch[1], 2), beat * 0.9, "sine", 0.24);
    t.nota(b0 + 2 * beat, freq(ch[2], 2), beat * 0.9, "sine", 0.27);
    t.nota(b0 + 3 * beat, freq(ch[(c % 2) + 1], 3), beat * 0.9, "sine", 0.22);
    t.hat(b0 + beat * 0.5, 0.06); t.hat(b0 + beat * 1.5, 0.09);
    t.hat(b0 + beat * 2.5, 0.06); t.hat(b0 + beat * 3.5, 0.09);
    // melodía suave
    [[0, 0], [1.25, 2], [2, 1], [3.25, 3]].forEach(([pb, ni]) => {
      const f = freq(ch[ni], 5);
      t.add(b0 + pb * beat, beat * 0.8, (tt) => {
        const vib = 1 + Math.sin(2 * Math.PI * 5 * tt) * 0.003;
        return Math.sin(2 * Math.PI * f * vib * tt);
      }, 0.13, 90);
    });
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

// 5) PASO FIRME — groove seguro 112 BPM: decisión de compra con estilo
function pasoFirme(nombre) {
  const PROG = [
    ["G", "B", "D"],
    ["E", "G", "B"],
    ["C", "E", "G"],
    ["D", "F", "A"],
  ];
  const bpm = 112, beat = 60 / bpm, compases = 14;
  const t = new Track(compases * 4 * beat + 1);
  for (let c = 0; c < compases; c++) {
    const b0 = c * 4 * beat;
    const ch = PROG[c % 4];
    t.acorde(b0, ch, 4, beat * 1.6, 0.09);
    t.bajo(b0, freq(ch[0], 2), beat * 1.7, 0.27);
    t.bajo(b0 + 2 * beat, freq(ch[1], 2), beat * 1.6, 0.24);
    t.kick(b0); t.kick(b0 + beat * 1.5, 0.55); t.kick(b0 + beat * 2.5, 0.7);
    t.snare(b0 + beat); t.snare(b0 + 3 * beat);
    for (let h = 0; h < 16; h++) t.hat(b0 + h * beat * 0.25, h % 4 === 2 ? 0.12 : 0.05);
    t.nota(b0 + beat * 3.25, freq(ch[2], 5), beat * 0.6, "pluck", 0.15);
  }
  fs.writeFileSync(path.join(DIR, nombre), wav(t.s));
  console.log("generado:", nombre);
}

confianza("Garage Gold - Confianza Total.wav");
urbano("Garage Gold - Estilo Urbano.wav");
amanecer("Garage Gold - Amanecer Dorado.wav");
sofisticado("Garage Gold - Sofisticado.wav");
pasoFirme("Garage Gold - Paso Firme.wav");
console.log("OK ->", DIR);
