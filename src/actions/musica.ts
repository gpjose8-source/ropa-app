"use server";

import { revalidatePath } from "next/cache";
import { escanearMusica } from "@/lib/db";

export async function escanearBiblioteca(): Promise<void> {
  escanearMusica();
  revalidatePath("/musica");
}
