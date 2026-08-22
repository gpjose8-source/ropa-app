import { NextResponse } from "next/server";
import { registrarEvento } from "@/lib/trends";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { songId?: unknown; event?: unknown };
    const res = registrarEvento(Number(body.songId), String(body.event ?? ""));
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
