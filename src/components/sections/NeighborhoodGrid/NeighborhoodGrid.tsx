import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeighborhoodGridSection as NeighborhoodGridType } from "../../../types/sections";
import { Section } from "../../layout";
import {
  fadeUp,
  fadeIn,
  stagger,
  staggerFast,
  heroTransition,
  revealTransition,
  cardTransition,
  viewport,
} from "../../../lib/motion";

const CATEGORY_LABELS: Record<string, string> = {
  cafe:        "Café",
  bar:         "Bar",
  restaurant:  "Restaurant",
  shop:        "Shop",
  nature:      "Nature",
  culture:     "Culture",
};

export const NeighborhoodGrid = ({
  headline,
  intro,
  spots,
  enableFilters,
}: NeighborhoodGridType) => {
  const [active, setActive] = useState<string | null>(null);

  const categories = Array.from(new Set(spots.map((s) => s.category)));
  const filtered = active ? spots.filter((s) => s.category === active) : spots;

  return (
    <Section bgColor="#F6F2EA" paddingY="xl" maxWidth="3xl">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mb-10"
      >
        {headline && (
          <motion.h2
            className="font-serif font-normal text-text-primary mb-4
                       text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight"
            variants={fadeUp}
            transition={heroTransition}
          >
            {headline}
          </motion.h2>
        )}
        {intro && (
          <motion.p
            className="font-body text-body-md text-text-secondary max-w-2xl"
            variants={fadeUp}
            transition={revealTransition}
          >
            {intro}
          </motion.p>
        )}
      </motion.div>

      {/* Filter chips */}
      {enableFilters && categories.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => setActive(null)}
            className={`font-body text-body-xs uppercase tracking-widest px-4 py-2 border transition-colors duration-[150ms]
              ${active === null
                ? "bg-text-primary text-text-inverse border-text-primary"
                : "bg-transparent text-text-secondary border-border-light hover:border-text-primary hover:text-text-primary"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat === active ? null : cat)}
              className={`font-body text-body-xs uppercase tracking-widest px-4 py-2 border transition-colors duration-[150ms]
                ${active === cat
                  ? "bg-text-primary text-text-inverse border-text-primary"
                  : "bg-transparent text-text-secondary border-border-light hover:border-text-primary hover:text-text-primary"
                }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </motion.div>
      )}

      {/* Spot grid — 4 columns at lg */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active ?? "all"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-light"
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          viewport={viewport}
        >
          {filtered.map((spot) => (
            <motion.article
              key={spot.id}
              className="bg-cream-50 p-6 flex flex-col"
              variants={fadeUp}
              transition={cardTransition}
            >
              {spot.image && (
                <div className="w-full aspect-[4/3] overflow-hidden mb-5">
                  <img
                    src={spot.image.src}
                    alt={spot.image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}

              <p className="font-body text-body-xs text-text-muted uppercase tracking-widest mb-2">
                {CATEGORY_LABELS[spot.category] ?? spot.category}
                {spot.distance && ` · ${spot.distance}`}
              </p>

              <h3 className="font-serif font-normal text-text-primary text-display-xs mb-3">
                {spot.name}
              </h3>

              <p className="font-body text-body-sm text-text-secondary leading-relaxed flex-grow">
                {spot.description}
              </p>

              {spot.tags && spot.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {spot.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="font-body text-body-xs text-text-muted border border-border-light px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {spot.link && (
                <a
                  href={spot.link}
                  className="font-body text-body-xs text-green-dark uppercase tracking-widest mt-4 inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
};
