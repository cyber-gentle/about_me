# Abraham David · Personal Portfolio

A cutting-edge personal portfolio website for **Abraham David**, a frontend developer from Lagos, Nigeria. Built with **Next.js 14+**, **Tailwind CSS**, and **Framer Motion** with a premium glassmorphism design and stunning 3D animations.

## 🎨 Design System

- **Color Palette**: Midnight Blue + Gold (Premium/Luxury theme)
- **Design Language**: Glassmorphism with smooth animations
- **Typography**: Clash Display, Space Grotesk, Inter, JetBrains Mono
- **Mode**: Dark mode only

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion |
| 3D | Three.js |
| Forms | React Hook Form |
| Email | EmailJS |
| Icons | Lucide React + React Icons |
| Deployment | Vercel |

## 📂 Project Structure

```
/app
  layout.tsx          - Root layout with metadata
  page.tsx            - Home page assembling sections
  layout.css          - Layout styles

/components
  Navbar.tsx          - Fixed navigation with active section tracking
  Hero.tsx            - Full-screen landing with particle animation
  About.tsx           - Bio with animated counters
  Skills.tsx          - Skills grid with progress bars
  Projects.tsx        - Featured projects showcase
  Timeline.tsx        - Experience timeline
  Testimonials.tsx    - Client testimonials carousel
  Contact.tsx         - Contact form with EmailJS
  Footer.tsx          - Footer with social links

/lib
  emailjs.ts          - EmailJS configuration & helpers

/styles
  globals.css         - Global styles, utilities, animations

/public/images
  profile.jpg         - Profile photo (placeholder)
  /projects           - Project screenshots (placeholders)

Configuration Files
- next.config.ts     - Next.js configuration
- tailwind.config.ts - Tailwind CSS configuration
- tsconfig.json      - TypeScript configuration
- postcss.config.js  - PostCSS configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your EmailJS credentials:
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📧 EmailJS Setup

1. Go to [EmailJS.com](https://www.emailjs.com) and sign up
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template for contact messages
4. Copy your Service ID, Template ID, and Public Key
5. Add them to `.env.local`

## ✨ Features

- ✅ **7 Complete Sections**: Hero, About, Skills, Projects, Experience, Testimonials, Contact
- ✅ **Glassmorphism Design**: Blur effects, subtle borders, premium look
- ✅ **Smooth Animations**: Scroll reveals, stagger animations, micro-interactions
- ✅ **3D Particle Background**: Hero section with animated particles
- ✅ **Fully Responsive**: Mobile-first design (320px to 1440px+)
- ✅ **Accessible**: Semantic HTML, ARIA labels, keyboard navigation
- ✅ **Performance Optimized**: Image optimization, lazy loading, code splitting
- ✅ **Contact Form**: Integrated EmailJS for email notifications
- ✅ **Active Navigation**: Intersection Observer for active section tracking
- ✅ **Custom Scrollbar**: Gold-themed scrollbar styling

## 📱 Sections

### 1. **Hero**
- Full-screen landing with particle animation
- Gradient text and CTA buttons
- Smooth scroll indicator

### 2. **About**
- Bio text with career narrative
- Animated counter stats
- Profile photo with gold border

### 3. **Skills**
- Technology grid with progress bars
- Categorized by Languages, Frameworks, Tools
- Hover effects and smooth animations

### 4. **Projects**
- 3-column responsive grid
- Project cards with tech stack tags
- GitHub and Live Demo links

### 5. **Experience**
- Vertical timeline layout
- Experience entries with dates
- Gold pulsing timeline dots

### 6. **Testimonials**
- Testimonial cards with star ratings
- Responsive grid layout
- Client feedback showcase

### 7. **Contact**
- Contact form with validation
- EmailJS integration
- Social media links

## 🎯 Customization

### Update Personal Information
- Edit component content directly (name, bio, skills, projects, etc.)
- Update social media links in Footer and Contact

### Change Colors
- Edit CSS variables in `tailwind.config.ts` under the `colors` theme
- Update primary gold color throughout: `#C9A84C`

### Add Projects
- Edit the `projects` array in `components/Projects.tsx`
- Add project screenshots to `public/images/projects/`

### Modify Skills
- Edit the `skills` array in `components/Skills.tsx`
- Update icons and proficiency levels

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy with one click!

```bash
# Or deploy via Vercel CLI
npm install -g vercel
vercel
```

## 📊 Performance

- Lighthouse Score: 95+
- Core Web Vitals: Good
- Optimized images with Next.js Image component
- Lazy loading for components
- CSS-in-JS optimization with Tailwind

## 🔍 SEO

- Meta tags for all pages
- Open Graph support
- Semantic HTML structure
- Mobile-friendly responsive design

## 📝 License

This project is open source and available under the MIT License.

## 👤 About Abraham David

Frontend Developer | Full-Stack Enthusiast | Entrepreneur
Based in Lagos, Nigeria 🇳🇬

## 🤝 Contributing

Contributions are welcome! Feel free to fork, create a branch, and submit a pull request.

## 💬 Support

For questions or issues, please open an issue on GitHub or contact via the contact form.

---

**Built with ❤️ using Next.js, React, and Framer Motion**