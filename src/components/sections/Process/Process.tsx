import { motion } from "framer-motion";
import { ProcessSection as ProcessSectionType } from "../../../types/sections";
import { Section } from "../../layout";
import { fadeUp, fadeIn, stagger, staggerFast, heroTransition, revealTransition, cardTransition, viewport } from "../../../lib/motion";

export const Process = ({
  overline,
  headline,
  intro,
  steps,
  bgColor,
}: ProcessSectionType) => {
  return (
    <Section bgColor={bgColor ?? "#FAF7F2"} paddingY="xl" maxWidth="2xl">

      {(overline || headline || intro) && (
        <motion.div
          className="mb-16 max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {overline && (
            <motion.p
              className="font-body text-body-xs text-text-muted uppercase tracking-widest mb-4"
              variants={fadeUp}
              transition={revealTransition}
            >
              {overline}
            </motion.p>
          )}
          {headline && (
            <motion.h2
              className="font-serif font-light text-text-primary text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight mb-4"
              variants={fadeUp}
              transition={heroTransition}
            >
              {headline}
            </motion.h2>
          )}
          {intro && (
            <motion.p
              className="font-body text-body-md text-text-secondary leading-relaxed"
              variants={fadeUp}
              transition={revealTransition}
            >
              {intro}
            </motion.p>
          )}
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-light"
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className="flex flex-col gap-8 pt-10 md:pt-0 md:px-10 first:pt-0 first:md:pl-0 last:md:pr-0"
            variants={fadeUp}
            transition={cardTransition}
          >
            {step.image && (
              <motion.div
                className="w-full aspect-video overflow-hidden"
                variants={fadeIn}
                transition={cardTransition}
              >
                <img
                  src={step.image.src}
                  alt={step.image.alt}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            <div className="flex flex-col gap-4">
              <span className="font-body text-body-xs text-text-muted uppercase tracking-widest">
                {step.number}
              </span>
              <h3 className="font-serif font-light text-text-primary text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.3] tracking-tight">
                {step.title}
              </h3>
              <p className="font-body text-body-md text-text-secondary leading-relaxed">
                {step.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
