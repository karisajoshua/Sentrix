"""Stage Kenya ADM3 ward polygons from geoBoundaries, pending constituency review."""
import json,os,urllib.request,urllib.error,time
API="https://www.geoboundaries.org/api/current/gbOpen/KEN/ADM3/"
url=os.environ["SUPABASE_URL"].rstrip("/")+"/rest/v1/"
key=os.environ["SUPABASE_SERVICE_ROLE_KEY"]
headers={"apikey":key,"Authorization":"Bearer "+key,"Content-Type":"application/json","Prefer":"return=representation"}
def get(u):
 with urllib.request.urlopen(u,timeout=180) as r:return json.load(r)
def post(table,rows):
 req=urllib.request.Request(url+table,data=json.dumps(rows).encode(),headers=headers,method="POST")
 with urllib.request.urlopen(req,timeout=180) as r:return json.load(r)
def main():
 meta=get(API);geo_url=meta["gjDownloadURL"];features=get(geo_url)["features"]
 if len(features)!=1450:raise RuntimeError(f"Expected 1450 ADM3 wards; got {len(features)}")
 rows=[]
 for f in features:
  props=f.get("properties") or {};geom=f.get("geometry")
  name=str(props.get("shapeName") or "").strip();code=str(props.get("shapeID") or "").strip()
  if not name or not code or not geom or geom.get("type") not in ("Polygon","MultiPolygon"):raise RuntimeError(f"Invalid ADM3 ward record: {props}")
  rows.append((code,name,geom))
 if len(set(x[0] for x in rows))!=1450:raise RuntimeError("Duplicate ADM3 source codes")
 imp=post("geographic_data_imports",[{"source_name":"geoBoundaries Kenya ADM3 ward candidates (IEBC/OCHA attributed)","source_url":geo_url,"level":"ward","notes":"1450 ADM3 ward candidates staged. Parent constituency and topology checks required before publication."}])[0]["id"]
 for offset in range(0,len(rows),5):
  batch=[{"import_id":imp,"source_code":code,"name":name,"level":"constituency","geometry":geom} for code,name,geom in rows[offset:offset+5]]
  for attempt in range(4):
   try:post("geographic_boundary_staging",batch);break
   except urllib.error.HTTPError as e:
    detail=e.read(1000).decode("utf-8","replace")
    if e.code in (429,500,502,503,504) and attempt<3:time.sleep(2**attempt);continue
    raise RuntimeError(f"Supabase HTTP {e.code}: {detail}") from e
 print(json.dumps({"import_id":imp,"staged":len(rows),"publication":"not automatic"}))
if __name__=="__main__":main()
