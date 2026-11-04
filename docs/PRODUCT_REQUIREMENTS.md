# Sentrix product requirements (PRD)

## Mission
Help authorized political, civic and editorial teams explore geographic public-interest information and track development accountability using transparent, source-backed evidence.

## Personas
- Campaign research analyst: understands historic aggregate electoral results and public development issues.
- Civic accountability investigator: compares approved budgets, disbursements, site observations and official project status.
- Newsroom researcher: verifies claims, finds primary documents and exports evidence summaries.
- Organization administrator: manages workspaces, membership and approvals.
- Public visitor: sees only published, verified records.

## Workspaces
Multi-tenant platform for parties, candidates, campaigns, NGOs, newsrooms and research teams. No organization-specific hardcoding. Each tenant chooses geography, branding and enabled modules.

## Functional requirements
FR-01 Map navigation: world → country → county → constituency → ward, subject to available boundary data.
FR-02 Layers: boundaries, projects, spending, historic elections, aggregate development metrics and reviewed reports.
FR-03 Projects: searchable location, agency, contractor (where public), status, timeline, amounts, documents and evidence.
FR-04 Finance: keep allocation, disbursement, expenditure and commitments distinct; display currency/year and source.
FR-05 Elections: official aggregate results by election, office and administrative unit; provenance and boundary version.
FR-06 Reports: geotagged submissions with consent, private intake, deduplication, review and appeal/correction workflow.
FR-07 Commands: natural-language search translated into approved, explainable read-only operations.
FR-08 Collaboration: tenant roles, assignments, review decisions and audit trail.
FR-09 Exports: source-backed CSV/GeoJSON/PDF summaries subject to access controls.
FR-10 Accessibility: keyboard-operable non-map equivalents, responsive layouts and readable contrast.

## Evidence and publication rules
A record may be 'reported', 'under review', 'verified', 'disputed' or 'retracted'. Status like 'stalled' must have an operational definition, source evidence and last checked date. A missing document is not proof of wrongdoing. Allegations must be labeled as such and offer correction channels.

## Acceptance criteria for first production pilot
- One authorized workspace and verified county/ward geography.
- At least one complete public-project ingestion pipeline with traceable source documents.
- Verified projects visible on map with filters, detail view and citations.
- End-to-end role and tenant-isolation tests.
- Reporter privacy controls, moderation and correction workflow.
- Production deployment, backup and incident runbook.

## Out of scope
Individual-level political persuasion scoring, voter dossiers, inferred political affiliation, covert surveillance, publishing unverified accusations and automated editorial verdicts.
