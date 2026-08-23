import { execFileSync } from "node:child_process";

const FF = "C:\\Users\\jose-\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe";
const DIR = "C:\\Users\\jose-\\OneDrive\\Escritorio\\novaccion";
const SR = 16000;

function pcm(file) {
  const out = execFileSync(FF, [
    "-v", "quiet", "-i", file,
    "-ac", "1", "-ar", String(SR), "-f", "s16le", "-",
  ], { maxBuffer: 64 * 1024 * 1024 });
  const n = Math.floor(out.length / 2);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) s[i] = out.readInt16LE(i * 2) / 32768;
  return s;
}

function analiza(file) {
  const x = pcm(file);
  const hop = Math.floor(SR * 0.025);
  const frames = [];
  for (let i = 0; i + hop <= x.length; i += hop) {
    let e = 0;
    for (let k = 0; k < hop; k++) e += x[i + k] * x[i + k];
    frames.push(Math.sqrt(e / hop));
  }
  const pico = Math.max(...frames);
  if (pico < 1e-4) return { voz: 0, pausas: 0, activoPct: 0 };
  const umbral = Math.max(pico * 0.12, 0.008);
  const act = frames.map((f) => f > umbral);
  // segmentos activos y su duracion
  const segs = [];
  let ini = -1;
  for (let i = 0; i < act.length; i++) {
    if (act[i] && ini < 0) ini = i;
    if ((!act[i] || i === act.length - 1) && ini >= 0) {
      segs.push(i - ini);
      ini = -1;
    }
  }
  const activoPct = (act.filter(Boolean).length / act.length) * 100;
  const pausas = segs.length - 1;
  // HABLA: muchos segmentos cortos-medios (silabas/palabras), actividad 35-75%
  const segPorSeg = segs.length / (frames.length * 0.025);
  const largoMedio = segs.length ? segs.reduce((a, b) => a + b, 0) / segs.length : 0;
  let voz = 0;
  if (activoPct > 25 && activoPct < 85) {
    voz = segPorSeg * 8 + (largoMedio > 3 && largoMedio < 60 ? 3 : 0) + (pausas > 3 ? 2 : 0);
    if (pico > 0.05) voz += 2;
  }
  return { voz: Math.round(voz * 10) / 10, pausas, activoPct: Math.round(activoPct), segPorSeg: Math.round(segPorSeg * 10) / 10 };
}

const archivos = process.argv.slice(2);
for (const a of archivos) {
  try {
    const r = analiza(`${DIR}\\${a}`);
    console.log(`${r.voz}\t${r.pausas}\t${r.activoPct}%\t${r.segPorSeg}/s\t${a}`);
  } catch {
    console.log(`ERR\t\t\t${a}`);
  }
}
