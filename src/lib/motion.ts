/**
 * Shared Framer Motion animation system.
 * Import variants and viewport config into any section component.
 */
import type { Variants, Transition } from "framer-motion";

// ── Easing curves ──────────────────────────────────────────────────────────
/** Expo out — the signature curve of this site */
export const expo = [0.16, 1, 0.3, 1] as const;
/** Power3 inOut — used for slow builds */
export const power3 = [0.17, 0.55, 0.55, 1] as const;

// ── Shared viewport config ─────────────────────────────────────────────────
/** Standard whileInView trigger — fires once, 80px before element enters */
export const viewport = { once: true, margin: "-80px 0px" } as const;

// ── Transitions ────────────────────────────────────────────────────────────
export const slowTransition: Transition = { duration: 0.9, ease: expo };
export const cardTransition: Transition = { duration: 0.7, ease: expo };

// ── Variants ───────────────────────────────────────────────────────────────

/** Headline / intro — fade and rise from below */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/** Image / overlay — simple opacity */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Text reveal — text rises out of a clipped container */
export const maskReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/** Stagger wrapper — 0.12 s between children, good for 2–4 items */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Stagger wrapper — 0.07 s between children, good for card grids */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.03 },
  },
};
