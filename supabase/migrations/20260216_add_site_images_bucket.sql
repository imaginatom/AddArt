insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

alter table storage.objects enable row level security;

create policy "Site images are publicly readable"
on storage.objects
for select
using (bucket_id = 'site-images');

create policy "Site images are insertable by admin"
on storage.objects
for insert
with check (bucket_id = 'site-images' and public.is_admin());

create policy "Site images are updatable by admin"
on storage.objects
for update
using (bucket_id = 'site-images' and public.is_admin())
with check (bucket_id = 'site-images' and public.is_admin());

create policy "Site images are deletable by admin"
on storage.objects
for delete
using (bucket_id = 'site-images' and public.is_admin());
