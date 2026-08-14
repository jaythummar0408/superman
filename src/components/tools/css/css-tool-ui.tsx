"use client";

import React, { useState } from "react";
import type { Extension } from "@codemirror/state";
import { Trash2, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hexToRgb } from "@/lib/color-utils";
import { Button } from "@/components/ui/button";

// Re-export the shared dev primitives so CSS tools have a single import source.
export {
  Panel,
  Field,
  Segmented,
  StatusNote,
  CopyButton,
  CodeEditor,
  controlInputClass,
  monoTextareaClass,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

import {
  Panel,
  CopyButton,
  CodeEditor,
  StatusNote,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

/** hex + alpha (0–1) → an `rgba(...)` string; falls back to the hex if unparseable. */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const a = Math.round(alpha * 100) / 100;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

/* ------------------------------------------------------------------ */
/* Labelled range slider                                              */
/* ------------------------------------------------------------------ */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
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

/* ------------------------------------------------------------------ */
/* Colour input — native picker swatch + hex text field              */
/* ------------------------------------------------------------------ */
export function ColorInput({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(value) ? value : "#000000";
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border/60 shadow-sm">
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-25%] h-[150%] w-[150%] cursor-pointer border-0 bg-transparent p-0"
            aria-label={label ? `${label} colour picker` : "colour picker"}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-sm text-foreground uppercase shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Styled native select                                              */
/* ------------------------------------------------------------------ */
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
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox row                                                      */
/* ------------------------------------------------------------------ */
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Preview surface                                                   */
/* ------------------------------------------------------------------ */
export function PreviewSurface({
  children,
  className,
  minHeight = "240px",
}: {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}) {
  return (
    <div
      style={{ minHeight }}
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted/20 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generated-code block (dark, always) with copy                     */
/* ------------------------------------------------------------------ */
export function CodeOutput({ code, prefix }: { code: string; prefix?: string }) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 pr-24 text-sm leading-relaxed text-zinc-100">
        <code className="whitespace-pre font-mono">
          {prefix ? <span className="text-zinc-500">{prefix}</span> : null}
          {code}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generator layout: controls | preview, then generated code         */
/* ------------------------------------------------------------------ */
export function GenLayout({
  controls,
  preview,
  code,
  controlsTitle = "Controls",
  previewTitle = "Live preview",
  codeTitle = "Generated CSS",
}: {
  controls: React.ReactNode;
  preview: React.ReactNode;
  code: React.ReactNode;
  controlsTitle?: string;
  previewTitle?: string;
  codeTitle?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={controlsTitle}>{controls}</Panel>
        <Panel title={previewTitle}>{preview}</Panel>
      </div>
      <Panel title={codeTitle}>{code}</Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared minify / beautify tool                                      */
/* ------------------------------------------------------------------ */
function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

/**
 * Generic two-editor formatter used by every CSS/HTML/JS minifier &
 * beautifier. `transform` may be sync or async and should throw on error.
 */
export function FormatterTool({
  transform,
  extension,
  sample,
  actionLabel,
  inputTitle = "Input",
  outputTitle = "Output",
  inputPlaceholder,
  outputPlaceholder,
  downloadName,
  downloadMime = "text/plain;charset=utf-8",
  showStats = false,
}: {
  transform: (input: string) => string | Promise<string>;
  extension?: Extension;
  sample: string;
  actionLabel: string;
  inputTitle?: string;
  outputTitle?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  downloadName: string;
  downloadMime?: string;
  showStats?: boolean;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const exts = extension ? [extension] : [];

  const run = async (text: string) => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    setBusy(true);
    try {
      const result = await transform(text);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    } finally {
      setBusy(false);
    }
  };

  const saved = input && output ? input.length - output.length : 0;
  const savedPct = input.length > 0 ? Math.round((saved / input.length) * 100) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title={inputTitle}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(sample);
                run(sample);
              }}
            >
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setInput("");
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <CodeEditor value={input} onChange={setInput} extensions={exts} placeholder={inputPlaceholder} />
        <div className="mt-3">
          <Button className="w-full gap-2" onClick={() => run(input)} disabled={busy || !input.trim()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {actionLabel}
          </Button>
        </div>
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title={outputTitle}
        actions={
          <>
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() => downloadText(downloadName, output, downloadMime)}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor value={output} extensions={exts} readOnly placeholder={outputPlaceholder} />
        {showStats && output && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-1 font-medium">
              {formatBytes(input.length)} → {formatBytes(output.length)}
            </span>
            {saved > 0 && (
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
                {savedPct}% smaller
              </span>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
