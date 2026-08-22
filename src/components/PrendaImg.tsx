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

function tamLabel(len: number): number {
  if (len <= 8) return 13;
  if (len <= 12) return 11;
  if (len <= 16) return 9.5;
  if (len <= 20) return 8;
  return 7;
}

const TEE =
  "M118 80 L86 98 L58 154 L96 174 L112 148 L112 332 Q200 346 288 332 L288 148 L304 174 L342 154 L314 98 L282 80 Q240 106 200 106 Q160 106 118 80 Z";
const JEANS =
  "M124 98 L276 98 L296 340 L214 340 L202 192 L198 192 L186 340 L104 340 Z";

type Palette = { light: string; base: string; dark: string };

function paleta(marca?: string): Palette {
  switch (marca) {
    case "Tommy Hilfiger":
      return { light: "#2b4f85", base: "#1d3a66", dark: "#122544" };
    case "Calvin Klein":
      return { light: "#3a3a42", base: "#232329", dark: "#101014" };
    case "Polo Ralph Lauren":
      return { light: "#2b4a7d", base: "#14264a", dark: "#0b1730" };
    case "Levi's":
    case "Wrangler":
      return { light: "#3d5c85", base: "#23405f", dark: "#122338" };
    case "Nike":
    case "Under Armour":
      return { light: "#4b5563", base: "#23272f", dark: "#0d1015" };
    case "Gap":
    case "Old Navy":
      return { light: "#3b6fc9", base: "#1d4a94", dark: "#0e2c5c" };
    case "Champion":
      return { light: "#94a3b8", base: "#5b6b7e", dark: "#37414e" };
    case "Carhartt":
      return { light: "#a9743c", base: "#7a4e21", dark: "#4c2f12" };
    case "The North Face":
      return { light: "#e8eaee", base: "#b9bec7", dark: "#767d89" };
    case "Abercrombie & Fitch":
      return { light: "#4a6a55", base: "#2c4638", dark: "#16281f" };
    case "Nautica":
      return { light: "#3d7ab8", base: "#1a5290", dark: "#0a3059" };
    default:
      return { light: "#dde1e8", base: "#c9ced7", dark: "#9ba3b0" };
  }
}

