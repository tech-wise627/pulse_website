-- Fostride Pulse dashboard — Phase 1 migration
-- Run this once in the Supabase SQL Editor for the Pulse project.

-- Link one Supabase Auth user to one client (one login per client).
alter table public.clients
  add column if not exists user_id uuid unique references auth.users(id);

-- Row Level Security: a logged-in client can only see their own client row,
-- their own installations, and readings for pulses installed at their sites.
alter table public.clients enable row level security;
alter table public.installations enable row level security;
alter table public.readings enable row level security;

drop policy if exists "own client row" on public.clients;
create policy "own client row" on public.clients
  for select
  using (user_id = auth.uid());

drop policy if exists "own installations" on public.installations;
create policy "own installations" on public.installations
  for select
  using (
    client_id in (
      select id from public.clients where user_id = auth.uid()
    )
  );

drop policy if exists "own readings" on public.readings;
create policy "own readings" on public.readings
  for select
  using (
    pulse_id in (
      select i.pulse_id
      from public.installations i
      join public.clients c on c.id = i.client_id
      where c.user_id = auth.uid()
    )
  );

-- Manual step after running this file: create a real login for each client.
-- 1. Supabase Dashboard -> Authentication -> Users -> Add user (email + password).
-- 2. update public.clients set user_id = '<the new auth user's id>' where id = '<client id>';
