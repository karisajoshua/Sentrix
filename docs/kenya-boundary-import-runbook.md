# Kenya geographic boundaries: controlled import

## Current status
The Sentrix database has zero published boundaries. The staging workflow is manually triggered and has **not** been run or validated end to end. The ArcGIS endpoint is a third-party data source, not automatically authoritative for electoral boundaries. Confirm its provenance, vintage, licensing, and correspondence with current IEBC boundaries before publication.

## Run
1. Configure GitHub Actions repository secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never commit the service-role key.
2. Trigger **Stage Kenya ward boundaries** under GitHub Actions. This invokes `scripts/stage_kenya_wards.py` and writes only to `geographic_boundary_staging`.
3. Inspect the run logs and imported `geographic_data_imports` record. Verify source feature counts, names, unique codes, and sample polygons.
4. With a privileged database connection, execute `select public.validate_geographic_import('<import_uuid>');` and `select public.geographic_import_readiness('<import_uuid>');`.
5. Ward and constituency records require **verified parent codes**. The initial importer does not yet resolve parent codes, so readiness must remain false for wards until hierarchy is reconciled.
6. Compare against official IEBC county, constituency, and ward lists. Reject invalid, duplicated, outdated, or misassigned features.
7. Publish through a separately reviewed promotion migration that writes `countries`, `administrative_areas`, and `geographic_boundaries` transactionally. **No automatic promotion is enabled.**

## Quality gates
- Feature source and license confirmed
- Kenya extent, geometry validity, topology and CRS checked
- Each ward linked to the correct constituency; each constituency linked to its county
- No duplicate official codes in the same country/level
- Official boundary counts and names reconciled
- Project locations and project verification statuses remain separate from boundary validation
- Live map performance and RLS tested after publication

## Notes
The current public `published_boundaries` is a view, not a table. Insert into the underlying `administrative_areas` and `geographic_boundaries` tables when publishing.
