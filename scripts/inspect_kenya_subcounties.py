"""Inspect a separately identified UNHCR sub-county ArcGIS dataset before importing."""
import json,urllib.request
item="227062616a8c4d808b3bea3e4ca1dd92"
url=f"https://www.arcgis.com/sharing/rest/content/items/{item}?f=json"
with urllib.request.urlopen(url,timeout=60) as r:metadata=json.load(r)
service=metadata.get("url")
print(json.dumps({"title":metadata.get("title"),"service_url":service,"access":metadata.get("access"),"license":metadata.get("licenseInfo")},default=str)[:2000])
if not service:raise RuntimeError("No feature service URL in ArcGIS item")
with urllib.request.urlopen(service.rstrip("/")+"/0?f=json",timeout=60) as r:layer=json.load(r)
print(json.dumps({"name":layer.get("name"),"fields":[f["name"] for f in layer.get("fields",[])],"geometryType":layer.get("geometryType"),"copyright":layer.get("copyrightText")},default=str))
with urllib.request.urlopen(service.rstrip("/")+"/0/query?where=1%3D1&returnCountOnly=true&f=json",timeout=60) as r:print("count",json.load(r))
