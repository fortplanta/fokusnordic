import { motion } from "framer-motion";
import { ConceptBlockSection as ConceptBlockType } from "../../../types/sections";
import { Section } from "../../layout";
import {
  fadeUp,
  fadeIn,
  stagger,
  heroTransition,
  revealTransition,
  cardTransition,
  viewport,
} from "../../../lib/motion";

export const ConceptBlock = ({
  headline,
  body,
  image,
  imagePosition = "right",
  pullQuote,
}: ConceptBlockType) => {
  const isImageLeft = imagePosition === "left";

  return (
    <Section bgColor="#F6F2EA" paddingY="xl" maxWidth="xl">
      {/* 5/12 text + 7/12 image — matches handoff ratio */}
      <div
        className={`flex flex-col ${isImageLeft ? "md:flex-row-reverse" : "md:flex-row"} gap-12 md:gap-16 items-start`}
      >
        {/* Text column */}
        <motion.div
          className="flex-[5] min-w-0"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {headline && (
            <motion.h2
              className="font-serif font-light text-text-primary mb-8
                         text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight"
              variants={fadeUp}
              transition={heroTransition}
            >
              {headline}
            </motion.h2>
          )}

          <motion.p
            className="font-body text-body-md text-text-secondary leading-relaxed mb-6"
            variants={fadeUp}
            transition={revealTransition}
          >
            {body}
          </motion.p>

          {pullQuote && (
            <motion.blockquote
              className="border-l-2 border-green-dark pl-6 italic font-body text-body-md text-text-secondary"
              variants={fadeUp}
              transition={revealTransition}
            >
              "{pullQuote}"
            </motion.blockquote>
          )}
        </motion.div>

        {/* Image column */}
        {image && (
          <motion.div
            className="flex-[7] min-w-0"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={cardTransition}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto object-cover"
            />
            {image.caption && (
              <p className="font-body text-body-xs text-text-muted mt-3">
                {image.caption}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </Section>
  );
};
