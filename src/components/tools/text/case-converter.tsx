"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

import { Panel, monoTextareaClass } from "@/components/tools/text/text-tool-ui";

function words(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const CASES: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { label: "lowercase", fn: (s) => s.toLowerCase() },
  {
    label: "Title Case",
    fn: (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
  },
  {
    label: "Sentence case",
    fn: (s) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (c) => c.toUpperCase()),
  },
  {
    label: "camelCase",
    fn: (s) =>
      words(s)
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(""),
  },
  {
    label: "PascalCase",
    fn: (s) => words(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
  },
  { label: "snake_case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { label: "kebab-case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
  { label: "CONSTANT_CASE", fn: (s) => words(s).map((w) => w.toUpperCase()).join("_") },
  { label: "dot.case", fn: (s) => words(s).map((w) => w.toLowerCase()).join(".") },
  {
    label: "aLtErNaTiNg",
    fn: (s) =>
      [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join(""),
  },
  {
    label: "InVeRsE",
    fn: (s) =>
      [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(""),
  },
];

function CaseRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="whitespace-pre-wrap break-words text-sm text-foreground">
          {value || <span className="text-muted-foreground">—</span>}
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        disabled={!value}
        title="Copy"
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function CaseConverter() {
  const [text, setText] = useState("");
  const results = useMemo(() => CASES.map((c) => ({ label: c.label, value: text ? c.fn(text) : "" })), [text]);

  return (
    <div className="space-y-5">
      <Panel title="Your text">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to convert…"
          className={`${monoTextareaClass} min-h-[120px]`}
        />
      </Panel>
      <Panel title="All cases">
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((r) => (
            <CaseRow key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
