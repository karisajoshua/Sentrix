import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}) : null;

export type ProjectAccountability = {
 milestones: {id:string;title:string;status:string;progress_percent:number|null;due_date:string|null;source_url:string|null}[];
 updates: {id:string;title:string;summary:string;observed_at:string|null;source_url:string|null}[];
 allocations: {id:string;amount:number;description:string|null;source_url:string|null}[];
 disbursements: {id:string;amount:number;currency_code:string;disbursed_on:string|null;source_url:string|null}[];
 expenditures: {id:string;amount:number;currency_code:string;spent_on:string|null;source_url:string|null}[];
 contracts: {id:string;title:string;contract_value:number|null;currency_code:string;contractor_id:string;source_url:string|null}[];
 evidence: {id:string;title:string;evidence_type:string;source_url:string|null}[];
};
export async function fetchProjectAccountability(projectId:string):Promise<ProjectAccountability>{
 if(!db)throw new Error("Supabase is not configured");
 const names=["project_milestones","project_updates","budget_allocations","disbursements","expenditures","contracts","project_evidence"] as const;
 const results=await Promise.all(names.map(async name=>{
  const {data,error}=await db.from(name).select("*").eq("project_id",projectId).eq("verification_status","verified").limit(100);
  if(error)throw new Error(name+": "+error.message);
  return data||[];
 }));
 return {milestones:results[0] as ProjectAccountability["milestones"],updates:results[1] as ProjectAccountability["updates"],allocations:results[2] as ProjectAccountability["allocations"],disbursements:results[3] as ProjectAccountability["disbursements"],expenditures:results[4] as ProjectAccountability["expenditures"],contracts:results[5] as ProjectAccountability["contracts"],evidence:results[6] as ProjectAccountability["evidence"]};
}
