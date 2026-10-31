import './globals.css';
import type { Metadata } from 'next';
import { site, githubUrl } from '@/lib/site';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const description =
  'Backend Developer specializing in Go, APIs, Web Development, Performance Optimization, and Modern Cloud Applications.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.title}`,
  description,
  keywords: [
    'Backend Developer',
    'Go',
    'Golang',
    'API Development',
    'Cloud',
    'Software Engineer',
    'Portfolio',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${site.name} — ${site.title}`,
    description,
    url: '/',
    siteName: site.name,
    type: 'profile',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Backend Developer`,
    description,
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Backend Developer',
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressRegion: 'Lagos State', addressCountry: 'NG' },
  sameAs: [githubUrl, site.linkedin, site.twitter].filter(Boolean),
  knowsAbout: ['Go', 'API Development', 'Backend Engineering', 'Cloud Computing'],
};

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
