/**
 * Shared Framer Motion animation system.
 * Import variants and viewport config into any section component.
 */
import type { Variants, Transition } from "framer-motion";

// ── Easing curves ──────────────────────────────────────────────────────────
/** Standard glide — smooth, ends soft */
export const glide     = [0.25, 0.10, 0.25, 1.00] as const;
/** Decelerate — elements arriving from below */
export const enter     = [0.00, 0.00, 0.20, 1.00] as const;
/** Accelerate — elements leaving */
export const exit      = [0.40, 0.00, 1.00, 1.00] as const;
/** Editorial — hero type, elegant overshoot */
export const editorial = [0.16, 1.00, 0.30, 1.00] as const;

// Legacy aliases (keep old names working in existing components)
/** @deprecated use `editorial` */
export const expo    = editorial;
/** @deprecated use `glide` */
export const power3  = [0.17, 0.55, 0.55, 1] as const;

// ── Shared viewport config ─────────────────────────────────────────────────
/** Standard whileInView trigger — fires once, 80px before element enters */
export const viewport = { once: true, margin: "-80px 0px" } as const;

// ── Transitions ────────────────────────────────────────────────────────────

/** Section headline / intro reveal — 500ms, decelerate */
export const revealTransition: Transition = {
  duration: 0.5,
  ease: enter,
};

/** Hero / cinematic slow build — 800ms, editorial overshoot */
export const heroTransition: Transition = {
  duration: 0.8,
  ease: editorial,
};

/** Standard card/element transition — 700ms, editorial */
export const cardTransition: Transition = {
  duration: 0.7,
  ease: editorial,
};

/** Slow, languid reveal — 900ms, editorial */
export const slowTransition: Transition = {
  duration: 0.9,
  ease: editorial,
};

// ── Variants ───────────────────────────────────────────────────────────────

/**
 * Content reveal — fade and rise 16px (matches --reveal-offset-y token).
 * Use with `revealTransition` or `slowTransition`.
 */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/** Image / overlay — simple opacity fade */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

/** Text reveal — text rises out of a clipped container */
export const maskReveal: Variants = {
  hidden:  { y: "110%" },
  visible: { y: "0%" },
};

/**
 * Stagger wrapper — 80ms stagger, good for 3–6 text children.
 * Matches --reveal-stagger token.
 */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Tighter stagger — 60ms, good for card grids (4–8 items) */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};
