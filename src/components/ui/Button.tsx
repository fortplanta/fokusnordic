import React from "react";
import { colors, typography } from "../../tokens/design-tokens";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary";
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: `
    bg-green-dark text-white 
    hover:opacity-90 transition-opacity
    px-6 py-3
  `,
  secondary: `
    bg-navy-900 text-white 
    hover:opacity-90 transition-opacity
    px-6 py-3
  `,
  tertiary: `
    bg-transparent text-navy-900 
    border border-navy-900
    hover:bg-cream-50 transition-colors
    px-6 py-3
  `,
};

export const Button: React.FC<ButtonProps> = ({
  label,
  href,
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
}) => {
  const baseClass = `
    inline-flex items-center justify-center
    font-sans font-medium text-sm
    cursor-pointer
    ${variantStyles[variant] || variantStyles.primary}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {label}
    </button>
  );
};
