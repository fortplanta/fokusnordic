import type { PageSection, JournalPost, LeasingContact } from '@/types/sanity'
import HeroSection          from '@/components/sections/HeroSection'
import StatementSection     from '@/components/sections/StatementSection'
import FiguresSection       from '@/components/sections/FiguresSection'
import TestimonialSection   from '@/components/sections/TestimonialSection'
import FloorsSection        from '@/components/sections/FloorsSection'
import NeighbourhoodSection from '@/components/sections/NeighbourhoodSection'
import JournalSection       from '@/components/sections/JournalSection'
import ViewingSection       from '@/components/sections/ViewingSection'

type RegistryProps = {
  section:  PageSection
  posts:    JournalPost[]
  contact?: LeasingContact
}

export function SectionRenderer({ section, posts, contact }: RegistryProps) {
  switch (section._type) {
    case 'heroSection':
      return <HeroSection section={section} />
    case 'statementSection':
      return <StatementSection section={section} />
    case 'figuresSection':
      return <FiguresSection section={section} />
    case 'testimonialSection':
      return <TestimonialSection section={section} />
    case 'floorsSection':
      return <FloorsSection section={section} contactEmail={contact?.email} />
    case 'neighbourhoodSection':
      return <NeighbourhoodSection section={section} />
    case 'journalSection':
      return <JournalSection section={section} posts={posts} />
    case 'viewingSection':
      return <ViewingSection section={section} contact={contact} />
    default:
      return null
  }
}
