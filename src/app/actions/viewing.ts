'use server'

/**
 * Viewing enquiry — sends the form submission to the leasing agent.
 *
 * Transport options (configure via env vars):
 *   • RESEND_API_KEY + CONTACT_TO_EMAIL  → sends via Resend (recommended)
 *   • FORMSPREE_ENDPOINT                 → posts to Formspree
 *   • Neither                            → logs to server console (dev mode)
 *
 * The "from" address must be a verified Resend domain in production.
 * Set CONTACT_FROM_EMAIL to e.g. "website@barnangshuset.se".
 */
export type ViewingResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitViewingEnquiry(
  _prev: ViewingResult | null,
  formData: FormData
): Promise<ViewingResult> {
  const name    = (formData.get('name')    as string | null)?.trim()
  const company = (formData.get('company') as string | null)?.trim()
  const email   = (formData.get('email')   as string | null)?.trim().toLowerCase()
  const size    = (formData.get('size')    as string | null)?.trim()
  const message = (formData.get('message') as string | null)?.trim()

  if (!name || !email || !email.includes('@')) {
    return { ok: false, error: 'Name and a valid email are required.' }
  }

  const body = [
    `Name: ${name}`,
    company ? `Company: ${company}` : null,
    `Email: ${email}`,
    size    ? `Space needed: ${size}` : null,
    message ? `\nMessage:\n${message}` : null,
  ].filter(Boolean).join('\n')

  // ── Resend ──────────────────────────────────────────────────────────────────
  const resendKey  = process.env.RESEND_API_KEY
  const toEmail    = process.env.CONTACT_TO_EMAIL
  const fromEmail  = process.env.CONTACT_FROM_EMAIL ?? 'website@barnangshuset.se'

  if (resendKey && toEmail) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from:    fromEmail,
          to:      [toEmail],
          subject: `Viewing request — ${name}${company ? ` / ${company}` : ''}`,
          text:    body,
          reply_to: email,
        }),
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) throw new Error(`Resend ${res.status}`)
      return { ok: true }
    } catch (err) {
      console.error('[viewing] Resend error:', err)
      return { ok: false, error: 'Failed to send — please email us directly.' }
    }
  }

  // ── Formspree ────────────────────────────────────────────────────────────────
  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT

  if (formspreeEndpoint) {
    try {
      const res = await fetch(formspreeEndpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, company, email, size, message }),
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) throw new Error(`Formspree ${res.status}`)
      return { ok: true }
    } catch (err) {
      console.error('[viewing] Formspree error:', err)
      return { ok: false, error: 'Failed to send — please email us directly.' }
    }
  }

  // ── Dev fallback ─────────────────────────────────────────────────────────────
  console.log('[viewing] enquiry received (no transport configured):\n', body)
  return { ok: true }
}
