import React from "react";
import { cn } from "../../lib/utils";

export type BadgeStatus = "available" | "reserved" | "leased" | "new" | "coming";

interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

const STATUS_STYLES: Record<BadgeStatus, { dot: string; bg: string; text: string; defaultLabel: string }> = {
  available: { dot: "bg-green-dark",  bg: "bg-green-light",  text: "text-green-dark",   defaultLabel: "Available" },
  reserved:  { dot: "bg-terra",       bg: "bg-terra-light",  text: "text-terra",         defaultLabel: "Reserved"  },
  leased:    { dot: "bg-stone-400",   bg: "bg-cream-200",    text: "text-text-muted",    defaultLabel: "Leased"    },
  new:       { dot: "bg-green-dark",  bg: "bg-green-light",  text: "text-green-dark",   defaultLabel: "New"       },
  coming:    { dot: "bg-stone-300",   bg: "bg-cream-200",    text: "text-text-secondary",defaultLabel: "Coming Soon"},
};

export const Badge: React.FC<BadgeProps> = ({ status, label, className }) => {
  const { dot, bg, text, defaultLabel } = STATUS_STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 font-body text-[11px] font-medium uppercase tracking-wider", bg, text, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      {label ?? defaultLabel}
    </span>
  );
};
