"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Panel, Slider, CopyButton, shuffle, pick } from "@/components/tools/random/random-ui";
import { EMOJIS } from "@/components/tools/random/data";

export function RandomEmoji() {
  const [count, setCount] = useState(5);
  const [unique, setUnique] = useState(true);
  const [emojis, setEmojis] = useState<string[]>([]);

  const generate = () => {
    if (unique) {
      setEmojis(shuffle(EMOJIS).slice(0, Math.min(count, EMOJIS.length)));
    } else {
      setEmojis(Array.from({ length: count }, () => pick(EMOJIS)));
    }
  };

  const copyOne = async (e: string) => {
    try {
      await navigator.clipboard.writeText(e);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel
        title="Options"
        actions={
          <>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
              <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
              Unique
            </label>
            <Button size="sm" className="gap-1.5" onClick={generate}>
              <RefreshCw className="h-3.5 w-3.5" />
              Generate
            </Button>
          </>
        }
      >
        <Slider label="How many emojis" value={count} onChange={setCount} min={1} max={20} />
      </Panel>

      {emojis.length > 0 && (
        <Panel title="Emojis" actions={<CopyButton value={emojis.join(" ")} label="Copy all" />}>
          <div className="flex flex-wrap justify-center gap-2">
            {emojis.map((e, i) => (
              <button
                key={i}
                onClick={() => copyOne(e)}
                title="Click to copy"
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/50 bg-muted/20 text-3xl transition-transform hover:-translate-y-0.5"
              >
                {e}
              </button>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
