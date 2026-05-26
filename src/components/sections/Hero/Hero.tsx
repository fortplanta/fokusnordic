import React from "react";
import { motion } from "framer-motion";
import { HeroSection as HeroSectionType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { Section } from "../../layout";
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
      <Section
        asChild
        bgImage={image ? { src: image.src, alt: image.alt } : undefined}
        overlay="dark"
        minHeight="100vh"
        paddingY="xl"
        maxWidth="xl"
      >
        <motion.section
          className="flex items-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="text-center md:text-left">
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
                <Button label={cta.label} href={cta.href} variant={cta.variant ?? "primary"} />
              </motion.div>
            )}
          </div>

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
        </motion.section>
      </Section>
    );
  }

  // Cream minimal variant
  return (
    <Section bgColor="#F5F3ED" paddingY="xl" maxWidth="md">
      <motion.div
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
            <Button label={cta.label} href={cta.href} variant={cta.variant ?? "primary"} />
          </motion.div>
        )}
      </motion.div>
    </Section>
  );
};
