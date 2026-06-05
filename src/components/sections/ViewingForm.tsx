'use client'

import { useActionState, useState } from 'react'
import { submitViewingEnquiry, type ViewingResult } from '@/app/actions/viewing'

const INITIAL: ViewingResult | null = null

export default function ViewingForm({ agentEmail }: { agentEmail?: string }) {
  const [state, action, pending] = useActionState(submitViewingEnquiry, INITIAL)
  const [open, setOpen] = useState(false)

  if (state?.ok) {
    return (
      <div className="viewing-form__success">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)', marginBottom: '0.5rem' }}>
          Message received.
        </p>
        <p style={{ fontSize: 'var(--step-0)', color: 'var(--c-stone-3)', lineHeight: 1.6 }}>
          We'll be in touch within one business day to arrange a time.
        </p>
      </div>
    )
  }

  return (
    <div className="viewing-form">
      {!open ? (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-coral"
            onClick={() => setOpen(true)}
          >
            Arrange a viewing →
          </button>
          {agentEmail && (
            <a
              href={`mailto:${agentEmail}?subject=Viewing request — Barnängshuset`}
              style={{
                fontSize: 'var(--step-00)',
                color: 'var(--c-stone-3)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Or email directly
            </a>
          )}
        </div>
      ) : (
        <form action={action} className="viewing-form__fields" noValidate>
          <div className="vf-row">
            <div className="vf-field">
              <label htmlFor="vf-name" className="vf-label">Name *</label>
              <input
                id="vf-name"
                name="name"
                type="text"
                className="vf-input"
                required
                disabled={pending}
                autoComplete="name"
              />
            </div>
            <div className="vf-field">
              <label htmlFor="vf-company" className="vf-label">Company</label>
              <input
                id="vf-company"
                name="company"
                type="text"
                className="vf-input"
                disabled={pending}
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="vf-row">
            <div className="vf-field">
              <label htmlFor="vf-email" className="vf-label">Email *</label>
              <input
                id="vf-email"
                name="email"
                type="email"
                className="vf-input"
                required
                disabled={pending}
                autoComplete="email"
              />
            </div>
            <div className="vf-field">
              <label htmlFor="vf-size" className="vf-label">Space needed</label>
              <select id="vf-size" name="size" className="vf-input vf-select" disabled={pending}>
                <option value="">Unsure</option>
                <option value="Up to 10 people">Up to 10 people</option>
                <option value="10–25 people">10–25 people</option>
                <option value="25–50 people">25–50 people</option>
                <option value="50+ people">50+ people</option>
              </select>
            </div>
          </div>

          <div className="vf-field">
            <label htmlFor="vf-message" className="vf-label">Anything else</label>
            <textarea
              id="vf-message"
              name="message"
              className="vf-input vf-textarea"
              rows={3}
              disabled={pending}
              placeholder="Move-in timing, specific requirements…"
            />
          </div>

          {state && !state.ok && (
            <p className="vf-error">{state.error}</p>
          )}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" className="btn-coral" disabled={pending}>
              {pending ? 'Sending…' : 'Send enquiry →'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--c-stone-3)',
                fontSize: 'var(--step-00)',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Cancel
            </button>
          </div>

          <p style={{
            fontSize: '0.72rem',
            color: 'var(--c-stone-3)',
            marginTop: '0.75rem',
            lineHeight: 1.5,
            opacity: 0.7,
          }}>
            Your details are used only to arrange a viewing and are not shared with third parties.
          </p>
        </form>
      )}
    </div>
  )
}
