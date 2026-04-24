create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  location text not null default '',
  category text not null default 'Uncategorized',
  image_src text not null,
  image_alt text not null default '',
  image_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Projects are readable when published or admin" on public.projects;
create policy "Projects are readable when published or admin"
on public.projects
for select
using (status = 'published' or public.is_admin());

drop policy if exists "Projects insert is admin only" on public.projects;
create policy "Projects insert is admin only"
on public.projects
for insert
with check (public.is_admin());

drop policy if exists "Projects update is admin only" on public.projects;
create policy "Projects update is admin only"
on public.projects
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Projects delete is admin only" on public.projects;
create policy "Projects delete is admin only"
on public.projects
for delete
using (public.is_admin());

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();
