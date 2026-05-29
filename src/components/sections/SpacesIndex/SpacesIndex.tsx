import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpacesIndexSection, Image } from "../../../types/sections";

// ── Layout constants ──────────────────────────────────────────────────────────
//
// These must match the Section component's "content" token so that the list's
// left edge aligns with every other section's content on the page.
//
//   max-w-content = 1920px = 120rem
//   px-8          = 2rem  =   32px
//
// The right-side image bleeds to the viewport edge.  Its left edge is
// calculated with the same math that Section.tsx uses to place content:
//
//   image-left = max( gutter + LIST_W, (vw - MAX_W) / 2 + GUTTER + LIST_W )
//
// When viewport ≤ 1920 px the first term wins; when larger the second does.
// Result: the image always starts exactly at the right edge of the list column.

const MAX_W  = "120rem";  // max-w-content = 1920px
const GUTTER = "2rem";    // md:px-8        =   32px (used in the centering calc)
const LIST_W = "320px";

// Minimum = mobile gutter (px-4 = 1rem) + list width.
// On md+ the second term takes over and aligns with the px-8 / centered container.
const IMAGE_LEFT = [
  `max(`,
  `  calc(1rem + ${LIST_W}),`,
  `  calc((100% - ${MAX_W}) / 2 + ${GUTTER} + ${LIST_W})`,
  `)`,
].join("");

// ── Types ─────────────────────────────────────────────────────────────────────

type ViewMode = "list" | "gallery";

// ── Component ─────────────────────────────────────────────────────────────────

export const SpacesIndex: React.FC<SpacesIndexSection> = ({
  logo = "Barnängshuset",
  instagramHandle = "@barnangshuset",
  navLinks,
  featuredImage,
  categories,
}) => {
  const allSpaces     = categories.flatMap((c) => c.spaces);
  const totalCount    = allSpaces.length;
  const defaultImage  = featuredImage ?? allSpaces.find((s) => s.image)?.image;

  const [activeImage, setActiveImage] = useState<Image | undefined>(defaultImage);
  const [view,        setView]        = useState<ViewMode>("list");

  const defaultNavLinks = navLinks ?? [
    { label: instagramHandle,  href: "#"        },
    { label: "Spaces",         href: "#spaces"  },
    { label: "About",          href: "#about"   },
    { label: "Contact",        href: "#contact" },
  ];

  // ── Shared container class ─────────────────────────────────────────────────
  // All content rows use this so the left edge of text aligns with every
  // other Section on the page (same rule as Section.tsx → maxWidth "xl").
  // px-4 md:px-8 matches Section.tsx's default paddingX="md" so content
  // left-edges align across every section on the page.
  const container = "max-w-content mx-auto w-full px-4 md:px-8";

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden select-none">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0">
        <div className={container}>
          <nav
            className="flex items-center justify-between py-6"
            aria-label="Primary"
          >
            <span className="font-serif text-[22px] tracking-[-0.01em] text-navy-900">
              {logo}
            </span>

            <ul className="flex items-center gap-9" role="list">
              {defaultNavLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-[11px] tracking-[0.12em] uppercase text-gray-400
                               hover:text-navy-900 transition-colors duration-150 font-sans"
                  >
                    {link.label}
                    {link.label === "Spaces" && (
                      <sup className="ml-px text-[8px] align-super">{totalCount}</sup>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-100" />
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      {/*
        The list column lives inside the shared max-width container so its
        left edge aligns with all other sections.

        The image is absolutely positioned from IMAGE_LEFT → right: 0, so it
        bleeds to the viewport edge regardless of container constraints.
      */}
      <main
        className="flex-1 relative overflow-hidden"
        onMouseLeave={() => setActiveImage(defaultImage)}
      >
        {/* Full-bleed image (right half → viewport edge) */}
        <AnimatePresence mode="sync" initial={false}>
          {activeImage && (
            <motion.img
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt ?? ""}
              className="absolute inset-y-0 right-0 h-full object-cover"
              style={{ left: IMAGE_LEFT }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Content: max-width container, list column only */}
        <div className={`${container} h-full relative z-10`}>
          <div
            style={{ width: LIST_W }}
            className="h-full overflow-y-auto py-8 scrollbar-none"
          >
            {categories.map((cat) => (
              <div key={cat.name} className="mb-10 last:mb-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400 mb-4 font-sans">
                  {cat.name}
                </p>

                <ul className="space-y-[10px]">
                  {cat.spaces.map((space) => (
                    <li key={space.id}>
                      <a
                        href={`#${space.id}`}
                        className="group flex items-baseline gap-2.5 font-serif
                                   text-[14px] text-navy-900 leading-snug"
                        onMouseEnter={() => space.image && setActiveImage(space.image)}
                      >
                        <span className="transition-opacity duration-150 group-hover:opacity-40">
                          {space.name}
                        </span>

                        {space.status === "reserved" && (
                          <span className="text-[9px] uppercase tracking-[0.12em]
                                           text-gray-400 font-sans transition-opacity
                                           duration-150 group-hover:opacity-40">
                            Reserved
                          </span>
                        )}
                        {space.status === "leased" && (
                          <span className="text-[9px] uppercase tracking-[0.12em]
                                           text-gray-300 font-sans transition-opacity
                                           duration-150 group-hover:opacity-40">
                            Leased
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="flex-shrink-0 border-t border-gray-100">
        <div className={`${container} flex items-center gap-5 py-3.5`}>
          {(["gallery", "list"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              className={[
                "text-[10px] uppercase tracking-[0.14em] font-sans transition-colors duration-150",
                view === mode
                  ? "text-navy-900 border-b border-navy-900 pb-px"
                  : "text-gray-400 hover:text-navy-900",
              ].join(" ")}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
