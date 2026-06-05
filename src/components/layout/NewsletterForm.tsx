'use client'

import { useActionState } from 'react'
import { subscribeNewsletter, type NewsletterResult } from '@/app/actions/newsletter'

const INITIAL: NewsletterResult | null = null

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, INITIAL)

  if (state?.ok) {
    return (
      <div style={{ fontSize: 'var(--step-00)', lineHeight: 1.7, color: 'rgba(250,247,243,0.65)' }}>
        {state.pending
          ? '✓ Got it — we\'ll be in touch when the newsletter is ready.'
          : '✓ Check your inbox to confirm your subscription.'}
      </div>
    )
  }

  return (
    <form action={action} noValidate>
      <div className="footer__newsletter">
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          aria-label="Email address"
          required
          disabled={pending}
          autoComplete="email"
        />
        <button type="submit" disabled={pending} aria-label="Subscribe">
          {pending ? '…' : '→'}
        </button>
      </div>

      {state && !state.ok && (
        <p style={{
          fontSize: 'var(--step-00)',
          color: 'var(--c-coral)',
          marginTop: '0.6rem',
          lineHeight: 1.5,
        }}>
          {state.error}
        </p>
      )}

      <p style={{
        fontSize: '0.72rem',
        color: 'rgba(250,247,243,0.3)',
        marginTop: '0.65rem',
        lineHeight: 1.55,
        letterSpacing: '0.02em',
      }}>
        Building dispatches only. Unsubscribe anytime.
        EU residents: see our privacy policy.
      </p>
    </form>
  )
}
