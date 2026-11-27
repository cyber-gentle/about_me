-- Harden is_admin(): the email must match the allowlist AND be a verified
-- email. Without the email_verified check, a Supabase project with
-- "Confirm email" disabled would let anyone sign up with an admin email
-- and gain write access to every content table.

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = any (
    array['info.abdavid@gmail.com']
  )
  and coalesce((auth.jwt() ->> 'email_verified')::boolean, false);
$$;
