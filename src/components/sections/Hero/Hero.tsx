import React from "react";
import { motion } from "framer-motion";
import { HeroSection as HeroSectionType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { fadeUp, fadeIn, stagger, slowTransition, viewport } from "../../../lib/motion";

export const Hero: React.FC<HeroSectionType> = ({
  variant,
  headline,
  intro,
  image,
  cta,
}) => {
  if (variant === "dark_cinematic") {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        {image && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image.src})` }}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 1.2, ease: "easeOut" }}
            aria-hidden="true"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy-900 opacity-40" aria-hidden="true" />

        {/* Content stagger container */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center md:text-left"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white leading-tight mb-6"
            variants={fadeUp}
            transition={slowTransition}
          >
            {headline}
          </motion.h1>

          {intro && (
            <motion.p
              className="text-base md:text-lg text-gray-200 font-serif max-w-xl mb-8 leading-relaxed"
              variants={fadeUp}
              transition={slowTransition}
            >
              {intro}
            </motion.p>
          )}

          {cta && (
            <motion.div variants={fadeUp} transition={slowTransition}>
              <Button label={cta.label} href={cta.href} variant={cta.variant || "primary"} />
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm opacity-70"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 1, delay: 0.6 }}
        >
          scroll to explore
        </motion.div>
      </section>
    );
  }

  // Cream minimal variant
  return (
    <section className="w-full bg-cream-50 py-20 md:py-32">
      <motion.div
        className="max-w-4xl mx-auto px-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-serif font-light text-navy-900 leading-tight mb-8"
          variants={fadeUp}
          transition={slowTransition}
        >
          {headline}
        </motion.h1>

        {intro && (
          <motion.p
            className="text-base md:text-lg text-text-primary font-serif max-w-2xl leading-relaxed mb-8"
            variants={fadeUp}
            transition={slowTransition}
          >
            {intro}
          </motion.p>
        )}

        {cta && (
          <motion.div variants={fadeUp} transition={slowTransition}>
            <Button label={cta.label} href={cta.href} variant={cta.variant || "primary"} />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
