import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { MotionProvider } from '@/components/providers/motion-provider';
import { CustomCursor } from '@/components/providers/custom-cursor';
import { ScrollProgress } from '@/components/providers/scroll-progress';
import { AuroraBackground } from '@/components/providers/aurora-background';
import { Navbar } from '@/components/sections/navbar';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Skills } from '@/components/sections/skills';
import { TechStack } from '@/components/sections/tech-stack';
import { Projects } from '@/components/sections/projects';
import { Experience } from '@/components/sections/experience';
import { GitHub } from '@/components/sections/github';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';
import { getContent } from '@/lib/content';

// Content comes from Supabase. Saving in /admin refreshes the page immediately
// (on-demand revalidation); this is the fallback refresh interval.
export const revalidate = 300;

export default async function Home() {
  const { settings, projects, skillCategories, techs, experiences } = await getContent();

  return (
    <MotionProvider>
      <SmoothScroll>
        <CustomCursor />
        <ScrollProgress />
        <div className="noise" aria-hidden="true" />
        <AuroraBackground />

        <Navbar />

        <main id="main" className="relative z-10">
          <Hero settings={settings} />
          <About settings={settings} />
          {skillCategories.length > 0 && <Skills categories={skillCategories} />}
          {techs.length > 0 && <TechStack techs={techs} />}
          <Projects projects={projects} />
          {experiences.length > 0 && <Experience experiences={experiences} />}
          {settings.github && <GitHub username={settings.github} />}
          <Testimonials />
          <Contact settings={settings} />
        </main>

        <Footer settings={settings} />
      </SmoothScroll>
    </MotionProvider>
  );
}
