"use client";

import { useId } from "react";

const BRANDS: Record<string, { bg: string; fg: string; label: string }> = {
  "Tommy Hilfiger": { bg: "#0f2d52", fg: "#ffffff", label: "TOMMY HILFIGER" },
  "Calvin Klein": { bg: "#000000", fg: "#ffffff", label: "CALVIN KLEIN JEANS" },
  Hollister: { bg: "#14342b", fg: "#e8d9a0", label: "HOLLISTER" },
  "Polo Ralph Lauren": { bg: "#0a1f44", fg: "#ffffff", label: "POLO RALPH LAUREN" },
  "Levi's": { bg: "#c41230", fg: "#ffffff", label: "LEVI'S" },
  Nike: { bg: "#111111", fg: "#ffffff", label: "NIKE" },
  "Under Armour": { bg: "#1a1a1a", fg: "#ff3333", label: "UNDER ARMOUR" },
  Gap: { bg: "#002e6e", fg: "#ffffff", label: "GAP" },
  Champion: { bg: "#b21f2d", fg: "#ffffff", label: "CHAMPION" },
  Carhartt: { bg: "#624a2e", fg: "#ffb300", label: "CARHARTT" },
  "The North Face": { bg: "#000000", fg: "#e5e5e5", label: "THE NORTH FACE" },
  "American Eagle": { bg: "#8b1e3f", fg: "#ffffff", label: "AMERICAN EAGLE" },
  "Old Navy": { bg: "#00274d", fg: "#ffcc00", label: "OLD NAVY" },
  Wrangler: { bg: "#8a4b08", fg: "#ffe9c2", label: "WRANGLER" },
  "Abercrombie & Fitch": { bg: "#1c2f26", fg: "#e8dfc8", label: "ABERCROMBIE & FITCH" },
  Nautica: { bg: "#003366", fg: "#ffffff", label: "NAUTICA" },
};

const POLOS = ["Tommy Hilfiger", "Polo Ralph Lauren", "Nautica", "Champion"];
const CREWS = ["Nautica", "Abercrombie & Fitch", "American Eagle", "Gap", "Under Armour", "Champion"];

function tamLabel(len: number): number {
  if (len <= 8) return 13;
  if (len <= 12) return 11;
  if (len <= 16) return 9.5;
  if (len <= 20) return 8;
  return 7;
}

interface Tono {
  light: string;
  base: string;
  dark: string;
}

function paleta(marca: string): Tono {
  switch (marca) {
    case "Tommy Hilfiger":
      return { light: "#4a7fc9", base: "#2a5da8", dark: "#173e78" };
    case "Calvin Klein":
      return { light: "#5a6068", base: "#33373d", dark: "#181b1f" };
    case "Hollister":
      return { light: "#e66a8a", base: "#d63f68", dark: "#a12547" };
    case "Polo Ralph Lauren":
      return { light: "#3457a5", base: "#1e3a75", dark: "#10234c" };
    case "Levi's":
      return { light: "#5a86c2", base: "#39629e", dark: "#24436f" };
    case "Nike":
      return { light: "#6a6f77", base: "#42464d", dark: "#23262b" };
    case "Under Armour":
      return { light: "#4a4f57", base: "#282c33", dark: "#12151a" };
    case "Gap":
      return { light: "#4a76bd", base: "#27549c", dark: "#153567" };
    case "Champion":
      return { light: "#889098", base: "#565d66", dark: "#30353c" };
    case "Carhartt":
      return { light: "#b5793d", base: "#8f551f", dark: "#5f370f" };
    case "The North Face":
      return { light: "#e8eaee", base: "#b9bec7", dark: "#767d89" };
    case "American Eagle":
      return { light: "#b04a67", base: "#8b1e3f", dark: "#5f1129" };
    case "Old Navy":
      return { light: "#3d6ba8", base: "#1e4679", dark: "#0f2b52" };
    case "Wrangler":
      return { light: "#c98d4a", base: "#a36420", dark: "#6f420f" };
    case "Abercrombie & Fitch":
      return { light: "#4a6a55", base: "#2c4638", dark: "#16281f" };
    case "Nautica":
      return { light: "#3d7ab8", base: "#1a5290", dark: "#0a3059" };
    default:
      return { light: "#dde1e8", base: "#c9ced7", dark: "#9ba3b0" };
  }
}

function outline(cat: string): string {
  if (cat === "pantalon") {
    return "M158 118 L242 118 L248 142 L237 332 L207 332 L200 214 L193 332 L163 332 L152 142 Z";
  }
  if (cat === "chaqueta") {
    return "M148 118 L196 128 L196 322 L154 322 L140 168 Z M252 118 L204 128 L204 322 L246 322 L260 168 Z";
  }
  if (cat === "gorra") {
    return "M132 196 C132 138 162 104 200 104 C238 104 268 138 268 196 L268 208 L132 208 Z";
  }
  return "M150 120 L118 134 L94 178 L127 194 L136 174 L136 302 Q200 314 264 302 L264 174 L273 194 L306 178 L282 134 L250 120 Q226 140 200 140 Q174 140 150 120 Z";
}

