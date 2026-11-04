import { createClient } from "@supabase/supabase-js";
import type { Project, ProjectStatus } from "./data";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const hasSupabaseConfig = Boolean(url && key);
const client = hasSupabaseConfig ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

type Row = { id: string; name: string; county: string; category: string; status: string; allocated_budget: number | string | null; progress_percent: number | null; description: string | null; source_url: string | null; location: unknown };
function coordinates(value: unknown): [number,number] | null {
 if (typeof value === "string") { const match = /^POINT\\s*\\(\\s*(-?\\d+(?:\\.\\d+)?)\\s+(-?\\d+(?:\\.\\d+)?)\\s*\\)$/i.exec(value); if(match) return [Number(match[1]),Number(match[2])]; }
 if (value && typeof value === "object" && "coordinates" in value) {const coords=(value as {coordinates:unknown}).coordinates;if(Array.isArray(coords)&&coords.length>=2&&coords.every(v=>typeof v==="number"))return [coords[0],coords[1]];}
 return null;
}
export async function fetchVerifiedProjects(): Promise<Project[]> {
 if(!client) throw new Error("Supabase is not configured");
 const {data,error}=await client.from("projects").select("id,name,county,category,status,allocated_budget,progress_percent,description,source_url,location").eq("verification_status","verified").order("created_at",{ascending:false}).limit(500);
 if(error)throw error;
 return ((data||[]) as Row[]).flatMap(row=>{
  const point=coordinates(row.location);if(!point)return [];
  const status:ProjectStatus=row.status==="completed"?"Completed":row.status==="in_progress"?"In progress":"Stalled";
  return [{id:row.id,name:row.name,county:row.county,category:row.category,status,budget:Number(row.allocated_budget||0),progress:row.progress_percent??0,lng:point[0],lat:point[1],description:row.description||"No description provided.",source:row.source_url||"Source not supplied"}];
 });
}
