import {useEffect,useState} from "react";
import {client} from "./supabase";
type Metric={total:number;open:number;done:number};
type Snapshot={tasks:Metric;cases:Metric;activities:Metric;team:number;upcoming:{title:string;scheduled_date:string}[]};
const empty:Snapshot={tasks:{total:0,open:0,done:0},cases:{total:0,open:0,done:0},activities:{total:0,open:0,done:0},team:0,upcoming:[]};
const card:React.CSSProperties={background:"#0e1c2b",border:"1px solid #304258",borderRadius:12,padding:18};
export default function ExecutiveCommandCentre({organizationId}:{organizationId:string}){
 const [data,setData]=useState<Snapshot>(empty),[error,setError]=useState(""),[loading,setLoading]=useState(true),[refresh,setRefresh]=useState(0);
 useEffect(()=>{if(!client)return;let active=true;setLoading(true);setError("");setData(empty);
 Promise.all([
 client.from("workspace_tasks").select("status").eq("organization_id",organizationId),
 client.from("workspace_cases").select("status").eq("organization_id",organizationId),
 client.from("workspace_activities").select("title,status,scheduled_date").eq("organization_id",organizationId),
 client.rpc("list_workspace_team",{target_organization:organizationId})
 ]).then(results=>{if(!active)return;setLoading(false);const failures=results.filter(r=>r.error).map(r=>r.error?.message);if(failures.length){setError(failures.join("; "));return}
 const tasks=(results[0].data||[]) as {status:string}[],cases=(results[1].data||[]) as {status:string}[],activities=(results[2].data||[]) as {title:string;status:string;scheduled_date:string}[];
 const count=(rows:{status:string}[],completed:string[]):Metric=>({total:rows.length,open:rows.filter(x=>!completed.includes(x.status)).length,done:rows.filter(x=>completed.includes(x.status)).length});
 setData({tasks:count(tasks,["done"]),cases:count(cases,["resolved","closed"]),activities:count(activities,["completed","cancelled"]),team:(results[3].data||[]).length,upcoming:activities.filter(x=>x.status==="planned"&&x.scheduled_date>=new Date().toISOString().slice(0,10)).sort((a,b)=>a.scheduled_date.localeCompare(b.scheduled_date)).slice(0,5)});
 }).catch(e=>{if(active){setError(String(e));setLoading(false)}});return()=>{active=false}},[organizationId,refresh]);
 const tiles=[{label:"Operational tasks",m:data.tasks},{label:"Community cases",m:data.cases},{label:"Field activities",m:data.activities}];
 return <section aria-label="Executive command centre" style={{margin:"24px 0 36px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div><h2 style={{marginBottom:4}}>Executive Command Centre</h2><p style={{color:"#94a3b8",marginTop:0}}>Live, organization-scoped operational overview</p></div><button onClick={()=>setRefresh(x=>x+1)} disabled={loading} style={{...card,color:"#e2e8f0",cursor:"pointer"}}>{loading?"Loading…":"Refresh overview"}</button></div>
 {error&&<p role="alert" style={{color:"#fca5a5"}}>{error}</p>}
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>{tiles.map(t=><article key={t.label} style={card}><div style={{color:"#94a3b8",fontSize:13}}>{t.label}</div><strong style={{fontSize:34}}>{t.m.total}</strong><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:12}}><span>{t.m.open} active</span><span>{t.m.done} completed</span></div><div style={{height:6,background:"#304258",borderRadius:8,marginTop:8}}><div style={{width:(t.m.total?t.m.done/t.m.total*100:0)+"%",height:"100%",background:"#38bdf8",borderRadius:8}}/></div></article>)}<article style={card}><div style={{color:"#94a3b8",fontSize:13}}>Team members</div><strong style={{fontSize:34}}>{data.team}</strong><p style={{fontSize:12,color:"#94a3b8"}}>Members with workspace access</p></article></div>
 <div style={{...card,marginTop:14}}><h3 style={{marginTop:0}}>Upcoming field operations</h3>{data.upcoming.length?data.upcoming.map((x,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:12,padding:"10px 0",borderBottom:"1px solid #304258"}}><span>{x.title}</span><time dateTime={x.scheduled_date}>{x.scheduled_date}</time></div>):<p style={{color:"#94a3b8"}}>No upcoming activities scheduled.</p>}</div>
 <p style={{fontSize:12,color:"#94a3b8"}}>Figures reflect only records in the selected workspace. They are not national project statistics or externally verified data.</p></section>
}
