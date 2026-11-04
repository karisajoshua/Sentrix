# Proposed API contract (design only)

**No endpoints below currently exist.** The current UI uses local fixtures. Use HTTPS, JSON, pagination, explicit versioning (`/api/v1`), standard HTTP errors and request IDs.

## Public endpoints (planned)
- `GET /api/v1/areas?level=county&parent_id=...` → `{items:[{id,name,code,level}],next_cursor}`
- `GET /api/v1/projects?bbox=minLng,minLat,maxLng,maxLat&status=stalled&limit=50&cursor=...` → `{items:[ProjectSummary],next_cursor}`
- `GET /api/v1/projects/:id` → `{project,evidence,source_refs,verified_at}`
- `GET /api/v1/aggregates/projects?area_id=...&group_by=status` → aggregated counts with provenance.
- `GET /api/v1/elections/:id/results?area_id=...` → official aggregate results with source metadata.

## Authenticated endpoints (planned)
- `POST /api/v1/reports` → submit report for private moderation; requires consent and abuse controls.
- `POST /api/v1/reviews/:id/decisions` → reviewer-only action; immutable audit event.
- `POST /api/v1/commands/interpret` → typed read-only query plan, never arbitrary SQL.
- `GET /api/v1/workspaces/:id/... ` → tenant-scoped resources.

## Project summary example (fictional)
```json
{"id":"demo-1","name":"Example: School Classroom Block","status":"stalled","coordinates":[37.2634,-1.5177],"verification_status":"unverified","source_refs":[],"is_demo":true}
```

## Validation and errors
- Bounding boxes and pagination limits mandatory for bulk map queries.
- Return `400` invalid inputs, `401` unauthenticated, `403` forbidden, `404` absent, `409` review conflict, `429` rate limited.
- Error shape: `{"error":{"code":"INVALID_BBOX","message":"Invalid bounds","request_id":"..."}}`.
- Use idempotency keys for submissions; never leak reporter details or private workspace data.
- Version breaking changes; document deprecations.
