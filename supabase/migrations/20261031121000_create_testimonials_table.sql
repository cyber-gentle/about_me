/*
# Client testimonials (public submit, owner-moderated)

Flow:
  1. A client submits the form on the site -> row inserted with approved = false.
  2. The owner reviews it in the Supabase dashboard (Table editor -> testimonials)
     and flips `approved` to true.
  3. Approved testimonials appear on the site automatically.

Security:
- anon may INSERT, but only unapproved rows (cannot self-approve).
- anon may SELECT only approved rows, and only the public columns
  (email is never readable from the browser).
- No UPDATE / DELETE for anon or authenticated; the owner manages rows via the
  dashboard / service role, which bypasses RLS.
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  role text CHECK (role IS NULL OR char_length(role) <= 120),
  email text NOT NULL CHECK (
    char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  quote text NOT NULL CHECK (char_length(quote) BETWEEN 20 AND 800),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS testimonials_approved_created_idx
  ON testimonials (approved, created_at DESC);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_testimonials" ON testimonials;
CREATE POLICY "anon_insert_testimonials" ON testimonials FOR INSERT
TO anon WITH CHECK (approved = false);

DROP POLICY IF EXISTS "anon_select_approved_testimonials" ON testimonials;
CREATE POLICY "anon_select_approved_testimonials" ON testimonials FOR SELECT
TO anon USING (approved = true);

-- Column-level privileges: hide email (and the approved flag) from the browser.
REVOKE SELECT ON testimonials FROM anon, authenticated;
GRANT SELECT (id, name, role, quote, created_at) ON testimonials TO anon;
REVOKE INSERT ON testimonials FROM anon, authenticated;
GRANT INSERT (name, role, email, quote) ON testimonials TO anon;
