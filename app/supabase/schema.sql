-- TrueNest — leads table (lead-capture slice)
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  phone        text,
  project      text,           -- e.g. 'Retreat 76', 'Hills & Skies'
  message      text,
  source       text,           -- which page/form the lead came from
  intent       text default 'inquiry',  -- inquiry | brochure | callback
  status       text not null default 'new'  -- new | contacted | closed
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Row Level Security: lock the table down. No anon/public access at all.
-- Inserts and reads happen ONLY through server-side code using the
-- service_role key, which bypasses RLS. The browser never touches this table.
alter table public.leads enable row level security;

-- (Intentionally no policies: with RLS enabled and no policies, the anon
--  and authenticated roles get zero access. service_role still bypasses RLS.)
