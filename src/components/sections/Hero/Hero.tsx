import { motion } from "framer-motion";
import { HeroSection as HeroSectionType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { Section } from "../../layout";
import {
  fadeUp,
  fadeIn,
  stagger,
  heroTransition,
  revealTransition,
  viewport,
} from "../../../lib/motion";

// Two-layer gradient: bottom darkens for text legibility, top darkens for nav legibility
const HERO_GRADIENT =
  "linear-gradient(to top,   rgba(19,16,13,0.72) 0%, rgba(19,16,13,0.30) 45%, transparent 70%), " +
  "linear-gradient(to bottom, rgba(0,0,0,0.45)   0%, transparent 22%)";

export const Hero = ({
  variant,
  headline,
  intro,
  image,
  cta,
}: HeroSectionType) => {

  // ── Dark Cinematic ───────────────────────────────────────────────────────
  if (variant === "dark_cinematic") {
    return (
      <Section
        asChild
        isHero           // → stamps .is--hero (min-height: 100dvh via CSS)
        bgImage={image ? { src: image.src, alt: image.alt } : undefined}
        overlayGradient={HERO_GRADIENT}
        paddingY="none"
        maxWidth="3xl"
      >
        <motion.section
          className="flex flex-col justify-end pb-16 md:pb-24"
          initial="hidden"
          animate="visible"
          viewport={viewport}
        >
          {/* Background scale-in */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          />


          {/* Top labels — positioned below the nav using --nav-height */}
          <motion.div
            className="absolute left-0 right-0 z-10"
            style={{ top: "var(--nav-height, 64px)" }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="max-w-content mx-auto w-full px-4 md:px-8 flex items-center justify-between pt-4">
              <span className="text-body-xs font-body text-text-inverse/70 uppercase tracking-widest">
                Stockholm
              </span>
              <span className="text-body-xs font-body text-text-inverse/70 uppercase tracking-widest">
                Est. 1899
              </span>
            </div>
          </motion.div>

          {/* Bottom-anchored content */}
          <div className="relative z-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {headline && (
                <motion.h1
                  className="font-serif font-light text-text-inverse mb-6
                             text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] tracking-tight"
                  variants={fadeUp}
                  transition={heroTransition}
                >
                  {headline}
                </motion.h1>
              )}

              {intro && (
                <motion.p
                  className="font-body text-body-md text-text-inverse/80 max-w-lg mb-10 leading-relaxed"
                  variants={fadeUp}
                  transition={revealTransition}
                >
                  {intro}
                </motion.p>
              )}

              {cta && (
                <motion.div variants={fadeUp} transition={revealTransition}>
                  <Button
                    label={cta.label}
                    href={cta.href}
                    variant={cta.variant ?? "primary"}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 right-8 z-10 text-text-inverse/50
                       text-body-xs font-body uppercase tracking-widest
                       flex items-center gap-2"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <span className="block w-6 h-px bg-text-inverse/40" />
            Scroll
          </motion.div>
        </motion.section>
      </Section>
    );
  }

  // ── Cream Minimal ────────────────────────────────────────────────────────
  return (
    <Section bgColor="#F6F2EA" paddingY="xl" maxWidth="xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {headline && (
          <motion.h1
            className="font-serif font-light text-text-primary mb-8
                       text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] tracking-tight"
            variants={fadeUp}
            transition={heroTransition}
          >
            {headline}
          </motion.h1>
        )}

        {intro && (
          <motion.p
            className="font-body text-body-md text-text-secondary max-w-2xl mb-10 leading-relaxed"
            variants={fadeUp}
            transition={revealTransition}
          >
            {intro}
          </motion.p>
        )}

        {cta && (
          <motion.div variants={fadeUp} transition={revealTransition}>
            <Button
              label={cta.label}
              href={cta.href}
              variant={cta.variant ?? "primary"}
            />
          </motion.div>
        )}
      </motion.div>
    </Section>
  );
};
