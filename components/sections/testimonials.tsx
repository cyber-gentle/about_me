'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { useContent } from '@/components/providers/content-provider';

const COLORS = ['#4F8BFF', '#8A5CFF', '#7FE7FF'];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export function Testimonials() {
  const { testimonials: rows } = useContent();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const testimonials = useMemo(
    () =>
      rows.map((t, i) => ({
        ...t,
        initials: initialsOf(t.name),
        color: COLORS[i % COLORS.length],
      })),
    [rows]
  );

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="relative z-10 py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="What People Say"
          description="Words from colleagues and leaders I have had the privilege to work with."
        />

        <div
          className="relative mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl glass-card p-8 sm:p-12">
            <Quote
              size={48}
              className="absolute right-8 top-8 text-white/5"
              fill="currentColor"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-between"
              >
                <p className="font-display text-xl leading-relaxed text-white/85 sm:text-2xl">
                  &ldquo;{testimonials[index].quote}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-lg font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${testimonials[index].color}40, ${testimonials[index].color}10)`,
                      borderColor: `${testimonials[index].color}50`,
                      boxShadow: `0 0 20px ${testimonials[index].color}40`,
                    }}
                  >
                    {testimonials[index].initials}
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold text-white">
                      {testimonials[index].name}
                    </div>
                    <div className="text-sm text-white/50">
                      {testimonials[index].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              data-cursor="hover"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  data-cursor="hover"
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === index ? 24 : 8,
                    background:
                      i === index
                        ? 'linear-gradient(90deg, #4F8BFF, #8A5CFF)'
                        : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              data-cursor="hover"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
