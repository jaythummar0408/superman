"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, AlertCircle, CheckCircle2, Info, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* Secure random helpers                                              */
/* ------------------------------------------------------------------ */
export function randInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;
  const limit = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return min + (x % range);
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* UI primitives                                                     */
/* ------------------------------------------------------------------ */
export const controlInputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50";

export const monoTextareaClass =
  "w-full resize-y rounded-lg border border-border/60 bg-muted/10 p-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50";

export function Panel({
  title,
  actions,
  children,
  className,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:p-6", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : <span />}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const NOTE_STYLES: Record<string, { cls: string; icon: LucideIcon }> = {
  error: { cls: "border-destructive/30 bg-destructive/10 text-destructive", icon: AlertCircle },
  success: { cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  info: { cls: "border-border/60 bg-muted/30 text-muted-foreground", icon: Info },
};

export function StatusNote({ variant, children }: { variant: "error" | "success" | "info"; children: React.ReactNode }) {
  const { cls, icon: Icon } = NOTE_STYLES[variant];
  return (
    <div className={cn("flex items-start gap-2 rounded-lg border px-3 py-2 text-sm", cls)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 break-words font-medium">{children}</div>
    </div>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} disabled={!value} className="gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={cn(controlInputClass, "cursor-pointer")}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}

/** A copyable result row (used by name/username lists). */
export function ResultRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={copy}
      title="Click to copy"
      className="group flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
    >
      <span className="min-w-0 truncate text-sm font-medium text-foreground">{value}</span>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

export function downloadText(filename: string, text: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
