'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Loader2,
  X,
} from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/providers/reveal';
import { getSupabase } from '@/lib/supabase';

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  created_at: string;
};

const ACCENTS = ['#4F8BFF', '#8A5CFF', '#7FE7FF'];
const LIMITS = { name: 100, role: 120, email: 254, quoteMin: 20, quoteMax: 800 };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-all focus:border-[#4F8BFF]/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(79,139,255,0.1)]';

/* ---------------------------------------------------------------- */
/* Submission form                                                   */
/* ---------------------------------------------------------------- */

function TestimonialForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', role: '', email: '', quote: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const role = form.role.trim();
    const email = form.email.trim();
    const quote = form.quote.trim();

    if (quote.length < LIMITS.quoteMin) {
      setErrorMsg(`Please write at least ${LIMITS.quoteMin} characters.`);
      setStatus('error');
      return;
    }
    if (honeypot) {
      setStatus('sent');
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Submissions are offline right now. Please try again later.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    const { error } = await supabase
      .from('testimonials')
      .insert({ name, role: role || null, email, quote });
    if (error) {
      setErrorMsg('Something went wrong. Please try again in a moment.');
      setStatus('error');
      return;
    }
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="font-display text-xl font-semibold text-white">Thank you!</p>
        <p className="max-w-sm text-sm text-white/60">
          Your testimonial has been received and will appear here once it&apos;s been reviewed.
        </p>
        <button
          onClick={onClose}
          className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white/80 hover:border-white/25 hover:bg-white/10"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-label="Leave a testimonial" className="relative flex flex-col gap-4">
      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="t-website">Website</label>
        <input
          id="t-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="t-name" className="text-xs font-medium text-white/70">
            Your name *
          </label>
          <input id="t-name" name="name" required autoComplete="name" maxLength={LIMITS.name}
            value={form.name} onChange={set('name')} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="t-role" className="text-xs font-medium text-white/70">
            Role &amp; company
          </label>
          <input id="t-role" name="role" autoComplete="organization-title" maxLength={LIMITS.role}
            placeholder="e.g. Founder, Acme Inc." value={form.role} onChange={set('role')} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="t-email" className="text-xs font-medium text-white/70">
          Email * <span className="font-normal text-white/50">(never shown publicly)</span>
        </label>
        <input id="t-email" name="email" type="email" required autoComplete="email" maxLength={LIMITS.email}
          value={form.email} onChange={set('email')} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="t-quote" className="text-xs font-medium text-white/70">
          Your testimonial *
        </label>
        <textarea id="t-quote" name="quote" required rows={4} minLength={LIMITS.quoteMin} maxLength={LIMITS.quoteMax}
          value={form.quote} onChange={set('quote')} className={inputClass}
          placeholder="What was it like working with me?" />
        <span className="self-end font-mono text-[11px] text-white/50">
          {form.quote.length}/{LIMITS.quoteMax}
        </span>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        data-cursor="hover"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] text-sm font-semibold text-white shadow-[0_8px_32px_rgba(79,139,255,0.4)] transition-opacity disabled:opacity-70"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting...
          </>
        ) : (
          'Submit testimonial'
        )}
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm text-red-300">
        {status === 'error' ? errorMsg : ''}
      </p>
    </form>
  );
}

/* ---------------------------------------------------------------- */
/* Section                                                           */
/* ---------------------------------------------------------------- */

export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from('testimonials')
      .select('id, name, role, quote, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  const count = items.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [paused, reduceMotion, count, next]);

  const current = items[index];
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <section id="testimonials" className="relative z-10 py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Clients Say"
          description="Feedback from people I've worked with. Worked with me too? I'd love to hear from you."
        />

        <div
          className="relative mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl glass-card">
              <Loader2 className="animate-spin text-white/50" aria-label="Loading testimonials" />
            </div>
          ) : current ? (
            <>
              <div
                className="relative min-h-[300px] overflow-hidden rounded-3xl glass-card p-8 sm:p-12"
                aria-roledescription="carousel"
                aria-label="Client testimonials"
              >
                <Quote size={48} className="absolute right-8 top-8 text-white/5" fill="currentColor" aria-hidden="true" />
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={current.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col justify-between"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${count}`}
                  >
                    <blockquote className="font-display text-xl leading-relaxed text-white/85 sm:text-2xl">
                      &ldquo;{current.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      <div
                        aria-hidden="true"
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${accent}40, ${accent}10)`,
                          borderColor: `${accent}50`,
                          boxShadow: `0 0 20px ${accent}40`,
                        }}
                      >
                        {initials(current.name)}
                      </div>
                      <div>
                        <div className="font-display text-base font-semibold text-white">{current.name}</div>
                        {current.role && <div className="text-sm text-white/60">{current.role}</div>}
                      </div>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              {count > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={prev}
                    data-cursor="hover"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    {items.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => setIndex(i)}
                        data-cursor="hover"
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: i === index ? 24 : 8,
                          background: i === index ? 'linear-gradient(90deg, #4F8BFF, #8A5CFF)' : 'rgba(255,255,255,0.2)',
                        }}
                        aria-label={`Go to testimonial ${i + 1}`}
                        aria-current={i === index}
                      />
                    ))}
                  </div>
                  <button
                    onClick={next}
                    data-cursor="hover"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-3xl glass-card p-8 text-center">
              <p className="font-display text-lg font-semibold text-white">Be the first to leave a testimonial</p>
              <p className="max-w-md text-sm text-white/60">
                If we&apos;ve worked together, a few words about the experience would mean a lot.
              </p>
            </div>
          )}
        </div>

        {/* Leave a testimonial */}
        <Reveal className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            {formOpen ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="relative rounded-3xl glass-card p-6 sm:p-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-white">Leave a testimonial</h3>
                  <button
                    onClick={() => setFormOpen(false)}
                    aria-label="Close testimonial form"
                    className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
                <TestimonialForm onClose={() => setFormOpen(false)} />
              </motion.div>
            ) : (
              <motion.div key="cta" className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  onClick={() => setFormOpen(true)}
                  data-cursor="hover"
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition-all hover:border-white/30 hover:bg-white/10"
                >
                  <MessageSquarePlus size={16} className="text-[#7FE7FF]" />
                  Worked with me? Leave a testimonial
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