function Detalles({ cat, marca, p }: { cat: string; marca: string; p: Tono }) {
  if (cat === "gorra") {
    return (
      <>
        <path d="M268 196 C310 198 348 214 352 232 C354 244 340 250 318 246 C292 240 268 228 264 216 Z" fill={p.dark} />
        <path d="M268 196 C308 199 344 213 350 230" fill="none" stroke={p.base} strokeWidth="2" opacity="0.6" />
        <path d="M200 104 C186 130 180 165 182 206" fill="none" stroke={p.dark} strokeWidth="1.6" opacity="0.7" />
        <path d="M200 104 C214 130 220 165 218 206" fill="none" stroke={p.dark} strokeWidth="1.6" opacity="0.7" />
        <path d="M166 108 C154 132 148 166 148 202" fill="none" stroke={p.dark} strokeWidth="1.2" opacity="0.5" />
        <path d="M234 108 C246 132 252 166 252 202" fill="none" stroke={p.dark} strokeWidth="1.2" opacity="0.5" />
        <circle cx="200" cy="106" r="5" fill={p.dark} stroke="#ffffff44" />
        <circle cx="164" cy="150" r="2" fill="#0f172a" opacity="0.55" />
        <circle cx="236" cy="150" r="2" fill="#0f172a" opacity="0.55" />
      </>
    );
  }
  if (cat === "pantalon") {
    return (
      <>
        <rect x="154" y="116" width="92" height="18" rx="3" fill={p.dark} />
        <rect x="154" y="116" width="92" height="5" rx="2" fill="#ffffff" opacity="0.12" />
        {[162, 183, 198, 213, 234].map((x) => (
          <rect key={x} x={x} y="114" width="5" height="14" rx="2" fill={p.dark} stroke="#00000033" strokeWidth="0.6" />
        ))}
        <circle cx="212" cy="139" r="3.4" fill="#b08d3e" stroke="#6b5320" strokeWidth="0.8" />
        <path d="M208 141 L208 176" stroke={p.dark} strokeWidth="1.4" opacity="0.8" />
        <path d="M188 140 Q200 146 212 140" fill="none" stroke={p.dark} strokeWidth="1.6" opacity="0.7" />
        <path d="M170 236 Q185 246 200 238" fill="none" stroke={p.dark} strokeWidth="1.6" opacity="0.6" />
        <path d="M230 236 Q215 246 201 238" fill="none" stroke={p.dark} strokeWidth="1.6" opacity="0.6" />
        <path d="M170 238 L184 252 M230 238 L216 252" stroke={p.dark} strokeWidth="1" opacity="0.5" />
        <rect x="163" y="316" width="30" height="16" fill={p.base} stroke={p.dark} strokeWidth="1" opacity="0.85" />
        <rect x="207" y="316" width="30" height="16" fill={p.base} stroke={p.dark} strokeWidth="1" opacity="0.85" />
        <path d="M167 322 H189 M211 322 H233" stroke="#ffffff55" strokeWidth="1.2" />
      </>
    );
  }
  if (cat === "chaqueta") {
    if (marca === "Polo Ralph Lauren") {
      return (
        <>
          <path d="M148 118 L196 128 L196 200 L170 128 Z" fill={p.base} stroke={p.dark} strokeWidth="1.4" />
          <path d="M252 118 L204 128 L204 200 L230 128 Z" fill={p.base} stroke={p.dark} strokeWidth="1.4" />
          <path d="M196 128 L196 322" stroke={p.dark} strokeWidth="2" />
          <circle cx="192" cy="176" r="4" fill="#b08d3e" stroke="#6b5320" />
          <circle cx="192" cy="216" r="4" fill="#b08d3e" stroke="#6b5320" />
          <path d="M162 250 L184 258 M238 250 L216 258" stroke={p.dark} strokeWidth="1.6" opacity="0.7" />
          <rect x="154" y="306" width="42" height="16" fill={p.dark} opacity="0.8" />
          <rect x="204" y="306" width="42" height="16" fill={p.dark} opacity="0.8" />
          <path d="M158 311 H192 M208 311 H242" stroke="#ffffff44" strokeWidth="1.2" />
        </>
      );
    }
    if (CREWS.includes(marca)) {
      return (
        <>
          <path d="M148 118 L196 128 L204 128 L252 118 L262 132 L222 152 L200 144 L178 152 L138 132 Z" fill={p.base} stroke={p.dark} strokeWidth="1.4" />
          <ellipse cx="200" cy="130" rx="26" ry="10" fill={p.dark} />
          <ellipse cx="200" cy="129" rx="20" ry="7" fill={p.base} opacity="0.55" />
          <path d="M148 300 H196 M204 300 H252" stroke={p.dark} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
          <path d="M152 303 H192 M208 303 H248" stroke="#ffffff44" strokeWidth="1.4" />
          <path d="M140 168 q-6 40 -2 84 M260 168 q6 40 2 84" fill="none" stroke={p.dark} strokeWidth="1.4" opacity="0.6" />
        </>
      );
    }
    return (
      <>
        <rect x="197" y="126" width="6" height="198" rx="2" fill={p.dark} />
        <path d="M200 150 l0 14 m0 10 l0 14" stroke="#9aa3ad" strokeWidth="2.4" strokeDasharray="3 3" />
        <rect x="195" y="196" width="10" height="18" rx="3" fill="#9aa3ad" stroke="#5c646d" strokeWidth="1" />
        <path d="M148 118 L196 128 L204 128 L252 118 L262 132 L222 150 L200 142 L178 150 L138 132 Z" fill={p.base} stroke={p.dark} strokeWidth="1.4" />
        <path d="M162 252 L186 262 M238 252 L214 262" stroke={p.dark} strokeWidth="1.6" opacity="0.7" />
        <rect x="154" y="306" width="42" height="16" fill={p.dark} opacity="0.8" />
        <rect x="204" y="306" width="42" height="16" fill={p.dark} opacity="0.8" />
      </>
    );
  }
  const esPolo = POLOS.includes(marca);
  return (
    <>
      <ellipse cx="200" cy="123" rx="27" ry="10" fill={p.dark} />
      <ellipse cx="200" cy="122" rx="21" ry="7" fill="#0f172a" opacity="0.35" />
      <path d="M173 120 a27 10 0 0 1 54 0" fill="none" stroke="#ffffff66" strokeWidth="1.4" strokeDasharray="2.5 2.5" />
      {esPolo ? (
        <>
          <path d="M186 128 L200 142 L214 128 L206 124 L200 130 L194 124 Z" fill={p.light} stroke={p.dark} strokeWidth="1" />
          <rect x="195" y="138" width="10" height="34" rx="2" fill={p.base} stroke={p.dark} strokeWidth="1" />
          <circle cx="200" cy="148" r="2.6" fill="#b08d3e" stroke="#6b5320" strokeWidth="0.6" />
          <circle cx="200" cy="160" r="2.6" fill="#b08d3e" stroke="#6b5320" strokeWidth="0.6" />
          <path d="M150 132 L118 145" stroke="#ffffff44" strokeWidth="1.2" />
          <path d="M250 132 L282 145" stroke="#ffffff44" strokeWidth="1.2" />
        </>
      ) : (
        <path d="M136 176 L127 192" stroke={p.dark} strokeWidth="1.4" opacity="0.6" />
      )}
      <path d="M136 290 Q200 301 264 290" fill="none" stroke={p.dark} strokeWidth="1.4" opacity="0.55" />
      <path d="M143 168 q-3 50 1 96 M257 168 q3 50 -1 96" fill="none" stroke={p.dark} strokeWidth="1.2" opacity="0.45" />
      <rect x="188" y="112" width="24" height="7" rx="2" fill="#f4f1e6" stroke={p.dark} strokeWidth="0.6" />
    </>
  );
}

