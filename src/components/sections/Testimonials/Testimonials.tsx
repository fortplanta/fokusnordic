import { motion } from "framer-motion";
import { TestimonialsSection as TestimonialsSectionType } from "../../../types/sections";
import { Section } from "../../layout";
import { fadeUp, fadeIn, stagger, staggerFast, heroTransition, revealTransition, cardTransition, viewport } from "../../../lib/motion";

export const Testimonials = ({
  overline,
  headline,
  items,
  bgColor,
}: TestimonialsSectionType) => {
  return (
    <Section bgColor={bgColor ?? "#F6F2EA"} paddingY="xl" maxWidth="2xl">

      {(overline || headline) && (
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
              className="font-serif font-light text-text-primary text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight"
              variants={fadeUp}
              transition={heroTransition}
            >
              {headline}
            </motion.h2>
          )}
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-light"
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {items.map((item) => (
          <motion.figure
            key={item.id}
            className="bg-[#F6F2EA] p-10 md:p-16 flex flex-col justify-between gap-12"
            variants={fadeIn}
            transition={cardTransition}
          >
            <blockquote className="font-serif font-light text-text-primary text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.4] tracking-tight">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="flex flex-col gap-1">
              <span className="font-body text-body-sm text-text-primary font-medium">
                {item.author}
              </span>
              {(item.role || item.company) && (
                <span className="font-body text-body-xs text-text-muted">
                  {[item.role, item.company].filter(Boolean).join(", ")}
                </span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
};
