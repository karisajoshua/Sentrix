import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type Map as MapType, type GeoJSONSource } from "maplibre-gl";
import { demoProjects, statusColor, type Project, type ProjectStatus } from "./data";
import { fetchVerifiedProjects, hasSupabaseConfig } from "./supabase";
const defaultStyle = {version:8 as const,sources:{osm:{type:"raster" as const,tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256,attribution:"© OpenStreetMap contributors"}},layers:[{id:"osm",type:"raster" as const,source:"osm"}]};
const fmt = (v:number) => "KSh " + new Intl.NumberFormat("en-KE",{notation:"compact",maximumFractionDigits:1}).format(v);
function featureCollection(items:Project[]) {return {type:"FeatureCollection" as const,features:items.map(p=>({type:"Feature" as const,geometry:{type:"Point" as const,coordinates:[p.lng,p.lat]},properties:{id:p.id,status:p.status}}))};}
export default function App(){
 const mapContainer=useRef<HTMLDivElement>(null); const map=useRef<MapType|null>(null);
 const [projects,setProjects]=useState<Project[]>(demoProjects); const [dataMode,setDataMode]=useState<"demo"|"live"|"loading"|"error">(hasSupabaseConfig?"loading":"demo");
 const [selected,setSelected]=useState<Project|null>(null); const [search,setSearch]=useState(""); const [filter,setFilter]=useState<"All"|ProjectStatus>("All"); const [showProjects,setShowProjects]=useState(true); const [command,setCommand]=useState(""); const [message,setMessage]=useState("");
 useEffect(()=>{if(!hasSupabaseConfig)return;let active=true;fetchVerifiedProjects().then(items=>{if(active){setProjects(items);setDataMode("live");}}).catch(err=>{console.error("Sentrix Supabase read failed",err);if(active)setDataMode("error");});return()=>{active=false};},[]);
 const filtered=useMemo(()=>projects.filter(p=>(filter==="All"||p.status===filter)&&[p.name,p.county,p.category].join(" ").toLowerCase().includes(search.toLowerCase())),[filter,search,projects]);
 const filteredRef=useRef(filtered);filteredRef.current=filtered;
 useEffect(()=>{if(!mapContainer.current||map.current)return;
  const m=new maplibregl.Map({container:mapContainer.current,style:import.meta.env.VITE_MAP_STYLE_URL||defaultStyle,center:[37.5,0.2],zoom:5.2,attributionControl:{}});
  map.current=m;m.addControl(new maplibregl.NavigationControl(),"top-right");
  m.on("load",()=>{m.addSource("projects",{type:"geojson",data:featureCollection(filteredRef.current)});
   m.addLayer({id:"project-halo",type:"circle",source:"projects",paint:{"circle-radius":15,"circle-color":["match",["get","status"],"Stalled","#fb6472","In progress","#f5b94f","#3dd9a0"],"circle-opacity":0.15}});
   m.addLayer({id:"project-points",type:"circle",source:"projects",paint:{"circle-radius":7,"circle-stroke-width":2,"circle-stroke-color":"#081522","circle-color":["match",["get","status"],"Stalled","#fb6472","In progress","#f5b94f","#3dd9a0"]}});
   m.on("click","project-points",e=>{const id=e.features?.[0]?.properties?.id;const p=filteredRef.current.find(x=>x.id===id);if(p){setSelected(p);m.flyTo({center:[p.lng,p.lat],zoom:9});}});
   m.on("mouseenter","project-points",()=>m.getCanvas().style.cursor="pointer");m.on("mouseleave","project-points",()=>m.getCanvas().style.cursor="");
  });return()=>{m.remove();map.current=null};},[]);
 useEffect(()=>{const m=map.current;if(!m?.isStyleLoaded())return;(m.getSource("projects") as GeoJSONSource|undefined)?.setData(featureCollection(filtered));if(m.getLayer("project-points"))m.setLayoutProperty("project-points","visibility",showProjects?"visible":"none");if(m.getLayer("project-halo"))m.setLayoutProperty("project-halo","visibility",showProjects?"visible":"none");},[filtered,showProjects]);
 function go(p:Project){setSelected(p);map.current?.flyTo({center:[p.lng,p.lat],zoom:9,essential:true});}
 function runCommand(){const q=command.trim().toLowerCase();if(!q)return;
 const county=projects.find(p=>q.includes(p.county.toLowerCase()))?.county;
 const status=q.includes("stall")||q.includes("incomplete")?"Stalled":q.includes("complete")?"Completed":q.includes("progress")?"In progress":"All";
 setFilter(status);setSearch(county||"");setMessage(dataMode==="live"?"Applied filters to published verified records. AI commands are not connected.":"Applied local demonstration filters. AI commands are not connected.");}
 return <div className="shell">
 <aside className="sidebar"><div className="brand"><span className="brand-icon">◈</span><div><strong>SENTRIX</strong><small>POLITICAL INTELLIGENCE</small></div></div>
 <div className="section-label">WORKSPACE</div><div className="nav active">◉ &nbsp; Intelligence Map</div><div className="nav muted">▤ &nbsp; Election Analytics <em>Soon</em></div><div className="nav muted">▦ &nbsp; Public Expenditure <em>Soon</em></div><div className="nav muted">◎ &nbsp; Citizen Reports <em>Soon</em></div>
 <div className="section-label">MAP LAYERS</div><label className="toggle"><span>Project locations</span><input type="checkbox" checked={showProjects} onChange={e=>setShowProjects(e.target.checked)}/></label>
 <div className="section-label">PROJECT STATUS</div><div className="filters">{(["All","Stalled","In progress","Completed"] as const).map(s=><button className={filter===s?"chosen":""} key={s} onClick={()=>setFilter(s)}>{s}</button>)}</div>
 <div className="sidebar-footer">{dataMode==="live"?"VERIFIED PUBLIC DATA":dataMode==="loading"?"CONNECTING TO DATABASE":dataMode==="error"?"DATABASE UNAVAILABLE":"DEMO ENVIRONMENT"}<br/><span>{dataMode==="live"?"Only verified published records are shown.":dataMode==="error"?"Live records could not be loaded. Demonstration data is displayed.":"Demo records are fictional."}</span></div></aside>
 <main className="main"><header><div><h1>Geospatial Intelligence</h1><p>Kenya / National Overview</p></div><span className="demo">● {dataMode==="live"?"VERIFIED DATABASE RECORDS":dataMode==="loading"?"CONNECTING":dataMode==="error"?"DATABASE ERROR · DEMO DATA":"DEMONSTRATION DATA"}</span></header>
 <section className="stats"><div><span>Projects in view</span><strong>{filtered.length}</strong></div><div><span>Stalled</span><strong className="red">{filtered.filter(p=>p.status==="Stalled").length}</strong></div><div><span>In progress</span><strong className="yellow">{filtered.filter(p=>p.status==="In progress").length}</strong></div><div><span>{dataMode==="live"?"Verified allocation":"Illustrative allocation"}</span><strong>{fmt(filtered.reduce((n,p)=>n+p.budget,0))}</strong></div></section>
 <div className="workspace"><div className="map-wrap"><div ref={mapContainer} className="map"/><div className="map-label">◉ &nbsp; SENTRIX GEOINT / KENYA</div><div className="legend">{(Object.keys(statusColor) as ProjectStatus[]).map(s=><span key={s}><i style={{background:statusColor[s]}}/>{s}</span>)}</div></div>
 <div className="right-panel"><div className="panel-heading"><strong>Project Explorer</strong><span>{filtered.length} records</span></div><input aria-label="Search projects" placeholder="Search county, project, sector..." value={search} onChange={e=>setSearch(e.target.value)}/><div className="records">{filtered.map(p=><button key={p.id} className={"record "+(selected?.id===p.id?"selected":"")} onClick={()=>go(p)}><div className="record-top"><strong>{p.name}</strong><i style={{background:statusColor[p.status]}}/></div><small>{p.county} · {p.category}</small><div className="record-meta"><span>{p.status}</span><span>{p.progress}%</span></div></button>)}{!filtered.length&&<p className="empty">No matching records.</p>}</div>
 {selected&&<div className="detail"><div className="panel-heading"><strong>Project details</strong><button onClick={()=>setSelected(null)} aria-label="Close details">✕</button></div><h3>{selected.name}</h3><p>{selected.description}</p><div className="detail-grid"><span>County</span><b>{selected.county}</b><span>Budget</span><b>{fmt(selected.budget)}</b><span>Status</span><b>{selected.status}</b><span>Progress</span><b>{selected.progress}%</b><span>Evidence</span><b>{selected.source}</b></div></div>}</div></div>
 <form className="command" onSubmit={e=>{e.preventDefault();runCommand()}}><span>⌘</span><input aria-label="Map command" placeholder='Try: "show stalled projects in Machakos"' value={command} onChange={e=>setCommand(e.target.value)}/><button type="submit">Run command ↵</button></form>{message&&<div className="notice" role="status">{message}</div>}
 </main></div>;
}
