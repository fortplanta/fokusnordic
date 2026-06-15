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
import bridgeSection        from './sections/bridgeSection'
import floorsSection        from './sections/floorsSection'
import neighbourhoodSection  from './sections/neighbourhoodSection'
import rationalCaseSection  from './sections/rationalCaseSection'
import journalSection        from './sections/journalSection'
import viewingSection       from './sections/viewingSection'
import gallerySection       from './sections/gallerySection'
import neighbourhoodDetailsSection from './sections/neighbourhoodDetailsSection'

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
  bridgeSection,
  floorsSection,
  neighbourhoodSection,
  rationalCaseSection,
  journalSection,
  viewingSection,
  gallerySection,
  neighbourhoodDetailsSection,
]
