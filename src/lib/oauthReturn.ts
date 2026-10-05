// Google sign-in, returned through the website.
//
// Google returns to /welcome on this origin, not straight to
// pursuit.honestecho.com. Here the session exists, so we can stamp attribution
// on a NEW account, report the conversion, and then hand the session to pursuit
// the same way email signup does (tokens in the URL hash). If the marker for
// the round trip cannot be stored, Signup falls back to the direct redirect.
// Verified with a real Google sign-in on 2026-10-05.

import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { track, getAttribution } from './analytics';
import { reportSignupConversion } from './googleAds';

const PENDING_KEY = 'he_oauth_pending';
// An abandoned consent screen must not leave a marker that a much later visit
// to /welcome would act on.
const PENDING_TTL_MS = 15 * 60 * 1000;
// A Google account that Supabase created this recently is a signup, not a
// returning sign-in. Generous enough for a slow consent screen.
const NEW_ACCOUNT_WINDOW_MS = 10 * 60 * 1000;

export const OAUTH_RETURN_URL = 'https://honestecho.com/welcome';

type Pending = { from: string | null; at: number };

// False when the marker cannot be stored: the caller must then use the default
// path, or Google would return here with nothing to finish the hand-off.
export function markOAuthPending(from: string | null): boolean {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ from, at: Date.now() } satisfies Pending));
    return true;
  } catch {
    return false;
  }
}

export function clearOAuthPending(): void {
  try { sessionStorage.removeItem(PENDING_KEY); } catch { /* nothing to clear */ }
}

function readOAuthPending(): Pending | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const pending = JSON.parse(raw) as Pending;
    if (typeof pending.at !== 'number' || Date.now() - pending.at > PENDING_TTL_MS) {
      sessionStorage.removeItem(PENDING_KEY);
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

export function hasOAuthPending(): boolean {
  return readOAuthPending() !== null;
}

// supabase-js persists the session under sb-<project ref>-auth-token.
const SESSION_STORAGE_KEY = `sb-${new URL(import.meta.env.VITE_SUPABASE_URL as string).hostname.split('.')[0]}-auth-token`;

async function handOffToPursuit(session: Session, isNewSignup: boolean): Promise<void> {
  // auth-js on pursuit rejects the hash unless expires_in AND token_type are
  // present alongside the tokens (same contract as the email signup bridge).
  const params = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: String(session.expires_in ?? 3600),
    ...(session.expires_at ? { expires_at: String(session.expires_at) } : {}),
    token_type: session.token_type ?? 'bearer',
    ...(isNewSignup ? { type: 'signup' } : {}),
  });
  // Drop this origin's stored copy so only pursuit holds the refresh token;
  // two clients refreshing the same rotating token would revoke the session.
  // Not auth.signOut(): even scope 'local' ends the session on the server.
  // Stop the refresh timer first so it cannot write the session back.
  try {
    await supabase.auth.stopAutoRefresh();
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch { /* storage unavailable: nothing persisted to drop */ }
  window.location.replace(`https://pursuit.honestecho.com#${params.toString()}`);
}

// Runs on /welcome. Returns 'no-pending' when this visit is not an OAuth
// return, 'no-session' when Google sign-in did not complete, and otherwise
// navigates away to pursuit.
type OAuthReturnResult = 'no-pending' | 'no-session' | 'bridged';

// A stalled request must not hold a signed-in visitor on /welcome.
function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timed out')), ms)),
  ]);
}

let inFlight: Promise<OAuthReturnResult> | null = null;
// Memoized: a double-mounted effect must not run the hand-off twice.
export function finishOAuthReturn(): Promise<OAuthReturnResult> {
  return (inFlight ??= runOAuthReturn());
}

async function runOAuthReturn(): Promise<OAuthReturnResult> {
  const pending = readOAuthPending();
  if (!pending) return 'no-pending';

  // getSession() waits for the client to finish reading the tokens Google's
  // redirect left in the URL.
  let session = (await supabase.auth.getSession()).data.session;
  if (!session) {
    clearOAuthPending();
    return 'no-session';
  }

  // Attribution and reporting must never block the hand-off: whatever fails
  // in here, a signed-in visitor still reaches pursuit.
  let isNewSignup = false;
  try {
    const user = session.user;
    const meta = user.user_metadata ?? {};
    // signup_reported is the per-user marker: a second Google sign-in inside
    // the window, or a repeat visit, finds it and reports nothing. It is a
    // client-side guard; the hard dedupe is Google's, on transaction_id.
    isNewSignup =
      user.app_metadata?.provider === 'google' &&
      Date.now() - new Date(user.created_at).getTime() < NEW_ACCOUNT_WINDOW_MS &&
      !meta.signup_reported;
    if (isNewSignup) {
      const acquisition = { ...getAttribution(), ...(pending.from ? { from: pending.from } : {}) };
      const { error } = await withTimeout(supabase.auth.updateUser({
        data: {
          signup_reported: true,
          ...(Object.keys(acquisition).length && !meta.acquisition ? { acquisition } : {}),
        },
      }));
      // No marker saved means a repeat could count twice, so report nothing.
      if (error) throw error;
      // updateUser can rotate the session; hand off the current one.
      session = (await withTimeout(supabase.auth.getSession())).data.session ?? session;
      track('signup_account_created', { method: 'google', ...(pending.from ? { from: pending.from } : {}) });
      await reportSignupConversion(user.id);
    }
  } catch (err) {
    console.warn('Signup attribution skipped:', err);
  }

  clearOAuthPending();
  await handOffToPursuit(session, isNewSignup);
  return 'bridged';
}
