import type { BridgeSection as T } from '@/types/sanity'

/**
 * Bridge — the conscious pause between the testimonial (emotional) and the
 * floor plan (rational). A single large display statement, generous space,
 * paper-3 ground. Animated as a slow single-line reveal in PageAnimations.tsx.
 */
export default function BridgeSection({ section }: { section: T }) {
  const {
    headline      = 'Four point nine metres.',
    supportingLine = 'Not a specification. A condition for the kind of work that needs room to happen.',
  } = section

  return (
    <section className="bridge" aria-label="Bridge">
      <div className="container">
        <div className="bridge__inner">
          <h2 className="bridge__headline">{headline}</h2>
          {supportingLine && (
            <p className="bridge__support">{supportingLine}</p>
          )}
        </div>
      </div>
    </section>
  )
}
