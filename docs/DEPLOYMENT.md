# Deployment guide

## Local development
Node.js 20+; `npm install`, `cp .env.example .env`, `npm run dev`.
Build: `npm run build`; preview: `npm run preview`.

## Vercel (planned setup; not deployed)
1. Import `karisajoshua/Sentrix` into Vercel.
2. Framework preset: Vite; build command `npm run build`; output directory `dist`.
3. Add only public environment variables with the `VITE_` prefix.
4. Deploy preview; test map tiles, project interactions, responsiveness and console errors.
5. Configure custom domain, HTTPS, monitoring and rollback once validated.

## Supabase (not connected)
1. Create separate development/staging/production projects.
2. Review `supabase/schema.sql` and apply to development using SQL editor or migrations.
3. Set up Auth, RLS, Storage and review workflow **before** storing real data.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only when client integration exists.
5. Never expose `service_role` or private API credentials in browser environment variables.

## Map style
`VITE_MAP_STYLE_URL` can point to a licensed MapLibre-compatible style JSON. The default uses OSM raster tiles and is not a production-grade tile arrangement. Validate provider terms and attribution.

## Release checklist
Successful build; authenticated tenant tests; RLS checks; security headers; dependency audit; source attribution; accessibility and mobile checks; monitoring; database backups; data correction and incident procedures. CI and automated tests are not implemented yet.
