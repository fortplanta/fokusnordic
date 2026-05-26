import React, { useState } from "react";
import { motion } from "framer-motion";
import { ContactSectionConfig as ContactSectionType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { fadeUp, stagger, slowTransition, cardTransition, viewport } from "../../../lib/motion";

export const ContactSection: React.FC<ContactSectionType> = ({
  headline,
  intro,
  formFields,
  teamMembers,
  address,
  phone,
  email,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message. We'll be in touch soon!");
    setFormData({});
  };

  return (
    <section className="w-full bg-cream-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-8">

        {/* Section header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12"
        >
          {headline && (
            <motion.h2
              className="text-4xl md:text-5xl font-serif font-light text-navy-900 mb-4"
              variants={fadeUp}
              transition={slowTransition}
            >
              {headline}
            </motion.h2>
          )}
          {intro && (
            <motion.p
              className="text-base md:text-lg font-serif text-text-primary max-w-2xl"
              variants={fadeUp}
              transition={slowTransition}
            >
              {intro}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">

          {/* Contact info */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h3
              className="text-2xl font-serif font-light text-navy-900 mb-6"
              variants={fadeUp}
              transition={slowTransition}
            >
              Get in touch
            </motion.h3>

            {address && (
              <motion.p
                className="text-sm font-serif text-text-primary mb-4"
                variants={fadeUp}
                transition={slowTransition}
              >
                <span className="font-medium">Address:</span>
                <br />
                {address}
              </motion.p>
            )}

            {phone && (
              <motion.p
                className="text-sm font-serif text-text-primary mb-4"
                variants={fadeUp}
                transition={slowTransition}
              >
                <a href={`tel:${phone}`} className="text-green-dark hover:underline">
                  {phone}
                </a>
              </motion.p>
            )}

            {email && (
              <motion.p
                className="text-sm font-serif text-text-primary mb-8"
                variants={fadeUp}
                transition={slowTransition}
              >
                <a href={`mailto:${email}`} className="text-green-dark hover:underline">
                  {email}
                </a>
              </motion.p>
            )}

            {teamMembers && teamMembers.length > 0 && (
              <motion.div className="mt-12" variants={fadeUp} transition={slowTransition}>
                <h4 className="text-lg font-serif font-light text-navy-900 mb-6">Our team</h4>
                <div className="space-y-6">
                  {teamMembers.map((member) => (
                    <div key={member.id}>
                      {member.image && (
                        <img
                          src={member.image.src}
                          alt={member.image.alt}
                          className="w-20 h-20 rounded object-cover mb-2"
                        />
                      )}
                      <h5 className="text-base font-serif font-light text-navy-900">
                        {member.name}
                      </h5>
                      <p className="text-sm text-text-secondary font-sans">{member.role}</p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-xs text-green-dark hover:underline"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Contact form */}
          {formFields && formFields.length > 0 && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={cardTransition}
            >
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-sans font-medium text-text-primary uppercase tracking-wide mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded font-serif text-sm text-text-primary focus:outline-none focus:border-green-dark"
                      rows={5}
                    />
                  ) : field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded font-serif text-sm text-text-primary focus:outline-none focus:border-green-dark"
                    >
                      <option value="">{field.placeholder || "Select..."}</option>
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded font-serif text-sm text-text-primary focus:outline-none focus:border-green-dark"
                    />
                  )}
                </div>
              ))}

              <Button label="Send" fullWidth variant="primary" />
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};
