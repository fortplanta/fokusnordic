import Image from 'next/image'
import type { ViewingSection as T, LeasingContact } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import ViewingForm from './ViewingForm'

export default function ViewingSection({
  section,
  contact,
}: {
  section: T
  contact?: LeasingContact
}) {
  const {
    heading  = 'See it in person.',
    bodyText = 'Spaces like this read differently in photographs. The light, the volume, the quiet — come and spend an hour.',
  } = section

  const photoSrc = contact?.photo?.asset?.url
    ? urlFor(contact.photo).width(400).url()
    : '/assets/img-portrait.jpg'

  return (
    <section className="viewing" id="viewing" aria-label="Arrange a viewing">
      <div className="container">
        <div className="viewing__grid">
          {/* Agent */}
          <div className="viewing__agent">
            <div className="viewing__photo" aria-hidden={!contact?.name}>
              <Image
                src={photoSrc}
                alt={contact?.name ? `Photo of ${contact.name}` : 'Leasing agent'}
                fill
                sizes="160px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {contact?.name && (
              <>
                <span className="viewing__name">{contact.name}</span>
                {contact.role && (
                  <span className="viewing__role">{contact.role}</span>
                )}
                <div className="viewing__contact">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                      {contact.phone}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Body */}
          <div className="viewing__body" data-fade>
            <h2>{heading}</h2>
            <p>{bodyText}</p>
          </div>

          {/* Form CTA — expand to inline form on click, or direct email fallback */}
          <div className="viewing__cta-wrap" data-fade data-delay="0.1">
            <ViewingForm agentEmail={contact?.email} />
          </div>
        </div>
      </div>
    </section>
  )
}
