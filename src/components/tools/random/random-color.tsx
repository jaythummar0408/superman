"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Panel, Slider, randInt } from "@/components/tools/random/random-ui";
import { rgbToHex, hexToRgb, rgbToHsl, readableTextColor } from "@/lib/color-utils";

interface Swatch {
  hex: string;
  rgb: string;
  hsl: string;
  text: string;
}

function makeSwatch(): Swatch {
  const r = randInt(0, 255);
  const g = randInt(0, 255);
  const b = randInt(0, 255);
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)`, text: readableTextColor(r, g, b) };
}

function SwatchCard({ swatch }: { swatch: Swatch }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(swatch.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      toast.success(`Copied ${swatch.hex}`);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={copy}
      className="group overflow-hidden rounded-xl border border-border/50 text-left transition-transform hover:-translate-y-0.5"
    >
      <div className="flex h-24 items-start justify-end p-2" style={{ backgroundColor: swatch.hex, color: swatch.text }}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />}
      </div>
      <div className="space-y-0.5 bg-white p-2.5 dark:bg-card">
        <div className="font-mono text-sm font-semibold text-foreground">{swatch.hex}</div>
        <div className="font-mono text-[11px] text-muted-foreground">{swatch.rgb}</div>
        <div className="font-mono text-[11px] text-muted-foreground">{swatch.hsl}</div>
      </div>
    </button>
  );
}

export function RandomColor() {
  const [count, setCount] = useState(8);
  const [swatches, setSwatches] = useState<Swatch[]>([]);

  const generate = () => setSwatches(Array.from({ length: count }, makeSwatch));
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <Panel title="Options" actions={<Button size="sm" className="gap-1.5" onClick={generate}><RefreshCw className="h-3.5 w-3.5" />Generate</Button>}>
        <Slider label="How many colors" value={count} onChange={setCount} min={1} max={24} />
      </Panel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {swatches.map((s, i) => (
          <SwatchCard key={i} swatch={s} />
        ))}
      </div>
    </div>
  );
}
