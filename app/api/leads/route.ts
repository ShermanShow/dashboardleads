import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type HistoryEntry = { estado: string; fecha: string; comentario: string };
type Lead = {
  fila: number;
  id: string;
  name: string;
  last: string;
  fechaIngreso: string;
  fuente: string;
  mail: string;
  telefono: string;
  product: string;
  seller: string;
  status: string;
  eventDate: string;
  action: string;
  reason: string;
  comment: string;
  comentarioInicial: string;
  historial: HistoryEntry[];
};

const SHEET_ID =
  process.env.SHEET_ID || "1lPkOv2Zmg98AWY3KOXyGViWle1L6uSEaI6LhsLafUDI";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { cur.push(field); field = ""; }
    else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field !== "" || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
}

const reEstado = /^ESTADO\s+(\d+)$/i;
const reFecha = /^FECHA\s*Estado\s*(\d+)$/i;
const reCom = /^COMENTARIO\s*Estado\s*(\d+)$/i;

async function fetchSheetLeads(): Promise<Lead[]> {
  const res = await fetch(URL, { redirect: "follow", cache: "no-store" });
  if (!res.ok) throw new Error("Google Sheets respondio HTTP " + res.status);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const header = rows[0];
  const colByName = new Map<string, number[]>();
  header.forEach((h, i) => {
    const key = (h || "").trim().toUpperCase();
    if (!key) return;
    const arr = colByName.get(key) || [];
    arr.push(i);
    colByName.set(key, arr);
  });
  const get = (row: string[], name: string, nth = 0): string => {
    const arr = colByName.get(name.toUpperCase());
    const i = arr ? arr[nth] : undefined;
    return i !== undefined && i < row.length ? (row[i] || "").trim() : "";
  };

  const estadoIdx: Record<number, number> = {};
  const fechaIdx: Record<number, number> = {};
  const comIdx: Record<number, number> = {};
  header.forEach((h, i) => {
    let m = reEstado.exec((h || "").trim());
    if (m) estadoIdx[Number(m[1])] = i;
    m = reFecha.exec((h || "").trim());
    if (m) fechaIdx[Number(m[1])] = i;
    m = reCom.exec((h || "").trim());
    if (m) comIdx[Number(m[1])] = i;
  });
  const histCols = Object.keys(estadoIdx)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({ n, e: estadoIdx[n], f: fechaIdx[n], c: comIdx[n] }));

  const clean = (v: string) => (v || "").trim();
  const meaningful = (v: string) => {
    const s = clean(v);
    return s !== "" && s !== "/" && s !== "-";
  };

  const leads: Lead[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const historial: HistoryEntry[] = [];
    for (const hc of histCols) {
      const estado = meaningful(row[hc.e]) ? clean(row[hc.e]) : "";
      const fecha = clean(row[hc.f]);
      const comentario = clean(row[hc.c]);
      if (estado || fecha || comentario) {
        historial.push({
          estado: estado || (comentario ? "REGISTRO" : ""),
          fecha,
          comentario,
        });
      }
    }
    const lead: Lead = {
      fila: r + 1,
      id: clean(row[0]) || String(r + 1),
      name: get(row, "NOMBRE"),
      last: get(row, "APELLIDO"),
      fechaIngreso: get(row, "FECHA"),
      fuente: get(row, "FUENTE"),
      mail: get(row, "MAIL", 0),
      telefono: get(row, "TELEFONO"),
      product: get(row, "LINEA DE PRODUCTO"),
      seller: get(row, "VENDEROR"),
      status: get(row, "ESTADO GRAL"),
      eventDate: get(row, "FECHA ACCION"),
      action: get(row, "ACCION"),
      reason: get(row, "MOTIVO ESTADO"),
      comment: get(row, "COMENTARIO VENTAS"),
      comentarioInicial: get(row, "COMENTARIO"),
      historial,
    };
    const contactSignal =
      meaningful(lead.name) || meaningful(lead.last) || meaningful(lead.telefono) ||
      meaningful(lead.mail) || meaningful(lead.product) || meaningful(lead.seller) ||
      meaningful(lead.fechaIngreso);
    const anyContent = [
      lead.id, lead.name, lead.last, lead.fechaIngreso, lead.fuente, lead.mail,
      lead.telefono, lead.product, lead.seller, lead.status, lead.action,
      lead.reason, lead.comment, lead.comentarioInicial,
      ...historial.flatMap((x) => [x.estado, x.fecha, x.comentario]),
    ].some((v) => v !== "" && v !== "/" && v !== "-");
    if (contactSignal && anyContent) leads.push(lead);
  }
  return leads;
}

export async function GET() {
  try {
    const leads = await fetchSheetLeads();
    return NextResponse.json(leads, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
