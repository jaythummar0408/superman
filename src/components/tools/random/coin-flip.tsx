"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Panel, randInt } from "@/components/tools/random/random-ui";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-3 text-center">
      <div className="text-2xl font-bold tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

export function CoinFlip() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [tally, setTally] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const r = randInt(0, 1) === 0 ? "heads" : "tails";
      setResult(r);
      setTally((t) => ({ ...t, [r]: t[r] + 1 }));
      setFlipping(false);
    }, 600);
  };

  const total = tally.heads + tally.tails;

  return (
    <div className="mx-auto max-w-md space-y-5">
      <Panel>
        <div className="flex flex-col items-center gap-6 py-4">
          <div
            className={cn(
              "flex h-32 w-32 items-center justify-center rounded-full border-4 text-4xl font-bold shadow-lg transition-transform duration-500",
              flipping && "animate-spin",
              result === "heads"
                ? "border-amber-400 bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900"
                : result === "tails"
                ? "border-zinc-400 bg-gradient-to-br from-zinc-300 to-zinc-500 text-zinc-900"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            {flipping ? "?" : result === "heads" ? "H" : result === "tails" ? "T" : "?"}
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold capitalize text-foreground">
              {flipping ? "Flipping…" : result ?? "Ready"}
            </div>
          </div>

          <Button className="w-full" onClick={flip} disabled={flipping}>
            Flip coin
          </Button>
        </div>
      </Panel>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Heads" value={tally.heads} />
          <Stat label="Tails" value={tally.tails} />
          <Stat label="Total" value={total} />
        </div>
      )}
    </div>
  );
}
