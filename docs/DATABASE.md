# Database specification

## Current database
`supabase/schema.sql` defines only `public.projects` and a PostGIS extension, indexes and a verified-only SELECT policy. It is not applied automatically. The app currently reads `src/data.ts`, not Supabase.

### Current project columns
`id`, `name`, `county`, `constituency`, `ward`, `category`, `status`, `allocated_budget`, `disbursed_amount`, `spent_amount`, `progress_percent`, `location`, `description`, `source_url`, `verification_status`, `last_verified_at`, `created_at`.

## Proposed normalized schema (NOT implemented)
- `organizations(id, name, kind, created_at)`
- `memberships(organization_id, user_id, role, status)`
- `admin_units(id, parent_id, country_code, level, name, code, boundary_version, geom)`
- `projects(id, organization_id?, admin_unit_id, agency_id, title, category, operational_status, verification_status, point, started_at, due_at)`
- `project_status_events(id, project_id, old_status, new_status, evidence_id, reviewer_id, at)`
- `budgets(id, project_id, fiscal_year, allocation, disbursement, expenditure, currency, source_id)`
- `organizations_agencies(id, name, kind)` (avoid collision with tenant organizations)
- `elections(id, election_date, office, boundary_version, source_id)`
- `election_results(id, election_id, admin_unit_id, candidate_id, votes, registered_voters, turnout)`
- `sources(id, publisher, original_url, retrieved_at, content_hash, license, archive_ref)`
- `evidence(id, project_id, source_id, file_ref, captured_at, redaction_status)`
- `reports(id, tenant_id, project_id?, reporter_id?, precise_location_private, allegation, review_state)`
- `review_decisions(id, report_id, reviewer_id, action, reason, at)`
- `audit_events(id, tenant_id, actor_id, action, object_type, object_id, at, metadata)`

These are conceptual table definitions; migrations, constraints and policies must be written and reviewed before use.

## RLS and tenancy
- `tenant_id` or `organization_id` on every private operational table.
- Access only via authenticated membership, checked server-side and in RLS.
- Public read views include only approved fields of verified published records.
- Explicit deny tests for cross-tenant reads, writes, uploads and aggregates.
- Service-role credentials only on trusted servers.
- Consider separate ingestion staging schema with no public access.

## Spatial considerations
Use SRID 4326; GIST indexes; validate coordinate order (longitude, latitude), geographic precision and polygon validity. Store versioned administrative boundaries; never assume old electoral units match today's geography.

## Migration strategy
Use versioned migrations and staging environment; back up before schema changes. Never edit production tables manually without a reviewed migration and rollback plan.
