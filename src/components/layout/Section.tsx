import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { VisualSurface, type VisualSurfaceProps } from "./VisualSurface";

// ── Token maps ────────────────────────────────────────────────────────────────

export type SectionMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
export type SectionPaddingX = "none" | "sm" | "md" | "lg";
export type SectionPaddingY = "none" | "sm" | "md" | "lg" | "xl";
export type SectionCols = 1 | 2 | 3 | 4 | 6 | 12;
export type SectionGap = "sm" | "md" | "lg" | "xl" | "2xl";
export type SectionAlign = "start" | "center" | "end";

const MAX_WIDTH: Record<SectionMaxWidth, string> = {
  sm:   "max-w-2xl",       //  672px
  md:   "max-w-4xl",       //  896px
  lg:   "max-w-6xl",       // 1152px
  xl:   "max-w-7xl",       // 1280px
  "2xl":"max-w-content",   // 1920px — standard content container (see tailwind.config.ts)
  "3xl":"max-w-content",   // 1920px — alias kept for backward compat
  full: "max-w-none",
};

const PADDING_X: Record<SectionPaddingX, string> = {
  none: "px-0",
  sm:   "px-4",
  md:   "px-4 md:px-8",
  lg:   "px-4 md:px-8 lg:px-16",
};

const PADDING_Y: Record<SectionPaddingY, string> = {
  none: "py-0",
  sm:   "py-8",
  md:   "py-12 md:py-16",
  lg:   "py-16 md:py-24",
  xl:   "py-20 md:py-32",
};

// Responsive column defaults: always 1 on mobile, expand at larger breakpoints
const COLS: Record<SectionCols, string> = {
  1:  "grid-cols-1",
  2:  "grid-cols-1 sm:grid-cols-2",
  3:  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4:  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6:  "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-12",
};

const GAP: Record<SectionGap, string> = {
  sm:   "gap-4",
  md:   "gap-8",
  lg:   "gap-12",
  xl:   "gap-[72px]",
  "2xl":"gap-[96px]",
};

const ALIGN: Record<SectionAlign, string> = {
  start:  "items-start",
  center: "items-center",
  end:    "items-end",
};

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SectionProps
  extends Omit<VisualSurfaceProps, "asChild" | "className" | "style" | "overlayGradient"> {
  /** CSS gradient overlay — forwarded to VisualSurface */
  overlayGradient?: string;
  // Container
  maxWidth?: SectionMaxWidth;
  paddingX?: SectionPaddingX;
  paddingY?: SectionPaddingY;

  // Grid
  grid?: boolean;
  cols?: SectionCols;
  gap?: SectionGap;
  align?: SectionAlign;

  /**
   * Stamps `.is--hero` on the section element.
   * CSS sets `min-height: 100dvh` so the section fills the full viewport,
   * and the section reads `--nav-height` (set by Nav) to correctly position
   * any absolutely-placed top content beneath the fixed navbar.
   * Toggle off to collapse back to normal content-driven height.
   */
  isHero?: boolean;

  /**
   * Adds `scroll-margin-top: var(--nav-height)` so anchor links (#section)
   * scroll to the right place instead of disappearing behind the fixed nav.
   */
  navOffset?: boolean;

  /**
   * Merges Section's layout classes (padding, max-width, grid) onto the
   * single child element — replacing the default `<section>` tag without
   * adding any extra wrapper divs.
   *
   * The inner container `<div>` is also skipped; the child element IS the
   * container. Background layers (color / image / video / overlay) are still
   * provided by an outer VisualSurface div.
   *
   * @example
   * <Section asChild paddingY="xl" maxWidth="lg" bgImage={img} overlay="dark_strong">
   *   <header>
   *     <h1>Barnängshuset</h1>
   *   </header>
   * </Section>
   */
  asChild?: boolean;

  /** className for the outer VisualSurface (full-bleed layer) */
  surfaceClassName?: string;
  /** className for the semantic section element */
  className?: string;
  /** className for the inner container div (ignored when asChild) */
  innerClassName?: string;
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Full-section layout block. Composes a VisualSurface (full-bleed bg) with a
 * centered, max-width content container and an optional 12-column grid system.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      // Visual surface
      bgColor,
      bgImage,
      bgVideo,
      overlay,
      overlayGradient,
      minHeight,
      // Container
      maxWidth = "2xl",
      paddingX = "md",
      paddingY = "lg",
      // Grid
      grid = false,
      cols = 3,
      gap = "md",
      align = "start",
      // Composition
      asChild = false,
      isHero = false,
      navOffset = false,
      surfaceClassName,
      className,
      innerClassName,
      style,
      children,
    },
    ref
  ) => {
    const hasSurface = !!(bgColor || bgImage || bgVideo || overlay || overlayGradient || minHeight);

    // Build scroll-margin style when navOffset is set
    const navOffsetStyle: React.CSSProperties = navOffset
      ? { scrollMarginTop: "var(--nav-height, 64px)" }
      : {};

    const gridClasses = grid
      ? cn("grid", COLS[cols], GAP[gap], ALIGN[align])
      : undefined;

    // ── asChild path ─────────────────────────────────────────────────────────
    // Radix Slot merges Section's layout classes onto the single child element.
    // The child becomes both the semantic wrapper AND the max-width container.
    // No inner <div> is added — one less DOM node.
    if (asChild) {
      const containerClasses = cn(
        "relative z-10",
        isHero && "is--hero",
        PADDING_Y[paddingY],
        MAX_WIDTH[maxWidth],
        PADDING_X[paddingX],
        "mx-auto w-full",
        gridClasses,
        className
      );

      const slotContent = (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={containerClasses}
          style={{ ...navOffsetStyle, ...style }}
        >
          {children}
        </Slot>
      );

      if (hasSurface) {
        return (
          <VisualSurface
            bgColor={bgColor}
            bgImage={bgImage}
            bgVideo={bgVideo}
            overlay={overlay}
            overlayGradient={overlayGradient}
            minHeight={minHeight}
            className={surfaceClassName}
          >
            {slotContent}
          </VisualSurface>
        );
      }

      return slotContent;
    }

    // ── default path ─────────────────────────────────────────────────────────
    const sectionEl = (
      <section
        ref={ref}
        className={cn("relative z-10", isHero && "is--hero", PADDING_Y[paddingY], className)}
        style={{ ...navOffsetStyle, ...style }}
      >
        <div
          className={cn(
            "mx-auto w-full",
            MAX_WIDTH[maxWidth],
            PADDING_X[paddingX],
            gridClasses,
            innerClassName
          )}
        >
          {children}
        </div>
      </section>
    );

    if (hasSurface) {
      return (
        <VisualSurface
          bgColor={bgColor}
          bgImage={bgImage}
          bgVideo={bgVideo}
          overlay={overlay}
          minHeight={minHeight}
          className={surfaceClassName}
        >
          {sectionEl}
        </VisualSurface>
      );
    }

    return sectionEl;
  }
);

Section.displayName = "Section";
