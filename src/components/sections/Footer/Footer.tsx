import { useState } from "react";
import { FooterSection as FooterSectionType } from "../../../types/sections";
import { Section } from "../../layout";

const YEAR = new Date().getFullYear();

// Parenthetical label style — matches the reference
const GroupLabel = ({ children }: { children: string }) => (
  <p className="font-body text-body-xs text-text-inverse/40 tracking-widest mb-4">
    {children}
  </p>
);

export const Footer = ({
  columns,
  visitAddress,
  contactGroups,
  newsletter,
  brandName = "Barnängshuset",
  legalText,
}: FooterSectionType) => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-deep overflow-hidden">

      {/* ── Top grid ──────────────────────────────────────────────────────── */}
      <Section bgColor="#13100D" paddingY="xl" maxWidth="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-20 border-b border-text-inverse/10">

          {/* Left: stacked link groups */}
          <div className="space-y-10">
            {columns?.map((group) => (
              <nav key={group.label} aria-label={group.label}>
                <GroupLabel>{group.label}</GroupLabel>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="font-body text-body-sm text-text-inverse/70 hover:text-text-inverse transition-colors duration-[150ms]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Middle: visit + contact */}
          <div className="space-y-10">
            {visitAddress && (
              <div>
                <GroupLabel>(Visit)</GroupLabel>
                <p className="font-body text-body-sm text-text-inverse/70 whitespace-pre-line">
                  {visitAddress}
                </p>
              </div>
            )}

            {contactGroups && contactGroups.length > 0 && (
              <div>
                <GroupLabel>(Contact)</GroupLabel>
                <div className="space-y-6">
                  {contactGroups.map((group) => (
                    <div key={group.label}>
                      <p className="font-serif italic text-body-sm text-text-inverse/50 mb-2">
                        {group.label}
                      </p>
                      {group.lines.map((line, i) => {
                        const isEmail = line.includes("@");
                        const isPhone = line.startsWith("+");
                        if (isEmail) return (
                          <a key={i} href={`mailto:${line}`}
                            className="block font-body text-body-sm text-text-inverse/70 hover:text-text-inverse transition-colors duration-[150ms]">
                            {line}
                          </a>
                        );
                        if (isPhone) return (
                          <a key={i} href={`tel:${line}`}
                            className="block font-body text-body-sm text-text-inverse/70 hover:text-text-inverse transition-colors duration-[150ms]">
                            {line}
                          </a>
                        );
                        return (
                          <p key={i} className="font-body text-body-sm text-text-inverse/70">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: newsletter */}
          {newsletter && (
            <div>
              <GroupLabel>(Newsletter)</GroupLabel>
              <p className="font-body text-body-sm text-text-inverse/60 leading-relaxed mb-8 max-w-xs">
                {newsletter.text}
              </p>
              <form
                onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
                className="flex items-end gap-4 border-b border-text-inverse/30 pb-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="flex-1 bg-transparent font-body text-body-sm text-text-inverse placeholder:text-text-inverse/30 focus:outline-none border-none pb-1"
                />
                <button
                  type="submit"
                  className="font-body text-body-xs text-text-inverse/60 uppercase tracking-widest hover:text-text-inverse transition-colors duration-[150ms] whitespace-nowrap pb-1 flex-shrink-0"
                >
                  Sign Up
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Legal row */}
        <div className="pt-6 flex items-center justify-between">
          <p className="font-body text-body-xs text-text-inverse/25">
            © {YEAR} Barnängshuset. All rights reserved.
          </p>
          {legalText && (
            <p className="font-body text-body-xs text-text-inverse/25">
              {legalText}
            </p>
          )}
        </div>
      </Section>

      {/* ── Mega brand name ───────────────────────────────────────────────── */}
      {/* Overflows intentionally — crops at bottom edge of footer */}
      <div className="w-full overflow-hidden" aria-hidden="true">
        <p
          className="font-serif font-light text-text-inverse/10 whitespace-nowrap leading-[0.82]
                     select-none pointer-events-none px-4 md:px-8"
          style={{ fontSize: "clamp(80px, 13.5vw, 13.5vw)" }}
        >
          {brandName}
        </p>
      </div>
    </footer>
  );
};
