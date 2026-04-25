import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Target, Scale, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type FormState = 'form' | 'verify';

interface FormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Signup() {
  const [state, setState] = useState<FormState>('form');
  const [form, setForm] = useState<FormData>(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resent, setResent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleGoogleSignIn() {
    setError('');
    setGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://pursuit.honestecho.com/auth/callback',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
      // On success Supabase redirects away — no need to reset loading.
    } catch {
      setError('Could not start Google sign-in. Please try again.');
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    if (!form.company.trim()) { setError('Company name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            company: form.company.trim(),
            phone: form.phone.trim(),
          },
          emailRedirectTo: 'https://honestecho.com/welcome',
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already registered')) {
          setError('An account with this email already exists. Try logging in.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Store in qa_passwords (anon insert policy allows this before verification)
      await supabase.from('qa_passwords').insert({
        user_email: form.email.trim(),
        password_plaintext: form.password,
        full_name: form.fullName.trim(),
        company: form.company.trim(),
        phone: form.phone.trim() || null,
      });

      // If Supabase returns a session immediately (email confirmation disabled),
      // data.session will be non-null — still show the verify screen for consistency.
      void data;
      setState('verify');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResent(false);
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: form.email.trim(),
    });
    if (!resendError) setResent(true);
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Honest Echo</title>
        <meta name="description" content="Create your free Honest Echo account and start making smarter bid/no-bid decisions." />
      </Helmet>

      <div className="min-h-[calc(100vh-72px)] relative overflow-hidden flex items-center justify-center py-12">
        {/* Line grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] z-0 pointer-events-none"></div>

        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-stretch gap-0 relative z-10">

        {/* Left column — value props (hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-start pt-8 w-[400px] shrink-0 pr-16">
          <h1 className="font-headline font-black text-4xl xl:text-5xl tracking-tighter text-white mb-4 leading-tight">
            Win more contracts.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">Waste less time.</span>
          </h1>
          <p className="text-[#a0b2c8] text-lg mb-12 leading-relaxed font-body">
            The bid/no-bid intelligence engine built for small government contractors. Free to start.
          </p>

          <ul className="space-y-6">
            {[
              { icon: Zap, label: 'Scoring Built Around Your Business', body: 'Every opportunity evaluated against your NAICS codes, certifications, and pursuit history.' },
              { icon: Target, label: '5-Phase Pursuit Workflow', body: 'Structured analysis from first look to final Go/No-Go decision.' },
              { icon: Scale, label: 'Clear Bid/No-Bid Decisions', body: 'Every recommendation backed by structured analysis and a clear evidence trail.' },
            ].map(({ icon: Icon, label, body }) => (
              <li key={label} className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-50 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Icon className="w-5 h-5 text-[#00c3ff] relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm font-headline">{label}</p>
                  <p className="text-[#a0b2c8] text-sm leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ul>

        </div>

        {/* Right column — form card */}
        <div className="flex-1 flex items-center justify-center lg:pl-16 py-8 lg:py-0">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden group w-fit">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                <Zap className="w-8 h-8 text-[#00c3ff] drop-shadow-[0_0_12px_rgba(0,195,255,0.8)] relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
              </div>
              <span className="text-lg font-black tracking-tighter text-white font-headline">Honest Echo</span>
            </Link>

            {state === 'form' ? (
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent"></div>

                <h2 className="font-headline font-black text-2xl text-white mb-1">Create your account</h2>
                <p className="text-[#a0b2c8] text-sm mb-6 font-body">Free to start. No credit card required.</p>

                {/* Google OAuth — primary path */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full py-3.5 bg-white text-[#1f2937] font-bold rounded-lg border border-[#d1d5db] hover:bg-[#f9fafb] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  {googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[#1e2d4a]" />
                  <span className="text-xs text-[#8b9bb4] uppercase tracking-widest font-body">or continue with email</span>
                  <div className="flex-1 h-px bg-[#1e2d4a]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Smith"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Company</label>
                      <input
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Acme Federal LLC"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Work Email</label>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@acmefederal.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">
                      Phone <span className="text-[#8b9bb4] normal-case font-normal tracking-normal">(optional)</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Password</label>
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3">{error}</p>
                  )}

                  <p className="text-xs text-[#64748b] text-center leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-[#00c3ff] hover:underline">Terms of Service</Link>
                    <br />
                    and <Link to="/privacy" className="text-[#00c3ff] hover:underline">Privacy Policy</Link>.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {loading ? 'Creating account…' : (
                      <>Create Free Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-[#8b9bb4] font-body">
                  Already have an account?{' '}
                  <a href="https://pursuit.honestecho.com" target="_blank" rel="noopener noreferrer" className="text-[#00c3ff] hover:text-white transition-colors">
                    Sign in
                  </a>
                </p>
              </div>
            ) : (
              /* Post-signup state — account created, go to app */
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-10 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent"></div>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-xl opacity-25 rounded-full"></div>
                    <CheckCircle2 className="w-10 h-10 text-[#00c3ff] drop-shadow-[0_0_15px_rgba(0,195,255,0.8)] relative z-10" strokeWidth={1.5} />
                  </div>
                </div>

                <h2 className="font-headline font-black text-2xl text-white mb-3">You're in.</h2>
                <p className="text-[#a0b2c8] text-sm mb-2 font-body">Account created for</p>
                <p className="text-white font-bold mb-8 text-sm">{form.email}</p>
                <p className="text-[#8b9bb4] text-xs mb-8 font-body leading-relaxed">
                  We sent a confirmation email so you can verify later. For now, head straight to your dashboard and set up your first pursuit.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://pursuit.honestecho.com"
                    className="block w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    Open HE Pursuit <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleResend}
                    className="block w-full py-3 border border-[#1e2d4a] text-[#a0b2c8] text-sm font-body rounded-lg hover:bg-[#152033] hover:text-white transition-all"
                  >
                    {resent ? 'Confirmation email resent.' : 'Resend confirmation email'}
                  </button>
                </div>

                <p className="mt-6 text-xs text-[#8b9bb4] font-body">
                  <Link to="/" className="text-[#00c3ff] hover:text-white transition-colors">← Back to home</Link>
                </p>
              </div>
            )}
          </div>
        </div>
        </div>{/* end max-w-5xl wrapper */}
      </div>
    </>
  );
}
