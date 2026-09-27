import type { ButtonHTMLAttributes, ReactNode } from "react";
export function Button({
  variant = "secondary",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      {...props}
      data-variant={variant}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={`hh-button ${className}`}
    >
      {loading && <span className="hh-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
