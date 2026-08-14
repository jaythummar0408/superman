"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { SwatchBook, Copy, Check, Shuffle, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UploadCard, PreviewImage } from "@/components/tools/image/image-tool-ui";
import { useImageFile, type LoadedImage } from "@/components/tools/image/use-image-file";
import { hexToRgb, readableTextColor, hslToHex } from "@/lib/color-utils";

interface Swatch {
  name: string;
  hex: string;
}

function pretty(name: string) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function ColorPaletteGenerator() {
  const { image, select, clear } = useImageFile();
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const extract = React.useCallback(async (img: LoadedImage) => {
    setLoading(true);
    try {
      const { Vibrant } = await import("node-vibrant/browser");
      const palette = await new Vibrant(img.url).getPalette();
      const entries = Object.entries(palette) as [
        string,
        { hex: string; population: number } | null,
      ][];
      const next = entries
        .filter(([, s]) => s)
        .sort((a, b) => (b[1]?.population ?? 0) - (a[1]?.population ?? 0))
        .map(([name, s]) => ({ name: pretty(name), hex: s!.hex.toUpperCase() }));
      setSwatches(next);
      if (next.length === 0) toast.info("Couldn't find distinct colors in this image.");
    } catch (err) {
      console.error(err);
      toast.error("Could not extract a palette from this image.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onSelect = async (files: File[]) => {
    const img = await select(files);
    if (img) extract(img);
  };

  const randomPalette = () => {
    const base = Math.floor(Math.random() * 360);
    const offsets = [0, 25, -25, 50, 180];
    const next = offsets.map((off, i) => {
      const h = (((base + off) % 360) + 360) % 360;
      const s = 55 + Math.floor(Math.random() * 25);
      const l = Math.max(28, Math.min(72, 48 + (i % 2 ? 12 : -8) + Math.floor(Math.random() * 8)));
      return { name: `Color ${i + 1}`, hex: hslToHex(h, s, l) };
    });
    clear();
    setSwatches(next);
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((c) => (c === value ? null : c)), 1200);
      toast.success(`Copied ${value}`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const copyAll = () => copy(swatches.map((s) => s.hex).join(", "));

  return (
    <div className="space-y-6">
      {!image ? (
        <div className="space-y-3">
          <UploadCard
            onSelect={onSelect}
            title="Drop an image to extract its palette"
            subtitle="We pull the dominant colors right in your browser"
            icon={SwatchBook}
          />
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            or
            <span className="h-px w-8 bg-border" />
          </div>
          <Button variant="outline" className="w-full gap-2" onClick={randomPalette}>
            <Shuffle className="h-4 w-4" />
            Generate a random palette
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="truncate pr-3 text-sm font-medium text-foreground">{image.file.name}</p>
            <button
              onClick={clear}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <PreviewImage src={image.url} alt={image.file.name} className="h-[220px]" />
        </div>
      )}

      {loading && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Extracting colors…
        </p>
      )}

      {swatches.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-500">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map((s) => {
              const rgb = hexToRgb(s.hex) ?? { r: 0, g: 0, b: 0 };
              const textColor = readableTextColor(rgb.r, rgb.g, rgb.b);
              return (
                <button
                  key={s.hex + s.name}
                  onClick={() => copy(s.hex)}
                  className="group flex h-28 flex-col justify-between rounded-xl border border-border/40 p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: s.hex, color: textColor }}
                >
                  <span className="text-[11px] font-medium opacity-80">{s.name}</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold tabular-nums">
                    {copied === s.hex ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
                    {s.hex}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1 gap-2" onClick={copyAll}>
              <Copy className="h-4 w-4" />
              Copy all colors
            </Button>
            <Button variant="outline" className="gap-2 sm:w-auto" onClick={randomPalette}>
              <Shuffle className="h-4 w-4" />
              Random palette
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
