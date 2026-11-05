# Kenya geographic boundary rollout

## Published
- 47 counties: UNHCR-hosted IEBC-attributed ADM1, all valid, matched by ADM1_PCODE.
- 290 constituency candidates: geoBoundaries Kenya ADM2, all valid and each spatially matched to a county (100% rounded overlap). Published under constituency level; source vintage must be reviewed against current IEBC gazette.

- 290 administrative sub-counties: separate UNHCR/IMWG operational dataset, all valid after audited repair of Kanduyi, county parent codes matched 290/290, point-on-surface inside county 290/290. Published as distinct `subcounty` level. Source explicitly disclaims official national-authority status.\n- 1,027 provisional ADM3 ward polygons linked to constituency parents and available through `published_boundaries`. Source import remains `validated` rather than fully `published` because 425 features remain held for reconciliation.\n\n## Ward coverage is not yet authoritative
- Original ArcGIS ward feed: 1,412 polygons, repaired 12 invalid geometries using PostGIS ST_MakeValid. Originals retained in geographic_geometry_repair_audit.
- Official IEBC baseline: 1,450 wards.
- geoBoundaries ADM3 feed: 1,452 features, all geometrically valid. This differs from the official 1,450 electoral wards. Spatial match against 290 constituency polygons: 1,027 have >=95% area overlap; 425 are below 95% (minimum 23.98%). Do not publish this layer as electoral wards without reconciliation.
- Five duplicate ward names in original feed are not necessarily duplicates; different constituencies may share names.

## Administrative versus electoral
- County -> constituency -> ward is electoral hierarchy.
- County -> subcounty is separate administrative hierarchy. Do not alias a constituency polygon to subcounty without verifying the specific boundary designation.
- The administrative_areas level constraint permits subcounty; 290 distinct UNHCR/IMWG operational subcounty polygons are published, with provenance caveat.

## Publication gates
1. Confirm source provenance, licence and administrative vintage.
2. Check valid nonempty polygons and unique codes.
3. Match parent via maximum spatial intersection and review low-overlap cases.
4. Reconcile counts against official IEBC gazette.
5. Publish only reviewed records; verify published_boundaries counts and front-end CI.

## Source references
- County: https://services2.arcgis.com/RyJEMkDR4Jnx7PU8/arcgis/rest/services/Kenya/FeatureServer/0
- geoBoundaries: https://www.geoboundaries.org/api/current/gbOpen/KEN/ADM2/
- IEBC: https://www.iebc.or.ke/
\n- Subcounties: https://services.arcgis.com/hBEMHCkbQdfV906F/arcgis/rest/services/Kenya_Sub_Counties/FeatureServer/0\n
## User-directed provisional ward rollout and 3D navigation (2026-11-05)
- All 1,452 geoBoundaries ADM3 polygons now available in `published_boundaries`. The 425 previously withheld polygons were assigned by maximum spatial overlap at user request; 3 have <50% constituency overlap. These assignments are provisional, not independently verified electoral hierarchy.
- Ward selection activates a 65-degree pitched camera at zoom 15.5 and a MapLibre fill-extrusion layer sourced from OpenFreeMap/OpenStreetMap building footprints. Roads are rendered by the OpenFreeMap dark basemap; actual building heights appear when OSM attributes exist, otherwise illustrative fallback heights are used.
- Buildings/roads depend on local OpenStreetMap coverage, map tile availability and network connectivity. Not photorealistic imagery or guaranteed complete 3D coverage.
