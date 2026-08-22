"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/vender", label: "Vender" },
  { href: "/ventas", label: "Ventas" },
  { href: "/clientes", label: "Clientes" },
  { href: "/musica", label: "Música" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="rounded-lg bg-emerald-500 px-2 py-0.5 text-slate-950">RF</span>
          <span className="hidden sm:inline">RopaFlow</span>
        </Link>
        <nav className="flex flex-1 gap-1 overflow-x-auto text-sm">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition ${
                  active
                    ? "bg-slate-800 font-semibold text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
