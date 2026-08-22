import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import RadioGlobal from "@/components/RadioGlobal";
import { escanearMusica } from "@/lib/db";
import { rankingTendencias } from "@/lib/trends";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GARAGE ONLINE — Ropa americana",
  description: "Inventario, ventas, clientes y música con algoritmo de tendencias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let canciones: {
    id: number;
    titulo: string;
    artista: string;
    score: number;
    url: string;
  }[] = [];

  try {
    escanearMusica();
    canciones = rankingTendencias().map((c) => ({
      id: c.id,
      titulo: c.titulo,
      artista: c.artista,
      score: c.score,
      url: `/music/${encodeURIComponent(c.archivo)}`,
    }));
  } catch {}

  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">{children}</main>
        <RadioGlobal songs={canciones} />
      </body>
    </html>
  );
}
