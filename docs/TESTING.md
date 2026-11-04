# Testing and quality assurance

## Current state
No automated test suite or CI workflow has been configured. Do not describe the scaffold as build-verified until `npm run build` is run successfully.

## MVP manual smoke tests
1. Load desktop and mobile widths; verify map and panels render without overflow.
2. Zoom/pan map and click each demo project; correct details appear.
3. Filter by status; map markers and list stay synchronized.
4. Search by county, project name and category; empty states are clear.
5. Toggle project visibility; marker and halo layers disappear/reappear.
6. Enter 'show stalled projects in Machakos'; verify demo filter and honest command notice.
7. Confirm every fictional record is labeled and no data appears as an official claim.
8. Test with blocked map tiles and slow network; record error handling gaps.

## Proposed automated coverage
- Unit: parsers, coordinate validation, status normalization, budget arithmetic.
- Component: map/list selection, filters, keyboard navigation and empty/error states.
- Integration: API pagination, source provenance, tenant-scoped queries.
- Database: RLS cross-tenant denial, anonymous verified-only reads, audit immutability.
- E2E: submission → moderation → publication → correction/retraction.
- Security: malicious file uploads, injection, IDOR, prompt injection, rate limiting.
- Performance: large layers, viewport query limits, tile load and memory.
- Accessibility: screen reader, focus order, contrast, reduced motion.

## CI proposal
On pull requests run install, typecheck/build, lint, unit tests and dependency scan. Add preview deployments and protected-branch review requirements once configured.
