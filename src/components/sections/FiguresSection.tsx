import type { FiguresSection as T } from '@/types/sanity'

const DEFAULTS = [
  { value: '4.9m',         label: 'Ceiling height' },
  { value: '2',            label: 'Floors' },
  { value: '300m²',        label: 'Total area' },
  { value: '8 min',        label: 'To Slussen' },
  { value: '1917 / BREEAM',label: 'Built / Certified' },
]

export default function FiguresSection({ section }: { section: T }) {
  const figures = section.figures?.length ? section.figures : DEFAULTS

  return (
    <section className="figures" aria-label="Key figures">
      <div className="container">
        <dl className="figures__grid">
          {figures.map((fig, i) => (
            <div key={i} className="figures__item">
              <dt className="lbl">{fig.label}</dt>
              <dd className="val">{fig.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
