import {useEffect,useState} from "react";
import {client} from "./supabase";
type Member={member_user_id:string;member_role:string;joined_at:string};
export default function TeamAdministration({organizationId}:{organizationId:string}){
 const [members,setMembers]=useState<Member[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let active=true;setLoading(true);setError("");setMembers([]);if(!client){setLoading(false);return}client.rpc("list_workspace_team",{target_organization:organizationId}).then(({data,error})=>{if(!active)return;setLoading(false);if(error)setError(error.message);else setMembers((data||[]) as Member[])});return()=>{active=false}},[organizationId]);
 return <section style={{marginTop:32,maxWidth:850}}><h2>Team administration</h2><p style={{color:"#94a3b8"}}>Organization membership and access roles. Staff invitations and role changes are not enabled until authorization testing is complete.</p>{loading&&<p>Loading team…</p>}{error&&<p role="alert" style={{color:"#fca5a5"}}>{error}</p>}
 <div style={{display:"grid",gap:8}}>{members.map(m=><div key={m.member_user_id} style={{padding:12,border:"1px solid #304258",borderRadius:8,display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>Member {m.member_user_id.slice(0,8)}…</strong><div style={{fontSize:12,color:"#94a3b8"}}>Joined {new Date(m.joined_at).toLocaleDateString()}</div></div><span>{m.member_role}</span></div>)}</div>{!loading&&!error&&!members.length&&<p>No team members found.</p>}
 </section>
}