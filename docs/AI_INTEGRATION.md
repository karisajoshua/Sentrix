# AI command center design

## Current behavior
The app has a local keyword parser: recognizes a county name present in demo fixtures and words such as 'stalled' or 'completed'. It is **not AI** and does not call a language model.

## Target architecture
User command → authentication/tenant scope → intent classification → strict JSON query plan → schema validation → authorization → parameterized read-only query → sourced results → map layer update + human-readable explanation.

## Allowed intents (examples)
`find_projects`, `summarize_budget`, `compare_areas`, `show_election_results`, `toggle_layer`, `explain_source`.
Example plan:
```json
{"intent":"find_projects","filters":{"county_code":"KE-022","status":"stalled"},"limit":50,"require_verified":true}
```
The county code above is illustrative; production must validate against canonical administrative identifiers.

## Controls
- No model-generated raw SQL, arbitrary URL fetching, permission escalation or direct publish actions.
- Tool arguments are validated against allowlists and bounded query complexity.
- Retrieval documents are untrusted; ignore instructions embedded in source material.
- Results carry source IDs, dates, data freshness, uncertainty and record counts.
- Ask for clarification when a place name is ambiguous or data is missing.
- Sensitive political attributes of individuals and voter-level persuasion targeting are out of scope.
- Log command intent and execution metadata with privacy-conscious retention.

## Acceptance tests
Prompt injection does not alter permissions; requests for other tenants return forbidden; hallucinated sources never appear; ambiguous queries request clarification; unavailable datasets return explicit limitations.
