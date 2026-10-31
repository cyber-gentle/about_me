import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Portfolio',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#050505] text-white">{children}</div>;
}
