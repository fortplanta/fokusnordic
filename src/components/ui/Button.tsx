import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  fullWidth?: boolean;
  className?: string;
}

// Base classes shared across all variants
const BASE =
  "inline-flex items-center justify-center font-body font-medium text-body-sm " +
  "uppercase tracking-wide cursor-pointer px-6 py-3 rounded-sm" +
  "transition-[opacity,background-color,border-color,color] duration-[150ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]";

const VARIANTS: Record<string, string> = {
  // Dark green fill — primary CTA on light backgrounds
  primary:
    "bg-green-dark text-text-inverse hover:opacity-90",

  // Deep fill — secondary on light backgrounds
  secondary:
    "bg-deep text-text-inverse hover:opacity-90",

  // Outline — bordered, dark text, for use on cream/light backgrounds
  tertiary:
    "bg-transparent text-text-primary border border-text-primary hover:bg-cream-200",

  // Ghost — cream text + outline, for use on dark/image backgrounds
  ghost:
    "bg-transparent text-text-inverse border border-text-inverse/60 hover:border-text-inverse hover:bg-text-inverse/10",
};

export const Button: React.FC<ButtonProps> = ({
  label,
  href,
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
}) => {
  const cls = cn(BASE, VARIANTS[variant] ?? VARIANTS.primary, fullWidth && "w-full", className);

  if (href) {
    return <a href={href} className={cls}>{label}</a>;
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
    </button>
  );
};
