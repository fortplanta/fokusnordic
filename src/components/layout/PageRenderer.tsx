import React from "react";
import { PageConfig, Section } from "../../types/sections";
import { Hero } from "../sections/Hero/Hero";
import { ConceptBlock } from "../sections/ConceptBlock/ConceptBlock";
import { PropertyShowcase } from "../sections/PropertyShowcase/PropertyShowcase";
import { NeighborhoodGrid } from "../sections/NeighborhoodGrid/NeighborhoodGrid";
import { AmenitiesGrid } from "../sections/AmenitiesGrid/AmenitiesGrid";
import { ContactSection } from "../sections/ContactSection/ContactSection";

interface PageRendererProps {
  config: PageConfig;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ config }) => {
  const renderSection = (section: Section) => {
    switch (section.type) {
      case "hero":
        return <Hero key={section.id} {...section} />;
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
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  };

  // Sort sections by order if specified
  const sortedSections = [...config.sections].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <div className="w-full">
      {sortedSections.map((section) => renderSection(section))}
    </div>
  );
};
