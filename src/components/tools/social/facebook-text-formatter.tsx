"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

import { Panel, Field, monoTextareaClass } from "@/components/tools/social/social-tool-ui";

/** Map ASCII letters/digits into a Mathematical Alphanumeric range. */
function mathMap(text: string, upper: number, lower: number, digit?: number): string {
  let out = "";
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    if (c >= 65 && c <= 90) out += String.fromCodePoint(upper + (c - 65));
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(lower + (c - 97));
    else if (digit && c >= 48 && c <= 57) out += String.fromCodePoint(digit + (c - 48));
    else out += ch;
  }
  return out;
}

/** Append a combining mark to each visible character. */
function combine(text: string, mark: string): string {
  let out = "";
  for (const ch of text) {
    out += ch;
    if (ch.trim()) out += mark;
  }
  return out;
}

const STYLES: { name: string; fn: (t: string) => string }[] = [
  { name: "Bold", fn: (t) => mathMap(t, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { name: "Italic", fn: (t) => mathMap(t, 0x1d608, 0x1d622) },
  { name: "Bold Italic", fn: (t) => mathMap(t, 0x1d63c, 0x1d656) },
  { name: "Serif Bold", fn: (t) => mathMap(t, 0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Monospace", fn: (t) => mathMap(t, 0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Fullwidth", fn: (t) => mathMap(t, 0xff21, 0xff41, 0xff10) },
  { name: "Strikethrough", fn: (t) => combine(t, "̶") },
  { name: "Underline", fn: (t) => combine(t, "̲") },
];

function StyleRow({ name, value }: { name: string; value: string }) {
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
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{name}</div>
        <div className="truncate text-base text-foreground">{value || <span className="text-sm text-muted-foreground">—</span>}</div>
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

export function FacebookTextFormatter() {
  const [text, setText] = useState("");

  return (
    <div className="space-y-5">
      <Panel title="Your text">
        <Field label="Type or paste text">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Facebook doesn't support bold or italic — paste these Unicode styles instead."
            className={`${monoTextareaClass} min-h-[90px]`}
          />
        </Field>
      </Panel>

      <Panel title="Styled versions">
        <div className="space-y-2">
          {STYLES.map((s) => (
            <StyleRow key={s.name} name={s.name} value={text ? s.fn(text) : ""} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
