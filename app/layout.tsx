import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ContentProvider } from '@/components/providers/content-provider';

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

export const metadata: Metadata = {
  title: 'Abraham David — Backend Developer & Software Engineer',
  description:
    'Backend Developer specializing in Go, APIs, Web Development, Performance Optimization, and Modern Cloud Applications. Building fast, scalable, and beautiful software experiences.',
  keywords: [
    'Backend Developer',
    'Go',
    'Golang',
    'API Development',
    'Cloud',
    'Software Engineer',
    'Portfolio',
  ],
  authors: [{ name: ' Abraham David' }],
  openGraph: {
    title: 'Abraham David — Backend Developer & Software Engineer',
    description:
      'Building fast, scalable, and beautiful software experiences with Go, APIs, and modern cloud applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abraham David — Backend Developer',
    description:
      'Building fast, scalable, and beautiful software experiences.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#050505',
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
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
