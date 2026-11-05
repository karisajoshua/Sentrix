"""Stage 47 Kenyan county polygons; never publish automatically."""
import json,os,time,urllib.request,urllib.parse,urllib.error
from kenya_boundary_sources import COUNTY_SOURCE,COUNTY_EXPECTED
url=os.environ["SUPABASE_URL"].rstrip("/")+"/rest/v1/"
key=os.environ["SUPABASE_SERVICE_ROLE_KEY"]
headers={"apikey":key,"Authorization":"Bearer "+key,"Content-Type":"application/json","Prefer":"return=representation"}
def request(table,payload):
 data=json.dumps(payload).encode()
 req=urllib.request.Request(url+table,data=data,headers=headers,method="POST")
 with urllib.request.urlopen(req,timeout=120) as res:return json.load(res)
def main():
 params=urllib.parse.urlencode({"where":"1=1","outFields":"*","returnGeometry":"true","outSR":"4326","f":"geojson"})
 with urllib.request.urlopen(COUNTY_SOURCE+"?"+params,timeout=120) as res:features=json.load(res)["features"]
 if len(features)!=COUNTY_EXPECTED:raise RuntimeError(f"Expected 47 counties; received {len(features)}")
 rows=[]
 for f in features:
  props=f.get("properties") or {};geometry=f.get("geometry")
  name=str(props.get("ADM1_EN") or props.get("adm1_en") or props.get("county") or props.get("County") or props.get("COUNTY") or "").strip()
  code=str(props.get("OBJECTID_1") or props.get("objectid_1") or props.get("OBJECTID") or props.get("objectid") or "").strip()
  if not name or not code or not geometry or geometry.get("type") not in ("Polygon","MultiPolygon"):raise RuntimeError(f"Invalid county source feature: {props}")
  rows.append((code,name,geometry))
 if len(set(code for code,_,_ in rows))!=47:raise RuntimeError("County source codes are not unique")
 imp=request("geographic_data_imports",[{"source_name":"UNHCR / IEBC-attributed county boundaries (provenance review required)","source_url":COUNTY_SOURCE,"level":"county","notes":"Staged only. Requires geometry, source and administrative-code verification."}])[0]["id"]
 for start in range(0,len(rows),5):
  payload=[{"import_id":imp,"source_code":code,"name":name,"level":"county","geometry":geometry} for code,name,geometry in rows[start:start+5]]
  for attempt in range(4):
   try:request("geographic_boundary_staging",payload);break
   except urllib.error.HTTPError as exc:
    detail=exc.read(1000).decode("utf-8","replace")
    if exc.code in (429,500,502,503,504) and attempt<3:time.sleep(2**attempt);continue
    raise RuntimeError(f"Supabase HTTP {exc.code}: {detail}") from exc
 print(json.dumps({"import_id":imp,"staged":len(rows),"publication":"not automatic"}))
if __name__=="__main__":main()
