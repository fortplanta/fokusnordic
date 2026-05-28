import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactSectionConfig as ContactSectionType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { Section } from "../../layout";
import {
  fadeUp,
  stagger,
  heroTransition,
  revealTransition,
  cardTransition,
  viewport,
} from "../../../lib/motion";

export const ContactSection = ({
  headline,
  intro,
  formFields,
  teamMembers,
  address,
  phone,
  email,
}: ContactSectionType) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({});
  };

  return (
    <Section bgColor="#F6F2EA" paddingY="xl" maxWidth="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Left: contact info + team */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {headline && (
            <motion.h2
              className="font-serif font-light text-text-primary mb-6
                         text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-tight"
              variants={fadeUp}
              transition={heroTransition}
            >
              {headline}
            </motion.h2>
          )}

          {intro && (
            <motion.p
              className="font-body text-body-md text-text-secondary mb-10 leading-relaxed"
              variants={fadeUp}
              transition={revealTransition}
            >
              {intro}
            </motion.p>
          )}

          <motion.div className="space-y-4" variants={fadeUp} transition={revealTransition}>
            {address && (
              <p className="font-body text-body-sm text-text-secondary">
                {address}
              </p>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="block font-body text-body-sm text-green-dark hover:opacity-70 transition-opacity"
              >
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="block font-body text-body-sm text-green-dark hover:opacity-70 transition-opacity"
              >
                {email}
              </a>
            )}
          </motion.div>

          {teamMembers && teamMembers.length > 0 && (
            <motion.div className="mt-12" variants={fadeUp} transition={revealTransition}>
              <p className="font-body text-body-xs text-text-muted uppercase tracking-widest mb-6">
                Team
              </p>
              <div className="space-y-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-start gap-4">
                    {member.image && (
                      <img
                        src={member.image.src}
                        alt={member.image.alt}
                        className="w-14 h-14 object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-serif font-light text-text-primary text-body-md">
                        {member.name}
                      </p>
                      <p className="font-body text-body-xs text-text-muted">
                        {member.role}
                      </p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="font-body text-body-xs text-green-dark hover:opacity-70 transition-opacity mt-1 inline-block"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right: form */}
        {formFields && formFields.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={cardTransition}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
                  className="flex flex-col items-start justify-center h-full py-12"
                >
                  <div className="w-8 h-8 rounded-full bg-green-dark/10 flex items-center justify-center mb-6">
                    <svg
                      className="w-4 h-4 text-green-dark"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif font-light text-text-primary text-display-xs mb-3">
                    Message received
                  </h3>
                  <p className="font-body text-body-md text-text-secondary mb-8">
                    We'll be in touch within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="font-body text-body-xs text-text-muted uppercase tracking-widest hover:text-text-primary transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {formFields.map((field) => (
                    <div key={field.name}>
                      <label className="block font-body text-body-xs text-text-muted uppercase tracking-widest mb-3">
                        {field.label}
                        {field.required && <span className="text-terra ml-1">*</span>}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          rows={4}
                          className="w-full font-body text-body-md text-text-primary bg-transparent border-0 border-b border-border-light focus:border-text-primary focus:outline-none py-3 resize-none transition-colors placeholder:text-text-muted"
                        />
                      ) : field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          required={field.required}
                          className="w-full font-body text-body-md text-text-primary bg-transparent border-0 border-b border-border-light focus:border-text-primary focus:outline-none py-3 transition-colors"
                        >
                          <option value="">{field.placeholder || "Select…"}</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="w-full font-body text-body-md text-text-primary bg-transparent border-0 border-b border-border-light focus:border-text-primary focus:outline-none py-3 transition-colors placeholder:text-text-muted"
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-2">
                    <Button label="Send message" fullWidth variant="primary" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Section>
  );
};
