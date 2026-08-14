"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Slider,
  Toggle,
  StrengthBar,
  StatusNote,
} from "@/components/tools/security/security-tool-ui";
import { analyzePassword } from "@/components/tools/security/password-utils";

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};
const AMBIGUOUS = /[il1Lo0O]/g;

/** Unbiased random integer in [0, max) using the Web Crypto RNG. */
function secureRandomInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

interface Options {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

function generate(opts: Options): string {
  const active: string[] = [];
  if (opts.lowercase) active.push(SETS.lowercase);
  if (opts.uppercase) active.push(SETS.uppercase);
  if (opts.numbers) active.push(SETS.numbers);
  if (opts.symbols) active.push(SETS.symbols);
  if (active.length === 0) return "";

  const pools = opts.excludeAmbiguous ? active.map((s) => s.replace(AMBIGUOUS, "")) : active;
  const all = pools.join("");
  if (!all) return "";

  const chars: string[] = [];
  // Guarantee at least one char from each selected pool.
  for (const pool of pools) {
    if (chars.length < opts.length) chars.push(pool[secureRandomInt(pool.length)]);
  }
  while (chars.length < opts.length) {
    chars.push(all[secureRandomInt(all.length)]);
  }
  // Fisher–Yates shuffle so the guaranteed chars aren't at the front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function PasswordGenerator() {
  const [opts, setOpts] = useState<Options>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => setPassword(generate(opts)), [opts]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const noneSelected = !opts.lowercase && !opts.uppercase && !opts.numbers && !opts.symbols;
  const analysis = analyzePassword(password);

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  const set = <K extends keyof Options>(key: K, value: Options[K]) =>
    setOpts((o) => ({ ...o, [key]: value }));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Options">
        <div className="space-y-4">
          <Slider
            label="Length"
            value={opts.length}
            onChange={(v) => set("length", v)}
            min={4}
            max={64}
          />
          <div className="grid grid-cols-2 gap-3">
            <Toggle label="Lowercase (a-z)" checked={opts.lowercase} onChange={(v) => set("lowercase", v)} />
            <Toggle label="Uppercase (A-Z)" checked={opts.uppercase} onChange={(v) => set("uppercase", v)} />
            <Toggle label="Numbers (0-9)" checked={opts.numbers} onChange={(v) => set("numbers", v)} />
            <Toggle label="Symbols (!@#)" checked={opts.symbols} onChange={(v) => set("symbols", v)} />
          </div>
          <Toggle
            label="Exclude ambiguous (i, l, 1, L, o, 0, O)"
            checked={opts.excludeAmbiguous}
            onChange={(v) => set("excludeAmbiguous", v)}
          />
          {noneSelected && <StatusNote variant="error">Select at least one character type.</StatusNote>}
        </div>
      </Panel>

      <Panel
        title="Generated password"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={regenerate} disabled={noneSelected}>
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-stretch gap-2">
            <div className="flex min-h-[56px] flex-1 items-center break-all rounded-lg border border-border/60 bg-muted/20 px-4 py-3 font-mono text-lg text-foreground">
              {password || <span className="text-sm text-muted-foreground">—</span>}
            </div>
            <button
              type="button"
              onClick={copy}
              disabled={!password}
              title="Copy password"
              className="flex w-12 shrink-0 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>

          {password && (
            <div className="space-y-3">
              <StrengthBar score={analysis.score} />
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-1 font-medium">~{analysis.entropy} bits entropy</span>
                <span className="rounded-md bg-muted px-2 py-1 font-medium">Cracks in {analysis.crackTime}</span>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
