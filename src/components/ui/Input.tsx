import React from "react";
import { cn } from "../../lib/utils";

// ── Text / Email / Password ───────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block font-body text-body-xs text-text-muted uppercase tracking-widest mb-2">
          {label}
          {props.required && <span className="text-terra ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full font-body text-body-md text-text-primary bg-transparent",
          "border-0 border-b border-border-light focus:border-text-primary",
          "outline-none py-3 transition-colors placeholder:text-text-muted",
          error && "border-terra focus:border-terra",
          className
        )}
        {...props}
      />
      {error && <p className="font-body text-body-xs text-terra mt-1">{error}</p>}
      {hint && !error && <p className="font-body text-body-xs text-text-muted mt-1">{hint}</p>}
    </div>
  )
);

Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block font-body text-body-xs text-text-muted uppercase tracking-widest mb-2">
          {label}
          {props.required && <span className="text-terra ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full font-body text-body-md text-text-primary bg-transparent",
          "border-0 border-b border-border-light focus:border-text-primary",
          "outline-none py-3 transition-colors placeholder:text-text-muted resize-none",
          error && "border-terra focus:border-terra",
          className
        )}
        {...props}
      />
      {error && <p className="font-body text-body-xs text-terra mt-1">{error}</p>}
      {hint && !error && <p className="font-body text-body-xs text-text-muted mt-1">{hint}</p>}
    </div>
  )
);

Textarea.displayName = "Textarea";

// ── Select ────────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block font-body text-body-xs text-text-muted uppercase tracking-widest mb-2">
          {label}
          {props.required && <span className="text-terra ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full font-body text-body-md text-text-primary bg-transparent",
          "border-0 border-b border-border-light focus:border-text-primary",
          "outline-none py-3 transition-colors",
          error && "border-terra",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="font-body text-body-xs text-terra mt-1">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
