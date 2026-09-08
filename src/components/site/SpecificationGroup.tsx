'use client'

import { useId, useState, useSyncExternalStore } from 'react'
import type { CurrentHomePage } from '@/types/sanity'

const mobileQuery = '(max-width: 760px)'
function subscribe(onChange: () => void) {
  const media = window.matchMedia(mobileQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches
const getServerSnapshot = () => false

export default function SpecificationGroup({ group, initiallyOpen }: {
  group: CurrentHomePage['specifications']['specificationGroups'][number]
  initiallyOpen: boolean
}) {
  const mobile = useSyncExternalStore(subscribe, getMobileSnapshot, getServerSnapshot)
  const [open, setOpen] = useState(initiallyOpen)
  const id = useId()

  // SSR and desktop always expose every fact. Collapse is a mobile enhancement,
  // so resizing from a collapsed mobile category cannot hide desktop content.
  return <article className="volume-group">
    <h3>{mobile ? (
      <button className="specification-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span>{group.title}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
      </button>
    ) : group.title}</h3>
    <ul id={id} hidden={mobile && !open}>
      {group.facts.map((item) => <li key={item._key || item.label}>{item.value}</li>)}
    </ul>
  </article>
}
