# Contributing to Sentrix

Sentrix is currently proprietary. External contributions require prior written authorization; a pull request does not grant redistribution rights.

## Development workflow
1. Create an issue describing the problem, expected behavior and acceptance criteria.
2. Branch from `main` as `feat/<topic>`, `fix/<topic>`, or `docs/<topic>`.
3. Run `npm install`, `npm run build`, and manually test map interactions.
4. Open a pull request with screenshots for UI changes, affected data schemas, privacy/security impact, test notes and rollback plan.
5. Require at least one authorized review before merge; never commit secrets or personal citizen records.

## Engineering standards
- TypeScript strict mode; explicit domain types.
- Keep fictional fixture data clearly labeled and isolated from verified records.
- Use parameterized database operations; validate coordinates, budgets and status enums.
- Database changes need versioned migrations and documented RLS behavior.
- Include accessible labels, mobile behavior and failure/empty states.
- Public claims require source URL, retrieval date and verification status.

## Commit conventions
Prefer `feat:`, `fix:`, `docs:`, `test:`, `chore:` prefixes.

## Reporting
Security concerns: see SECURITY.md. Corrections to public political/project data must go through the evidence review process, not a silent edit.
