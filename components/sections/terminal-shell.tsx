'use client';

import { useEffect, useRef, useState } from 'react';
import { useContent } from '@/components/providers/content-provider';

type Tone = 'keyword' | 'accent' | 'string' | 'muted' | 'success';

type Line = { text: string; tone: Tone; href?: string };

const PROMPT = 'guest@abdavid:~$';

const pythonLines = [
  'class Me:',
  '    def __init__(self):',
  "        self.name = 'Abraham David'",
  "        self.role = 'Backend Developer & Software Engineer'",
  "        self.primary_stack = ['Go', 'Python', 'TypeScript', 'PostgreSQL', 'Redis']",
  "        self.focus = 'Distributed APIs & cloud systems'",
  "        self.availability = 'Open for remote roles & consulting'",
  "        self.location = 'Remote / Worldwide'",
];

const COMMANDS = [
  'help',
  'whoami',
  'stack',
  'projects',
  'experience',
  'contact',
  'clear',
  'date',
  'echo',
  'sudo hire-me',
] as const;

const toneClass: Record<Tone, string> = {
  keyword: 'text-[#7FE7FF]',
  accent: 'text-[#c4b5ff]',
  string: 'text-white/90',
  muted: 'text-white/50',
  success: 'text-emerald-300',
};

export function TerminalShell() {
  const { techs, projects, experience, contactLinks, settings } = useContent();
  const [typed, setTyped] = useState(0);
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalChars = pythonLines.reduce((n, line) => n + line.length, 0);
  const introDone = typed >= totalChars;

  // Intro typewriter — types the python file once, then hands over to the shell.
  useEffect(() => {
    if (introDone) return;
    const id = setInterval(() => {
      setTyped((prev) => Math.min(prev + 1, totalChars));
    }, 26);
    return () => clearInterval(id);
  }, [introDone, totalChars]);

  // Keep the terminal pinned to the newest line.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, input, typed]);

  useEffect(
    () => () => {
      if (chipTimer.current) clearInterval(chipTimer.current);
    },
    []
  );

  const print = (lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    const echo: Line = { text: `${PROMPT} ${cmd}`, tone: 'string' };
    const argv = cmd.split(/\s+/);
    const name = argv[0]?.toLowerCase() ?? '';

    if (!cmd) {
      print([echo]);
      return;
    }

    switch (name) {
      case 'help':
        print([
          echo,
          { text: 'available commands:', tone: 'muted' },
          ...COMMANDS.map((c) => ({
            text: `  ${c.padEnd(14)}${
              {
                help: 'show this list',
                whoami: 'who is behind this site',
                stack: 'technologies I work with',
                projects: 'selected work',
                experience: 'work & education history',
                contact: 'ways to reach me',
                clear: 'clear the terminal',
                date: 'current UTC time',
                echo: 'print text back',
                'sudo hire-me': 'try it',
              }[c] ?? ''
            }`,
            tone: 'string' as Tone,
          })),
        ]);
        break;

      case 'whoami':
        print([
          echo,
          { text: 'Abraham David — Backend Developer & Software Engineer', tone: 'string' },
          { text: `location: ${settings.location ?? 'Remote / Worldwide'}`, tone: 'muted' },
          { text: 'status: open for remote roles & consulting', tone: 'success' },
        ]);
        break;

      case 'stack': {
        const byCat = new Map<string, string[]>();
        // tech rows carry their category via the skills table grouping is not
        // available here, so just list them in managed order.
        void byCat;
        print([
          echo,
          { text: `primary stack (${techs.length}):`, tone: 'muted' },
          {
            text: '  ' + techs.map((t) => t.name).join(' · '),
            tone: 'string',
          },
        ]);
        break;
      }

      case 'projects':
        print([
          echo,
          { text: `selected work (${projects.length}):`, tone: 'muted' },
          ...projects.flatMap((p, i) => {
            const lines: Line[] = [
              {
                text: `  ${String(i + 1).padStart(2, '0')}  ${p.title}  [${p.tech.join(', ')}]`,
                tone: 'string',
              },
            ];
            if (p.url) {
              lines.push({ text: `      ↳ ${p.url}`, tone: 'keyword', href: p.url });
            }
            return lines;
          }),
          { text: "scroll down or run 'help'", tone: 'muted' },
        ]);
        break;

      case 'experience':
        print([
          echo,
          ...experience.map((e): Line => ({
            text: `  ${e.period.padEnd(16)} ${e.role} @ ${e.company}`,
            tone: 'string',
          })),
        ]);
        break;

      case 'contact':
      case 'socials':
        print([
          echo,
          { text: 'reach me here:', tone: 'muted' },
          ...contactLinks.map((c): Line => ({
            text: `  ${c.label.padEnd(10)} ${c.value}`,
            tone: 'string',
            href: c.href,
          })),
        ]);
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'date':
        print([echo, { text: new Date().toUTCString(), tone: 'string' }]);
        break;

      case 'echo':
        print([echo, { text: argv.slice(1).join(' '), tone: 'string' }]);
        break;

      case 'sudo':
        if (argv.slice(1).join(' ') === 'hire-me') {
          const email = contactLinks.find((c) => c.icon === 'mail')?.value;
          print([
            echo,
            { text: '[sudo] permission granted ✓', tone: 'success' },
            { text: 'recruiter mode activated.', tone: 'accent' },
            ...(email
              ? [{ text: `  ↳ ${email}`, tone: 'keyword' as Tone, href: `mailto:${email}` }]
              : []),
          ]);
        } else {
          print([
            echo,
            { text: `abraham is not in the sudoers file. This incident will be reported.`, tone: 'muted' },
          ]);
        }
        break;

      default:
        print([
          echo,
          { text: `command not found: ${name} — try 'help'`, tone: 'muted' },
        ]);
    }

    setInput('');
    setHistIdx(-1);
  };

  const execute = (cmd: string) => {
    runCommand(cmd);
    if (cmd.trim()) {
      setCmdHistory((h) => [...h, cmd].slice(-30));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      execute(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(cmdHistory[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= cmdHistory.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.trim().toLowerCase()));
      if (match) setInput(match + ' ');
    }
  };

  // Chips "type" the command character-by-character, then run it —
  // the same reveal mechanic as the intro, so it stays on-theme.
  const runChip = (cmd: string) => {
    if (busy || !introDone) return;
    setBusy(true);
    setInput('');
    let i = 0;
    chipTimer.current = setInterval(() => {
      i += 1;
      setInput(cmd.slice(0, i));
      if (i >= cmd.length) {
        if (chipTimer.current) clearInterval(chipTimer.current);
        chipTimer.current = null;
        setBusy(false);
        execute(cmd);
        inputRef.current?.focus();
      }
    }, 28);
  };

  // Distribute typed chars across intro lines (same as before).
  let consumed = 0;
  const rendered = pythonLines.map((line) => {
    const start = consumed;
    consumed += line.length;
    return { text: line, visible: Math.max(0, Math.min(line.length, typed - start)) };
  });

  return (
    <div>
      <div
        ref={scrollRef}
        onClick={() => introDone && inputRef.current?.focus()}
        className="h-[300px] cursor-text space-y-1.5 overflow-y-auto px-4 py-4 font-mono text-[11px] leading-5 sm:h-[320px] sm:text-xs"
      >
        {/* Intro: the python file, typed once */}
        {rendered.map(({ text, visible }, idx) =>
          visible === 0 ? null : (
            <div key={`intro-${idx}`} className="whitespace-pre text-white/60">
              <span>{text.slice(0, visible)}</span>
              {!introDone && visible < text.length && (
                <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-[#7FE7FF]" />
              )}
            </div>
          )
        )}
        {!introDone && (
          <div>
            <span className="inline-block h-3.5 w-2 animate-pulse bg-[#7FE7FF]" />
          </div>
        )}

        {/* Shell history */}
        {introDone &&
          history.map((line, idx) => (
            <div key={`out-${idx}`} className="whitespace-pre-wrap break-words">
              {line.href ? (
                <a
                  href={line.href}
                  target={line.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`${toneClass[line.tone]} underline decoration-white/20 underline-offset-2 hover:decoration-white/60`}
                >
                  {line.text}
                </a>
              ) : (
                <span className={toneClass[line.tone]}>{line.text}</span>
              )}
            </div>
          ))}

        {/* Live prompt line */}
        {introDone && (
          <div className="flex items-baseline whitespace-pre">
            <span className="text-[#7FE7FF]">
              guest@abdavid<span className="text-white/40">:~$</span>
            </span>
            <span className="relative ml-2 flex-1 text-white/90">
              {input}
              <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-[#7FE7FF]" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal command input"
                className="absolute inset-0 h-full w-full cursor-text bg-transparent p-0 font-mono text-[11px] text-transparent caret-transparent outline-none sm:text-xs"
              />
            </span>
          </div>
        )}
      </div>

      {/* Command chips — tap targets for mobile, hints for desktop */}
      <div className="flex flex-wrap gap-1.5 border-t border-white/10 bg-white/[0.02] px-4 py-3">
        {COMMANDS.filter((c) => c !== 'echo' && c !== 'date').map((c) => (
          <button
            key={c}
            onClick={() => runChip(c)}
            disabled={busy || !introDone}
            data-cursor="hover"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-white/60 transition-all duration-150 hover:border-[#7FE7FF]/40 hover:text-[#7FE7FF] disabled:opacity-40 sm:text-[11px]"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
