// Cloudflare Pages Function: POST /api/contact
//
// Self-contained website contact handler — no dependency on the Pursuit backend.
// Sends the submitted message to the ops inbox via Resend (honestecho.com is
// already a verified Resend sending domain).
//
// Required env var on the he-website Pages project:
//   RESEND_API_KEY  — Resend API key
// Optional:
//   CONTACT_INBOX   — recipient address (default: aaron.shivar@honestecho.com;
//   was info@, an unmonitored mailbox — a real lead would have rotted there.
//   Verified 2026-09-06: info@ held only unread DMARC reports.)
//
// Abuse posture: `to` and `from` are fixed (not user-controlled), so the worst
// case is spam to the ops inbox, not an open relay. Honeypot catches basic bots;
// add a Cloudflare rate-limiting rule on /api/contact for heavier protection.

const esc = (s, max) => String(s || '')
  .slice(0, max)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// HTML-escape AND strip CR/LF so name fields can't inject into the email subject.
const headerSafe = (s) => esc(s, 100).replace(/[\r\n]+/g, ' ').trim();

export async function onRequestPost({ request, env }) {
  const json = (status, obj) =>
    new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { first_name, last_name, email, message, honeypot } = body || {};

  // Honeypot → silent success (writes/sends nothing).
  if (honeypot && String(honeypot).trim().length > 0) return json(200, { success: true });

  if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return json(400, { success: false, message: 'Please enter a valid email address.' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return json(400, { success: false, message: 'Please include a message.' });
  }
  if (message.length > 4000) {
    return json(400, { success: false, message: 'Message is too long (4000 character max).' });
  }

  if (!env.RESEND_API_KEY) {
    return json(503, { success: false, message: "We couldn't send your message right now. Please email info@honestecho.com directly." });
  }

  const name      = `${headerSafe(first_name)} ${headerSafe(last_name)}`.trim() || '(no name given)';
  const safeEmail = esc(email.trim(), 254);
  const safeMsg   = esc(message.trim(), 4000).replace(/\n/g, '<br>');
  const inbox     = env.CONTACT_INBOX || 'aaron.shivar@honestecho.com';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:     'Honest Echo Website <noreply@honestecho.com>',
        to:       inbox,
        reply_to: email.trim(),
        subject:  `New contact form message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <h2 style="margin-bottom:4px;">New contact form submission</h2>
            <p style="margin:0 0 16px;color:#888;font-size:13px;">via honestecho.com/contact</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Message:</strong></p>
            <div style="border-left:3px solid #00c3ff;padding:8px 14px;background:#f6fafd;border-radius:4px;">${safeMsg}</div>
          </div>`,
      }),
    });

    if (!r.ok) {
      return json(502, { success: false, message: "We couldn't send your message right now. Please email info@honestecho.com directly." });
    }
    return json(200, { success: true });
  } catch {
    return json(500, { success: false, message: 'Server error. Please email info@honestecho.com directly.' });
  }
}
