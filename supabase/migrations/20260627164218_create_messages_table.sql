/*
# Create messages table for contact form (single-tenant, no auth)

1. New Tables
- `messages`
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email
  - `message` (text, not null) — the message body
  - `read` (boolean, default false) — whether the owner has read it
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `messages`.
- Allow anyone (anon + authenticated) to INSERT a new message via the contact form.
- No SELECT/UPDATE/DELETE for anon — only the owner (via service role / dashboard) reads and manages messages.
- This is a public contact form: anyone visiting the portfolio can submit a message.

3. Notes
- The portfolio has no sign-in screen, so the frontend uses the anon key.
- INSERT is intentionally open (WITH CHECK true) so visitors can submit messages.
- Reads are restricted to authenticated (the owner via the Supabase dashboard / service role), keeping submitted messages private.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a contact message
DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Only authenticated (owner) can read messages
DROP POLICY IF EXISTS "auth_select_messages" ON messages;
CREATE POLICY "auth_select_messages" ON messages FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_messages" ON messages;
CREATE POLICY "auth_update_messages" ON messages FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_messages" ON messages;
CREATE POLICY "auth_delete_messages" ON messages FOR DELETE
TO authenticated USING (true);
