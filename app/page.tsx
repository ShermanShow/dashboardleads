"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, CheckCircle2, Users, X } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import leadsJson from "../data/leads.json";
const normalizeSeller=(value:string)=>{const v=value.trim().toUpperCase();if(v==="OFICINA"||v.startsWith("EDGARDO/"))return "EDGARDO";return value.trim()||"SIN ASIGNAR";};
const cleanReason=(value:string)=>value.trim()||"SIN MOTIVO CARGADO";
const waNumber=(value:string)=>value.replace(/[^\d]/g,"");
const normSearch=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const isoToDmy=(iso:string)=>{if(!iso)return "";const [y,m,d]=iso.split("-").map(Number);if(!y||!m||!d)return "";return d+"/"+m+"/"+String(y).slice(-2);};
const dmyToIso=(dmy:string)=>{const m=dmy.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);if(!m)return "";const d=parseInt(m[1],10),mo=parseInt(m[2],10);if(!d||!mo||mo>12||d>31)return "";let y=m[3]?parseInt(m[3],10):new Date().getFullYear();if(y<100)y+=2000;return y+"-"+String(mo).padStart(2,"0")+"-"+String(d).padStart(2,"0");};
const BASE_ACCIONES=["CONTACTAR","SE ENVIO PRESUPUESTO","SEGUIMIENTO","RECONTACTAR","COORDINAR DEMO","ENVIAR INFO","NO RESPONDE","CERRADO"];
const BASE_MOTIVOS=["DESINTERES","PRECIO ALTO","FALTA STOCK","DERIVADO","CALIDAD LEAD","SEGUIMIENTO","CONCRETADO"];
interface HistoryEntry{estado:string;fecha:string;comentario:string}
interface Lead{
 fila:number;id:string;name:string;last:string;fechaIngreso:string;fuente:string;mail:string;telefono:string;
 product:string;seller:string;status:string;eventDate:string;action:string;reason:string;comment:string;comentarioInicial:string;historial:HistoryEntry[];
}
const initialLeads=()=>(leadsJson as {leads:Lead[]}).leads;
// Colores de los motivos (valores provisorios hasta recibir la foto con los colores exactos)
const REASON_COLORS:Record<string,string>={
  DESINTERES:"#f0919c", // rojo suave
  "PRECIO ALTO":"#c81e2e", // rojo fuerte
  "FALTA STOCK":"#f2c94c", // amarillo
  DERIVADO:"#5b9bd5", // azul
  "CALIDAD LEAD":"#a78bfa", // violeta
  SEGUIMIENTO:"#2fb98a", // verde claro
  CONCRETADO:"#178a5b", // verde
  "SIN MOTIVO CARGADO":"#c3cdd9", // gris
};
const reasonColor=(r:string)=>REASON_COLORS[r]??"#c3cdd9";
const fullName=(l:Lead)=>[l.name,l.last].filter(Boolean).join(" ").trim();
const yearOf=(s:string):number|null=>{const m=s&&s.match(/\/(\d{2,4})$/);if(!m)return null;const y=parseInt(m[1],10);return y<100?2000+y:y;};
const dateKey=(s:string,fallbackYear:number)=>{if(!s)return 0;const p=s.split("/").map(x=>parseInt(x,10));if(p.length<2||isNaN(p[0])||isNaN(p[1]))return 0;const y=p.length>2&&!isNaN(p[2])?(p[2]<100?2000+p[2]:p[2]):fallbackYear;return y*10000+(p[1]||0)*100+(p[0]||0);};
const toneOf=(e:string)=>/cerrad|desinter|baja|sin (respuesta|interes)/i.test(e)?"closed":/presup|oferta|cotiz|precio/i.test(e)?"quote":/seguim|recontact|contact|llamad|interes/i.test(e)?"open":/demo|visita|reunion/i.test(e)?"demo":"neutral";
export default function Home(){
 const [selectedDate,setSelectedDate]=useState("TODOS");
 const [selectedLead,setSelectedLead]=useState<Lead|null>(null);
 const [leads,setLeads]=useState<Lead[]>(initialLeads);
 const [query,setQuery]=useState("");
 const [showResults,setShowResults]=useState(false);
 const refreshFromServer=useCallback(async (keepId?:string|null)=>{
  try{
   const r=await fetch("/api/leads",{cache:"no-store"});
   if(!r.ok)return;
   const d=await r.json();
   if(Array.isArray(d)&&d.length){
    setLeads(d as Lead[]);
    if(keepId){
     const fresh=(d as Lead[]).find(x=>String(x.id)===String(keepId));
     if(fresh)setSelectedLead(fresh);
    }
   }
  }catch{/* mantiene la ultima version */}
 },[]);
 useEffect(()=>{refreshFromServer(null);},[refreshFromServer]);
 const closed=leads.filter(l=>l.status==="CERRADO").length, open=leads.filter(l=>l.status==="ABIERTO").length;
 const reasons=useMemo(()=>Object.entries(leads.filter(l=>l.status==="CERRADO").reduce<Record<string,number>>((a,l)=>{const r=cleanReason(l.reason);a[r]=(a[r]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]),[leads]);
 const reasonTotal=reasons.reduce((a,[,c])=>a+c,0);
 const chartData=reasons.map(([name,value])=>({name,value,color:reasonColor(name)}));
 const isAll=selectedDate==="TODOS";
 const dates=useMemo(()=>["TODOS",...Array.from(new Set(leads.map(l=>l.eventDate).filter(Boolean)))],[leads]);
 const events=useMemo(()=>leads.filter(l=>l.action&&(isAll||l.eventDate===selectedDate)),[leads,isAll,selectedDate]);
 const grouped=useMemo(()=>Object.entries(events.reduce<Record<string,typeof events>>((a,l)=>{const s=normalizeSeller(l.seller);(a[s]??=[]).push(l);return a;},{})),[events]);
 const eventsByDate=useMemo(()=>{
  if(!isAll)return [];
  // Orden de la fecha mas cercana (hoy/03-09) a la mas lejana
  const sorted=[...events].sort((a,b)=>dateKey(a.eventDate,2026)-dateKey(b.eventDate,2026)||Number(a.id)-Number(b.id));
  const map:Record<string,typeof events>={};
  sorted.forEach(l=>{const d=l.eventDate||"SIN FECHA";(map[d]??=[]).push(l);});
  return Object.entries(map);
 },[events,isAll]);
 const productOptions=useMemo(()=>Array.from(new Set(leads.map(l=>l.product).filter(Boolean))).sort((a,b)=>a.localeCompare(b,"es")),[leads]);
 const actionOptions=useMemo(()=>Array.from(new Set([...BASE_ACCIONES,...leads.map(l=>l.action).filter(Boolean)])).sort((a,b)=>a.localeCompare(b,"es")),[leads]);
 const reasonOptions=useMemo(()=>Array.from(new Set([...BASE_MOTIVOS,...leads.map(l=>l.reason).map(s=>s.trim()).filter(Boolean)])).sort((a,b)=>a.localeCompare(b,"es")),[leads]);
 const qNorm=normSearch(query.trim());
 const qDigits=query.replace(/[^\d]/g,"");
 const results=useMemo(()=>{
  if(!qNorm)return [];
  return leads.filter(l=>{
   const hay=normSearch([l.name,l.last,l.telefono,l.mail].join(" "));
   if(hay.includes(qNorm))return true;
   if(qDigits.length>=3&&waNumber(l.telefono).includes(qDigits))return true;
   return false;
  }).slice(0,30);
 },[leads,qNorm,qDigits]);
 return <main className="workspace"><header className="workspace-header">
 <div><p className="eyebrow">LEADS VENTAS / SEGUIMIENTO</p><h1>Control comercial</h1></div>
 <div className="search-wrap">
  <input className="search-input" value={query} onChange={e=>{setQuery(e.target.value);setShowResults(true);}} onFocus={()=>setShowResults(true)} onBlur={()=>setTimeout(()=>setShowResults(false),140)} onKeyDown={e=>{if(e.key==="Enter"&&results.length){setSelectedLead(results[0]);setQuery("");setShowResults(false);}}} placeholder="Buscar por nombre, apellido o teléfono…" aria-label="Buscar contacto"/>
  {query.trim()?<button className="search-clear" onMouseDown={e=>e.preventDefault()} onClick={()=>{setQuery("");setShowResults(false);}} aria-label="Limpiar búsqueda"><X size={15}/></button>:null}
  {showResults&&query.trim()?<div className="search-drop">
   {results.length===0?<div className="search-empty">Sin resultados para “{query.trim()}”.</div>:results.map(l=>(
    <button type="button" className="search-item" key={l.id+"-"+l.fila} onMouseDown={e=>{e.preventDefault();setSelectedLead(l);setQuery("");setShowResults(false);}}>
     <div className="si-main"><b>{fullName(l)||"Sin nombre"}</b><span>{l.product||"Línea no asignada"} · {normalizeSeller(l.seller)}</span></div>
     <div className="si-side"><em>{l.telefono||"—"}</em><small>Nº {l.id}</small></div>
    </button>
   ))}
   {results.length>=30?<div className="search-more">Se muestran los primeros 30 resultados.</div>:null}
  </div>:null}
 </div>
 </header>
 <section className="metrics"><Metric icon={<Users size={18}/>} label="Contactos" value={leads.length.toString()} note="contactos cargados" tone="blue"/><Metric icon={<BarChart3 size={18}/>} label="Caídos" value={closed.toString()} note="estado CERRADO" tone="red"/><Metric icon={<CheckCircle2 size={18}/>} label="Abiertos" value={open.toString()} note="requieren seguimiento" tone="green"/><Metric icon={<CalendarDays size={18}/>} label="Eventos del día" value={events.length.toString()} note={selectedDate} tone="orange"/></section>
 <section className="stack">
  <article className="panel reasons-panel">
   <div className="panel-head">
    <div><h2>Motivos de caídos</h2><p>registros CERRADOS · {reasonTotal} contactos</p></div>
   </div>
   {chartData.length===0?<div className="empty-events">Sin motivos cargados.</div>:(
   <div className="reason-layout">
    <div className="reason-chart-wrap">
     <div className="donut-center"><strong>{reasonTotal}</strong><span>caídos</span></div>
     <ResponsiveContainer width="100%" height={250}>
      <PieChart>
       <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2} strokeWidth={2} stroke="#fff">
        {chartData.map((d,i)=><Cell key={i} fill={d.color} />)}
       </Pie>
       <Tooltip contentStyle={{borderRadius:10,border:"1px solid #e8edf3",fontSize:12}} formatter={(value,name)=>[`${value} contactos`,name]} />
      </PieChart>
     </ResponsiveContainer>
    </div>
    <div className="legend-list">
     {chartData.map(d=>(
      <div className="legend-item" key={d.name}>
       <i style={{background:d.color}} />
       <span className="legend-name">{d.name}</span>
       <b>{d.value}</b>
       <em>{Math.round((d.value/reasonTotal)*100)}%</em>
      </div>
     ))}
    </div>
   </div>)}
  </article>
  <article className="panel event-panel">
   <div className="panel-head">
    <div><h2>Eventos del día</h2><p>Hacé clic en un contacto para ver su historial</p></div>
    <select className="date-select" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}>{dates.map(d=><option key={d} value={d}>{d==="TODOS"?"Todos (todos los eventos)":d}</option>)}</select>
   </div>
   {events.length===0?<div className="empty-events">No hay eventos para esta selección.</div>:(isAll?<div className="event-groups">{eventsByDate.map(([d,items])=><div className="event-group" key={d}><div className="group-title"><span className="seller-dot"/><h3>{d==="SIN FECHA"?"Sin fecha asignada":d}</h3><em>{items.length} evento{items.length===1?"":"s"}</em></div>{items.map(l=><div className="event-card is-click" key={l.id+"-"+l.fila} role="button" tabIndex={0} onClick={()=>setSelectedLead(l)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelectedLead(l);}}}><div className="event-date">{l.eventDate||"—"}</div><div className="event-main"><b>{fullName(l)||"Sin nombre"}</b><span>{l.product||"Línea no asignada"}</span><small><strong>Vendedor:</strong> {normalizeSeller(l.seller)}</small>{l.comment&&<small><strong>Comentario ventas:</strong> {l.comment}</small>}</div><div className="event-id">#{l.id}</div></div>)}</div>)}</div>:<div className="event-groups">{grouped.map(([seller,items])=><div className="event-group" key={seller}><div className="group-title"><span className="seller-dot"/><h3>{seller}</h3><em>{items.length} evento{items.length===1?"":"s"} · clic para historial</em></div>{items.map(l=><div className="event-card is-click" key={l.id+"-"+l.fila} role="button" tabIndex={0} onClick={()=>setSelectedLead(l)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelectedLead(l);}}}><div className="event-date">{l.eventDate}</div><div className="event-main"><b>{fullName(l)||"Sin nombre"}</b><span>{l.product||"Línea no asignada"}</span><small><strong>Acción:</strong> {l.action||"—"}</small>{l.comment&&<small><strong>Comentario ventas:</strong> {l.comment}</small>}</div><div className="event-id">#{l.id}</div></div>)}</div>)}</div>)}
  </article>
  {selectedLead&&<ContactHistoryModal key={selectedLead.id} lead={selectedLead} productOptions={productOptions} actionOptions={actionOptions} reasonOptions={reasonOptions} onClose={()=>setSelectedLead(null)} onSaved={(id)=>refreshFromServer(id)} />}
 </section>
 </main>;
}
function Metric({icon,label,value,note,tone}:{icon:React.ReactNode;label:string;value:string;note:string;tone:string}){return <div className="metric"><div className={"metric-icon "+tone}>{icon}</div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}
function ContactHistoryModal({lead,onClose,onSaved,productOptions,actionOptions,reasonOptions}:{lead:Lead;onClose:()=>void;onSaved:(id:string)=>void;productOptions:string[];actionOptions:string[];reasonOptions:string[]}){
 const baseYear=yearOf(lead.fechaIngreso)??yearOf(lead.eventDate)??2026;
 const sorted=[...lead.historial].sort((a,b)=>dateKey(a.fecha,baseYear)-dateKey(b.fecha,baseYear));
 const [busy,setBusy]=useState(false);
 const [feedback,setFeedback]=useState<{tipo:"ok"|"err";texto:string;area:"panel"|"producto"|"datos"}|null>(null);
 const [nEstado,setNEstado]=useState("");
 const [nFecha,setNFecha]=useState(()=>{const d=new Date();return d.getDate()+"/"+(d.getMonth()+1)+"/"+String(d.getFullYear()).slice(2);});
 const [nComentario,setNComentario]=useState("");
 const [nProducto,setNProducto]=useState(lead.product||"");
 const [nEstadoGral,setNEstadoGral]=useState(lead.status||"ABIERTO");
 const [nFechaAccion,setNFechaAccion]=useState(lead.eventDate||"");
 const [nAccion,setNAccion]=useState(lead.action||"");
 const [nMotivo,setNMotivo]=useState(lead.reason||"");
 const [nComentarioV,setNComentarioV]=useState(lead.comment||"");
 useEffect(()=>{const prev=document.body.style.overflow;document.body.style.overflow="hidden";return ()=>{document.body.style.overflow=prev;};},[]);
 const toggleStatus=lead.status==="CERRADO"?"ABIERTO":"CERRADO";
 const productDirty=nProducto.trim()!==(lead.product||"").trim();
 const RChanged=nEstadoGral!==(lead.status||"ABIERTO");
 const SChanged=nFechaAccion.trim()!==(lead.eventDate||"").trim();
 const TChanged=nAccion.trim()!==(lead.action||"").trim();
 const UChanged=nMotivo.trim()!==(lead.reason||"").trim();
 const VChanged=nComentarioV.trim()!==(lead.comment||"").trim();
 const datosDirty=RChanged||SChanged||TChanged||UChanged||VChanged;
 async function write(action:string,extra:Record<string,unknown>={},area:"panel"|"producto"|"datos"="panel"):Promise<boolean>{
  setBusy(true);setFeedback(null);
  try{
   const res=await fetch("/api/sheet",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:lead.id,fila:lead.fila,action,...extra})});
   const data=await res.json().catch(()=>({ok:false,error:"El servidor no respondió correctamente."}));
   if(data.ok){setFeedback({tipo:"ok",texto:(data.message as string)||"Guardado correctamente.",area});onSaved(lead.id);return true;}
   setFeedback({tipo:"err",texto:(data.error as string)||"No se pudo guardar.",area});return false;
  }catch(e){setFeedback({tipo:"err",texto:String(e),area});return false;}
  finally{setBusy(false);}
 }
 const saveProducto=async()=>{if(!productDirty||busy)return;await write("producto",{producto:nProducto.trim()},"producto");};
 const saveDatos=async()=>{
  if(!datosDirty||busy)return;
  if(RChanged){const ok=await write("estado",{estado:nEstadoGral},"datos");if(!ok)return;}
  const extra:Record<string,string>={};
  if(SChanged)extra.fechaAccion=nFechaAccion.trim();
  if(TChanged)extra.accion=nAccion.trim();
  if(UChanged)extra.motivo=nMotivo.trim();
  if(VChanged)extra.comentario=nComentarioV.trim();
  if(Object.keys(extra).length)await write("datos",extra,"datos");
 };
 const items:{label:string;node:React.ReactNode}[]=[
  {label:"Fecha de ingreso",node:lead.fechaIngreso?lead.fechaIngreso:null},
  {label:"Fuente / campaña",node:lead.fuente?lead.fuente:null},
  {label:"Mail",node:lead.mail?<a className="modal-link" href={"mailto:"+lead.mail}>{lead.mail}</a>:null},
  {label:"Teléfono",node:lead.telefono?waNumber(lead.telefono)?<a className="wa-number" href={"https://wa.me/"+waNumber(lead.telefono)} target="_blank" rel="noopener noreferrer" title="Abrir WhatsApp">{lead.telefono}</a>:lead.telefono:null},
  {label:"Producto",node:<div className="product-editor"><div className="product-row"><input list="product-options" value={nProducto} onChange={e=>setNProducto(e.target.value)} placeholder={lead.product||"Elegí o escribí una línea…"}/><button className="btn" disabled={busy||!productDirty||!nProducto.trim()} onClick={saveProducto}>{busy?"Guardando…":"Guardar"}</button></div><datalist id="product-options">{productOptions.map(o=><option key={o} value={o}/>)}</datalist>{feedback&&feedback.area==="producto"?<em className={"product-feedback "+feedback.tipo}>{feedback.texto}</em>:null}</div>},
  {label:"Vendedor",node:normalizeSeller(lead.seller)!=="SIN ASIGNAR"?normalizeSeller(lead.seller):null},
  {label:"Estado",node:lead.status?<span className={"status-chip "+(lead.status==="CERRADO"?"closed":"open")}>{lead.status}</span>:null},
  {label:"Última acción",node:lead.action?lead.action+(lead.eventDate?" · "+lead.eventDate:""):null},
  {label:"Motivo",node:lead.reason?<span className="reason-chip"><i style={{background:reasonColor(cleanReason(lead.reason))}}/>{cleanReason(lead.reason)}</span>:null},
 ].filter(x=>x.node!=null);
 return (
  <div className="modal-backdrop" onClick={onClose} role="presentation">
   <div className="contact-modal contact-modal-lg" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}>
    <div className="modal-head">
     <div>
      <span className="modal-eyebrow">Ficha e historial del contacto</span>
      <h3>{fullName(lead)||"Sin nombre"}{lead.fila?<span className="fila-chip">Fila {lead.fila}</span>:null}</h3>
      <p>Nº {lead.id||"—"} · vendedor {normalizeSeller(lead.seller)}</p>
     </div>
     <button className="modal-close" onClick={onClose} aria-label="Cerrar historial"><X size={16}/></button>
    </div>
    <div className="modal-scroll">
    <div className="meta-grid">
     {items.map(it=>(
      <div className="meta-box" key={it.label}><small>{it.label}</small><div className="meta-value">{it.node}</div></div>
     ))}
    </div>
    <div className="action-editor">
     <div className="history-head"><h4>Editar acción actual</h4><em>se guarda en la fila {lead.fila||""} · cols R-S-T-U-V</em></div>
     {feedback&&feedback.area==="datos"?<div className={"write-feedback "+feedback.tipo}>{feedback.texto}</div>:null}
     <div className="ae-grid">
      <label><span>Estado general</span><select className={nEstadoGral==="CERRADO"?"sel-closed":"sel-open"} value={nEstadoGral} onChange={e=>setNEstadoGral(e.target.value)}><option value="ABIERTO">ABIERTO</option><option value="CERRADO">CERRADO</option></select></label>
      <label><span>Fecha acción (S)</span><input type="date" value={dmyToIso(nFechaAccion)} onChange={e=>setNFechaAccion(isoToDmy(e.target.value))}/></label>
     </div>
     <div className="ae-grid">
      <label><span>Acción a realizar</span><input list="action-options" value={nAccion} onChange={e=>setNAccion(e.target.value)} placeholder="Ej: SE ENVIO PRESUPUESTO…"/><datalist id="action-options">{actionOptions.map(o=><option key={o} value={o}/>)}</datalist></label>
      <label><span>Motivo estado (U)</span><select value={nMotivo} onChange={e=>setNMotivo(e.target.value)}><option value="">— sin motivo —</option>{reasonOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></label>
     </div>
     <label className="ae-comment"><span>Comentario ventas (V)</span><textarea rows={1} value={nComentarioV} onChange={e=>setNComentarioV(e.target.value)} placeholder="Situación actual del contacto…"/></label>
     <div className="write-actions">
      <button className="btn btn-primary" disabled={busy||!datosDirty} onClick={saveDatos}>{busy?"Guardando…":"Guardar cambios"}</button>
      <span className="write-hint">Solo se envían las columnas que cambiaste.</span>
     </div>
    </div>
    {lead.comentarioInicial?<div className="lead-note"><small>Mensaje / consulta del contacto</small><p>{lead.comentarioInicial}</p></div>:null}
    {lead.comment?<div className="lead-note"><small>Comentario de ventas (situación actual)</small><p>{lead.comment}</p></div>:null}
    <div className="history-head"><h4>Historial de la conversación</h4><em>{sorted.length} paso{sorted.length===1?"":"s"} · cronológico</em></div>
    {sorted.length===0?<p className="history-empty">Todavía no hay seguimientos cargados para este contacto.</p>:
     <div className="history-list">
      {sorted.map((h,idx)=>(
       <div className="history-item" key={idx}>
        <div className="history-top"><span className={"estado-dot "+toneOf(h.estado)}/><b>{h.fecha||"Sin fecha"}</b><em>Paso {idx+1}</em></div>
        <span className="history-estado">{h.estado||"REGISTRO"}</span>
        <p className="history-comment">{h.comentario||"Sin comentario."}</p>
       </div>
      ))}
     </div>}
    </div>
    <div className="write-panel">
     <div className="history-head"><h4>Registrar en la planilla</h4></div>
     {feedback&&feedback.area==="panel"&&<div className={"write-feedback "+feedback.tipo}>{feedback.texto}</div>}
     <div className="write-grid">
      <label><span>Estado del paso</span><input list="estado-options" value={nEstado} onChange={e=>setNEstado(e.target.value)} placeholder="Ej: SE ENVIO PRESUPUESTO…"/></label>
      <datalist id="estado-options">
       {["SE ENVIO PRESUPUESTO","SEGUIMIENTO","RECONTACTAR","COORDINAR DEMO","ENVIAR INFO","NO RESPONDE","CERRADO"].map(o=><option key={o} value={o}/>)}
      </datalist>
      <label><span>Fecha</span><input type="date" value={dmyToIso(nFecha)} onChange={e=>setNFecha(isoToDmy(e.target.value))}/></label>
     </div>
     <label className="write-comment"><span>Comentario / resultado</span><textarea rows={2} value={nComentario} onChange={e=>setNComentario(e.target.value)} placeholder="¿Qué se habló con el contacto?"/></label>
     <div className="write-actions">
      <button className="btn btn-primary" disabled={busy||!nComentario.trim()} onClick={()=>write("seguimiento",{estado:(nEstado.trim()||"SEGUIMIENTO"),fecha:nFecha.trim(),comentario:nComentario.trim()})}>{busy?"Guardando…":"Registrar seguimiento"}</button>
      <button className="btn btn-ghost" disabled={busy} onClick={()=>write("estado",{estado:toggleStatus})}>{busy?"…":(lead.status==="CERRADO"?"Reabrir como ABIERTO":"Cerrar contacto (CERRADO)")}</button>
     </div>
     <p className="write-hint">Se guarda directo en la fila {lead.fila||""} de la planilla y el historial se actualiza solo.</p>
    </div>
   </div>
  </div>
 );
}