export default function PrendaImg({
  categoria,
  marca,
  className,
}: {
  categoria: string;
  marca: string;
  className?: string;
}) {
  const raw = useId();
  const u = raw.replace(/[^a-zA-Z0-9]/g, "");
  const p = paleta(marca);
  const b = BRANDS[marca];
  const D = outline(categoria);

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${marca} ${categoria}`}>
      <defs>
        <linearGradient id={`bg-${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfcfe" />
          <stop offset="72%" stopColor="#eef1f6" />
          <stop offset="100%" stopColor="#dde2ea" />
        </linearGradient>
        <radialGradient id={`key-${u}`} cx="32%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`base-${u}`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="52%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        <linearGradient id={`brillo-${u}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`n-${u}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
        <pattern id={`tela-${u}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 H6 M3 0 V6" stroke="#000000" strokeWidth="0.4" opacity="0.10" />
        </pattern>
        <pattern id={`twill-${u}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#ffffff" strokeWidth="1.6" opacity="0.09" />
          <line x1="3" y1="0" x2="3" y2="8" stroke="#000000" strokeWidth="1.2" opacity="0.13" />
        </pattern>
        <pattern id={`knit-${u}`} width="10" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 5 L2.5 2 L5 5 L7.5 2 L10 5" fill="none" stroke="#000000" strokeWidth="1.1" opacity="0.13" />
          <path d="M0 6.5 L2.5 3.5 L5 6.5 L7.5 3.5 L10 6.5" fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.10" />
        </pattern>
        <clipPath id={`c-${u}`}>
          <path d={D} />
        </clipPath>
        <clipPath id={`floor-${u}`}>
          <rect x="0" y="360" width="400" height="40" />
        </clipPath>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${u})`} />
      <rect width="400" height="400" fill={`url(#key-${u})`} />
      <line x1="0" y1="358" x2="400" y2="358" stroke="#cbd2dc" strokeWidth="2" />

      {/* PERCHA */}
      <g>
        <path d="M200 16 q11 1 11 11 t-11 10 v9" fill="none" stroke="#8a5a2b" strokeWidth="5" strokeLinecap="round" />
        <path d="M206 18 q6 2 5 8" fill="none" stroke="#ffffff88" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M92 98 L200 54 L308 98" fill="none" stroke="#a06a33" strokeWidth="9" strokeLinecap="round" />
        <path d="M92 98 L200 54 L308 98" fill="none" stroke="#c68b4d" strokeWidth="4" strokeLinecap="round" />
        <path d="M96 96 L198 54" fill="none" stroke="#8a5a2b" strokeWidth="1.4" opacity="0.6" />
      </g>

      {/* SOMBRA EN PISO */}
      <ellipse cx="200" cy="366" rx="120" ry="12" fill="#0f172a" opacity="0.08" />
      <ellipse cx="200" cy="364" rx="82" ry="8" fill="#0f172a" opacity="0.14" />

      {/* REFLEJO ESPEJO */}
      <g clipPath={`url(#floor-${u})`} opacity="0.07" transform="translate(0 720) scale(1 -1)">
        <path d={D} fill={p.dark} />
      </g>

      {/* PRENDA */}
      <path d={D} fill={`url(#base-${u})`} stroke={p.dark} strokeWidth="2" strokeLinejoin="round" />
      <Detalles cat={categoria} marca={marca} p={p} />

      {/* TEXTURAS Y LUZ */}
      {categoria === "pantalon" && <rect width="400" height="400" fill={`url(#twill-${u})`} clipPath={`url(#c-${u})`} />}
      {(categoria === "chaqueta" || POLOS.includes(marca)) && (
        <rect width="400" height="400" fill={`url(#knit-${u})`} clipPath={`url(#c-${u})`} />
      )}
      {(categoria === "camiseta" || categoria === "gorra") && (
        <rect width="400" height="400" fill={`url(#tela-${u})`} clipPath={`url(#c-${u})`} />
      )}
      <rect width="400" height="400" filter={`url(#n-${u})`} clipPath={`url(#c-${u})`} />
      <rect width="400" height="400" fill={`url(#brillo-${u})`} clipPath={`url(#c-${u})`} />

      {/* ETIQUETA DE PRECIO COLGANTE */}
      <g transform="rotate(14 300 170)">
        <line x1="288" y1="128" x2="304" y2="158" stroke="#9a7b4f" strokeWidth="1.6" />
        <rect x="290" y="156" width="38" height="24" rx="3" fill="#fdf6e3" stroke="#d4c9a8" />
        <circle cx="296" cy="162" r="2.2" fill="#b3a37e" />
        <line x1="302" y1="168" x2="322" y2="168" stroke="#b23b3b" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="302" y1="173" x2="315" y2="173" stroke="#8a8a8a" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* PARCHE DE MARCA COSIDO */}
      {b && categoria !== "gorra" && (
        <g>
          <rect x="236" y="278" width="30" height="14" rx="2" fill="#f4f1e6" stroke="#c9be9c" strokeWidth="0.8" />
          <path d="M238 280 v10 M264 280 v10" stroke={p.dark} strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          <text x="251" y="288" fontSize="7" fontWeight="800" fill={p.dark} textAnchor="middle" fontFamily="Arial, sans-serif">
            {b.label.slice(0, 6)}
          </text>
        </g>
      )}

      {/* INSIGNIA DE MARCA */}
      {b && (
        <g>
          <rect
            x={12}
            y={358}
            width={b.label.length * tamLabel(b.label.length) * 0.62 + 20}
            height={28}
            rx={7}
            fill={b.bg}
            stroke="#ffffff77"
            strokeWidth="1.5"
          />
          <text
            x={22}
            y={377}
            fontSize={tamLabel(b.label.length)}
            fontWeight="800"
            fill={b.fg}
            fontFamily="Arial, sans-serif"
            letterSpacing={b.label.length > 16 ? 0.4 : 1.2}
          >
            {b.label}
          </text>
        </g>
      )}
    </svg>
  );
}
