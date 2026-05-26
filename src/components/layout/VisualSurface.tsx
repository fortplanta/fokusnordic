import React from "react";
import { cn } from "../../lib/utils";

// ── Overlay ───────────────────────────────────────────────────────────────────

export type OverlayPreset = "dark" | "dark_strong" | "light";

export interface OverlayConfig {
  color?: string;
  opacity?: number;
  preset?: OverlayPreset;
}

// Warm near-black (#13100D) matches --color-deep / --overlay-dark tokens
const OVERLAY_PRESETS: Record<OverlayPreset, { color: string; opacity: number }> = {
  dark:        { color: "#13100D", opacity: 0.45 },
  dark_strong: { color: "#13100D", opacity: 0.65 },
  light:       { color: "#13100D", opacity: 0.12 },
};

function resolveOverlay(
  overlay: OverlayConfig | OverlayPreset | undefined
): { color: string; opacity: number } | null {
  if (!overlay) return null;
  if (typeof overlay === "string") return OVERLAY_PRESETS[overlay];
  const base = overlay.preset
    ? OVERLAY_PRESETS[overlay.preset]
    : { color: "#13100D", opacity: 0.45 };
  return {
    color:   overlay.color   ?? base.color,
    opacity: overlay.opacity ?? base.opacity,
  };
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface BgImageConfig {
  src: string;
  /** Omit or leave empty for purely decorative images */
  alt?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export interface BgVideoConfig {
  src: string;
  poster?: string;
}

export interface VisualSurfaceProps {
  // Backgrounds — only one of color/image/video expected, but any combo is valid
  bgColor?: string;
  bgImage?: BgImageConfig;
  bgVideo?: BgVideoConfig;
  /** Solid-color overlay (flat, single layer) */
  overlay?: OverlayConfig | OverlayPreset;
  /**
   * CSS gradient string for the overlay layer — use instead of (or on top of) `overlay`.
   * E.g.: "linear-gradient(to top, rgba(19,16,13,0.72) 0%, transparent 60%)"
   * When both `overlay` and `overlayGradient` are provided, gradient renders on top.
   */
  overlayGradient?: string;
  /** CSS min-height value, e.g. "100vh", "600px" */
  minHeight?: string;
  /**
   * Merges VisualSurface's classes and style onto the single child element.
   * bg layers (image / video / overlays) are injected before child's own content.
   * Best used when you want a background surface without an extra <div> wrapper.
   */
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Full-bleed visual primitive. Handles background color, image, video,
 * solid overlay, and gradient overlay. Content renders above all bg layers.
 */
export const VisualSurface = React.forwardRef<HTMLDivElement, VisualSurfaceProps>(
  (
    {
      bgColor,
      bgImage,
      bgVideo,
      overlay,
      overlayGradient,
      minHeight,
      asChild = false,
      className,
      style,
      children,
    },
    ref
  ) => {
    const resolved = resolveOverlay(overlay);

    const rootClassName = cn("relative overflow-hidden", className);
    const rootStyle: React.CSSProperties = {
      backgroundColor: bgColor,
      minHeight,
      ...style,
    };

    const bgLayers = (
      <>
        {bgImage && (
          <img
            src={bgImage.src}
            alt={bgImage.alt ?? ""}
            aria-hidden={!bgImage.alt || undefined}
            className={cn(
              "absolute inset-0 h-full w-full",
              bgImage.objectFit === "contain" ? "object-contain" : "object-cover"
            )}
            style={bgImage.objectPosition ? { objectPosition: bgImage.objectPosition } : undefined}
          />
        )}
        {bgVideo && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            poster={bgVideo.poster}
          >
            <source src={bgVideo.src} />
          </video>
        )}
        {/* Flat overlay */}
        {resolved && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: resolved.color, opacity: resolved.opacity }}
            aria-hidden="true"
          />
        )}
        {/* Gradient overlay — renders on top of flat overlay */}
        {overlayGradient && (
          <div
            className="absolute inset-0"
            style={{ background: overlayGradient }}
            aria-hidden="true"
          />
        )}
      </>
    );

    // asChild: inject bg layers into the single child element — no wrapper div
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      }>;

      return React.cloneElement(
        child,
        {
          className: cn(rootClassName, child.props.className),
          style: { ...rootStyle, ...child.props.style },
          ref,
        } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> },
        bgLayers,
        child.props.children
      );
    }

    return (
      <div ref={ref} className={rootClassName} style={rootStyle}>
        {bgLayers}
        {children}
      </div>
    );
  }
);

VisualSurface.displayName = "VisualSurface";
