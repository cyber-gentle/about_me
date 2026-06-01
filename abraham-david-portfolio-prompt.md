# Abraham David · Portfolio — MVP Dev Prompt

> **Purpose:** Hand this file to any AI (Claude, Cursor, ChatGPT, GitHub Copilot) or developer to build Abraham David's personal portfolio website from scratch. All design decisions, tech choices, and section specs are defined here.

---

## 1. PROJECT OVERVIEW

Build a **personal developer portfolio website** for **Abraham David · Frontend Developer**.

The site must be:
- **MVP-ready** and production-quality
- Visually cutting-edge with **glassmorphism**, **3D animations**, and **premium UI/UX**
- Fully responsive, accessible, and performant

---

## 2. TECH STACK

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + custom CSS for glassmorphism & 3D |
| Animations | Framer Motion (scroll reveals, transitions, stagger) |
| 3D | Three.js or React Three Fiber (hero background) |
| Icons | Lucide React or React Icons |
| Contact Form | React Hook Form + EmailJS (no backend needed) |
| Deployment | Vercel |

---

## 3. DESIGN SYSTEM

### Color Palette — Midnight Blue + Gold (Premium / Luxury)

```css
--bg-base:        #020818;   /* deep midnight */
--bg-surface:     #0a1628;   /* dark navy */
--glass-fill:     rgba(255, 255, 255, 0.05);
--glass-blur:     backdrop-filter: blur(20px);
--primary:        #C9A84C;   /* gold */
--primary-light:  #F0C96A;   /* light gold */
--text:           #E8EAF0;   /* off-white */
--muted:          #6B7A99;   /* slate */
--border:         rgba(201, 168, 76, 0.2); /* gold-tinted glass border */
```

### Typography

| Role | Font |
|---|---|
| Headings | `Clash Display` or `Space Grotesk` |
| Body | `Inter` or `DM Sans` |
| Code / Accent | `JetBrains Mono` |

### Design Language

- **Glassmorphism cards:** `backdrop-filter: blur(20px)`, subtle gold border, low-opacity background fill
- **Gold glows / halos** on hero name, CTA buttons, and active nav items
- **Gradient text** on name and section headings (gold → light gold)
- **Smooth 60fps animations** — no janky transitions
- **Micro-interactions** on every interactive element (buttons, cards, links)
- **Dark mode only** — the palette is dark-native, no light mode toggle needed

---

## 4. SECTIONS

Build all seven sections in this order:

---

### Section 1 — Hero / Landing

- Full-screen dark background with **Three.js animated particle field** or floating 3D geometric shapes (gold-tinted)
- Large gradient heading: **"Abraham David"**
- Subtitle: **"Frontend Developer"**
- Tagline: *"Building beautiful, fast, and purposeful web experiences."*
- Two CTAs:
  - `View My Work` → gold filled button, scrolls to Projects
  - `Download CV` → ghost/outline button
- Smooth scroll indicator arrow at bottom center
- **Framer Motion stagger animation** on load (name → subtitle → tagline → buttons)

---

### Section 2 — About Me

- Glassmorphism card layout (two columns on desktop, stacked on mobile)
- Short bio paragraph:
  > *"I'm a frontend developer passionate about crafting pixel-perfect interfaces. Currently on a journey from frontend mastery toward full-stack development — building real products along the way."*
- Profile photo placeholder (circular frame, gold border glow)
- Stats row with animated counters:
  - `1+` Years Learning
  - `5+` Projects Built
  - `∞` Cups of Coffee ☕

---

### Section 3 — Skills

- Responsive grid of animated skill cards
- Each card:
  - Glassmorphism surface
  - Technology icon
  - Skill name
  - Gold progress bar (fill % set per skill)
- Cards animate in from below on scroll (Framer Motion `whileInView`)
- **Skill categories and levels:**

| Skill | Category | Level |
|---|---|---|
| HTML | Languages | 85% |
| CSS | Languages | 80% |
| JavaScript | Languages | 70% |
| Go | Languages | 55% |
| React | Frameworks | 65% |
| Next.js | Frameworks | 60% |
| Tailwind CSS | Frameworks | 75% |
| Git & GitHub | Tools | 70% |
| VS Code | Tools | 90% |
| Figma | Tools | 50% |

---

### Section 4 — Projects

- 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each project card:
  - Glassmorphism surface
  - Project thumbnail / screenshot (placeholder image)
  - Project title
  - Short description (1–2 sentences)
  - Tech stack tags (pill badges, gold outline)
  - Two icon buttons: `GitHub ↗` and `Live Demo ↗`
  - **Hover effect:** 3D tilt (CSS perspective transform or `react-tilt`) + gold glow

- **Placeholder projects to include:**

