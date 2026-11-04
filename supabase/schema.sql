-- Run in Supabase SQL editor. Requires PostGIS.
create extension if not exists postgis with schema extensions;
create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 county text not null,
 constituency text,
 ward text,
 category text not null,
 status text not null check (status in ('proposed','in_progress','completed','delayed','stalled','unknown')),
 allocated_budget numeric(18,2),
 disbursed_amount numeric(18,2),
 spent_amount numeric(18,2),
 progress_percent integer check (progress_percent between 0 and 100),
 location extensions.geography(Point,4326),
 description text,
 source_url text,
 verification_status text not null default 'unverified' check (verification_status in ('unverified','under_review','verified','disputed')),
 last_verified_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists projects_location_idx on public.projects using gist(location);
create index if not exists projects_county_idx on public.projects(county);
alter table public.projects enable row level security;
-- Public reads limited to verified records; writes require authenticated server-side policies.
create policy "Public may read verified projects" on public.projects for select to anon, authenticated using (verification_status = 'verified');
