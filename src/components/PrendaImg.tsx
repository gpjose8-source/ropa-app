const COLORS: Record<string, [string, string]> = {
  camiseta: ["#38bdf8", "#0ea5e9"],
  pantalon: ["#818cf8", "#4f46e5"],
  chaqueta: ["#fb923c", "#ea580c"],
  vestido: ["#f472b6", "#db2777"],
  blusa: ["#a78bfa", "#7c3aed"],
  zapatos: ["#34d399", "#059669"],
};

const BRANDS: Record<string, { bg: string; fg: string; label: string }> = {
  "Tommy Hilfiger": { bg: "#0f2d52", fg: "#ffffff", label: "TOMMY" },
  "Calvin Klein": { bg: "#000000", fg: "#ffffff", label: "CALVIN KLEIN" },
  Hollister: { bg: "#14342b", fg: "#e8d9a0", label: "HOLLISTER" },
};

export default function PrendaImg({
  categoria,
  marca,
  className = "",
}: {
  categoria: string;
  marca?: string;
  className?: string;
}) {
  const [c1, c2] = COLORS[categoria] ?? COLORS.camiseta;
  const b = marca ? BRANDS[marca] : undefined;
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={categoria}>
      <defs>
        <linearGradient id={`g-${categoria}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="16" fill={`url(#g-${categoria})`} />
      <g fill={c1} opacity="0.92">
        {(categoria === "camiseta" || categoria === "" ) && (
          <path d="M62 38 L38 54 L18 94 L44 108 L52 92 L52 168 L148 168 L148 92 L156 108 L182 94 L162 54 L138 38 Q124 58 100 58 Q76 58 62 38 Z" />
        )}
        {categoria === "pantalon" && (
          <>
            <path d="M64 32 L136 32 L146 168 L106 168 L100 88 L94 168 L54 168 Z" />
            <rect x="64" y="32" width="72" height="10" fill={c2} />
          </>
        )}
        {categoria === "chaqueta" && (
          <>
            <path d="M62 38 L38 54 L18 94 L44 108 L52 92 L52 168 L98 168 L98 46 Q78 58 62 38 Z" />
            <path d="M138 38 L162 54 L182 94 L156 108 L148 92 L148 168 L102 168 L102 46 Q122 58 138 38 Z" fill={c2} />
            <rect x="97" y="46" width="6" height="122" fill="#cbd5e1" opacity="0.7" />
          </>
        )}
        {categoria === "vestido" && (
          <>
            <path d="M82 32 L118 32 L114 80 L142 168 L58 168 L86 80 Z" />
            <rect x="82" y="26" width="36" height="12" rx="5" fill={c2} />
          </>
        )}
        {categoria === "blusa" && (
          <>
            <path d="M64 42 L40 58 L22 96 L48 110 L56 94 L56 158 L144 158 L144 94 L152 110 L178 96 L160 58 L136 42 L100 74 Z" />
            <path d="M64 42 L100 74 L136 42 L128 34 L100 58 L72 34 Z" fill={c2} />
          </>
        )}
        {categoria === "zapatos" && (
          <>
            <path d="M28 132 Q28 100 68 98 Q118 96 148 82 Q176 70 180 104 L180 138 Q180 150 166 150 L42 150 Q28 150 28 140 Z" />
            <path d="M28 136 L180 136 L180 146 Q180 152 168 152 L40 152 Q28 152 28 144 Z" fill={c2} />
            <path d="M96 96 Q120 88 142 84 L146 96 Q120 100 100 108 Z" fill="#e2e8f0" opacity="0.85" />
          </>
        )}
      </g>
      {b && (
        <g>
          <rect x={200 - (b.label.length * 7 + 22)} y={162} width={b.label.length * 7 + 16} height={26} rx={6} fill={b.bg} stroke="#ffffff55" />
          <text
            x={200 - (b.label.length * 7 + 14) / 2 - 3}
            y={180}
            textAnchor="middle"
            fontSize={b.label.length > 8 ? 10 : 12}
            fontWeight="800"
            fill={b.fg}
            fontFamily="Arial, sans-serif"
            letterSpacing="1"
          >
            {b.label}
          </text>
        </g>
      )}
    </svg>
  );
}
