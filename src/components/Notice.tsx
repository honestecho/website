import type { ReactNode } from 'react';

/**
 * Notice — the canonical "important note" / announcement strip.
 *
 * Use this anywhere the site needs to call out a single high-signal message:
 * beta offers, deadlines, policy callouts, "read this first" context. It is the
 * one approved alternative to hand-rolling a bordered/​tinted strip inline.
 *
 * Two emphasis levels only (single-accent system — opacity, not hue, carries weight):
 *   strong — announcements that should grab the eye (border/50, fill/10, badge)
 *   soft   — quieter context notes that sit alongside content (border/30, fill/5)
 */

type NoticeTone = 'strong' | 'soft';

const toneClasses: Record<NoticeTone, string> = {
  strong: 'border-[#00c3ff]/50 bg-[#00c3ff]/10',
  soft: 'border-[#00c3ff]/30 bg-[#00c3ff]/5',
};

interface NoticeProps {
  /** All-caps badge text (e.g. "Beta", "New", "Note"). Omit for a badge-less note. */
  label?: string;
  /** Emphasis level. Defaults to "strong". */
  tone?: NoticeTone;
  /** Content alignment. Defaults to "center". */
  align?: 'center' | 'left';
  /** Extra classes — use for outer margin (e.g. "mb-4"). */
  className?: string;
  /** Inline content only — rendered inside a <p>. Do not pass block elements. */
  children: ReactNode;
}

export default function Notice({
  label,
  tone = 'strong',
  align = 'center',
  className = '',
  children,
}: NoticeProps) {
  // Drives both axes: on mobile (flex-col) the cross-axis is horizontal, so a
  // left-aligned notice needs items-start, not just justify/text changes.
  const alignment =
    align === 'center'
      ? 'items-center justify-center text-center'
      : 'items-start sm:items-center justify-start text-left';
  return (
    <div
      role="note"
      className={`rounded-xl border ${toneClasses[tone]} px-6 py-4 flex flex-col sm:flex-row ${alignment} gap-2 sm:gap-4 ${className}`}
    >
      {label && (
        <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest font-label text-[#030B17] bg-[#00c3ff] shrink-0">
          {label}
        </span>
      )}
      <p className="font-body text-white text-sm md:text-base">{children}</p>
    </div>
  );
}

/** Inline monospace chip for a code or value inside a Notice (e.g. a coupon code). */
export function NoticeCode({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono font-bold text-[#00c3ff] bg-[#030B17] border border-[#00c3ff]/30 rounded px-2 py-0.5 select-all">
      {children}
    </span>
  );
}
