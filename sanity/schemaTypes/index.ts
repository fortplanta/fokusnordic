// Documents
import siteSettings     from './documents/siteSettings'
import page             from './documents/page'
import floor            from './documents/floor'
import journalPost      from './documents/journalPost'
import poi              from './documents/poi'

// Section objects (used inside page.sections[])
import heroSection          from './sections/heroSection'
import statementSection     from './sections/statementSection'
import figuresSection       from './sections/figuresSection'
import testimonialSection   from './sections/testimonialSection'
import floorsSection        from './sections/floorsSection'
import neighbourhoodSection from './sections/neighbourhoodSection'
import journalSection       from './sections/journalSection'
import viewingSection       from './sections/viewingSection'

export const schemaTypes = [
  // Documents
  siteSettings,
  page,
  floor,
  journalPost,
  poi,
  // Section objects
  heroSection,
  statementSection,
  figuresSection,
  testimonialSection,
  floorsSection,
  neighbourhoodSection,
  journalSection,
  viewingSection,
]
