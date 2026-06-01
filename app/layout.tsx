import type { Metadata } from "next";
import "./layout.css";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Abraham David · Frontend Developer",
  description:
    "Frontend developer building beautiful, fast, and purposeful web experiences.",
  keywords: ["Frontend Developer", "React", "Next.js", "Web Development", "UI/UX"],
  authors: [{ name: "Abraham David" }],
  creator: "Abraham David",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abraham-david.com",
    title: "Abraham David · Frontend Developer",
    description: "Building beautiful, fast, and purposeful web experiences.",
    siteName: "Abraham David Portfolio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%23C9A84C' font-weight='bold'>AD</text></svg>" />
      </head>
      <body className="bg-midnight text-text">
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
