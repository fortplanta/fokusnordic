import React from "react";
import { AmenitiesGridSection as AmenitiesGridType } from "../../../types/sections";
import { Card } from "../../ui/Card";

export const AmenitiesGrid: React.FC<AmenitiesGridType> = ({
  headline,
  intro,
  amenities,
}) => {
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
          {amenities.map((amenity) => (
            <Card key={amenity.id} variant="dark">
              {/* Icon or image */}
              {amenity.image ? (
                <img
                  src={amenity.image.src}
                  alt={amenity.image.alt}
                  className="w-full h-40 object-cover rounded mb-4 -m-6 mb-6"
                />
              ) : amenity.icon ? (
                <div className="text-4xl mb-4">{amenity.icon}</div>
              ) : null}

              {/* Content */}
              <h3 className="text-xl font-serif font-light mb-2">
                {amenity.name}
              </h3>

              <p className="text-xs font-sans text-gray-400 uppercase tracking-wide mb-3">
                {amenity.type}
              </p>

              <p className="text-sm font-serif text-gray-300 mb-4">
                {amenity.description}
              </p>

              {amenity.capacity && (
                <p className="text-xs text-gray-400">
                  <span className="font-sans font-medium">Capacity: </span>
                  {amenity.capacity}
                </p>
              )}

              {amenity.hours && (
                <p className="text-xs text-gray-400">
                  <span className="font-sans font-medium">Hours: </span>
                  {amenity.hours}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
