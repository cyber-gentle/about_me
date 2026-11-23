/*
# Admin dashboard content tables

Tables (uuid pk, sort_order for arrangement, created_at):
- tech_stack        (name, short)
- skills            (category, name, level 0-100)
- projects          (title, description, tech[], stars, image, url)
- experience        (entry_type work|education, role, company, period, description, tags[])
- testimonials      (quote, name, role)
- github_repos      (name, description, language, stars, forks)
- about_stats       (label, value, suffix)
- about_pillars     (title, body)
- github_stats      (label, value)
- github_languages  (name, pct, color)
- contact_links     (icon, label, value, href)
- site_settings     (key, value jsonb) -- misc single values (e.g. location)

Security:
- Public (anon) can SELECT everything: the portfolio reads content with the anon key.
- Writes (insert/update/delete) require is_admin(): the authenticated user's email
  must be in ADMIN_EMAILS below. EDIT THIS LIST to match your Supabase auth email.
- Also tightens the messages table: only the admin can read/update/delete messages.
*/

-- =====================================================================
-- ADMIN EMAILS - change this to the email you sign into /admin with
-- =====================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = any (
    array['info.abdavid@gmail.com']
  );
$$;

-- ----------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------
create table if not exists tech_stack (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  level int not null default 50 check (level between 0 and 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tech text[] not null default '{}',
  stars int not null default 0,
  image text not null default '',
  url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null default 'work' check (entry_type in ('work','education')),
  role text not null,
  company text not null default '',
  period text not null default '',
  description text not null default '',
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists github_repos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  language text not null default '',
  stars int not null default 0,
  forks int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists about_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value int not null default 0,
  suffix text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists about_pillars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists github_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null default '0',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists github_languages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pct int not null default 0 check (pct between 0 and 100),
  color text not null default '#4F8BFF',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists contact_links (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'mail',
  label text not null,
  value text not null default '',
  href text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- Policies: public read, admin-only write (loop over content tables)
-- ----------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'tech_stack','skills','projects','experience','testimonials',
    'github_repos','about_stats','about_pillars','github_stats',
    'github_languages','contact_links'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public_read" on %I', t);
    execute format(
      'create policy "public_read" on %I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin_write" on %I', t);
    execute format(
      'create policy "admin_write" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- site_settings: public read, admin write
alter table site_settings enable row level security;
drop policy if exists "public_read_settings" on site_settings;
create policy "public_read_settings" on site_settings for select
  to anon, authenticated using (true);
drop policy if exists "admin_write_settings" on site_settings;
create policy "admin_write_settings" on site_settings for all
  to authenticated using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------
-- Messages table (contact form inbox)
-- ----------------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;

-- Anyone can submit a message via the contact form
drop policy if exists "anon_insert_messages" on messages;
create policy "anon_insert_messages" on messages for insert
  to anon, authenticated with check (true);

-- ----------------------------------------------------------------------
-- Tighten messages reads/updates: admin email only
-- ----------------------------------------------------------------------
drop policy if exists "auth_select_messages" on messages;
create policy "admin_select_messages" on messages for select
  to authenticated using (is_admin());

drop policy if exists "auth_update_messages" on messages;
create policy "admin_update_messages" on messages for update
  to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "auth_delete_messages" on messages;
create policy "admin_delete_messages" on messages for delete
  to authenticated using (is_admin());

-- anon insert for the contact form stays as-is
