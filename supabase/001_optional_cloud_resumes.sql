-- Future opt-in cloud sync only. V1 never connects to Supabase.
begin;
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 120),
  schema_version integer not null default 1 check (schema_version = 1),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 1000000),
  updated_at timestamptz not null default now()
);
create index resumes_owner_updated_idx on public.resumes(owner_id,updated_at desc);
alter table public.resumes enable row level security;
revoke all on public.resumes from anon, public, authenticated;
grant select, insert, update, delete on public.resumes to authenticated;
create policy "Owners manage their resumes" on public.resumes for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
commit;
