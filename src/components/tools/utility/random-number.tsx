"use client";

import React, { useState } from "react";
import { Dices, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  NumberField,
  Toggle,
  StatusNote,
  Slider,
} from "@/components/tools/utility/utility-tool-ui";

function randInt(min: number, max: number): number {
  const range = max - min + 1;
  const limit = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return min + (x % range);
}

export function RandomNumber() {
  const [min, setMin] = useState<number | "">(1);
  const [max, setMax] = useState<number | "">(100);
  const [count, setCount] = useState(5);
  const [unique, setUnique] = useState(false);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lo = typeof min === "number" ? min : 0;
  const hi = typeof max === "number" ? max : 0;

  const generate = () => {
    setError(null);
    if (hi < lo) return setError("Max must be greater than or equal to min.");
    const range = hi - lo + 1;
    if (unique && count > range) return setError(`Only ${range} unique values possible in this range.`);

    let nums: number[];
    if (unique) {
      const set = new Set<number>();
      while (set.size < count) set.add(randInt(lo, hi));
      nums = [...set];
    } else {
      nums = Array.from({ length: count }, () => randInt(lo, hi));
    }
    if (sort) nums.sort((a, b) => a - b);
    setResults(nums);
  };

  const copy = async () => {
    if (!results.length) return;
    try {
      await navigator.clipboard.writeText(results.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Options">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Minimum" value={min} onChange={setMin} />
            <NumberField label="Maximum" value={max} onChange={setMax} />
          </div>
          <Slider label="How many" value={count} onChange={setCount} min={1} max={100} />
          <div className="flex flex-wrap gap-4">
            <Toggle label="Unique values" checked={unique} onChange={setUnique} />
            <Toggle label="Sort ascending" checked={sort} onChange={setSort} />
          </div>
          <Button className="w-full gap-2" onClick={generate}>
            <Dices className="h-4 w-4" />
            Generate
          </Button>
          {error && <StatusNote variant="error">{error}</StatusNote>}
        </div>
      </Panel>

      <Panel
        title={`Results${results.length ? ` (${results.length})` : ""}`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" disabled={!results.length} onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        }
      >
        {results.length === 0 ? (
          <StatusNote variant="info">Click generate to create random numbers.</StatusNote>
        ) : (
          <div className="flex flex-wrap gap-2">
            {results.map((n, i) => (
              <span
                key={i}
                className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-border/50 bg-muted/20 px-3 font-mono text-sm font-semibold tabular-nums text-foreground"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
