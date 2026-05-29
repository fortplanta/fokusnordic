import { PageConfig, Section } from "../../types/sections";
import { Hero } from "../sections/Hero/Hero";
import { Statement } from "../sections/Statement/Statement";
import { ConceptBlock } from "../sections/ConceptBlock/ConceptBlock";
import { PropertyShowcase } from "../sections/PropertyShowcase/PropertyShowcase";
import { NeighborhoodGrid } from "../sections/NeighborhoodGrid/NeighborhoodGrid";
import { AmenitiesGrid } from "../sections/AmenitiesGrid/AmenitiesGrid";
import { ContactSection } from "../sections/ContactSection/ContactSection";
import { SpacesIndex } from "../sections/SpacesIndex/SpacesIndex";
import { Footer } from "../sections/Footer/Footer";
import { Testimonials } from "../sections/Testimonials/Testimonials";
import { Process } from "../sections/Process/Process";

interface PageRendererProps {
  config: PageConfig;
}

export const PageRenderer = ({ config }: PageRendererProps) => {
  const renderSection = (section: Section) => {
    switch (section.type) {
      case "hero":
        return <Hero key={section.id} {...section} />;
      case "statement":
        return <Statement key={section.id} {...section} />;
      case "concept":
        return <ConceptBlock key={section.id} {...section} />;
      case "property_showcase":
        return <PropertyShowcase key={section.id} {...section} />;
      case "neighborhood":
        return <NeighborhoodGrid key={section.id} {...section} />;
      case "amenities":
        return <AmenitiesGrid key={section.id} {...section} />;
      case "contact":
        return <ContactSection key={section.id} {...section} />;
      case "spaces_index":
        return <SpacesIndex key={section.id} {...section} />;
      case "footer":
        return <Footer key={section.id} {...section} />;
      case "testimonials":
        return <Testimonials key={section.id} {...section} />;
      case "process":
        return <Process key={section.id} {...section} />;
      default: {
        const s = section as { type: string };
        console.warn(`Unknown section type: ${s.type}`);
        return null;
      }
    }
  };

  // Sort sections by order if specified
  const sorted = [...config.sections].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <div className="w-full">
      {sorted.map((section) => renderSection(section))}
    </div>
  );
};
