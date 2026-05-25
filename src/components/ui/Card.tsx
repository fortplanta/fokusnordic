import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "light",
  onClick,
}) => {
  const bgClass = variant === "light" ? "bg-cream-50" : "bg-navy-900 text-white";

  return (
    <div
      className={`
        ${bgClass}
        p-6 rounded transition-shadow
        hover:shadow-lg
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
