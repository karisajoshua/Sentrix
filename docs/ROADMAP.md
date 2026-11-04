# Sentrix roadmap

This roadmap distinguishes **shipped**, **specified**, and **future** work. Dates and staffing are not yet committed.

## Phase 0 — foundation (shipped scaffold)
- [x] React + TypeScript + Vite app
- [x] MapLibre map and OpenStreetMap raster tiles
- [x] Clearly fictional demo projects, filters and detail panel
- [x] Basic keyword command parser
- [x] Initial PostGIS SQL schema
- [x] Comprehensive technical and product documentation
- [ ] Run build, establish CI and add automated tests

## Phase 1 — first usable geographic pilot
- [ ] Set up Vercel preview and Supabase development environment
- [ ] Implement authentication and tenant RLS
- [ ] Load licensed Kenya administrative boundaries and drilldown
- [ ] Establish verified project ingestion, evidence and review workflow
- [ ] Connect project API and database to map
- [ ] Replace demo records with sourced pilot data
- [ ] Add licensed satellite imagery style

## Phase 2 — accountability and election analytics
- [ ] Public finance model and fiscal-year comparisons
- [ ] Historical official IEBC aggregate election layers
- [ ] deck.gl heatmaps, clustering and scalable vector tiles
- [ ] Moderated citizen reports and corrections
- [ ] Source-backed reports and exports

## Phase 3 — organization-scale intelligence
- [ ] Workspace branding, quotas, roles and audit logs
- [ ] AI read-only command interpretation
- [ ] Alerts, saved searches and newsroom workflows
- [ ] Operational monitoring, backup drills, penetration testing

## Release gates
No real citizen data before privacy, moderation and security review. No allegations published as verified without human evidence review. No production multi-tenancy before RLS isolation tests.
