# Contexto del proyecto (retomar tras reinicio)

- Repo: `dashboardleads` en C:\Users\emart\dashboard\dashboardleads
- Rama main sincronizada con origin/main. Último commit: 16b32ba
- Producción: https://dashboardleads-lime.vercel.app (Vercel, auto-deploy al hacer push a main)

## Qué se implementó
- Dashboard de leads (Next.js, "use client") que lee la planilla de Google Sheets
  - En vivo al recargar: la página llama GET /api/leads (baja y parsea la planilla)
  - Cada build también regenera data/leads.json (scripts/fetch-leads.mjs)
- Ficha de contacto (clic en evento): fecha ingreso, fuente, mail, teléfono,
  producto, vendedor, estado, historial cronológico (columnas ESTADO n/FECHA/COMENTARIO)
- Torta de motivos de caídos (recharts) + eventos del día a ancho completo
- Filtro "Todos" en eventos con orden por fecha (hoy arriba, luego ascendente)
- Escritura a la planilla desde el panel:
  - POST /api/sheet -> Apps Script independiente (NO es el del bot de WhatsApp)
  - Env vars en Vercel: SHEET_WEBAPP_URL y SHEET_WRITE_TOKEN (token: Sistemas748!)
  - Acciones: seguimiento (nuevo estado/fecha/comentario), estado (ABIERTO/CERRADO),
    datos (fechaAccion/accion/motivo/comentario columnas S/T/U/V)
  - producto (asignar LINEA DE PRODUCTO): la manda el panel (action:"producto", campo
    "producto"). REQUIERE handler nuevo en el Apps Script (aún no implementado) que
    escriba la columna LINEA DE PRODUCTO en la fila.
- Ficha de contacto: el NÚMERO de teléfono es link directo a WhatsApp (wa.me/<digitos tal
  cual>, sin +54; ya no hay link tel: ni botón verde). Caja "Producto" editable (combobox
  con líneas existentes + texto libre, se guarda con la acción producto). Campo FECHA del
  "Registrar en la planilla" usa picker nativo de calendario (input type=date, valor final
  se envía como dd/mm/aa).

## Reglas de trabajo (.clinerules)
- No usar comandos bloqueantes ni sleeps largos en primer plano;
  procesos que corren seguido ir en segundo plano.

## Pendiente / posible
- Colores de la torta de motivos: provisorios (falta foto de la planilla para afinar)
- Apps Script: agregar handler de action "producto" (campo "producto") que escriba la
  columna LINEA DE PRODUCTO de la fila. El panel ya lo manda desde la ficha de contacto.
- Apps Script: si se cambia código, crear nueva versión en la implementación web.
