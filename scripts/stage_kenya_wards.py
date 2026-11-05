"""Stage Kenya ward polygons from a public ArcGIS FeatureServer.
Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Does not publish unvalidated data.
"""
import json, os, time, urllib.parse, urllib.request
from datetime import datetime, timezone
BASE="https://services6.arcgis.com/zOnyumh63cMmLBBH/ArcGIS/rest/services/Kenya_Wards/FeatureServer/0/query"
URL=os.environ["SUPABASE_URL"].rstrip("/")
KEY=os.environ["SUPABASE_SERVICE_ROLE_KEY"]
HEADERS={"apikey":KEY,"Authorization":"Bearer "+KEY,"Content-Type":"application/json","Prefer":"return=representation"}
def api(method,table,data=None,query=""):
 request=urllib.request.Request(URL+"/rest/v1/"+table+query,data=json.dumps(data).encode() if data is not None else None,headers=HEADERS,method=method)
 with urllib.request.urlopen(request,timeout=90) as response:return json.load(response)
def fetch(params):
 query=urllib.parse.urlencode(params)
 with urllib.request.urlopen(BASE+"?"+query,timeout=120) as response:return json.load(response)
def main():
 meta=fetch({"where":"1=1","returnCountOnly":"true","f":"json"})
 count=meta.get("count")
 if not isinstance(count,int) or count<1:raise RuntimeError("No authoritative features returned")
 imp=api("POST","geographic_data_imports",[{"source_name":"ArcGIS Kenya Wards FeatureServer (external source; provenance review required)","source_url":BASE,"level":"ward","notes":"Imported to staging; publication requires independent source and boundary validation"}])[0]
 import_id=imp["id"];staged=0;offset=0
 while offset<count:
  batch=fetch({"where":"1=1","outFields":"*","returnGeometry":"true","outSR":"4326","resultOffset":str(offset),"resultRecordCount":"100","f":"geojson"})
  features=batch.get("features",[])
  if not features:raise RuntimeError("Pagination stopped before expected feature count")
  rows=[]
  for feature in features:
   geom=feature.get("geometry");props=feature.get("properties") or {}
   if not geom or geom.get("type") not in ("Polygon","MultiPolygon"):continue
   code=str(props.get("OBJECTID") or props.get("FID") or props.get("objectid") or f"offset-{offset+len(rows)}")
   name=str(props.get("ELEC_AREA_") or props.get("IEBC_WARDS") or props.get("WARD_NAME") or props.get("ward_name") or props.get("name") or "").strip()
   if not name:continue
   rows.append({"import_id":import_id,"source_code":code,"name":name,"level":"ward","geometry":geom})
  if rows:api("POST","geographic_boundary_staging",rows);staged+=len(rows)
  offset+=len(features)
  print(f"Staged {staged} polygons; fetched {offset}/{count}; first_geometry_type={features[0].get('geometry',{}).get('type') if features[0].get('geometry') else 'null'}; first_property_keys={list((features[0].get('properties') or {}).keys())[:12]}",flush=True)
  time.sleep(.2)
 print(json.dumps({"import_id":import_id,"staged":staged,"expected":count,"publication":"not automatic"}))
if __name__=="__main__":main()
