'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, FileText, Mail, Sparkles, Terminal } from 'lucide-react';
import type { SiteSettings } from '@/lib/content-types';
import { handleAnchorClick } from '@/components/providers/smooth-scroll';

/* Lazy-load the 3D scene to keep initial paint fast */
const HeroSceneLazy = dynamic(
  () => import('@/components/three/hero-scene').then((m) => m.HeroScene),
  { ssr: false }
);

const codeLines = [
  { text: 'package main', color: 'text-white/90' },
  { text: '', color: '' },
  { text: 'import "fmt"', color: 'text-[#7FE7FF]' },
  { text: 'import "net/http"', color: 'text-[#7FE7FF]' },
  { text: '', color: '' },
  { text: 'func main() {', color: 'text-[#8A5CFF]' },
  { text: '  http.HandleFunc("/", handler)', color: 'text-white/80' },
  { text: '  fmt.Println(":8080 listening")', color: 'text-white/80' },
  { text: '  http.ListenAndServe(":8080", nil)', color: 'text-white/80' },
  { text: '}', color: 'text-[#8A5CFF]' },
];

export function Hero({ settings }: { settings: SiteSettings }) {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setTyped(codeLines.length);
      return;
    }
    const id = setInterval(() => {
      setTyped((t) => (t + 1) % (codeLines.length + 3));
    }, 450);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      {/* 3D scene background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {!reduceMotion && <HeroSceneLazy />}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        {/* Badge */}
        {settings.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-white/70"
          >
            <Sparkles size={14} className="text-[#7FE7FF]" aria-hidden="true" />
            <span>{settings.availability_text}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
            <span className="font-mono text-white/60">Remote / Worldwide</span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          <span className="text-gradient">Building Fast, Scalable</span>
          <br />
          <span className="text-gradient-blue">&amp; Beautiful</span>{' '}
          <span className="text-gradient-purple">Software</span>
          <br />
          <span className="text-gradient">Experiences</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg md:text-xl"
        >
          Backend Developer specializing in{' '}
          <span className="text-white/80">Go</span>,{' '}
          <span className="text-white/80">APIs</span>, Web Development,
          Performance Optimization, and Modern Cloud Applications.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#projects"
            onClick={handleAnchorClick}
            data-cursor="hover"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(79,139,255,0.4)] transition-all hover:shadow-[0_12px_40px_rgba(79,139,255,0.6)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#8A5CFF] to-[#4F8BFF] transition-transform duration-500 group-hover:translate-x-0" />
          </a>
          <a
            href="#contact"
            onClick={handleAnchorClick}
            data-cursor="hover"
            className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/10"
          >
            <Mail size={16} className="text-[#7FE7FF]" />
            Contact Me
          </a>
          {settings.resume_url && (
            <a
              href={settings.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              <FileText size={16} className="text-[#8A5CFF]" aria-hidden="true" />
              Résumé
            </a>
          )}
        </motion.div>

        {/* Floating code editor card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 w-full max-w-xl"
          style={{ perspective: 1000 }}
        >
          <div className="glass-card overflow-hidden rounded-2xl text-left" aria-hidden="true">
            {/* Editor header */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-2 flex items-center gap-1.5 text-xs text-white/50">
                <Terminal size={12} />
                <span className="font-mono">main.go</span>
              </div>
            </div>
            {/* Code body */}
            <div className="p-4 font-mono text-xs leading-relaxed sm:text-sm">
              {codeLines.slice(0, Math.min(typed, codeLines.length)).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`min-h-[1.4em] ${line.color}`}
                >
                  {line.text || '\u00A0'}
                  {i === Math.min(typed, codeLines.length) - 1 &&
                    typed <= codeLines.length && (
                      <span className="cursor-blink ml-0.5 inline-block h-4 w-1.5 bg-[#7FE7FF] align-middle" />
                    )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.div
            className="h-2 w-1 rounded-full bg-white/60"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