| # | Title | Description | Stack |
|---|---|---|---|
| 1 | ASCII Art Generator | Terminal-style tool that renders text using ASCII banner fonts | Go, CLI |
| 2 | Go Reloaded | Text transformation engine handling formatting tags and punctuation rules | Go |
| 3 | 247 Sparkle Web App | Home services platform with booking, real-time chat, and payments | Next.js, Node.js, PostgreSQL |

---

### Section 5 — Experience / Timeline

- Vertical timeline layout
  - Centered on desktop
  - Left-aligned on mobile
- Gold pulsing dot for each timeline node
- Glassmorphism event cards
- **Entries:**

| Date | Title | Organisation | Detail |
|---|---|---|---|
| 2024 – Present | Frontend Developer Student | 01Edu Learn2Earn | Quest-based programming curriculum covering Go, frontend development, and collaborative projects |
| 2024 – Present | Co-founder | 247 Sparkle Laundry & Cleaning Services | Building a web platform for home services with booking, payments, and real-time features |

---

### Section 6 — Testimonials

- Horizontal scroll carousel (Framer Motion drag-to-scroll)
- Glassmorphism quote cards
- Each card: gold star rating, quote text, name, role/relationship
- **3 placeholder cards** (swap in real testimonials later):

> *"Abraham is a focused and driven developer who picks up concepts fast. Great collaborator on our Go projects."*
> — **Treasure**, Teammate · 01Edu

> *"Always shows up with ideas and energy. One of the most consistent people I've worked with."*
> — **Victor**, Teammate · 01Edu

> *"Gentle brings both technical skill and entrepreneurial thinking to everything he builds."*
> — **Mentor**, 01Edu Platform

---

### Section 7 — Contact Form

- Full glassmorphism card, centered
- Fields:
  - Name (text input)
  - Email (email input)
  - Message (textarea, min 4 rows)
- Input style: gold-outlined, gold glow on focus
- Submit button: gold filled, loading spinner state while sending
- **EmailJS integration** — store Service ID, Template ID, and Public Key in `.env.local`
- Below the form — social links row:
  - GitHub
  - LinkedIn
  - Twitter / X

---

## 5. GLOBAL REQUIREMENTS

### Navbar
- Sticky, top-fixed
- Glassmorphism background (blur + low opacity)
- Logo: initials **`AD`** in gold (left side)
- Nav links: Hero · About · Skills · Projects · Experience · Contact (right side)
- **Active section highlight** via Intersection Observer
- Mobile: hamburger menu with slide-in drawer

### Performance
- Lazy load all images
- Dynamic import for Three.js (SSR-safe, client-side only)
- Next.js `Image` component for all images

### Accessibility
- Semantic HTML throughout (`<section>`, `<nav>`, `<main>`, `<footer>`)
- ARIA labels on icon-only buttons
- Keyboard navigable (tab order, focus rings styled in gold)
- Sufficient colour contrast on all text

### Scroll & Motion
- Smooth scroll behaviour (`scroll-behavior: smooth`)
- Page load: fade in from black (Framer Motion `AnimatePresence`)
- All scroll-reveal animations use `whileInView` with `once: true`

### Custom Scrollbar
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #020818; }
::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }
```

---

## 6. FILE STRUCTURE

```
/app
  layout.tsx          ← fonts, metadata, global providers
  page.tsx            ← assembles all section components

/components
  Navbar.tsx
  Hero.tsx            ← Three.js canvas + text reveal
  About.tsx
  Skills.tsx
  Projects.tsx
  Timeline.tsx
  Testimonials.tsx
  Contact.tsx
  Footer.tsx

/lib
  emailjs.ts          ← EmailJS helper function

/styles
  globals.css         ← CSS variables, glassmorphism utilities, scrollbar

/public
  /images
    profile.jpg       ← profile photo placeholder
    /projects         ← project screenshot placeholders
```

---

## 7. ENVIRONMENT VARIABLES

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 8. COMMANDS TO GET STARTED

```bash
npx create-next-app@latest abraham-portfolio --typescript --tailwind --app
cd abraham-portfolio
npm install framer-motion three @react-three/fiber @react-three/drei react-hook-form @emailjs/browser lucide-react
npm run dev
```

---

## 9. DELIVERABLE CHECKLIST

- [ ] All 7 sections built and populated with placeholder content
- [ ] Glassmorphism applied consistently across cards and navbar
- [ ] Three.js hero background rendering (client-side, no SSR crash)
- [ ] Framer Motion scroll reveals on Skills, Projects, Timeline, Testimonials
- [ ] 3D tilt effect on project cards
- [ ] Contact form wired to EmailJS and tested
- [ ] Fully responsive from 320px to 1440px+
- [ ] Deployed to Vercel with live URL
- [ ] `.env.local` variables configured

---

*Prompt authored for Abraham David · Frontend Developer · Lagos, Nigeria*
*Generated: June 2026*
