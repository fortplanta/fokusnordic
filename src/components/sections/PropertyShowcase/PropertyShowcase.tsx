import React from "react";
import { PropertyShowcaseSection as PropertyShowcaseType } from "../../../types/sections";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

export const PropertyShowcase: React.FC<PropertyShowcaseType> = ({
  headline,
  intro,
  properties,
}) => {
  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      available: "bg-green-dark text-white",
      reserved: "bg-yellow-500 text-navy-900",
      leased: "bg-gray-400 text-white",
    };
    return colors[status] || colors.available;
  };

  return (
    <section className="w-full bg-navy-900 py-20 md:py-32 text-white">
      <div className="max-w-6xl mx-auto px-8">
        {headline && (
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">
            {headline}
          </h2>
        )}
        {intro && (
          <p className="text-base md:text-lg font-serif text-gray-300 max-w-2xl mb-12">
            {intro}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card
              key={property.id}
              variant="dark"
              className="flex flex-col h-full"
            >
              {/* Image */}
              {property.image && (
                <img
                  src={property.image.src}
                  alt={property.image.alt}
                  className="w-full h-48 object-cover rounded mb-4 -m-6 mb-6"
                />
              )}

              {/* Status badge */}
              <div className="mb-4">
                <span className={`text-xs font-sans font-medium px-3 py-1 rounded ${statusBadge(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-serif font-light mb-2">
                {property.name}
              </h3>

              {property.floor && (
                <p className="text-sm text-gray-300 mb-2">Floor {property.floor}</p>
              )}

              {property.sqm && (
                <p className="text-sm text-gray-300 mb-4">{property.sqm} sqm</p>
              )}

              {property.details && (
                <p className="text-sm text-gray-400 mb-6 flex-grow">
                  {property.details}
                </p>
              )}

              {property.ctaLabel && (
                <Button
                  label={property.ctaLabel}
                  variant="secondary"
                  fullWidth
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
