-- Support public colleague testimonial submissions with admin approval.
-- Existing rows are marked approved so they remain visible after migration;
-- new public submissions must have approved = false until approved in /admin.

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'testimonials'
      and column_name = 'approved'
  ) then
    alter table public.testimonials
      add column approved boolean not null default false;
    update public.testimonials set approved = true;
  end if;
end $$;

grant select, insert on public.testimonials to anon, authenticated;

drop policy if exists "public_read" on public.testimonials;
create policy "public_read" on public.testimonials for select
  to anon, authenticated using (approved or is_admin());

drop policy if exists "anon_insert_testimonials" on public.testimonials;
create policy "anon_insert_testimonials" on public.testimonials for insert
  to anon, authenticated
  with check (
    approved = false
    and length(trim(name)) > 0
    and length(trim(quote)) > 0
  );
