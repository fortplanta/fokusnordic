import React from "react";
import { motion } from "framer-motion";
import { ConceptBlockSection as ConceptBlockType } from "../../../types/sections";
import { Section } from "../../layout";
import { fadeUp, fadeIn, stagger, slowTransition, cardTransition, viewport } from "../../../lib/motion";

export const ConceptBlock: React.FC<ConceptBlockType> = ({
  headline,
  body,
  image,
  imagePosition = "right",
  pullQuote,
}) => {
  const isImageLeft = imagePosition === "left";

  return (
    <Section bgColor="#F5F3ED" paddingY="lg" maxWidth="xl" grid cols={2} gap="lg">
      {/* Text — staggered fade-up */}
      <motion.div
        className={isImageLeft ? "md:col-start-2" : ""}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {headline && (
          <motion.h2
            className="text-4xl md:text-5xl font-serif font-light text-navy-900 leading-tight mb-8"
            variants={fadeUp}
            transition={slowTransition}
          >
            {headline}
          </motion.h2>
        )}

        <div className="space-y-6">
          <motion.p
            className="text-base md:text-lg font-serif text-text-primary leading-relaxed"
            variants={fadeUp}
            transition={slowTransition}
          >
            {body}
          </motion.p>

          {pullQuote && (
            <motion.blockquote
              className="border-l-4 border-green-dark pl-6 italic text-text-secondary font-serif text-lg"
              variants={fadeUp}
              transition={slowTransition}
            >
              "{pullQuote}"
            </motion.blockquote>
          )}
        </div>
      </motion.div>

      {/* Image — simple fade */}
      {image && (
        <motion.div
          className={isImageLeft ? "md:col-start-1 md:row-start-1" : ""}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={cardTransition}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto object-cover rounded"
          />
          {image.caption && (
            <p className="text-sm text-text-secondary font-serif mt-4">
              {image.caption}
            </p>
          )}
        </motion.div>
      )}
    </Section>
  );
};
