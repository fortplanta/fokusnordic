import React from "react";
import { cn } from "../../lib/utils";

export type ChipVariant = "solid" | "outline" | "ghost" | "green" | "terra";
export type ChipSize = "sm" | "md";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  active?: boolean;
  onDismiss?: () => void;
  onClick?: () => void;
  className?: string;
}

const VARIANTS: Record<ChipVariant, string> = {
  solid:   "bg-text-primary text-text-inverse",
  outline: "bg-transparent text-text-primary border border-border-mid hover:border-text-primary",
  ghost:   "bg-cream-200 text-text-secondary hover:bg-cream-200/80",
  green:   "bg-green-light text-green-dark border border-green-dark/20",
  terra:   "bg-terra-light text-terra border border-terra/20",
};

const SIZES: Record<ChipSize, string> = {
  sm: "px-2.5 py-0.5 text-[11px] tracking-wider",
  md: "px-3.5 py-1 text-[12px] tracking-wider",
};

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = "outline",
  size = "md",
  active = false,
  onDismiss,
  onClick,
  className,
}) => {
  const base = "inline-flex items-center gap-1.5 font-body font-medium uppercase transition-all duration-150";
  const activeCls = active ? "bg-text-primary text-text-inverse border-text-primary" : "";

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(base, VARIANTS[variant], SIZES[size], active && activeCls, onClick && "cursor-pointer", className)}
    >
      {label}
      {onDismiss && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="opacity-50 hover:opacity-100 transition-opacity leading-none"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
