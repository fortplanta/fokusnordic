import React from "react";
import { cn } from "../../lib/utils";

// ── Overlay ───────────────────────────────────────────────────────────────────

export type OverlayPreset = "dark" | "dark_strong" | "light";

export interface OverlayConfig {
  color?: string;
  opacity?: number;
  preset?: OverlayPreset;
}

const OVERLAY_PRESETS: Record<OverlayPreset, { color: string; opacity: number }> = {
  dark:        { color: "#000000", opacity: 0.4 },
  dark_strong: { color: "#000000", opacity: 0.6 },
  light:       { color: "#000000", opacity: 0.1 },
};

function resolveOverlay(
  overlay: OverlayConfig | OverlayPreset | undefined
): { color: string; opacity: number } | null {
  if (!overlay) return null;
  if (typeof overlay === "string") return OVERLAY_PRESETS[overlay];
  const base = overlay.preset ? OVERLAY_PRESETS[overlay.preset] : { color: "#000000", opacity: 0.4 };
  return {
    color:   overlay.color   ?? base.color,
    opacity: overlay.opacity ?? base.opacity,
  };
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface BgImageConfig {
  src: string;
  /** omit or leave empty for purely decorative images */
  alt?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export interface BgVideoConfig {
  src: string;
  poster?: string;
}

export interface VisualSurfaceProps {
  // Backgrounds — only one of color/image/video is expected, but any combo is valid
  bgColor?: string;
  bgImage?: BgImageConfig;
  bgVideo?: BgVideoConfig;
  overlay?: OverlayConfig | OverlayPreset;
  /** CSS min-height value, e.g. "100vh", "600px" */
  minHeight?: string;
  // Slot
  /**
   * Merges VisualSurface's classes and style onto the single child element.
   * bg layers (image / video / overlay) are injected as absolute siblings
   * before the child's existing content.
   *
   * Best used when you want a background surface without an extra <div> wrapper.
   */
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Full-bleed visual primitive. Handles background color, image, video, and
 * overlay. Content renders above the background layers via relative stacking.
 */
export const VisualSurface = React.forwardRef<HTMLDivElement, VisualSurfaceProps>(
  (
    { bgColor, bgImage, bgVideo, overlay, minHeight, asChild = false, className, style, children },
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
        {resolved && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: resolved.color, opacity: resolved.opacity }}
            aria-hidden="true"
          />
        )}
      </>
    );

    // asChild: inject bg layers into the single child element so no wrapper div is added
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
