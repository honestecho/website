import { useEffect, useState, type FormEvent } from 'react';
import { API_BASE } from '../lib/api';
import { track, getAttribution } from '../lib/analytics';
import { reportFarSubscribeConversion } from '../lib/googleAds';

// The FAR 2.0 Monday signup (HE-Pursuit /api/public/far-list/subscribe, double opt-in).
// Same form as the OT Radar Monday list (pages/OtherTransactions.tsx). The email is
// written only from the tracker's verified data; this copy promises nothing else.

export type FarWatch = { agencies: string[]; parts: number[] };

const card = 'scroll-mt-24 rounded-2xl border-2 border-[#00c3ff]/60 bg-[linear-gradient(135deg,#0d2a40_0%,#0a1c2d_55%,#081626_100%)] shadow-[0_24px_60px_-28px_rgba(0,195,255,0.55)] p-5 md:p-7';

export default function FarListSignup({ placement, watch, id }: { placement: string; watch?: FarWatch | null; id?: string }) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submit, setSubmit] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const picks = watch && (watch.agencies.length || watch.parts.length) ? watch : null;
  const inputId = `far-email-${placement}`;

  async function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (submit === 'sending') return;
    setSubmit('sending');
    track('far_watchlist_joined', { placement, agencies: picks?.agencies.join(',') ?? '', parts: picks?.parts.join(',') ?? '' });
    try {
      let anonymous_id: string | null = null;
      try { anonymous_id = localStorage.getItem('he_anon_id'); } catch { /* private mode */ }
      const res = await fetch(`${API_BASE}/public/far-list/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot, anonymous_id, attribution: getAttribution(), watch: picks }),
      });
      // The API gives every accepted address the same answer (no existence
      // oracle), so the copy below must be true whether or not an email went out.
      setSubmit(res.ok ? 'done' : 'error');
      // Paid visitors only: the Google tag loads only after an ad click.
      if (res.ok) reportFarSubscribeConversion();
    } catch {
      setSubmit('error');
    }
  }

  return (
    <div id={id} className={card}>
      <h2 className="font-headline font-bold text-white text-2xl leading-8 tracking-tight">Get FAR 2.0 changes every Monday</h2>
      <p className="mt-2 text-[#a0b2c8] text-base leading-6 font-body">
        A free Monday email with what changed in the FAR overhaul that week, which agencies adopted which parts, and what&rsquo;s coming next. It&rsquo;s built from the same weekly check of acquisition.gov, the Federal Register and DoD&rsquo;s deviation list as this tracker.
      </p>
      {picks && (
        <p className="mt-3 text-sm leading-6 text-[#c9d5e3] font-body">
          We&rsquo;ll save your picks with your signup: {[...picks.agencies, ...(picks.parts.length ? [`FAR ${picks.parts.length === 1 ? 'Part' : 'Parts'} ${picks.parts.join(', ')}`] : [])].join(' · ')}.
        </p>
      )}
      {submit === 'done' ? (
        <p role="status" className="mt-4 text-sm text-[#e2e8f0] font-body">
          Thanks! Confirm your address using the email we send, and the Monday email starts after that. Already signed up? Nothing changes.
        </p>
      ) : (
        <form onSubmit={onSubscribe} className="mt-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3">
          <label htmlFor={inputId} className="md:col-span-2 -mb-1 text-sm font-medium text-[#cbd5e1] font-body">Email address</label>
          <input
            id={inputId}
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="min-h-12 w-full rounded-lg bg-[#071321] border border-[#2a3a5a] px-4 text-base text-white placeholder-[#64748b] font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          />
          {/* Honeypot: hidden from people, filled by bots. */}
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={e => setHoneypot(e.target.value)} className="hidden" name="company_website" />
          <button
            type="submit"
            disabled={submit === 'sending'}
            className="h-12 w-full md:w-auto px-6 rounded-lg bg-[#00c3ff] text-[#030B17] font-headline font-bold text-sm hover:bg-[#33cfff] transition-colors whitespace-nowrap disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17] focus-visible:ring-[#00c3ff]"
          >
            {submit === 'sending' ? 'Sending…' : 'Send me FAR 2.0 Monday'}
          </button>
        </form>
      )}
      {submit === 'error' && <p role="alert" className="mt-2 text-sm text-[#fca5a5] font-body">That didn&rsquo;t go through. Check the address and try again.</p>}
      <p className="mt-4 text-base md:text-sm leading-6 text-[#a0b2c8] font-body">We&rsquo;ll email you a link to confirm your address before your Monday emails begin. You can unsubscribe anytime, and we never sell your address.</p>
    </div>
  );
}

// Return from the confirm / unsubscribe links in the email (the API redirects to
// /far-overhaul/?subscribed=1, =invalid, or ?unsubscribed=1).
export function FarListBanner() {
  const [banner, setBanner] = useState<'subscribed' | 'invalid' | 'unsubscribed' | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('subscribed');
    if (s === '1') setBanner('subscribed');
    else if (s === 'invalid') setBanner('invalid');
    else if (q.get('unsubscribed') === '1') setBanner('unsubscribed');
  }, []);
  if (!banner) return null;
  const text = {
    subscribed: 'You’re confirmed. FAR 2.0 Monday starts next Monday.',
    invalid: 'That confirm link has expired or was already used. Sign up again below and we’ll send a fresh one.',
    unsubscribed: 'You’re unsubscribed from FAR 2.0 Monday. You can sign up again any time.',
  }[banner];
  return (
    <div role="status" className="mt-5 max-w-3xl">
      <p className={`rounded-xl border px-4 py-3 text-sm font-body ${banner === 'invalid' ? 'border-[#fbbf24]/50 bg-[#fbbf24]/10 text-[#fde68a]' : 'border-[#00c3ff]/50 bg-[#00c3ff]/10 text-[#e2e8f0]'}`}>{text}</p>
    </div>
  );
}
