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

## Reglas de trabajo (.clinerules)
- No usar comandos bloqueantes ni sleeps largos en primer plano;
  procesos que corren seguido ir en segundo plano.

## Pendiente / posible
- Colores de la torta de motivos: provisorios (falta foto de la planilla para afinar)
- Apps Script: si se cambia código, crear nueva versión en la implementación web.
