import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "RopaFlow — Tienda de ropa americana",
  description: "Inventario, ventas, clientes y música con algoritmo de tendencias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">{children}</main>
      </body>
    </html>
  );
}
