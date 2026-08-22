import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let sqlite = "no disponible";
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(":memory:");
    db.exec("CREATE TABLE t(x)");
    sqlite = "ok";
    db.close();
  } catch (e) {
    sqlite = `error: ${(e as Error).message}`;
  }
  return NextResponse.json({
    ok: true,
    node: process.version,
    sqlite,
    vercel: process.env.VERCEL ?? "local",
    region: process.env.VERCEL_REGION ?? "-",
  });
}
