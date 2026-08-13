-- LinkOrganizer schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query) once per project.

create extension if not exists "pgcrypto";

create table if not exists niches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  niche_id uuid not null references niches(id) on delete cascade,
  title text not null,
  url text not null,
  notes text,
  status text not null default 'active' check (status in ('active', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists links_niche_id_idx on links(niche_id);
create index if not exists links_status_idx on links(status);

-- Row Level Security
--
-- TRADEOFF: This app has no authentication (single shared workspace, personal
-- tool). The policies below allow the public "anon" key to read and write
-- freely on both tables -- there is no per-user restriction at all. Anyone
-- who obtains your anon key (e.g. from the deployed app's client bundle,
-- since NEXT_PUBLIC_ vars are exposed to the browser) can read, insert,
-- update, and delete all data. That is acceptable ONLY because this is a
-- private personal tool with no sensitive data. Do NOT reuse this policy
-- pattern for an app with real user data or secrets.

alter table niches enable row level security;
alter table links enable row level security;

create policy "Allow anon full access to niches"
  on niches
  for all
  to anon
  using (true)
  with check (true);

create policy "Allow anon full access to links"
  on links
  for all
  to anon
  using (true)
  with check (true);
