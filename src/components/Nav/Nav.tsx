import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

const NAV_LINKS = [
  { label: "Spaces",       href: "#spaces" },
  { label: "Amenities",    href: "#amenities" },
  { label: "Neighborhood", href: "#neighborhood" },
  { label: "Contact",      href: "#contact" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Publish real nav height as --nav-height on :root so any section can read it.
  // Updates on mount and on every resize so the value is always accurate.
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
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex items-center justify-between h-16 md:h-18">

        {/* Logo */}
        <a href="/" aria-label="Barnängshuset — home" className="flex-shrink-0">
          <img
            src="/assets/barnangshuset_logo-neg.svg"
            alt="Barnängshuset"
            className={cn(
              "h-7 w-auto transition-all",
              scrolled ? "invert" : ""
            )}
            style={{ transitionDuration: "300ms" }}
          />
        </a>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Site navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-body-sm uppercase tracking-widest transition-opacity hover:opacity-60",
                scrolled ? "text-text-primary" : "text-text-inverse"
              )}
              style={{ transitionDuration: "150ms" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Button
          label="Book a viewing"
          href="#contact"
          variant={scrolled ? "primary" : "ghost"}
        />
      </div>
    </motion.header>
  );
};
