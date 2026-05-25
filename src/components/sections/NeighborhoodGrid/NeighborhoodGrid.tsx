import React, { useState } from "react";
import { NeighborhoodGridSection as NeighborhoodGridType } from "../../../types/sections";
import { Card } from "../../ui/Card";

export const NeighborhoodGrid: React.FC<NeighborhoodGridType> = ({
  headline,
  intro,
  spots,
  enableFilters,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(spots.map((s) => s.category)));
  const filteredSpots = selectedCategory
    ? spots.filter((s) => s.category === selectedCategory)
    : spots;

  return (
    <section className="w-full bg-cream-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-8">
        {headline && (
          <h2 className="text-4xl md:text-5xl font-serif font-light text-navy-900 mb-4">
            {headline}
          </h2>
        )}
        {intro && (
          <p className="text-base md:text-lg font-serif text-text-primary max-w-2xl mb-8">
            {intro}
          </p>
        )}

        {/* Filter buttons */}
        {enableFilters && categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm font-sans rounded transition-colors ${
                selectedCategory === null
                  ? "bg-green-dark text-white"
                  : "bg-navy-900 text-white hover:opacity-80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-sans rounded transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-dark text-white"
                    : "bg-navy-900 text-white hover:opacity-80"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map((spot) => (
            <Card key={spot.id} variant="light">
              {/* Image */}
              {spot.image && (
                <img
                  src={spot.image.src}
                  alt={spot.image.alt}
                  className="w-full h-40 object-cover rounded mb-4 -m-6 mb-6"
                />
              )}

              {/* Content */}
              <h3 className="text-lg font-serif font-light text-navy-900 mb-2">
                {spot.name}
              </h3>

              <p className="text-xs font-sans text-text-secondary uppercase tracking-wide mb-3">
                {spot.category}
              </p>

              {spot.distance && spot.time && (
                <p className="text-sm text-text-secondary font-serif mb-3">
                  {spot.distance} • {spot.time}
                </p>
              )}

              <p className="text-sm font-serif text-text-primary mb-4">
                {spot.description}
              </p>

              {spot.tags && spot.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {spot.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-navy-900 text-white px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {spot.link && (
                <a
                  href={spot.link}
                  className="text-sm text-green-dark font-sans font-medium mt-4 inline-block hover:underline"
                >
                  Learn more →
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
