"""Stage independently labelled Kenyan administrative sub-counties from UNHCR/IMWG."""
import json,os,time,urllib.parse,urllib.request,urllib.error
BASE="https://services.arcgis.com/hBEMHCkbQdfV906F/arcgis/rest/services/Kenya_Sub_Counties/FeatureServer/0/query"
ROOT=os.environ["SUPABASE_URL"].rstrip("/")+"/rest/v1/"
KEY=os.environ["SUPABASE_SERVICE_ROLE_KEY"]
HEAD={"apikey":KEY,"Authorization":"Bearer "+KEY,"Content-Type":"application/json","Prefer":"return=representation"}
def get(url):
 with urllib.request.urlopen(url,timeout=180) as response:return json.load(response)
def post(table,payload):
 request=urllib.request.Request(ROOT+table,data=json.dumps(payload).encode(),headers=HEAD,method="POST")
 with urllib.request.urlopen(request,timeout=180) as response:return json.load(response)
def main():
 count=get(BASE+"?"+urllib.parse.urlencode({"where":"1=1","returnCountOnly":"true","f":"json"}))["count"]
 if count!=290:raise RuntimeError(f"Expected 290 subcounties, got {count}")
 records=[]
 for offset in range(0,count,100):
  params={"where":"1=1","outFields":"*","returnGeometry":"true","outSR":"4326","f":"geojson","resultOffset":offset,"resultRecordCount":100}
  data=get(BASE+"?"+urllib.parse.urlencode(params))
  records.extend(data.get("features",[]))
 if len(records)!=290:raise RuntimeError(f"Fetched {len(records)} subcounties")
 rows=[]
 for feature in records:
  props=feature.get("properties") or {}
  name=str(props.get("ADM2_EN") or props.get("Sub_County") or "").strip()
  code=str(props.get("ADM2_PCODE") or "").strip()
  county=str(props.get("ADM1_PCODE") or "").strip()
  geom=feature.get("geometry")
  if not name or not code or not county or not geom or geom.get("type") not in ("Polygon","MultiPolygon"):raise RuntimeError(f"Bad subcounty: {props}")
  rows.append({"source_code":code,"name":name,"level":"subcounty","parent_source_code":county,"geometry":geom})
 if len(set(r["source_code"] for r in rows))!=290:raise RuntimeError("Duplicate ADM2_PCODE")
 imp=post("geographic_data_imports",[{"source_name":"UNHCR/IMWG Kenya administrative sub-counties (operational, non-official)","source_url":BASE,"level":"subcounty","notes":"290 separately labelled administrative subcounties; UNHCR/IMWG operational endorsement, not official national authority; staged for validation."}])[0]["id"]
 for offset in range(0,len(rows),5):
  batch=[dict(r,import_id=imp) for r in rows[offset:offset+5]]
  for attempt in range(4):
   try:post("geographic_boundary_staging",batch);break
   except urllib.error.HTTPError as e:
    detail=e.read(1000).decode("utf-8","replace")
    if e.code in (429,500,502,503,504) and attempt<3:time.sleep(2**attempt);continue
    raise RuntimeError(f"Supabase {e.code}: {detail}") from e
 print(json.dumps({"import_id":imp,"staged":len(rows),"publication":"not automatic"}))
if __name__=="__main__":main()
