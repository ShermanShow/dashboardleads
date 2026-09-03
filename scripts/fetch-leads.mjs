// Genera data/leads.json descargando la planilla pública de Google Sheets.
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHEET_ID =
  process.env.SHEET_ID || "1lPkOv2Zmg98AWY3KOXyGViWle1L6uSEaI6LhsLafUDI";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSV(text) {
  const rows = [];
  let cur = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
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

async function main() {
  const res = await fetch(URL, { redirect: "follow" });
  if (!res.ok) throw new Error("Error descargando planilla: HTTP " + res.status);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) throw new Error("La planilla no tiene filas");
  const header = rows[0];

  const colByName = new Map(); // name -> array of indices
  header.forEach((h, i) => {
    const key = (h || "").trim().toUpperCase();
    if (!key) return;
    if (!colByName.has(key)) colByName.set(key, []);
    colByName.get(key).push(i);
  });
  const get = (row, name, nth = 0) => {
    const arr = colByName.get(name.toUpperCase());
    const i = arr ? arr[nth] : undefined;
    return i !== undefined && i < row.length ? (row[i] || "").trim() : "";
  };

  // pares de columnas de historial (ESTADO n / FECHA Estado n / COMENTARIO Estado n)
  const histCols = [];
  const estadoIdx = {};
  header.forEach((h, i) => {
    const m = reEstado.exec((h || "").trim());
    if (m) estadoIdx[Number(m[1])] = i;
  });
  const fechaIdx = {};
  const comIdx = {};
  header.forEach((h, i) => {
    let m = reFecha.exec((h || "").trim());
    if (m) fechaIdx[Number(m[1])] = i;
    m = reCom.exec((h || "").trim());
    if (m) comIdx[Number(m[1])] = i;
  });
  Object.keys(estadoIdx)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((n) => histCols.push({ n, e: estadoIdx[n], f: fechaIdx[n], c: comIdx[n] }));

  const clean = (v) => (v || "").trim();
  const meaningful = (v) => { const s = clean(v); return s !== "" && s !== "/" && s !== "-"; };

  const leads = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const historial = [];
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
    const lead = {
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
    const anyContent = [
      lead.id, lead.name, lead.last, lead.fechaIngreso, lead.fuente, lead.mail,
      lead.telefono, lead.product, lead.seller, lead.status, lead.action,
      lead.reason, lead.comment, lead.comentarioInicial,
      ...historial.flatMap((x) => [x.estado, x.fecha, x.comentario]),
    ].some((v) => meaningful(v) || /^[\w.@+-]+$/i.test(v || ""));
    const contactSignal =
      meaningful(lead.name) || meaningful(lead.last) || meaningful(lead.telefono) ||
      meaningful(lead.mail) || meaningful(lead.product) || meaningful(lead.seller) ||
      meaningful(lead.fechaIngreso);
    if (contactSignal && anyContent) leads.push(lead);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    sheetId: SHEET_ID,
    count: leads.length,
    leads,
  };
  const dataDir = join(ROOT, "data");
  mkdirSync(dataDir, { recursive: true });
  const outFile = join(dataDir, "leads.json");
  writeFileSync(outFile, JSON.stringify(out), "utf8");
  console.log("OK: " + leads.length + " contactos -> " + outFile);
}

main().catch((e) => {
  console.error("fetch-leads falló:", e);
  process.exit(1);
});
