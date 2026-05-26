import { motion } from "framer-motion";
import { FooterSection as FooterSectionType } from "../../../types/sections";
import { Section } from "../../layout";
import { fadeUp, stagger, revealTransition, viewport } from "../../../lib/motion";

const YEAR = new Date().getFullYear();

export const Footer = ({
  address,
  phone,
  email,
  links,
  legalText,
}: FooterSectionType) => {
  return (
    <Section
      bgColor="#13100D"
      paddingY="xl"
      maxWidth="xl"
      surfaceClassName="relative overflow-hidden"
    >
      {/* Twill pattern watermark — large, behind everything */}
      <div
        className="absolute inset-0 bg-twill bg-repeat opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-16 border-b border-text-inverse/10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Logo column */}
          <motion.div variants={fadeUp} transition={revealTransition}>
            <img
              src="/assets/barnangshuset_logo-neg.svg"
              alt="Barnängshuset"
              className="h-8 w-auto mb-6"
            />
            <p className="font-body text-body-sm text-text-inverse/50 leading-relaxed max-w-xs">
              A creative office building in the heart of Södermalm, Stockholm.
            </p>
          </motion.div>

          {/* Contact column */}
          <motion.div variants={fadeUp} transition={revealTransition}>
            <p className="font-body text-body-xs text-text-inverse/40 uppercase tracking-widest mb-5">
              Contact
            </p>
            <div className="space-y-3">
              {address && (
                <p className="font-body text-body-sm text-text-inverse/60">
                  {address}
                </p>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="block font-body text-body-sm text-text-inverse/60 hover:text-text-inverse transition-colors"
                >
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block font-body text-body-sm text-text-inverse/60 hover:text-text-inverse transition-colors"
                >
                  {email}
                </a>
              )}
            </div>
          </motion.div>

          {/* Links column */}
          {links && links.length > 0 && (
            <motion.nav variants={fadeUp} transition={revealTransition} aria-label="Footer navigation">
              <p className="font-body text-body-xs text-text-inverse/40 uppercase tracking-widest mb-5">
                Navigation
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-body text-body-sm text-text-inverse/60 hover:text-text-inverse transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </motion.div>

        {/* Legal row */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-body text-body-xs text-text-inverse/30">
            © {YEAR} Barnängshuset. All rights reserved.
          </p>
          {legalText && (
            <p className="font-body text-body-xs text-text-inverse/30">
              {legalText}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
};
