/**
 * Section Types & Page Configuration
 * 
 * Centralized TypeScript interfaces that define:
 * - What each section type accepts (props)
 * - How the CMS JSON must be structured
 * - Type safety for component rendering
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseSection {
  id: string;
  type: string;
  order?: number;
}

export interface Image {
  src: string;
  alt: string;
  caption?: string;
}

export interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
}

// ============================================================================
// SECTION TYPES
// ============================================================================

export interface HeroSection extends BaseSection {
  type: "hero";
  variant: "dark_cinematic" | "cream_minimal";
  headline: string;
  intro?: string;
  image?: Image;
  cta?: CTA;
}

export interface ConceptBlockSection extends BaseSection {
  type: "concept";
  headline?: string;
  body: string;
  image?: Image;
  imagePosition?: "left" | "right";
  pullQuote?: string;
}

export interface PropertyShowcaseSection extends BaseSection {
  type: "property_showcase";
  headline?: string;
  intro?: string;
  properties: Property[];
}

export interface Property {
  id: string;
  name: string;
  floor?: string;
  sqm?: number;
  status: "available" | "reserved" | "leased";
  image?: Image;
  details?: string;
  ctaLabel?: string;
}

export interface NeighborhoodGridSection extends BaseSection {
  type: "neighborhood";
  headline?: string;
  intro?: string;
  spots: LocalSpot[];
  enableFilters?: boolean;
}

export interface LocalSpot {
  id: string;
  name: string;
  category: "cafe" | "bar" | "restaurant" | "shop" | "nature" | "culture";
  distance?: string;
  time?: string;
  description: string;
  image?: Image;
  link?: string;
  tags?: string[];
}

export interface AmenitiesGridSection extends BaseSection {
  type: "amenities";
  headline?: string;
  intro?: string;
  amenities: Amenity[];
}

export interface Amenity {
  id: string;
  name: string;
  type: "gym" | "lounge" | "cafe" | "restaurant" | "conference" | "other";
  description: string;
  image?: Image;
  capacity?: string;
  hours?: string;
  icon?: string;
}

export interface ContactSectionConfig extends BaseSection {
  type: "contact";
  headline?: string;
  intro?: string;
  formFields?: FormField[];
  teamMembers?: TeamMember[];
  address?: string;
  phone?: string;
  email?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: Image;
  email?: string;
  phone?: string;
}

// ============================================================================
// STATEMENT (overline + large serif headline)
// ============================================================================

export interface StatementSection extends BaseSection {
  type: "statement";
  overline?: string;
  headline: string;
  body?: string;
  bgColor?: string;
}

// ============================================================================
// FOOTER
// ============================================================================

export interface FooterSection extends BaseSection {
  type: "footer";
  address?: string;
  phone?: string;
  email?: string;
  links?: { label: string; href: string }[];
  legalText?: string;
}

// ============================================================================
// SPACES INDEX (INGRAO-style full-viewport list + image)
// ============================================================================

export interface SpaceItem {
  id: string;
  name: string;
  status?: "available" | "reserved" | "leased";
  image?: Image;
}

export interface SpaceCategory {
  name: string;
  spaces: SpaceItem[];
}

export interface SpacesIndexSection extends BaseSection {
  type: "spaces_index";
  logo?: string;
  instagramHandle?: string;
  navLinks?: { label: string; href: string }[];
  featuredImage?: Image;
  categories: SpaceCategory[];
}

// ============================================================================
// UNION TYPE FOR ALL SECTIONS
// ============================================================================

export type Section =
  | HeroSection
  | StatementSection
  | ConceptBlockSection
  | PropertyShowcaseSection
  | NeighborhoodGridSection
  | AmenitiesGridSection
  | ContactSectionConfig
  | SpacesIndexSection
  | FooterSection;

// ============================================================================
// PAGE CONFIGURATION
// ============================================================================

export interface PageMetadata {
  title: string;
  description: string;
  lang: "sv" | "en";
  version?: string;
}

export interface PageConfig {
  metadata: PageMetadata;
  sections: Section[];
}

// ============================================================================
// TYPE GUARDS (for rendering)
// ============================================================================

export function isHeroSection(section: Section): section is HeroSection {
  return section.type === "hero";
}

export function isConceptSection(section: Section): section is ConceptBlockSection {
  return section.type === "concept";
}

export function isPropertyShowcase(section: Section): section is PropertyShowcaseSection {
  return section.type === "property_showcase";
}

export function isNeighborhoodGrid(section: Section): section is NeighborhoodGridSection {
  return section.type === "neighborhood";
}

export function isAmenitiesGrid(section: Section): section is AmenitiesGridSection {
  return section.type === "amenities";
}

export function isContactSection(section: Section): section is ContactSectionConfig {
  return section.type === "contact";
}
