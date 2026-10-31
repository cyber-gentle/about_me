/*
# Harden the contact-form messages table

1. Security
- Drop the SELECT / UPDATE / DELETE policies granted to `authenticated`.
  Those let ANY signed-in user of the project (anyone can sign up with the
  public anon key if email signups are enabled) read and modify every message.
  The owner reads messages via the Supabase dashboard / service role, which
  bypasses RLS, so no policy is needed for that.
- Restrict INSERT to the `anon` role only and to unread rows.

2. Abuse limits
- Length / format constraints so the public form cannot be used to dump
  arbitrarily large payloads into the database.
*/

DROP POLICY IF EXISTS "auth_select_messages" ON messages;
DROP POLICY IF EXISTS "auth_update_messages" ON messages;
DROP POLICY IF EXISTS "auth_delete_messages" ON messages;

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
TO anon WITH CHECK (read = false);

ALTER TABLE messages
  ADD CONSTRAINT messages_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT messages_email_len CHECK (char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT messages_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT messages_message_len CHECK (char_length(message) BETWEEN 1 AND 5000);
