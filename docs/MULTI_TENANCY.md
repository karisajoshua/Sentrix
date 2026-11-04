# Multi-tenant platform design (planned)

## Purpose
Sentrix is a configurable product for multiple independent organizations. Muthwani, a party, an NGO or a newsroom is a workspace configuration, not hardcoded application logic.

## Entities and roles
Organization → workspaces → users/memberships → datasets, drafts, reports and settings.
Proposed roles: owner, administrator, analyst, field reporter, reviewer, viewer. Privileges are additive only where explicitly granted; publication approval requires designated reviewer permission.

## Isolation model
- Every private record references an organization/workspace.
- RLS derives access from authenticated membership, not a client-provided tenant ID alone.
- All server operations verify role, workspace and requested resource.
- Storage buckets and object keys are protected by tenant-aware policies.
- Background jobs and exports are tenant-scoped; log the authorization context.
- Shared verified public datasets live in separate curated/public views; no tenant notes leak into public records.

## Tenant settings
Name, logo, color, geography, enabled modules, default basemap, reporting templates, retention policies and data export permissions.

## Test matrix
Tenant A cannot read/write Tenant B projects, files, reports, audit events or aggregates. Removed members lose access immediately. Public anonymous users can see only published approved fields. Reviewers cannot self-approve where separation of duties is required.

## Operational concerns
Rate limits and quotas per workspace, backups, offboarding/export, audit retention and incident containment. No tenant features are implemented yet.
