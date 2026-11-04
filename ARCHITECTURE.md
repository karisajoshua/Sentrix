# Sentrix architecture

## 1. Status and scope
**Implemented:** single-page React/Vite client, MapLibre map with OSM raster basemap, in-memory demonstration data and filters, initial standalone SQL schema. **Planned:** Supabase connectivity, identity, tenant isolation, verified datasets, spatial boundaries, audit trail, AI, deck.gl and satellite imagery.

## 2. Current runtime
```text
Browser
  React App (src/App.tsx)
    ├─ src/data.ts (fictional project records)
    ├─ MapLibre GL JS → OSM raster tile server
    ├─ status / county / text filters
    └─ local keyword command parser
```
No backend endpoints are called. The Supabase schema has not been applied or connected.

## 3. Target runtime
```text
Browser (React/Next.js optional migration)
  ├─ MapLibre map + deck.gl overlays
  ├─ organization/workspace context
  └─ read-only command UI
       ↓ authenticated HTTPS
API / Edge Functions (authorization, validation, rate limiting)
  ├─ project and evidence services
  ├─ geographic aggregations
  ├─ election and budget statistics
  ├─ ingestion/review pipeline
  └─ AI intent compiler → allowlisted query operations
       ↓
Supabase PostgreSQL + PostGIS + Storage
  ├─ tenant-scoped operational records
  ├─ spatial boundary geometries
  ├─ source provenance and immutable audit events
  └─ reviewed public publishing views
```

## 4. Architecture principles
- Separate source facts, editorial interpretations, and user allegations.
- Every public project status must expose evidence, provenance, verification state and update time.
- Public aggregates may be shared; tenant workspaces, drafts and field notes must remain isolated.
- Server enforces authorization. Client-side filters and hidden UI controls are not security.
- Public APIs return bounded, paginated results; large map layers use vector tiles or server aggregations.
- Never expose Supabase service-role keys to the browser.
- Maps must preserve attribution and follow tile-provider terms.

## 5. Spatial model
Store project points as PostGIS geography(Point,4326), administrative boundaries as geometry(MultiPolygon,4326), and derived spatial indexes. Point-in-polygon joins use ST_Intersects / ST_Covers with validated coordinates. Use versioned boundary datasets to avoid historical election boundary mismatches.

## 6. Data lifecycle
Discover → license check → ingest raw snapshot → normalize → reconcile geographic IDs → provenance attach → human review → publish verified record → periodic revalidation → correction/retraction. Never overwrite original source artifacts silently.

## 7. Nonfunctional targets (proposed, not measured)
- WCAG 2.2 AA-oriented interaction, keyboard map alternatives and reduced motion.
- Defined pagination and tile loading limits; no unbounded geometry transfer.
- Structured logging, error tracking, backups, migration review and recovery drills.
- Availability and latency SLOs to be defined after production load testing.

## 8. Architectural decisions
ADR-001: MapLibre GL JS is the interactive map engine; deck.gl handles heavy overlays.
ADR-002: PostGIS is the canonical spatial database.
ADR-003: Verification and provenance are first-class data, not cosmetic badges.
ADR-004: Tenant authorization must be enforced by database RLS plus server checks.
ADR-005: The MVP is not a verified political-data product.
