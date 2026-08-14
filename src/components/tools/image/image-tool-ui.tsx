"use client";

import React from "react";
import { CheckCircle2, Download, RotateCcw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkerStyle } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";

interface Option<T extends string> {
  label: string;
  value: T;
}

/** Segmented pill control used for format / aspect-ratio / mode switches. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5",
        className
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            value === o.value
              ? "bg-white text-foreground shadow-sm dark:bg-card"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Labeled range slider with a live value badge. */
export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
  disabled?: boolean;
}) {
  return (
    <div className={cn(disabled && "opacity-50")}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="min-w-[3rem] rounded-md bg-muted px-2 py-0.5 text-center text-xs font-semibold tabular-nums text-foreground">
          {display ?? value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
      />
    </div>
  );
}

/** Simple label + control wrapper. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export const controlInputClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50";

/** Image preview on a checkerboard frame so transparency is obvious. */
export function PreviewImage({
  src,
  alt = "preview",
  className,
  imgStyle,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgStyle?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-xl border border-border/60 p-2",
        className
      )}
      style={checkerStyle}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={imgStyle}
        className="max-h-full max-w-full rounded-md object-contain transition-transform duration-200"
      />
    </div>
  );
}

/** Small metric tile (label above a value). */
export function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "default" | "positive";
}) {
  return (
    <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-lg font-bold tabular-nums",
          accent === "positive" ? "text-emerald-600 dark:text-emerald-500" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

/** Initial upload state — a bordered card wrapping the shared FileUploader. */
export function UploadCard({
  onSelect,
  title,
  subtitle = "Processed privately in your browser — your file never leaves your device.",
  icon,
  accept = "image/*",
  multiple = false,
  maxSizeMB = 30,
}: {
  onSelect: (files: File[]) => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-card">
      <FileUploader
        onFileSelect={onSelect}
        accept={accept}
        multiple={multiple}
        maxSizeMB={maxSizeMB}
        title={title}
        subtitle={subtitle}
        icon={icon}
      />
    </div>
  );
}

/** Standard success/result card: preview + stat tiles + download/reset actions. */
export function ResultCard({
  title = "Your file is ready",
  icon: Icon = CheckCircle2,
  previewUrl,
  preview,
  stats = [],
  onDownload,
  downloadLabel = "Download",
  onReset,
  resetLabel = "New image",
  children,
}: {
  title?: string;
  icon?: LucideIcon;
  previewUrl?: string;
  preview?: React.ReactNode;
  stats?: { label: string; value: React.ReactNode }[];
  onDownload?: () => void;
  downloadLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
  children?: React.ReactNode;
}) {
  const hasTop = preview || previewUrl || stats.length > 0;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-border/40 bg-white p-5 shadow-sm duration-500 dark:bg-card lg:p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500">
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      {hasTop && (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          {preview ? (
            preview
          ) : previewUrl ? (
            <PreviewImage src={previewUrl} alt="Result preview" className="h-[240px]" />
          ) : (
            <div />
          )}
          {stats.length > 0 && (
            <div className="flex flex-row gap-3 sm:w-56 sm:flex-col">
              {stats.map((s, i) => (
                <StatTile key={i} label={s.label} value={s.value} />
              ))}
            </div>
          )}
        </div>
      )}

      {children}

      {(onDownload || onReset) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {onDownload && (
            <Button size="lg" className="h-12 flex-1 gap-2 shadow-md" onClick={onDownload}>
              <Download className="h-5 w-5" />
              {downloadLabel}
            </Button>
          )}
          {onReset && (
            <Button size="lg" variant="outline" className="h-12 gap-2 sm:w-auto" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              {resetLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
