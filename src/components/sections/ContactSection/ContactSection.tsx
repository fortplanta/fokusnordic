import React, { useState } from "react";
import { ContactSectionConfig as ContactSectionType } from "../../../types/sections";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

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
        {headline && (
          <h2 className="text-4xl md:text-5xl font-serif font-light text-navy-900 mb-4">
            {headline}
          </h2>
        )}
        {intro && (
          <p className="text-base md:text-lg font-serif text-text-primary max-w-2xl mb-12">
            {intro}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Contact info */}
          <div>
            <h3 className="text-2xl font-serif font-light text-navy-900 mb-6">
              Get in touch
            </h3>

            {address && (
              <p className="text-sm font-serif text-text-primary mb-4">
                <span className="font-medium">Address:</span>
                <br />
                {address}
              </p>
            )}

            {phone && (
              <p className="text-sm font-serif text-text-primary mb-4">
                <a
                  href={`tel:${phone}`}
                  className="text-green-dark hover:underline"
                >
                  {phone}
                </a>
              </p>
            )}

            {email && (
              <p className="text-sm font-serif text-text-primary mb-8">
                <a
                  href={`mailto:${email}`}
                  className="text-green-dark hover:underline"
                >
                  {email}
                </a>
              </p>
            )}

            {/* Team members */}
            {teamMembers && teamMembers.length > 0 && (
              <div className="mt-12">
                <h4 className="text-lg font-serif font-light text-navy-900 mb-6">
                  Our team
                </h4>
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
                      <p className="text-sm text-text-secondary font-sans">
                        {member.role}
                      </p>
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
              </div>
            )}
          </div>

          {/* Contact form */}
          {formFields && formFields.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
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
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
