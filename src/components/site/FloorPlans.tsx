"use client";

import Image from "next/image";
import { stegaClean } from "@sanity/client/stega";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  FloorPlanConfiguration,
  FloorPlanSection,
  SanityImage,
} from "@/types/sanity";

function Arrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={previous ? "m15 4-8 8 8 8" : "m9 4 8 8-8 8"} />
    </svg>
  );
}

function PlanImage({
  image,
  alt,
  sizes,
  className,
}: {
  image?: SanityImage;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const url = image?.asset?.url;
  if (!url)
    return <span className="fp-study-missing">Drawing unavailable</span>;
  return (
    <Image
      src={url}
      alt={image.alt || alt}
      width={image.asset?.metadata?.dimensions?.width || 800}
      height={image.asset?.metadata?.dimensions?.height || 420}
      sizes={sizes}
      className={className}
      unoptimized={stegaClean(url).split("?")[0].endsWith(".svg")}
      draggable={false}
    />
  );
}

function ConfigurationTables({
  configuration,
}: {
  configuration: FloorPlanConfiguration;
}) {
  return (
    <div className="fp-study-tables">
      {configuration.detailTables?.map((table, index) => (
        <table
          key={table._key || index}
          className={`fp-study-table fp-study-table-${index}`}
        >
          <caption>{table.title}</caption>
          {(table.labelHeading || table.valueHeading) && (
            <thead>
              <tr>
                <th scope="col">{table.labelHeading}</th>
                <th scope="col">{table.valueHeading}</th>
              </tr>
            </thead>
          )}
          <tbody>
            {table.rows?.map((row, rowIndex) => (
              <tr key={row._key || rowIndex}>
                <td>
                  {row.accent && (
                    <span className="fp-study-key" aria-hidden="true" />
                  )}
                  {row.label}
                </td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
          {table.footer && (
            <tfoot>
              <tr>
                <td colSpan={2}>{table.footer}</td>
              </tr>
            </tfoot>
          )}
        </table>
      ))}
      {!configuration.detailTables?.length && !!configuration.facts?.length && (
        <dl className="fp-study-facts">
          {configuration.facts.map((fact, index) => (
            <div key={fact._key || index}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {configuration.informationNote && (
        <p className="fp-study-data-note">{configuration.informationNote}</p>
      )}
    </div>
  );
}

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const slides = useMemo(
    () =>
      (content.floors || []).flatMap((floor, floorIndex) =>
        (floor.configurations || []).map((configuration, index) => ({
          key: `${floor._key || floorIndex}/${configuration._key || index}`,
          floorLabel: floor.label,
          configuration,
        })),
      ),
    [content.floors],
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const id = useId();
  const activeIndex = Math.max(
    0,
    slides.findIndex((slide) => slide.key === selectedKey),
  );
  const active = slides[activeIndex];
  const select = (next: number) => {
    if (slides.length)
      setSelectedKey(slides[(next + slides.length) % slides.length].key);
  };

  useEffect(() => {
    const track = rail.current;
    const thumbnail = track?.children[activeIndex] as HTMLElement | undefined;
    if (!track || !thumbnail) return;
    track.scrollTo({
      left:
        thumbnail.offsetLeft -
        track.offsetLeft -
        (track.clientWidth - thumbnail.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [activeIndex, active?.key]);

  if (!active) return null;
  const configuration = active.configuration;
  const title = configuration.name || configuration.title;
  const description = configuration.body || content.body;
  const ctaUrl = stegaClean(content.ctaUrl);

  return (
    <section
      id="floor-plans"
      className="floor-plans fp-study"
      aria-label="Office configurations"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          (event.target as HTMLElement).closest(
            'input, textarea, select, [contenteditable="true"]',
          )
        )
          return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          select(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
        }
        if (event.key === "Home") {
          event.preventDefault();
          select(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          select(slides.length - 1);
        }
      }}
    >
      <div className="fp-study-stage">
        <div
          className="fp-study-drawing"
          id={`${id}-drawing`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${slides.length}: ${stegaClean(title)}`}
          onTouchStart={(event) => {
            const point = event.touches[0];
            touch.current =
              event.touches.length === 1
                ? { x: point.clientX, y: point.clientY }
                : null;
          }}
          onTouchCancel={() => {
            touch.current = null;
          }}
          onTouchEnd={(event) => {
            const start = touch.current;
            touch.current = null;
            if (!start) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5)
              select(activeIndex + (dx < 0 ? 1 : -1));
          }}
        >
          {configuration.planImage?.asset?.url ? (
            <a
              href={configuration.planImage.asset.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${stegaClean(title)} drawing at full size`}
            >
              <PlanImage
                key={active.key}
                image={configuration.planImage}
                alt={`${title}, ${active.floorLabel} floor plan`}
                sizes="(max-width: 900px) 90vw, 62vw"
                className="fp-study-plan"
              />
            </a>
          ) : (
            <span className="fp-study-missing">Drawing unavailable</span>
          )}
        </div>
        <div className="fp-study-navigation">
          <div
            className="fp-study-current"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2>{title}</h2>
            <p>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </p>
          </div>
          {slides.length > 1 && (
            <>
              <div className="fp-study-arrows">
                <button
                  type="button"
                  aria-label="Previous configuration"
                  aria-controls={`${id}-drawing`}
                  onClick={() => select(activeIndex - 1)}
                >
                  <Arrow previous />
                </button>
                <button
                  type="button"
                  aria-label="Next configuration"
                  aria-controls={`${id}-drawing`}
                  onClick={() => select(activeIndex + 1)}
                >
                  <Arrow />
                </button>
              </div>
              <nav
                className="fp-study-thumbnails"
                aria-label="Choose a configuration"
              >
                <div className="fp-study-track" ref={rail}>
                  {slides.map((slide, index) => (
                    <button
                      type="button"
                      key={slide.key}
                      aria-label={`Show ${stegaClean(slide.configuration.name || slide.configuration.title)}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      onClick={() => select(index)}
                      title={stegaClean(
                        slide.configuration.name || slide.configuration.title,
                      )}
                    >
                      <PlanImage
                        image={slide.configuration.planImage}
                        alt=""
                        sizes="144px"
                      />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </>
          )}
        </div>
        {configuration.explodedImage?.asset?.url && (
          <div className="fp-study-axo-track">
            <figure className="fp-study-axo">
              <PlanImage
                image={configuration.explodedImage}
                alt={`Building location of ${title}`}
                sizes="13vw"
              />
              {configuration.levelLabel && (
                <figcaption>{configuration.levelLabel}</figcaption>
              )}
            </figure>
          </div>
        )}
      </div>
      <aside
        className="fp-study-info"
        aria-label="Selected configuration details"
      >
        <header className="fp-study-header">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </header>
        {content.detailsLabel && (
          <h2 className="fp-study-mobile-heading">{content.detailsLabel}</h2>
        )}
        {configuration.body && (
          <p className="fp-study-mobile-description">{configuration.body}</p>
        )}
        <ConfigurationTables configuration={configuration} />
        {ctaUrl && content.ctaLabel && (
          <div className="fp-study-contact">
            <a className="fp-study-discuss" href={ctaUrl}>
              {content.ctaLabel}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </aside>
    </section>
  );
}
