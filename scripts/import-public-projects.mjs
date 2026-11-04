#!/usr/bin/env node
/**
 * Sentrix official project CSV importer.
 * Run locally or in a trusted CI runner; NEVER expose SUPABASE_SERVICE_ROLE_KEY in Vite.
 * Usage: node scripts/import-public-projects.mjs path/to/verified-projects.csv
 * Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SOURCE_URL
 * CSV headers: name,county,constituency,ward,category,status,allocated_budget,
 * progress_percent,longitude,latitude,description,source_url
 * Unpublished numeric fields must remain blank (not zero).
 */
import {readFileSync} from "node:fs";
import {createClient} from "@supabase/supabase-js";
const [path]=process.argv.slice(2);
if(!path||!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)throw Error("Provide CSV path, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
function parseCSV(raw){const out=[];let row=[],field="",quoted=false;for(let i=0;i<raw.length;i++){const ch=raw[i];if(ch==='"'){if(quoted&&raw[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(ch===","&&!quoted){row.push(field);field="";}else if((ch==="\n"||ch==="\r")&&!quoted){if(ch==="\r"&&raw[i+1]==="\n")i++;row.push(field);field="";if(row.some(v=>v.trim()))out.push(row);row=[];}else field+=ch;}row.push(field);if(row.some(v=>v.trim()))out.push(row);if(quoted)throw Error("Unterminated CSV quote");const [head,...rows]=out;return rows.map((r,i)=>{if(r.length!==head.length)throw Error("CSV column mismatch at line "+(i+2));return Object.fromEntries(head.map((h,j)=>[h.trim(),r[j].trim()]));});}
const apiKey=process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
if(apiKey.startsWith("sb_publishable_"))throw Error("SUPABASE_SERVICE_ROLE_KEY contains a publishable key. Use a secret key (sb_secret_...) or legacy service_role key. Never disable RLS.");
if(apiKey.split(".").length===3){
 try {
  const payload=JSON.parse(Buffer.from(apiKey.split(".")[1],"base64url").toString("utf8"));
  if(payload.role!=="service_role")throw Error("GitHub secret contains JWT role "+String(payload.role)+" instead of service_role. Use the service_role key from the SAME Supabase project.");
 } catch(e){throw Error("Cannot verify legacy service_role JWT: "+e.message);}
} else if(!apiKey.startsWith("sb_secret_"))throw Error("Unexpected API key format. Use a server-side Supabase secret key or legacy service_role key.");
function normalizeStatus(value){
 const s=String(value||"unknown").trim().toLowerCase().replace(/[\\s-]+/g,"_");
 const alias={ongoing:"in_progress",complete:"completed",inprogress:"in_progress",planned:"proposed"};
 const normalized=alias[s]||s;
 return ["proposed","in_progress","completed","delayed","stalled","unknown"].includes(normalized)?normalized:"unknown";
}
const rows=parseCSV(readFileSync(path,"utf8"));const db=createClient(process.env.SUPABASE_URL,apiKey,{auth:{persistSession:false}});
let inserted=0,skipped=0;for(const [i,r] of rows.entries()){
 const source=r.source_url||process.env.SOURCE_URL;
 // DPMIS national and multi-county projects remain in the raw extraction artifact until a defensible location is available.
 if(!r.county){console.warn("Staging without county (not inserted):",r.external_id||r.name);skipped++;continue;}
 if(!r.name||!r.county||!source||!/^https:\/\//.test(source)){console.warn("Skipping row",i+2,"missing project identity, county or HTTPS source");skipped++;continue;}
 const lng=r.longitude===""||r.longitude===undefined?null:Number(r.longitude),lat=r.latitude===""||r.latitude===undefined?null:Number(r.latitude);
 if((lng===null)!==(lat===null)||(lng!==null&&(!Number.isFinite(lng)||!Number.isFinite(lat)||lng<33||lng>42||lat<-5||lat>6))){console.warn("Skipping row",i+2,"invalid coordinates");skipped++;continue;}
 const numeric=(value,label)=>{if(value===""||value===undefined)return null;const n=Number(value);if(!Number.isFinite(n)||n<0)throw Error("Invalid "+label+" at row "+(i+2));return n;};
 const budget=numeric(r.allocated_budget,"budget"),progress=numeric(r.progress_percent,"progress");
 if(progress!==null&&progress>100)throw Error("Progress exceeds 100 at row "+(i+2));
 const {data:existing,error:findError}=await db.from("projects").select("id").eq("name",r.name).eq("county",r.county).eq("source_url",source).limit(1);if(findError)throw findError;
 if(existing?.length){skipped++;continue;}
 const payload={name:r.name,county:r.county,constituency:r.constituency||null,ward:r.ward||null,category:r.category||"Other",status:normalizeStatus(r.status),allocated_budget:budget,progress_percent:progress,description:[r.external_id||"",r.description||"",r.location_raw?"Published location: "+r.location_raw:"",r.period_raw?"Published period: "+r.period_raw:""].filter(Boolean).join(" | "),source_url:source,verification_status:"under_review"};
 if(lng!==null)payload.location="SRID=4326;POINT("+lng+" "+lat+")";
 const {error}=await db.from("projects").insert(payload);if(error)throw Error("Row "+(i+2)+": "+error.message);inserted++;
}
console.log(JSON.stringify({inserted,skipped,review:"New records are under_review verification and do not appear on the public map until approved."}));
