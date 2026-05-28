import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

// Split into two column groups — mirrors the reference layout
const LINKS_A = [
  { label: "Spaces",    href: "#spaces" },
  { label: "Amenities", href: "#amenities" },
];
const LINKS_B = [
  { label: "Neighborhood", href: "#neighborhood" },
  { label: "Contact",      href: "#contact" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Publish real nav height as --nav-height on :root so any section can offset correctly
  useEffect(() => {
    const publish = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 64;
      document.documentElement.style.setProperty("--nav-height", `${h}px`);
    };
    publish();
    window.addEventListener("resize", publish, { passive: true });
    return () => window.removeEventListener("resize", publish);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = cn(
    "relative block font-body text-body-sm",
    "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full",
    "after:origin-left after:scale-x-0 hover:after:scale-x-100",
    "after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.25,0.1,0.25,1)]",
  );

  return (
    <motion.header
      ref={headerRef}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all",
        scrolled
          ? "bg-cream-50/95 backdrop-blur-md border-b border-border-light"
          : "bg-transparent"
      )}
      style={{
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.25, 0.10, 0.25, 1)",
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* 5-column grid — logo | gap | links-A | links-B | cta */}
      <div className="max-w-[1664px] mx-auto w-full px-4 md:px-8 py-4 md:py-5 grid grid-cols-5 items-start">

        {/* Col 1 — logo */}
        <a href="/" aria-label="Barnängshuset — home">
          <img
            src="/assets/barnangshuset_logo-neg.svg"
            alt="Barnängshuset"
            className={cn("h-10 w-auto transition-all", scrolled ? "invert" : "")}
            style={{ transitionDuration: "300ms" }}
          />
        </a>

        {/* Col 2 — intentionally empty spacer */}
        <div />

        {/* Col 3 — Spaces + Amenities */}
        <nav className="hidden md:flex flex-col gap-1.5" aria-label="Main navigation">
          {LINKS_A.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={cn(linkCls, scrolled ? "text-text-primary after:bg-text-primary" : "text-text-inverse after:bg-text-inverse")}
              style={scrolled ? undefined : { textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Col 4 — Neighborhood + Contact */}
        <nav className="hidden md:flex flex-col gap-1.5" aria-label="More navigation">
          {LINKS_B.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={cn(linkCls, scrolled ? "text-text-primary after:bg-text-primary" : "text-text-inverse after:bg-text-inverse")}
              style={scrolled ? undefined : { textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Col 5 — CTA */}
        <div>
          <Button
            label="Book a viewing"
            href="#contact"
            variant={scrolled ? "primary" : "ghost"}
            className="px-4 py-2 text-[11px]"
          />
        </div>
      </div>
    </motion.header>
  );
};
