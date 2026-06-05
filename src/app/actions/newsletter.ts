'use server'

/**
 * Newsletter signup — posts to the webhook URL from NEWSLETTER_WEBHOOK_URL.
 *
 * Supports any service that accepts a POST with { email, timestamp, source }:
 *   • Resend Audiences  → set NEWSLETTER_WEBHOOK_URL to your audience webhook
 *   • Mailchimp         → use their webhook URL
 *   • Buttondown        → POST to their subscribe API endpoint
 *   • Make / Zapier     → wire a webhook trigger that adds to your list
 *
 * GDPR: the form copy must make clear what the person is signing up for.
 * Double opt-in is handled by the downstream service (configure it there).
 */
export type NewsletterResult =
  | { ok: true; pending?: boolean }
  | { ok: false; error: string }

export async function subscribeNewsletter(
  _prev: NewsletterResult | null,
  formData: FormData
): Promise<NewsletterResult> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase()

  // Basic validation
  if (!email || !email.includes('@') || !email.includes('.')) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL

  // Webhook not yet wired — accept gracefully
  if (!webhookUrl) {
    console.log(`[newsletter] signup ${email} — webhook not configured yet`)
    return { ok: true, pending: true }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        source:    'barnangshuset_footer',
      }),
      // 8-second timeout
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      throw new Error(`Webhook responded with ${res.status}`)
    }

    return { ok: true }
  } catch (err) {
    console.error('[newsletter] signup error:', err)
    return {
      ok: false,
      error: 'Something went wrong — please try again or email us directly.',
    }
  }
}
