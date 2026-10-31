# Abraham David — Portfolio

Personal portfolio of **Abraham David**, backend developer (Go, APIs, cloud).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · React Three Fiber · Supabase · Vercel

## Features

- Interactive 3D hero (React Three Fiber). It pauses when off-screen and is skipped when the visitor prefers reduced motion.
- Live GitHub stats, top repositories and contribution graph, pulled from the public GitHub API.
- A contact form that stores messages in Supabase, with row-level security (RLS) and spam protection.
- **Client testimonials:** visitors submit a testimonial, the owner approves it, and it then appears on the site.
- Accessibility: reduced-motion support, a skip link, semantic anchors, ARIA live form status and WCAG AA text contrast.
- SEO: Open Graph image, Person JSON-LD, sitemap, robots.txt and a canonical URL.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Deployed URL (canonical links, sitemap, OG) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public; RLS protects the data) |
| `RESEND_API_KEY` | *(optional)* [Resend](https://resend.com) API key, which enables replying to messages from the admin |
| `RESEND_FROM` | *(optional)* Sender, e.g. `Abraham David <hello@yourdomain.com>` (domain verified in Resend) |
| `REPLY_TO_EMAIL` | *(optional)* Where client responses go (defaults to the email in `lib/site.ts`) |

## Admin console (`/admin`)

Everything on the site is managed here: projects (with image upload), skill categories and percentages, the tech stack, the experience timeline, testimonial moderation, contact messages (read, reply, delete) and site settings (availability badge, links, résumé, About text, stats).

**One-time setup**

1. Run all the migrations (see *Database* below).
2. In Supabase → **Authentication → Users → Add user**, create your account with "Auto confirm" ticked.
3. In the SQL editor, make that account the admin:
   ```sql
   insert into admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
4. Sign in at `/admin/login`.

Access is enforced by the database, not the UI: every write policy checks `is_admin()`, so other accounts can't change anything even if they reach the admin pages. Saving content refreshes the public page immediately.

Personal details and social links live in [`lib/site.ts`](lib/site.ts).

## Database

Apply the SQL files in [`supabase/migrations`](supabase/migrations) in order, either with `supabase db push` or by pasting them into the SQL editor.

**Recommended:** turn off public sign-ups in *Authentication → Providers → Email*. The site never needs user accounts.

### Moderating testimonials

New submissions arrive with `approved = false`. To publish one, open **Table editor → testimonials** in the Supabase dashboard and set `approved` to `true`. Visitors' emails are never readable from the browser.

### Contact messages

Messages land in the `messages` table. To get an email for each new one, add a Database Webhook on `INSERT` that calls an email service (for example a Supabase Edge Function that uses Resend).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (lint and type errors fail the build) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Deployment

Deployed on **Vercel**. Import the repo (the framework preset is detected automatically), then add the environment variables above under *Project → Settings → Environment Variables*. Set `NEXT_PUBLIC_SITE_URL` to your production domain, e.g. `https://yourname.vercel.app`.
