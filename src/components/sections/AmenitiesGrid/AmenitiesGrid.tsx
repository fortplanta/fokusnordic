import React from "react";
import { motion } from "framer-motion";
import { AmenitiesGridSection as AmenitiesGridType } from "../../../types/sections";
import { Card } from "../../ui/Card";
import { fadeUp, stagger, staggerFast, slowTransition, cardTransition, viewport } from "../../../lib/motion";

export const AmenitiesGrid: React.FC<AmenitiesGridType> = ({
  headline,
  intro,
  amenities,
}) => {
  return (
    <section className="w-full bg-navy-900 py-20 md:py-32 text-white">
      <div className="max-w-6xl mx-auto px-8">

        {/* Section header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12"
        >
          {headline && (
            <motion.h2
              className="text-4xl md:text-5xl font-serif font-light mb-4"
              variants={fadeUp}
              transition={slowTransition}
            >
              {headline}
            </motion.h2>
          )}
          {intro && (
            <motion.p
              className="text-base md:text-lg font-serif text-gray-300 max-w-2xl"
              variants={fadeUp}
              transition={slowTransition}
            >
              {intro}
            </motion.p>
          )}
        </motion.div>

        {/* Amenity cards — staggered grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {amenities.map((amenity) => (
            <motion.div key={amenity.id} variants={fadeUp} transition={cardTransition}>
              <Card variant="dark">
                {amenity.image ? (
                  <img
                    src={amenity.image.src}
                    alt={amenity.image.alt}
                    className="w-full h-40 object-cover rounded mb-4 -m-6 mb-6"
                  />
                ) : amenity.icon ? (
                  <div className="text-4xl mb-4">{amenity.icon}</div>
                ) : null}

                <h3 className="text-xl font-serif font-light mb-2">{amenity.name}</h3>
                <p className="text-xs font-sans text-gray-400 uppercase tracking-wide mb-3">
                  {amenity.type}
                </p>
                <p className="text-sm font-serif text-gray-300 mb-4">{amenity.description}</p>
                {amenity.capacity && (
                  <p className="text-xs text-gray-400">
                    <span className="font-sans font-medium">Capacity: </span>
                    {amenity.capacity}
                  </p>
                )}
                {amenity.hours && (
                  <p className="text-xs text-gray-400">
                    <span className="font-sans font-medium">Hours: </span>
                    {amenity.hours}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
