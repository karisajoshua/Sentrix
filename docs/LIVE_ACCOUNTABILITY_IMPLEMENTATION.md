# Sentrix — live accountability feature (implementation notes)

## Delivered
- Public read-only verified project map backed by Supabase `published_project_map` (PostGIS coordinates, `security_invoker` view).
- County, status and text filtering of project records.
- Project detail panel reads verified milestones, updates, budget allocations, disbursements, expenditures, contracts and evidence.
- Explicit demo mode when public Supabase configuration is missing; database errors never silently substitute fictional project data.
- Database foreign keys prevent cross-project expenditure-to-disbursement and evidence-to-contract references.

## Production prerequisites
1. Check that Vercel has a **public** `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or Vercel integration `NEXT_PUBLIC_DB_*` mapped in `vite.config.ts`). Never expose service-role keys.
2. Confirm Vercel build of `main` passes `npm run build`. This has not been independently verified because deployment access is restricted.
3. Import real project records with **traceable source URLs**, verified dates, statuses and actual project coordinates. **No real records are loaded yet**.
4. Run real browser tests on desktop and Android; check map loads, county filters, project selection, empty states and links.
5. Build admin authentication, tenant-scoped write policies, editorial verification workflow, storage access controls, and source ingestion before enabling public submissions or administrative editing.
6. Finance summaries are intentionally limited and incomplete: only up to 100 verified records per category are fetched, and currency conversion is not implemented. Do not treat these as official audited totals.
7. Enforce URL validation and source trust at ingestion; evidence links are untrusted until independently verified.
8. Backfill official administrative boundaries, link projects to canonical geographic identifiers and build polygon drill-down for true ward-level GIS.
9. Add end-to-end tests, monitoring, provenance versioning, rate limits and accessibility audit.

## Data policy
- The `demoProjects` array contains fictional examples only.
- Do not assign a public project a 'stalled' status merely because its status is unknown.
- Do not publish allegations about contractors, public officials or citizens without attributable, corroborated evidence and a review process.
