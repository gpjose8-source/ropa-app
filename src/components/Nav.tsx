"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/tienda" className="flex items-center gap-2 font-bold">
          <span className="rounded-lg bg-red-600 px-2 py-0.5 text-white">GO</span>
          <span className="hidden tracking-wide text-black sm:inline">GARAGE ONLINE</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/tienda"
            className={`rounded-lg px-3 py-1.5 transition ${
              path.startsWith("/tienda")
                ? "bg-red-600 font-semibold text-white"
                : "text-slate-800 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            🛍️ Tienda
          </Link>
        </nav>
      </div>
    </header>
  );
}
