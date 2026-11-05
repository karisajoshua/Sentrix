# Kenya geographic boundary rollout

## Published
- 47 counties: UNHCR-hosted IEBC-attributed ADM1, all valid, matched by ADM1_PCODE.
- 290 constituency candidates: geoBoundaries Kenya ADM2, all valid and each spatially matched to a county (100% rounded overlap). Published under constituency level; source vintage must be reviewed against current IEBC gazette.

## Ward coverage is not yet authoritative
- Original ArcGIS ward feed: 1,412 polygons, repaired 12 invalid geometries using PostGIS ST_MakeValid. Originals retained in geographic_geometry_repair_audit.
- Official IEBC baseline: 1,450 wards.
- geoBoundaries ADM3 feed: 1,452 features. Count discrepancy requires reconciliation. Do not automatically publish all 1,452 as electoral wards.
- Five duplicate ward names in original feed are not necessarily duplicates; different constituencies may share names.

## Administrative versus electoral
- County -> constituency -> ward is electoral hierarchy.
- County -> subcounty is separate administrative hierarchy. Do not alias a constituency polygon to subcounty without verifying the specific boundary designation.
- The administrative_areas level constraint now permits subcounty; no distinct subcounty geometries have been published.

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