export default function PrendaImg({
  categoria,
  marca,
  className = "",
}: {
  categoria: string;
  marca?: string;
  className?: string;
}) {
  const u = `${marca ?? "x"}-${categoria}`.replace(/[^a-z0-9]/gi, "");
  const p = paleta(marca);
  const b = marca ? BRANDS[marca] : undefined;
  const stitch = "#c7d4e8";

  const silueta =
    categoria === "pantalon"
      ? JEANS
      : categoria === "chaqueta" || categoria === "camiseta"
        ? TEE
        : null;

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${marca ?? ""} ${categoria}`}>
      <defs>
        <radialGradient id={`bg-${u}`} cx="38%" cy="28%" r="95%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#eef1f5" />
          <stop offset="100%" stopColor="#dde2e9" />
        </radialGradient>
        <radialGradient id={`v-${u}`} cx="50%" cy="45%" r="72%">
          <stop offset="60%" stopColor="#0f172a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.13" />
        </radialGradient>
        <linearGradient id={`brillo-${u}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <pattern id={`tela-${u}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 H6 M3 0 V6" stroke="#000000" strokeWidth="0.4" opacity="0.10" />
        </pattern>
        <linearGradient id={`g-${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="55%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        {silueta && (
          <>
            <clipPath id={`c-${u}`}>
              <path d={silueta} />
            </clipPath>
            <filter id={`n-${u}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.055 0" />
            </filter>
          </>
        )}
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${u})`} />
      <ellipse cx="200" cy="354" rx="120" ry="15" fill="#0f172a" opacity="0.10" />

      {/* PERCHA DE MADERA */}
      {(categoria === "camiseta" || categoria === "chaqueta") && (
        <g>
          <path d="M200 16 q11 1 11 11 t-11 10 v9" fill="none" stroke="#8a5a2b" strokeWidth="5" strokeLinecap="round" />
          <path d="M92 98 L200 54 L308 98" fill="none" stroke="#a06a33" strokeWidth="9" strokeLinecap="round" />
          <path d="M92 98 L200 54 L308 98" fill="none" stroke="#c68b4d" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {categoria === "pantalon" && (
        <g>
          <path d="M200 20 q11 1 11 11 t-11 10 v13" fill="none" stroke="#8a5a2b" strokeWidth="5" strokeLinecap="round" />
          <rect x="140" y="46" width="120" height="9" rx="4.5" fill="#a06a33" />
          <rect x="128" y="52" width="15" height="26" rx="4" fill="#8a5a2b" />
          <rect x="257" y="52" width="15" height="26" rx="4" fill="#8a5a2b" />
        </g>
      )}

      {/* CAMISETA / POLO / CAMISA */}
      {(categoria === "camiseta" || categoria === "") && (
        <g>
          <path d={TEE} fill={`url(#g-${u})`} stroke="#00000022" />
          {marca === "Tommy Hilfiger" ? (
            <>
              <path d="M150 76 Q200 104 250 76 L242 62 Q200 86 158 62 Z" fill={p.dark} />
              <rect x="188" y="100" width="24" height="58" rx="3" fill={p.light} stroke="#00000033" />
              {[112, 130, 148].map((cy) => (
                <circle key={cy} cx="200" cy={cy} r="3" fill="#ffffff" opacity="0.9" />
              ))}
              <rect x="250" y="142" width="36" height="25" fill="#14213d" stroke="#ffffff55" />
              <rect x="268" y="146" width="16" height="7" fill="#ffffff" />
              <rect x="268" y="155" width="16" height="7" fill="#d62828" />
            </>
          ) : marca === "Calvin Klein" ? (
            <>
              <path d="M168 74 L232 74 L218 102 Q200 112 182 102 Z" fill={p.light} stroke="#00000033" />
              <line x1="182" y1="102" x2="176" y2="128" stroke="#ffffff44" strokeWidth="1.5" />
              <text x="200" y="215" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="3" fill="#ffffff" fontFamily="Arial">
                CALVIN KLEIN
              </text>
            </>
          ) : (
            <>
              <path d="M150 76 Q200 102 250 76 L243 65 Q200 88 157 65 Z" fill={p.dark} />
              <circle cx="200" cy="190" r="37" fill="none" stroke="#55654e" strokeWidth="3" />
              <path d="M178 183 q11 -14 22 0 q11 -14 22 0" fill="none" stroke="#55654e" strokeWidth="3" strokeLinecap="round" />
              <text x="200" y="228" textAnchor="middle" fontSize="16" fontWeight="800" letterSpacing="5" fill="#55654e" fontFamily="Arial">HCO</text>
            </>
          )}
          <path d="M126 168 q-8 46 0 92" stroke="#000" opacity="0.14" fill="none" strokeWidth="3" />
          <path d="M274 168 q8 46 0 92" stroke="#000" opacity="0.14" fill="none" strokeWidth="3" />
          <path d="M114 324 Q200 337 286 324" stroke="#000" opacity="0.20" fill="none" strokeWidth="2" />
        </g>
      )}

      {/* PANTALON / JEANS / SHORT / JOGGER */}
      {categoria === "pantalon" && (
        <g>
          <path d={JEANS} fill={`url(#g-${u})`} stroke="#00000022" />
          <rect x="124" y="72" width="152" height="26" rx="5" fill={p.dark} stroke="#00000033" />
          {[136, 167, 198, 229, 260].map((x) => (
            <rect key={x} x={x} y="67" width="7" height="15" rx="2" fill={p.dark} stroke="#00000022" />
          ))}
          <circle cx="198" cy="85" r="3.2" fill="#d7dde6" />
          <path d="M199 98 Q190 132 197 158" stroke={stitch} strokeWidth="1.8" strokeDasharray="6 4" fill="none" />
          <path d="M138 104 Q164 132 188 106" stroke={stitch} strokeWidth="1.8" strokeDasharray="6 4" fill="none" />
          <path d="M212 106 Q236 132 262 104" stroke={stitch} strokeWidth="1.8" strokeDasharray="6 4" fill="none" />
          <path d="M124 98 L276 98" stroke={stitch} strokeWidth="1.8" strokeDasharray="6 4" opacity="0.8" />
          <path d="M148 170 q-6 40 -4 78" stroke="#000" opacity="0.15" fill="none" strokeWidth="3" />
          <path d="M252 170 q6 40 4 78" stroke="#000" opacity="0.15" fill="none" strokeWidth="3" />
          {marca === "Tommy Hilfiger" && (
            <g>
              <rect x="246" y="76" width="34" height="18" rx="3" fill="#b98a4e" stroke="#7a5a2e" />
              <rect x="250" y="80" width="26" height="4" fill="#14213d" />
              <rect x="250" y="86" width="26" height="3" fill="#d62828" />
            </g>
          )}
          {marca === "Calvin Klein" && (
            <text x="152" y="200" fontSize="9" fontWeight="700" letterSpacing="1.5" fill="#ffffffcc" fontFamily="Arial">CALVIN KLEIN</text>
          )}
        </g>
      )}

      {/* CHAQUETA: sudadera / zip / rompevientos */}
      {categoria === "chaqueta" && (
        <g>
          {marca === "Tommy Hilfiger" ? (
            <>
              <path d="M118 80 L86 98 L58 154 L96 174 L118 148 Z" fill="#16294a" />
              <path d="M282 80 L314 98 L342 154 L304 174 L282 148 Z" fill="#16294a" />
              <path d={TEE} fill="#eceff3" stroke="#00000022" />
              <rect x="118" y="150" width="164" height="14" fill="#d62828" clipPath={`url(#c-${u})`} />
              <rect x="170" y="62" width="60" height="20" rx="8" fill="#16294a" />
              <line x1="198" y1="86" x2="198" y2="330" stroke="#94a3b8" strokeWidth="3" />
              <line x1="203" y1="86" x2="203" y2="330" stroke="#64748b" strokeWidth="1.5" />
              <rect x="114" y="318" width="172" height="15" rx="4" fill="#16294a" />
            </>
          ) : marca === "Hollister" ? (
            <>
              <path d="M136 86 Q200 40 264 86 L264 118 Q200 84 136 118 Z" fill={p.dark} />
              <path d={TEE} fill={`url(#g-${u})`} stroke="#00000022" />
              <path d="M192 110 q-3 26 0 46" stroke="#f1f3f5" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M208 110 q3 26 0 46" stroke="#f1f3f5" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <circle cx="192" cy="158" r="2.5" fill="#e2e5ea" />
              <circle cx="208" cy="158" r="2.5" fill="#e2e5ea" />
              <path d="M152 252 L248 252 L260 310 L140 310 Z" fill="none" stroke="#00000044" strokeWidth="2.5" strokeDasharray="7 4" />
              <text x="200" y="205" textAnchor="middle" fontSize="14" fontWeight="800" letterSpacing="4" fill="#55654e" fontFamily="Arial">HCO</text>
              <rect x="114" y="320" width="172" height="14" rx="4" fill={p.dark} />
            </>
          ) : (
            <>
              <rect x="170" y="64" width="60" height="20" rx="9" fill={p.light} stroke="#00000033" />
              <path d={TEE} fill={`url(#g-${u})`} stroke="#00000022" />
              <line x1="200" y1="86" x2="200" y2="330" stroke="#c7ccd6" strokeWidth="3" />
              <rect x="195" y="116" width="10" height="16" rx="3" fill="#9aa0aa" />
              <text x="158" y="150" fontSize="11" fontWeight="700" letterSpacing="2" fill="#ffffffaa" fontFamily="Arial">CK</text>
              <rect x="114" y="320" width="172" height="14" rx="4" fill={p.dark} />
            </>
          )}
        </g>
      )}

      {/* GORRA */}
      {categoria === "gorra" && (
        <g>
          <path d="M118 196 Q126 108 200 104 Q274 108 282 196 Q284 208 272 210 Q236 186 200 186 Q164 186 128 210 Q116 208 118 196 Z" fill={`url(#g-${u})`} stroke="#00000022" />
          <path d="M200 106 L200 184" stroke="#00000033" strokeWidth="2" />
          <circle cx="200" cy="102" r="6" fill={p.dark} stroke="#ffffff44" />
          <path d="M148 214 Q200 248 262 212 Q268 222 254 230 Q198 256 142 228 Z" fill={p.dark} stroke="#00000033" />
          <path d="M132 206 Q166 190 200 190" stroke="#ffffff55" strokeWidth="1.5" fill="none" />
          {marca === "Nike" && (
            <path d="M158 158 q34 14 84 -12 q-40 30 -78 20 Z" fill="#ffffff" opacity="0.92" />
          )}
          {marca === "Polo Ralph Lauren" && (
            <>
              <circle cx="200" cy="150" r="16" fill="#0a1f44" stroke="#ffffff88" strokeWidth="2" />
              <text x="200" y="157" textAnchor="middle" fontSize="18" fill="#ffffff" fontFamily="Georgia">🐎</text>
            </>
          )}
        </g>
      )}

      {/* LEGADO: vestido / blusa / zapatos */}
      {(categoria === "vestido" || categoria === "blusa" || categoria === "zapatos") && (
        <g transform="scale(2)">
          <g fill={p.base}>
            {categoria === "vestido" && (
              <>
                <path d="M41 16 L59 16 L57 40 L71 84 L29 84 L43 40 Z" />
                <rect x="41" y="13" width="18" height="6" rx="2.5" fill={p.dark} />
              </>
            )}
            {categoria === "blusa" && (
              <path d="M32 21 L20 29 L11 48 L24 55 L28 47 L28 79 L72 79 L72 47 L76 55 L89 48 L80 29 L68 21 L50 37 Z" />
            )}
            {categoria === "zapatos" && (
              <>
                <path d="M14 66 Q14 50 34 49 Q59 48 74 41 Q88 35 90 52 L90 69 Q90 75 83 75 L21 75 Q14 75 14 70 Z" />
                <path d="M14 68 L90 68 L90 73 Q90 76 84 76 L20 76 Q14 76 14 72 Z" fill={p.dark} />
              </>
            )}
          </g>
        </g>
      )}

      {silueta && (
        <>
          <rect width="400" height="400" filter={`url(#n-${u})`} clipPath={`url(#c-${u})`} />
          <rect width="400" height="400" fill={`url(#tela-${u})`} clipPath={`url(#c-${u})`} />
          <rect width="400" height="400" fill={`url(#brillo-${u})`} clipPath={`url(#c-${u})`} />
        </>
      )}

      {/* ETIQUETA DE PRECIO COLGANTE */}
      {silueta && (
        <g transform="rotate(14 300 170)">
          <line x1="288" y1="128" x2="304" y2="158" stroke="#9a7b4f" strokeWidth="1.6" />
          <rect x="290" y="156" width="38" height="24" rx="3" fill="#fdf6e3" stroke="#d4c9a8" />
          <circle cx="296" cy="162" r="2.2" fill="#b3a37e" />
          <line x1="302" y1="168" x2="322" y2="168" stroke="#b23b3b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="302" y1="173" x2="315" y2="173" stroke="#8a8a8a" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
      <rect width="400" height="400" fill={`url(#v-${u})`} />

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
