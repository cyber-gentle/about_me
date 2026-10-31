'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/providers/reveal';
import { getSupabase } from '@/lib/supabase';
import { buildSocials } from '@/lib/socials';
import type { SiteSettings } from '@/lib/content-types';

const LIMITS = { name: 100, email: 254, message: 5000 };

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  textarea,
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  maxLength: number;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const shared = {
    id,
    name: id,
    required: true,
    maxLength,
    autoComplete,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'peer w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pb-2.5 pt-6 text-sm text-white outline-none transition-all focus:border-[#4F8BFF]/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(79,139,255,0.1)]',
  };

  return (
    <div className="relative">
      {textarea ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} />
      )}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all ${active
          ? 'top-2 text-[10px] font-medium text-[#7FE7FF]'
          : textarea
            ? 'top-4 text-sm text-white/60'
            : 'top-1/2 -translate-y-1/2 text-sm text-white/60'
          }`}
      >
        {label}
      </label>
    </div>
  );
}

export function Contact({ settings }: { settings: SiteSettings }) {
  const socials = buildSocials(settings);
  const email = settings.email;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const fail = (msg: string) => {
    setErrorMsg(msg);
    setStatus('error');
    setTimeout(() => setStatus('idle'), 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || !email || !message) return fail('Please fill in all three fields.');

    // Bots fill hidden fields; pretend success and drop the submission.
    if (honeypot) {
      setStatus('sent');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      return fail(`The form is offline right now — please email me at ${email}.`);
    }

    setStatus('sending');
    setErrorMsg('');
    const { error } = await supabase.from('messages').insert({ name, email, message });
    if (error) {
      return fail(`Something went wrong sending your message. You can email me directly at ${email}.`);
    }
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let&apos;s Build Something"
          description="Have a project in mind, a role to fill, or just want to say hello? My inbox is always open."
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Social links */}
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group flex items-center gap-4 rounded-2xl glass-card p-4 transition-all hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 transition-all group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}25, ${s.color}08)`,
                      boxShadow: `0 0 0 0 ${s.color}`,
                    }}
                  >
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-white/60">{s.label}</div>
                    <div className="text-sm font-medium text-white/90">
                      {s.value}
                    </div>
                  </div>
                </a>
              ))}

              {/* Location */}
              <div className="flex items-center gap-4 rounded-2xl glass-card p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#4F8BFF]/20 to-[#8A5CFF]/10">
                  <MapPin size={20} className="text-[#7FE7FF]" />
                </div>
                <div>
                  <div className="text-xs text-white/60">Location</div>
                  <div className="text-sm font-medium text-white/90">
                    {settings.location}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              aria-label="Contact form"
              className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8"
            >
              {/* Glow accent */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(79,139,255,0.5), transparent 70%)',
                }}
              />

              <div className="relative flex flex-col gap-4">
                {/* Honeypot: hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingInput
                    id="name"
                    label="Your Name"
                    maxLength={LIMITS.name}
                    autoComplete="name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  />
                  <FloatingInput
                    id="email"
                    label="Your Email"
                    type="email"
                    maxLength={LIMITS.email}
                    autoComplete="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  />
                </div>
                <FloatingInput
                  id="message"
                  label="Your Message"
                  maxLength={LIMITS.message}
                  value={form.message}
                  onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                  textarea
                />

                {/* 3D send button */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  data-cursor="hover"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative mt-2 flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] text-sm font-semibold text-white shadow-[0_8px_32px_rgba(79,139,255,0.4)] transition-all disabled:opacity-70"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <AnimatePresence mode="wait">
                    {status === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        Send Message
                        <Send size={16} className="transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    )}
                    {status === 'sending' && (
                      <motion.span
                        key="sending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </motion.span>
                    )}
                    {status === 'sent' && (
                      <motion.span
                        key="sent"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Message Sent!
                      </motion.span>
                    )}
                    {status === 'error' && (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Try Again
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['0%', '300%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                </motion.button>

                <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
                  {status === 'error' && <span className="text-red-300">{errorMsg}</span>}
                  {status === 'sent' && (
                    <span className="text-emerald-300">Thanks — I&apos;ll get back to you soon.</span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
