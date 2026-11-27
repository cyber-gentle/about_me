'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { useContent } from '@/components/providers/content-provider';
import { supabase, supabaseConfigured } from '@/lib/supabase';

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
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', quote: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const testimonials = useMemo(
    () =>
      rows.map((t, i) => ({
        ...t,
        initials: initialsOf(t.name),
        color: COLORS[i % COLORS.length],
      })),
    [rows]
  );

  const safeIndex = testimonials.length > 0 ? index % testimonials.length : 0;

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const role = form.role.trim();
    const quote = form.quote.trim();
    if (!name || !quote) return;

    if (!supabaseConfigured) {
      setStatus('error');
      setErrorMsg('Submissions are currently unavailable.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    try {
      const { error } = await supabase.from('testimonials').insert({
        name,
        role,
        quote,
        approved: false,
      });
      if (error) throw error;
      setStatus('sent');
      setForm({ name: '', role: '', quote: '' });
    } catch (err) {
      console.error('Testimonial submission failed:', err);
      setStatus('error');
      setErrorMsg('Could not submit right now. Please try again later.');
    }
  };

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
          {testimonials.length === 0 ? (
            <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-3xl glass-card p-8 text-center sm:p-12">
              <Quote
                size={42}
                className="mb-4 text-white/10"
                fill="currentColor"
              />
              <p className="font-display text-lg font-semibold text-white">
                No testimonials published yet
              </p>
              <p className="mt-2 max-w-md text-sm text-white/50">
                Be the first colleague to share a note below.
              </p>
            </div>
          ) : (
            <>
              <div className="relative min-h-[320px] overflow-hidden rounded-3xl glass-card p-8 sm:p-12">
                <Quote
                  size={48}
                  className="absolute right-8 top-8 text-white/5"
                  fill="currentColor"
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col justify-between"
                  >
                    <p className="font-display text-xl leading-relaxed text-white/85 sm:text-2xl">
                      &ldquo;{testimonials[safeIndex].quote}&rdquo;
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-lg font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${testimonials[safeIndex].color}40, ${testimonials[safeIndex].color}10)`,
                          borderColor: `${testimonials[safeIndex].color}50`,
                          boxShadow: `0 0 20px ${testimonials[safeIndex].color}40`,
                        }}
                      >
                        {testimonials[safeIndex].initials}
                      </div>
                      <div>
                        <div className="font-display text-base font-semibold text-white">
                          {testimonials[safeIndex].name}
                        </div>
                        <div className="text-sm text-white/50">
                          {testimonials[safeIndex].role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              {testimonials.length > 1 && (
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
                          width: i === safeIndex ? 24 : 8,
                          background:
                            i === safeIndex
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
              )}
            </>
          )}

          {/* Colleague submission CTA + form */}
          <div className="mt-10 flex flex-col items-center">
            {!formOpen ? (
              <button
                type="button"
                onClick={() => {
                  setFormOpen(true);
                  setStatus('idle');
                  setErrorMsg('');
                }}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-white/75 backdrop-blur-md transition-all hover:border-[#4F8BFF]/50 hover:bg-[#4F8BFF]/15 hover:text-white"
              >
                <MessageSquarePlus size={14} className="text-[#7FE7FF]" />
                Worked with me? Leave a testimonial
              </button>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                onSubmit={handleSubmit}
                className="w-full rounded-3xl glass-card p-6 sm:p-8"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Leave a Testimonial
                    </h3>
                    <p className="text-xs text-white/45">
                      Submitted testimonials are reviewed before appearing on the site.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    data-cursor="hover"
                    aria-label="Close testimonial form"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/25 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {status === 'sent' ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-medium">Thank you for sharing!</p>
                      <p className="mt-1 text-xs text-emerald-200/75">
                        Your testimonial has been submitted and will appear once approved.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-white/55">
                          Your Name *
                        </span>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Jane Doe"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#4F8BFF]/60 focus:bg-white/[0.05]"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-white/55">
                          Role &amp; Company
                        </span>
                        <input
                          type="text"
                          maxLength={120}
                          value={form.role}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, role: e.target.value }))
                          }
                          placeholder="Senior Engineer, Acme Corp"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#4F8BFF]/60 focus:bg-white/[0.05]"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-white/55">
                        Your Testimonial *
                      </span>
                      <textarea
                        required
                        rows={4}
                        maxLength={800}
                        value={form.quote}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, quote: e.target.value }))
                        }
                        placeholder="Share what it was like working with Abraham..."
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#4F8BFF]/60 focus:bg-white/[0.05]"
                      />
                    </label>

                    {status === 'error' && errorMsg && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        <AlertCircle size={14} className="shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setFormOpen(false)}
                        disabled={status === 'sending'}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/70 transition-all hover:border-white/25 hover:text-white disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        data-cursor="hover"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(79,139,255,0.35)] transition-all hover:shadow-[0_6px_28px_rgba(79,139,255,0.5)] disabled:opacity-50"
                      >
                        {status === 'sending' ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Send size={13} />
                        )}
                        {status === 'sending' ? 'Submitting...' : 'Submit Testimonial'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
