-- Run this in the Supabase SQL editor to create the tables.
-- Safe to run multiple times.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed boolean not null default false,
  confirm_token text,
  unsubscribe_token text,
  start_date date,
  last_sent_day integer not null default 0,
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  day integer primary key,
  title text not null,
  game text not null,
  type text not null check (type in ('recreate', 'scratch')),
  reference text,
  tips text[] not null default '{}'
);

alter table public.subscribers enable row level security;
alter table public.challenges enable row level security;

drop policy if exists "No public access" on public.subscribers;
create policy "No public access" on public.subscribers
  for all using (false) with check (false);

drop policy if exists "No public access" on public.challenges;
create policy "No public access" on public.challenges
  for all using (false) with check (false);
