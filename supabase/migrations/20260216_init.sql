create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "Profiles are viewable by owner"
on public.profiles
for select
using (auth.uid() = id);

create policy "Profiles can be created by owner"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Profiles can be updated by owner"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Profiles can be deleted by admin"
on public.profiles
for delete
using (public.is_admin());

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  content_type text not null check (content_type in ('text', 'image', 'list')),
  content jsonb not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Site content is readable by all"
on public.site_content
for select
using (true);

create policy "Site content insert is admin only"
on public.site_content
for insert
with check (public.is_admin());

create policy "Site content update is admin only"
on public.site_content
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Site content delete is admin only"
on public.site_content
for delete
using (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();
