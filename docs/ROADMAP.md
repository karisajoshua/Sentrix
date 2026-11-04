# Sentrix implementation roadmap

## Phase 1 — runnable map MVP
- React + TypeScript, MapLibre map, demo project markers, filters, project details and simple text command parser.
- Responsive dark UI and transparent demo-data labeling.

## Phase 2 — verified Kenya data
- Supabase/PostGIS data ingestion, citations, source URLs and timestamps.
- Kenya county/constituency/ward GeoJSON boundaries and drilldown.
- Licensed satellite imagery basemap; caching and provider attribution.
- Admin review workflow, evidence attachments and moderation.

## Phase 3 — analytics
- IEBC historical election datasets, geographic comparisons and aggregation.
- Budget vs disbursement vs expenditure breakdowns.
- deck.gl heatmaps and large-scale layer rendering.
- Tenant/workspace isolation and role-based access.
- AI command interpretation with validated read-only queries.

## Safeguards
- No unverified accusations presented as facts.
- Avoid personal voter profiling or sensitive individual political targeting.
- Enforce tenant-specific RLS and audit logs before onboarding organizations.
- Geotagged citizen submissions need consent, privacy protection and verification.
