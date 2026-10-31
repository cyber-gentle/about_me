/*
# Admin console: content tables, admin role, storage, replies

After running this migration, make yourself the admin:
  1. Supabase dashboard -> Authentication -> Users -> "Add user"
     (email + password, tick "Auto confirm").
  2. SQL editor:
       insert into admin_users (user_id)
       select id from auth.users where email = 'you@example.com';

Security model: every write policy checks public.is_admin(). The admin UI is
just a client; the database is what enforces access.
*/

-- ------------------------------------------------------------------
-- Admin role
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- No policies: the table is invisible to the browser.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ------------------------------------------------------------------
-- Site settings (single row)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  available boolean NOT NULL DEFAULT true,
  availability_text text NOT NULL DEFAULT 'Available for new opportunities',
  email text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  github text,
  linkedin text,
  twitter text,
  resume_url text,
  about_bio text NOT NULL DEFAULT '',
  about_passion text NOT NULL DEFAULT '',
  about_journey text NOT NULL DEFAULT '',
  about_focus text NOT NULL DEFAULT '',
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------
-- Content tables
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '',
  tech text[] NOT NULL DEFAULT '{}',
  image_url text,
  demo_url text,
  repo_url text,
  accent text NOT NULL DEFAULT '#4F8BFF',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  icon text NOT NULL DEFAULT 'code',
  color text NOT NULL DEFAULT '#4F8BFF',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES skill_categories (id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  level int NOT NULL DEFAULT 50 CHECK (level BETWEEN 0 AND 100),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS skills_category_idx ON skills (category_id, sort_order);

CREATE TABLE IF NOT EXISTS tech_stack (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  short text NOT NULL CHECK (char_length(short) BETWEEN 1 AND 5),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'work' CHECK (kind IN ('work', 'education')),
  role text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  accent text NOT NULL DEFAULT '#4F8BFF',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages (id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS message_replies_message_idx ON message_replies (message_id, sent_at);

-- ------------------------------------------------------------------
-- RLS: public read for content, admin-only writes
-- ------------------------------------------------------------------
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['site_settings', 'skill_categories', 'skills', 'tech_stack', 'experiences'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "public_read" ON %I', t);
    EXECUTE format('CREATE POLICY "public_read" ON %I FOR SELECT TO anon, authenticated USING (true)', t);
  END LOOP;

  FOREACH t IN ARRAY ARRAY['site_settings', 'projects', 'skill_categories', 'skills', 'tech_stack', 'experiences', 'message_replies'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin_all" ON %I', t);
    EXECUTE format(
      'CREATE POLICY "admin_all" ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "public_read_published" ON projects;
CREATE POLICY "public_read_published" ON projects FOR SELECT
TO anon, authenticated USING (published = true);

-- Messages: admin can read / mark read / delete
DROP POLICY IF EXISTS "admin_select_messages" ON messages;
CREATE POLICY "admin_select_messages" ON messages FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin_update_messages" ON messages;
CREATE POLICY "admin_update_messages" ON messages FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_messages" ON messages;
CREATE POLICY "admin_delete_messages" ON messages FOR DELETE TO authenticated USING (public.is_admin());

-- Testimonials: admin moderates; public may filter on `approved`
GRANT SELECT (approved) ON testimonials TO anon;
GRANT SELECT, UPDATE, DELETE ON testimonials TO authenticated;
DROP POLICY IF EXISTS "admin_select_testimonials" ON testimonials;
CREATE POLICY "admin_select_testimonials" ON testimonials FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE TO authenticated USING (public.is_admin());

-- ------------------------------------------------------------------
-- Storage bucket for project images (public read, admin write)
-- ------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio', 'portfolio', true, 5242880,
        ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "portfolio_admin_insert" ON storage.objects;
CREATE POLICY "portfolio_admin_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
DROP POLICY IF EXISTS "portfolio_admin_update" ON storage.objects;
CREATE POLICY "portfolio_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());
DROP POLICY IF EXISTS "portfolio_admin_delete" ON storage.objects;
CREATE POLICY "portfolio_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());

-- ------------------------------------------------------------------
-- Seed with the content currently on the site (edit it in /admin)
-- ------------------------------------------------------------------
INSERT INTO site_settings (id, email, location, github, about_bio, about_passion, about_journey, about_focus, stats)
VALUES (
  1,
  'info.abdavid@gmail.com',
  'Lagos State, Nigeria — Remote Worldwide',
  'cyber-gentle',
  'I am a backend-focused software engineer who loves crafting reliable, high-performance systems. From distributed APIs to data pipelines, I turn complex problems into clean, maintainable code.',
  'I am obsessed with performance, developer experience, and elegant architecture. Every millisecond matters, and so does every line of code that ships to production.',
  'Started with scripting and automation, fell in love with Go and distributed systems, and have been building cloud-native applications and scalable APIs ever since.',
  'Deepening my expertise in observability, event-driven architecture, and edge computing.',
  '[{"label":"Years Learning","value":2,"suffix":"+"},{"label":"Projects Built","value":8,"suffix":""},{"label":"GitHub Contributions","value":2300,"suffix":"+"},{"label":"Technologies","value":24,"suffix":"+"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (title, description, tech, image_url, accent, featured, sort_order)
SELECT * FROM (VALUES
  ('Distributed API Gateway', 'A high-throughput API gateway built in Go with rate limiting, circuit breaking, and dynamic routing.', ARRAY['Go','Redis','gRPC','Docker'], 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=900', '#4F8BFF', true, 0),
  ('Realtime Analytics Pipeline', 'Event-driven data pipeline with stream processing and live dashboards.', ARRAY['Go','Kafka','PostgreSQL','Grafana'], 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=900', '#8A5CFF', false, 1),
  ('Cloud-Native Task Queue', 'Reliable background job system with retries, priorities, and dead-letter queues. Powered by Go and Redis.', ARRAY['Go','Redis','Kubernetes','Prometheus'], 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=900', '#7FE7FF', false, 2),
  ('Developer Portfolio Engine', 'A headless CMS for developer portfolios with markdown content, instant previews, and edge-deployed rendering.', ARRAY['Next.js','TypeScript','Supabase','Tailwind'], 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=900', '#4F8BFF', false, 3),
  ('Observability Toolkit', 'OpenTelemetry-based tracing and metrics toolkit for Go services with one-line instrumentation and dashboards.', ARRAY['Go','OpenTelemetry','Grafana','Loki'], 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=900', '#8A5CFF', true, 4),
  ('Auth Microservice', 'JWT and OAuth2 authentication service with refresh tokens, RBAC, and audit logging.', ARRAY['Go','PostgreSQL','JWT','Docker'], 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=900', '#7FE7FF', false, 5)
) AS v(title, description, tech, image_url, accent, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects);

INSERT INTO skill_categories (name, icon, color, sort_order)
SELECT * FROM (VALUES
  ('Backend', 'server', '#4F8BFF', 0),
  ('Frontend', 'layout', '#8A5CFF', 1),
  ('Databases', 'database', '#7FE7FF', 2),
  ('Cloud', 'cloud', '#4F8BFF', 3),
  ('Tools', 'wrench', '#8A5CFF', 4),
  ('Languages', 'code', '#7FE7FF', 5)
) AS v(name, icon, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skill_categories);

INSERT INTO skills (category_id, name, level, sort_order)
SELECT c.id, v.name, v.level, v.sort_order
FROM (VALUES
  ('Backend', 'Go (Golang)', 95, 0), ('Backend', 'REST APIs', 92, 1), ('Backend', 'gRPC', 85, 2), ('Backend', 'Microservices', 88, 3),
  ('Frontend', 'React / Next.js', 84, 0), ('Frontend', 'TypeScript', 86, 1), ('Frontend', 'Tailwind CSS', 90, 2), ('Frontend', 'Framer Motion', 78, 3),
  ('Databases', 'PostgreSQL', 90, 0), ('Databases', 'MySQL', 88, 1), ('Databases', 'Redis', 82, 2), ('Databases', 'MongoDB', 75, 3),
  ('Cloud', 'Docker', 90, 0), ('Cloud', 'Kubernetes', 78, 1), ('Cloud', 'AWS', 82, 2), ('Cloud', 'CI/CD', 85, 3),
  ('Tools', 'Git / GitHub', 94, 0), ('Tools', 'Linux', 88, 1), ('Tools', 'VS Code', 92, 2), ('Tools', 'Postman', 90, 3),
  ('Languages', 'Go', 95, 0), ('Languages', 'TypeScript', 86, 1), ('Languages', 'JavaScript', 88, 2), ('Languages', 'Python', 78, 3)
) AS v(category, name, level, sort_order)
JOIN skill_categories c ON c.name = v.category
WHERE NOT EXISTS (SELECT 1 FROM skills);

INSERT INTO tech_stack (name, short, sort_order)
SELECT * FROM (VALUES
  ('Go', 'Go', 0), ('JavaScript', 'JS', 1), ('TypeScript', 'TS', 2), ('HTML', 'HTML', 3), ('CSS', 'CSS', 4),
  ('Git', 'Git', 5), ('GitHub', 'GH', 6), ('Docker', 'Dkr', 7), ('Linux', 'Linux', 8), ('MySQL', 'SQL', 9),
  ('PostgreSQL', 'PG', 10), ('REST API', 'API', 11), ('JSON', 'JSON', 12), ('VS Code', 'VS', 13)
) AS v(name, short, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM tech_stack);

-- NOTE: placeholder entries from the original template — replace them in /admin.
INSERT INTO experiences (kind, role, company, period, description, tags, accent, sort_order)
SELECT * FROM (VALUES
  ('work', 'Senior Backend Engineer', 'Nebula Cloud', '2023 — Present', 'Leading the design of distributed services. Built the core API gateway and observability platform in Go.', ARRAY['Go','Kubernetes','gRPC','AWS'], '#4F8BFF', 0),
  ('work', 'Backend Engineer', 'Quantum Labs', '2021 — 2023', 'Designed and shipped event-driven microservices, real-time data pipelines, and internal developer tooling.', ARRAY['Go','Kafka','PostgreSQL','Docker'], '#8A5CFF', 1),
  ('work', 'Software Engineer', 'ByteForge', '2019 — 2021', 'Built REST APIs and internal dashboards. Introduced CI/CD pipelines and automated testing.', ARRAY['Go','React','MySQL','CI/CD'], '#7FE7FF', 2),
  ('education', 'B.Sc. Computer Science', 'State University', '2015 — 2019', 'Focused on distributed systems, algorithms, and operating systems.', ARRAY['Algorithms','Systems','OS','C++'], '#4F8BFF', 3)
) AS v(kind, role, company, period, description, tags, accent, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM experiences);
