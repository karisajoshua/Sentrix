# Sentrix — Political Intelligence & Development Accountability

**Status:** early MVP; not production-ready. **Owner:** Texcortech Systems. **License:** proprietary; see NOTICE.md.

Sentrix is a configurable, multi-tenant geospatial intelligence platform for political organizations, candidates, civic accountability teams, researchers and newsrooms. Its central interface is a map of public projects, political geography, historical election statistics and source-backed government expenditure.

> **Important:** Current map points and budgets are fictional demonstrations. The current app uses OpenStreetMap raster tiles, not satellite imagery. AI, authentication, multi-tenancy, electoral layers and real public datasets are roadmap items, not shipped capabilities.

## Quick start
Prerequisites: Node.js 20+ and npm.

```bash
git clone https://github.com/karisajoshua/Sentrix.git
cd Sentrix
npm install
cp .env.example .env
npm run dev
```

Open the local address shown by Vite. `npm run build` compiles TypeScript and produces `dist/`. Environment values are optional for the demo; do not put service-role credentials in `VITE_*` variables.

## Currently implemented
- React 18 + TypeScript + Vite dark dashboard
- MapLibre GL JS map, navigation, clickable fictional project points
- Project list, status filters, county/name search, detail panel
- Deterministic keyword command parser (not an LLM)
- Initial Supabase/PostGIS SQL schema (not connected to the UI)
- deck.gl installed as a dependency (not yet used)

## Documentation
| Topic | File |
|---|---|
| Architecture and current-vs-target design | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Product vision, personas, requirements | [docs/PRODUCT_REQUIREMENTS.md](docs/PRODUCT_REQUIREMENTS.md) |
| Module inventory | [docs/MODULES.md](docs/MODULES.md) |
| Database and RLS | [docs/DATABASE.md](docs/DATABASE.md) |
| Proposed API contracts | [docs/API.md](docs/API.md) |
| Kenya data sources and evidence | [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) |
| Tenant isolation | [docs/MULTI_TENANCY.md](docs/MULTI_TENANCY.md) |
| Map, drilldown and layers | [docs/GEOSPATIAL.md](docs/GEOSPATIAL.md) |
| AI command design | [docs/AI_INTEGRATION.md](docs/AI_INTEGRATION.md) |
| Deployment | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Testing and quality gates | [docs/TESTING.md](docs/TESTING.md) |
| Delivery phases | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Contributions | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Security | [SECURITY.md](SECURITY.md) |
| Change history | [CHANGELOG.md](CHANGELOG.md) |

## Non-goals for the MVP
No claims of verified government wrongdoing, no individual voter targeting, no private political profiling, and no production handling of sensitive citizen submissions.

## Contributing and permissions
See CONTRIBUTING.md and NOTICE.md. The public visibility of this repository does not grant an open-source license.
