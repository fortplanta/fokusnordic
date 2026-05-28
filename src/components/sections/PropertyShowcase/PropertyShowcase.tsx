import { motion } from "framer-motion";
import { PropertyShowcaseSection as PropertyShowcaseType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { Section } from "../../layout";
import {
  fadeUp,
  stagger,
  staggerFast,
  heroTransition,
  revealTransition,
  cardTransition,
  viewport,
} from "../../../lib/motion";

const STATUS_STYLES: Record<string, string> = {
  available: "text-green-dark border-green-dark",
  reserved:  "text-terra border-terra",
  leased:    "text-text-muted border-stone-400",
};

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  reserved:  "Reserved",
  leased:    "Leased",
};

export const PropertyShowcase = ({
  headline,
  intro,
  properties,
}: PropertyShowcaseType) => {
  return (
    <Section
      bgColor="#13100D"
      paddingY="xl"
      maxWidth="3xl"
      surfaceClassName="relative overflow-hidden"
    >
      {/* Subtle twill pattern watermark */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-twill bg-repeat pointer-events-none"
        aria-hidden="true"
      />

      {/* Section header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mb-12 relative z-10"
      >
        {headline && (
          <motion.h2
            className="font-serif font-light text-text-inverse mb-4
                       text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight"
            variants={fadeUp}
            transition={heroTransition}
          >
            {headline}
          </motion.h2>
        )}
        {intro && (
          <motion.p
            className="font-body text-body-md text-text-inverse/60 max-w-2xl"
            variants={fadeUp}
            transition={revealTransition}
          >
            {intro}
          </motion.p>
        )}
      </motion.div>

      {/* Property cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-400/20 relative z-10"
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {properties.map((property) => (
          <motion.div
            key={property.id}
            className="bg-deep p-8 flex flex-col"
            variants={fadeUp}
            transition={cardTransition}
          >
            {property.image && (
              <div className="w-full aspect-[4/3] overflow-hidden mb-6">
                <img
                  src={property.image.src}
                  alt={property.image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            )}

            {/* Status chip */}
            <span
              className={`font-body text-body-xs uppercase tracking-widest border px-3 py-1 self-start mb-4 ${STATUS_STYLES[property.status] ?? STATUS_STYLES.available}`}
            >
              {STATUS_LABELS[property.status] ?? property.status}
            </span>

            <h3 className="font-serif font-light text-text-inverse text-display-xs mb-2">
              {property.name}
            </h3>

            <div className="flex gap-4 mb-4">
              {property.floor && (
                <p className="font-body text-body-xs text-text-inverse/50 uppercase tracking-wide">
                  Floor {property.floor}
                </p>
              )}
              {property.sqm && (
                <p className="font-body text-body-xs text-text-inverse/50 uppercase tracking-wide">
                  {property.sqm} m²
                </p>
              )}
            </div>

            {property.details && (
              <p className="font-body text-body-sm text-text-inverse/60 mb-6 flex-grow">
                {property.details}
              </p>
            )}

            {property.ctaLabel && (
              <Button label={property.ctaLabel} variant="ghost" fullWidth />
            )}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
