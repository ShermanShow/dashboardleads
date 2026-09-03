import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Recibe las acciones de escritura desde el panel y las reenvia al
// Apps Script de la planilla, agregando el token secreto del servidor.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.id || !body.action) {
    return NextResponse.json({ ok: false, error: "Faltan datos (id/action)." }, { status: 400 });
  }

  const appUrl = process.env.SHEET_WEBAPP_URL;
  const token = process.env.SHEET_WRITE_TOKEN;
  if (!appUrl) {
    return NextResponse.json(
      { ok: false, error: "Escritura no configurada: falta SHEET_WEBAPP_URL en Vercel." },
      { status: 503 },
    );
  }
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Escritura no configurada: falta SHEET_WRITE_TOKEN en Vercel." },
      { status: 503 },
    );
  }

  const payload = { ...body, fila: Number(body.fila) || undefined, token };
  try {
    const res = await fetch(appUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let data: { ok?: boolean; message?: string; error?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, error: "El Apps Script no devolvio JSON valido: " + text.slice(0, 200) };
    }
    if (data.ok) {
      return NextResponse.json({ ok: true, message: data.message || "Listo" });
    }
    return NextResponse.json({ ok: false, error: data.error || "Error en la planilla." }, { status: 502 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
