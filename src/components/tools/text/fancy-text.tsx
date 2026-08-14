"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

import { Panel, monoTextareaClass } from "@/components/tools/text/text-tool-ui";

const cp = (n: number) => String.fromCodePoint(n);

/** Build an overrides map from { 'A': 0x212C, … } code-point entries. */
function ov(entries: Record<string, number>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k in entries) out[k] = cp(entries[k]);
  return out;
}

function styled(
  text: string,
  upper: number,
  lower: number,
  digit: number | null,
  overrides: Record<string, string> = {}
): string {
  let out = "";
  for (const ch of text) {
    if (overrides[ch]) {
      out += overrides[ch];
      continue;
    }
    const c = ch.codePointAt(0)!;
    if (c >= 65 && c <= 90) out += cp(upper + (c - 65));
    else if (c >= 97 && c <= 122) out += cp(lower + (c - 97));
    else if (digit && c >= 48 && c <= 57) out += cp(digit + (c - 48));
    else out += ch;
  }
  return out;
}

const SCRIPT_OV = ov({
  B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b,
  e: 0x212f, g: 0x210a, o: 0x2134,
});
const DBL_OV = ov({ C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 });
const FRAK_OV = ov({ C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 });

const SMALL_CAPS = [..."ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ"];
function smallCaps(text: string): string {
  return [...text]
    .map((ch) => {
      const c = ch.toLowerCase().codePointAt(0)!;
      return c >= 97 && c <= 122 ? SMALL_CAPS[c - 97] : ch;
    })
    .join("");
}

const FLIP_FROM = [..."abcdefghijklmnopqrstuvwxyz"];
const FLIP_TO = [..."ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz"];
function upsideDown(text: string): string {
  const map: Record<string, string> = {};
  FLIP_FROM.forEach((c, i) => (map[c] = FLIP_TO[i]));
  return [...text.toLowerCase()].map((c) => map[c] || c).reverse().join("");
}

function combine(text: string, mark: string): string {
  let out = "";
  for (const ch of text) {
    out += ch;
    if (ch.trim()) out += mark;
  }
  return out;
}

const STYLES: { name: string; fn: (t: string) => string }[] = [
  { name: "Bold", fn: (t) => styled(t, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { name: "Italic", fn: (t) => styled(t, 0x1d608, 0x1d622, null) },
  { name: "Bold Italic", fn: (t) => styled(t, 0x1d63c, 0x1d656, null) },
  { name: "Serif Bold", fn: (t) => styled(t, 0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Script", fn: (t) => styled(t, 0x1d49c, 0x1d4b6, null, SCRIPT_OV) },
  { name: "Double-struck", fn: (t) => styled(t, 0x1d538, 0x1d552, 0x1d7d8, DBL_OV) },
  { name: "Fraktur", fn: (t) => styled(t, 0x1d504, 0x1d51e, null, FRAK_OV) },
  { name: "Monospace", fn: (t) => styled(t, 0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Fullwidth", fn: (t) => styled(t, 0xff21, 0xff41, 0xff10) },
  { name: "Circled", fn: (t) => styled(t, 0x24b6, 0x24d0, null) },
  { name: "Small Caps", fn: smallCaps },
  { name: "Upside Down", fn: upsideDown },
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
        <div className="truncate text-base text-foreground">
          {value || <span className="text-sm text-muted-foreground">—</span>}
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

export function FancyText() {
  const [text, setText] = useState("");
  const results = useMemo(
    () => STYLES.map((s) => ({ name: s.name, value: text ? s.fn(text) : "" })),
    [text]
  );

  return (
    <div className="space-y-5">
      <Panel title="Your text">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text to convert into fancy Unicode fonts…"
          className={`${monoTextareaClass} min-h-[90px]`}
        />
      </Panel>
      <Panel title="Fancy styles">
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((r) => (
            <StyleRow key={r.name} name={r.name} value={r.value} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
