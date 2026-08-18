import { useState } from 'react';
import type { FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { track } from '../lib/analytics';

export default function Contact() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [message, setMessage]     = useState('');
  const [honeypot, setHoneypot]   = useState(''); // bot trap
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'email' | 'message' | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setErrorField(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      setErrorField('email');
      return;
    }
    if (!message.trim()) {
      setError('Please include a message.');
      setErrorField('message');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          first_name: firstName.trim() || undefined,
          last_name:  lastName.trim() || undefined,
          email:      email.trim(),
          message:    message.trim(),
          honeypot:   honeypot || undefined,
        }),
      });

      if (!res.ok) {
        const fallback = 'We couldn\'t send your message right now. Please email info@honestecho.com directly.';
        const body = await res.json().catch(() => ({ message: fallback }));
        setError(body.message || fallback);
        setLoading(false);
        return;
      }

      track('contact_submitted');
      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("We couldn't reach the server. Please email info@honestecho.com directly.");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Honest Echo</title>
        <meta name="description" content="Get in touch with Honest Echo for GovCon consulting or software tool inquiries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/contact" />
        <meta property="og:title" content="Contact Honest Echo — GovCon Intelligence" />
        <meta property="og:description" content="Reach out for consulting inquiries, enterprise tool access, or general questions about HE Pursuit." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Honest Echo — GovCon Intelligence" />
        <meta name="twitter:description" content="Reach out for consulting inquiries, enterprise tool access, or general questions about HE Pursuit." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-24 min-h-[80vh] flex flex-col-reverse md:flex-row gap-8 md:gap-16">
        {/* Left Side: Info */}
        <div className="w-full md:w-1/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-wide">Get in Touch</span>
          </div>

          <h1 className="font-headline font-black text-5xl text-white mb-6 tracking-tight">Let's talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">GovCon.</span></h1>
          <p className="text-lg text-[#a0b2c8] mb-12 font-body leading-relaxed">
            Reach out for consulting inquiries, enterprise tool access, or general questions about Honest Echo's pursuit engine.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#00c3ff]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm mb-1">Email Us</h2>
                <p className="text-[#a0b2c8] font-body text-sm">
                  <a href="mailto:info@honestecho.com" className="hover:text-[#00c3ff] transition-colors">info@honestecho.com</a>
                </p>
                <p className="text-[#a0b2c8] font-body text-sm mt-1">
                  <a href="mailto:support@honestecho.com" className="hover:text-[#00c3ff] transition-colors">support@honestecho.com</a>
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#00c3ff]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm mb-1">Location</h2>
                <p className="text-[#a0b2c8] font-body text-sm leading-relaxed">Honest Echo LLC<br />Fairfax, VA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3">
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate className="bg-[#0b1120] p-8 md:p-12 rounded-2xl border border-[#1e2d4a] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00c3ff]/5 to-transparent pointer-events-none"></div>

              {/* Honeypot — hidden from humans, catches bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">First Name (optional)</label>
                  <input type="text" id="firstName" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#5a6b85]" placeholder="Jane" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Last Name (optional)</label>
                  <input type="text" id="lastName" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#5a6b85]" placeholder="Doe" />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Work Email</label>
                <input type="email" id="email" required autoComplete="email" aria-invalid={errorField === 'email' || undefined} aria-describedby={errorField === 'email' ? 'contact-form-error' : undefined} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#5a6b85]" placeholder="jane@company.com" />
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Message</label>
                <textarea id="message" rows={5} required maxLength={4000} aria-invalid={errorField === 'message' || undefined} aria-describedby={errorField === 'message' ? 'contact-form-error' : undefined} value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#5a6b85]" placeholder="How can we help your team win?"></textarea>
              </div>

              {error && (
                <p id="contact-form-error" role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3 mb-6 relative z-10">{error}</p>
              )}

              <button type="submit" disabled={loading} className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,195,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                {loading ? 'Sending…' : (<>Send Message <Send className="w-4 h-4" /></>)}
              </button>
            </form>
          ) : (
            <div className="bg-[#0b1120] p-8 md:p-12 rounded-2xl border border-[#00c3ff]/40 shadow-[0_0_60px_rgba(0,195,255,0.15)] text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-14 h-14 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/40 flex items-center justify-center mb-5">
                <CheckCircle2 size={28} className="text-[#00c3ff]" strokeWidth={2} />
              </div>
              <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-3">Message sent.</h2>
              <p className="text-[#a0b2c8] font-body max-w-md">
                Thanks for reaching out — we'll get back to you at <span className="text-white font-semibold">{email}</span> within one business day.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link to="/signup/?promo=fall2026" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white transition-colors text-sm">
                  Start free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">
                  Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
