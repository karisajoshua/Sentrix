import { createClient } from "@supabase/supabase-js";
import type { Project, ProjectStatus } from "./data";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const hasSupabaseConfig = Boolean(url && key);
export const client = hasSupabaseConfig ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

type Row = { id:string;name:string;county:string;constituency:string|null;ward:string|null;category:string;status:string;allocated_budget:number|string|null;progress_percent:number|null;description:string|null;source_url:string|null;lng:number;lat:number };
function normalizeStatus(value:string):ProjectStatus {
 const s=value.toLowerCase().trim().replace(/[ -]/g,"_");
 if(s==="completed"||s==="complete")return "Completed";
 if(s==="in_progress"||s==="ongoing")return "In progress";
 if(s==="stalled"||s==="delayed")return "Stalled";
 return "Unknown";
}
export async function fetchVerifiedProjects():Promise<Project[]> {
 if(!client)throw new Error("Supabase is not configured");
 const {data,error}=await client.from("published_project_map").select("id,name,county,constituency,ward,category,status,allocated_budget,progress_percent,description,source_url,lng,lat").order("name",{ascending:true}).limit(500);
 if(error)throw error;
 return ((data||[]) as Row[]).filter(r=>Number.isFinite(Number(r.lng))&&Number.isFinite(Number(r.lat))).map(row=>({
 id:row.id,name:row.name,county:row.county,constituency:row.constituency||"",ward:row.ward||"",category:row.category,status:normalizeStatus(row.status),
 budget:Number(row.allocated_budget||0),progress:row.progress_percent??0,lng:Number(row.lng),lat:Number(row.lat),
 description:row.description||"No description provided.",source:row.source_url||"Source not supplied"
 }));
}
