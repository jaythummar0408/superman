"use client";

import React from "react";
import { CheckCircle2, Download, FileText, X, RotateCcw, AlertCircle, Info, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export { FileUploader } from "@/components/ui/file-uploader";

export const controlInputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60";

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:p-6", className)}>
      {title && <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>}
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

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {format ? format(value) : value}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-primary" />
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

/** A selected-file row with size and a remove button. */
export function FileChip({ file, onRemove }: { file: File; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/** Success card shown after processing, with download + reset. */
export function ResultCard({
  fileName,
  size,
  onDownload,
  onReset,
  title = "Your file is ready",
  note,
}: {
  fileName: string;
  size: number;
  onDownload: () => void;
  onReset: () => void;
  title?: string;
  note?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 truncate text-sm text-muted-foreground">
        {fileName} · {formatBytes(size)}
      </p>
      {note && <div className="mt-2 text-sm text-muted-foreground">{note}</div>}
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" className="gap-2" onClick={onDownload}>
          <Download className="h-5 w-5" />
          Download
        </Button>
        <Button variant="outline" size="lg" className="gap-2" onClick={onReset}>
          <RotateCcw className="h-5 w-5" />
          Start over
        </Button>
      </div>
    </div>
  );
}

/** Big process button with a spinner while working. */
export function ProcessButton({ onClick, loading, disabled, children }: { onClick: () => void; loading: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Button size="lg" className="h-13 w-full gap-2 text-base shadow-md sm:h-14" disabled={disabled || loading} onClick={onClick}>
      {loading ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          Processing…
        </>
      ) : (
        children
      )}
    </Button>
  );
}
