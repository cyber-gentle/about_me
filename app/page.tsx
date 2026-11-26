'use client';

import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { CustomCursor } from '@/components/providers/custom-cursor';
import { ScrollProgress } from '@/components/providers/scroll-progress';
import { AuroraBackground } from '@/components/providers/aurora-background';
import { LoadingScreen } from '@/components/providers/loading-screen';
import { Navbar } from '@/components/sections/navbar';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { TechStack } from '@/components/sections/tech-stack';
import { Projects } from '@/components/sections/projects';
import { Experience } from '@/components/sections/experience';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <div className="noise" />
      <AuroraBackground />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
