import React from "react";
import { motion } from "framer-motion";
import { PropertyShowcaseSection as PropertyShowcaseType } from "../../../types/sections";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { fadeUp, stagger, staggerFast, slowTransition, cardTransition, viewport } from "../../../lib/motion";

export const PropertyShowcase: React.FC<PropertyShowcaseType> = ({
  headline,
  intro,
  properties,
}) => {
  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      available: "bg-green-dark text-white",
      reserved: "bg-yellow-500 text-navy-900",
      leased: "bg-gray-400 text-white",
    };
    return colors[status] || colors.available;
  };

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

        {/* Property cards — staggered grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {properties.map((property) => (
            <motion.div key={property.id} variants={fadeUp} transition={cardTransition}>
              <Card variant="dark" className="flex flex-col h-full">
                {property.image && (
                  <img
                    src={property.image.src}
                    alt={property.image.alt}
                    className="w-full h-48 object-cover rounded mb-4 -m-6 mb-6"
                  />
                )}

                <div className="mb-4">
                  <span className={`text-xs font-sans font-medium px-3 py-1 rounded ${statusBadge(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-light mb-2">{property.name}</h3>

                {property.floor && (
                  <p className="text-sm text-gray-300 mb-2">Floor {property.floor}</p>
                )}
                {property.sqm && (
                  <p className="text-sm text-gray-300 mb-4">{property.sqm} sqm</p>
                )}
                {property.details && (
                  <p className="text-sm text-gray-400 mb-6 flex-grow">{property.details}</p>
                )}
                {property.ctaLabel && (
                  <Button label={property.ctaLabel} variant="secondary" fullWidth />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
