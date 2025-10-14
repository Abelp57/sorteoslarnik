/* app/components/Field.tsx */
"use client";
import * as React from "react";

export function Field({
  label, hint, children, required, className
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1 ${className || ""}`}>
      <label className="block text-sm font-medium text-foreground/90">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-foreground/60">{hint}</p> : null}
    </div>
  );
}
