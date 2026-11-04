# Geospatial specification

## Current map
MapLibre GL JS with an OpenStreetMap raster style and four fictional Kenyan project points. Zoom, pan, click-to-detail and project filtering work in the initial implementation. No satellite imagery, administrative polygons, 3D terrain, vector tiles or heatmaps are active.

## Target drilldown
World → country → county → constituency → ward → project. On selecting a polygon: fly to bounds, update breadcrumb and filters, fetch counts and source-backed records for that geographic unit. Boundary versions must match election dates.

## Proposed layers
- Basemap: streets / satellite imagery (licensed provider and credentials).
- Boundaries: counties, constituencies, wards.
- Projects: clustered points, status symbology, evidence confidence.
- Finance: choropleths of normalized fiscal indicators, never mix financial periods.
- Elections: aggregate turnout/results by selected historical election and unit.
- Reports: reviewed public reports only, fuzzed coordinates where privacy requires.
- Heatmaps: deck.gl GPU layers for density and spatial aggregations.

## Interaction
Hover = compact summary; click = evidence drawer; double-click or breadcrumb = drill; search = geocoder or bounded query; keyboard = equivalent list navigation; layer legend always describes units, source and timestamp.

## Scale and accuracy
Use server-side clustering/vector tiles beyond small datasets; debounce viewport requests; avoid exposing precise private locations. Reproject source data correctly, validate polygon topology and use administrative IDs rather than names as joins.

## Map data and attribution
OSM tile servers are suitable only under their published usage policy; use a commercial/self-hosted tile provider for production traffic. Satellite imagery requires its own licensing. Never imply imagery itself verifies project completion.
