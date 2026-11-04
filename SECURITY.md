# Security policy

## Status
Early-stage demonstration; **not approved for production or sensitive data**. There is no public security-reporting inbox designated yet. Until one is established, use a private GitHub security advisory if enabled, or contact the repository owner through a non-public channel. Do not publish exploit details in issues.

## Threat model
Risks include cross-tenant leakage, false or defamatory project allegations, location/privacy exposure, malicious uploads, source tampering, prompt injection, credential disclosure, insecure administrative APIs and unauthorized publishing.

## Minimum launch controls
- Supabase Auth or equivalent identity with MFA for administrators.
- Tenant membership checked on every write/read; RLS coverage tested for every tenant table and Storage path.
- Separate public verified views from private drafts; no direct anonymous access to raw reports.
- Server-side validation and authorization; strict upload MIME/size limits, malware scanning and signed access URLs.
- CSRF/XSS protection as applicable, dependency scanning, rate limiting, audit logs and secret rotation.
- Never store precise reporter coordinates or personal contact details in public records.
- AI outputs are untrusted suggestions; no AI-driven publishing or SQL execution without allowlists and human approval.
- Retention, deletion, breach-response and correction procedures before onboarding real users.

## Current SQL caveat
`supabase/schema.sql` is an **initial schema**, not a complete tenancy or authorization implementation. Its public SELECT policy only exposes records flagged verified, but no publication-review workflow is implemented. Apply and review policies in a controlled environment.

## Responsible disclosure
Share reproduction steps, affected versions, impact and minimal proof privately. Do not access data belonging to other users or disrupt services.
