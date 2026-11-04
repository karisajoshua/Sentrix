import {useEffect,useState} from "react";
import {client} from "./supabase";
type Activity={id:string;title:string;scheduled_date:string;status:string;county:string|null;ward:string|null};
export default function FieldOperations({organizationId,canEdit}:{organizationId:string;canEdit:boolean}){
 const [items,setItems]=useState<Activity[]>([]);
 const [title,setTitle]=useState(""),[date,setDate]=useState(""),[error,setError]=useState("");
 useEffect(()=>{let live=true;setItems([]);if(!client)return;client.from("workspace_activities").select("id,title,scheduled_date,status,county,ward").eq("organization_id",organizationId).order("scheduled_date",{ascending:false}).then(({data,error})=>{if(live){if(error)setError(error.message);else setItems((data||[]) as Activity[])}});return()=>{live=false}},[organizationId]);
 async function add(e:React.FormEvent){e.preventDefault();if(!client||!canEdit)return;const {data,error}=await client.from("workspace_activities").insert({organization_id:organizationId,title:title.trim(),scheduled_date:date}).select("id,title,scheduled_date,status,county,ward").single();if(error)setError(error.message);else{setItems(old=>[data as Activity,...old]);setTitle("");setDate("")}}
 async function change(item:Activity,status:string){if(!client||!canEdit)return;const {error}=await client.from("workspace_activities").update({status}).eq("id",item.id).eq("organization_id",organizationId);if(error)setError(error.message);else setItems(old=>old.map(x=>x.id===item.id?{...x,status}:x))}
 return <section style={{marginTop:32}}><h2>Field operations</h2><p>Schedule and track site visits and public-service activities.</p>{error&&<p role="alert">{error}</p>}
 {canEdit&&<form onSubmit={add}><input aria-label="Activity title" required minLength={3} maxLength={240} placeholder="Activity title" value={title} onChange={e=>setTitle(e.target.value)}/><input aria-label="Visit date" type="date" required value={date} onChange={e=>setDate(e.target.value)}/><button>Schedule</button></form>}
 {items.map(item=><div key={item.id} style={{padding:12,borderBottom:"1px solid #304258"}}><strong>{item.title}</strong> · {item.scheduled_date} <select aria-label={"Status of "+item.title} disabled={!canEdit} value={item.status} onChange={e=>change(item,e.target.value)}><option value="planned">Planned</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>)}
 {!items.length&&<p>No activities recorded.</p>}</section>
}