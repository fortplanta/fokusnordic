import { motion } from "framer-motion";
import { AmenitiesGridSection as AmenitiesGridType } from "../../../types/sections";
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

export const AmenitiesGrid = ({
  headline,
  intro,
  amenities,
}: AmenitiesGridType) => {
  return (
    <Section bgColor="#F6F2EA" paddingY="xl" maxWidth="3xl">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mb-12"
      >
        {headline && (
          <motion.h2
            className="font-serif font-normal text-text-primary mb-4
                       text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight"
            variants={fadeUp}
            transition={heroTransition}
          >
            {headline}
          </motion.h2>
        )}
        {intro && (
          <motion.p
            className="font-body text-body-md text-text-secondary max-w-2xl"
            variants={fadeUp}
            transition={revealTransition}
          >
            {intro}
          </motion.p>
        )}
      </motion.div>

      {/* Grid — internal borders only (no outer borders) */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-border-light"
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {amenities.map((amenity) => (
          <motion.article
            key={amenity.id}
            className="p-8 flex flex-col"
            variants={fadeUp}
            transition={cardTransition}
          >
            {amenity.image ? (
              <div className="w-full aspect-video overflow-hidden mb-6">
                <img
                  src={amenity.image.src}
                  alt={amenity.image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ) : amenity.icon ? (
              <div className="text-3xl mb-5" aria-hidden="true">{amenity.icon}</div>
            ) : null}

            <p className="font-body text-body-xs text-text-muted uppercase tracking-widest mb-3">
              {amenity.type}
            </p>

            <h3 className="font-serif font-normal text-text-primary text-display-xs mb-3">
              {amenity.name}
            </h3>

            <p className="font-body text-body-sm text-text-secondary leading-relaxed flex-grow">
              {amenity.description}
            </p>

            {(amenity.capacity || amenity.hours) && (
              <div className="mt-5 pt-5 border-t border-border-light flex gap-6">
                {amenity.capacity && (
                  <p className="font-body text-body-xs text-text-muted">
                    <span className="font-medium text-text-secondary">Cap. </span>
                    {amenity.capacity}
                  </p>
                )}
                {amenity.hours && (
                  <p className="font-body text-body-xs text-text-muted">
                    <span className="font-medium text-text-secondary">Hours </span>
                    {amenity.hours}
                  </p>
                )}
              </div>
            )}
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
};
