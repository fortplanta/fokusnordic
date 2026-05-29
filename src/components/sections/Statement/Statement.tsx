import { motion } from "framer-motion";
import { StatementSection as StatementSectionType } from "../../../types/sections";
import { Section } from "../../layout";
import { fadeUp, stagger, heroTransition, revealTransition, viewport } from "../../../lib/motion";

export const Statement = ({
  overline,
  headline,
  body,
  bgColor,
}: StatementSectionType) => {
  return (
    <Section
      bgColor={bgColor ?? "#F6F2EA"}
      paddingY="xl"
      maxWidth="2xl"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="max-w-3xl"
      >
        {overline && (
          <motion.p
            className="font-body text-body-xs text-terra uppercase tracking-widest mb-6"
            variants={fadeUp}
            transition={revealTransition}
          >
            {overline}
          </motion.p>
        )}

        {headline && (
          <motion.h2
            className="font-serif font-normal text-text-primary mb-8
                       text-[clamp(2rem,4vw,3rem)] leading-[1.2] tracking-tight"
            variants={fadeUp}
            transition={heroTransition}
          >
            {headline}
          </motion.h2>
        )}

        {body && (
          <motion.p
            className="font-body text-body-md text-text-secondary leading-relaxed max-w-xl"
            variants={fadeUp}
            transition={revealTransition}
          >
            {body}
          </motion.p>
        )}
      </motion.div>
    </Section>
  );
};
