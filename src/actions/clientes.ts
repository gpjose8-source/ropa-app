"use server";

import { revalidatePath } from "next/cache";
import { run } from "@/lib/db";

export async function crearCliente(fd: FormData): Promise<void> {
  const nombre = String(fd.get("nombre") || "").trim();
  if (!nombre) return;
  run(
    "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)",
    nombre,
    String(fd.get("telefono") || "").trim()
  );
  revalidatePath("/clientes");
}
