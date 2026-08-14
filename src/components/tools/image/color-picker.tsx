"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Pipette, Copy, Check, ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { checkerStyle, loadImageElement } from "@/lib/image-utils";
import {
  hexToRgb,
  rgbString,
  hslString,
  readableTextColor,
} from "@/lib/color-utils";
import { UploadCard } from "@/components/tools/image/image-tool-ui";
import { useImageFile } from "@/components/tools/image/use-image-file";

interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperConstructor {
  new (): { open: () => Promise<EyeDropperResult> };
}

export function ColorPicker() {
  const { image, select, clear } = useImageFile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#4F46E5");
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  // Client-only component (loaded with ssr:false), so window is available here.
  const [eyeDropperSupported] = useState(
    () => typeof window !== "undefined" && "EyeDropper" in window
  );

  // Draw the uploaded image onto the sampling canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    let alive = true;
    loadImageElement(image.url).then((img) => {
      if (!alive) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(img, 0, 0);
    });
    return () => {
      alive = false;
    };
  }, [image]);

  const commit = (hex: string) => {
    const upper = hex.toUpperCase();
    setColor(upper);
    setHistory((prev) => [upper, ...prev.filter((c) => c !== upper)].slice(0, 12));
  };

  const pickFromScreen = async () => {
    const Ctor = (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
    if (!Ctor) return;
    try {
      const result = await new Ctor().open();
      commit(result.sRGBHex);
    } catch {
      /* user cancelled */
    }
  };

  const sampleCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const to = (n: number) => n.toString(16).padStart(2, "0");
    commit(`#${to(r)}${to(g)}${to(b)}`);
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

  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
  const values = [
    { label: "HEX", value: color },
    { label: "RGB", value: rgbString(rgb) },
    { label: "HSL", value: hslString(rgb.r, rgb.g, rgb.b) },
  ];

  return (
    <div className="space-y-6">
      {/* Current color */}
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-white shadow-sm dark:bg-card">
        <div className="grid sm:grid-cols-[200px_1fr]">
          <div
            className="flex min-h-[160px] items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: color, color: readableTextColor(rgb.r, rgb.g, rgb.b) }}
          >
            {color}
          </div>
          <div className="flex flex-col gap-3 p-5">
            {eyeDropperSupported && (
              <Button onClick={pickFromScreen} className="w-full gap-2 sm:w-auto">
                <Pipette className="h-4 w-4" />
                Pick color from screen
              </Button>
            )}
            {!eyeDropperSupported && (
              <p className="text-xs text-muted-foreground">
                Screen eyedropper isn&apos;t supported in this browser — upload an image below to
                sample colors from it.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {values.map((v) => (
                <div
                  key={v.label}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {v.label}
                  </span>
                  <span className="ml-3 flex-1 truncate text-sm font-medium tabular-nums text-foreground">
                    {v.value}
                  </span>
                  <button
                    onClick={() => copy(v.value)}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={`Copy ${v.label}`}
                  >
                    {copied === v.value ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {history.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Recent</p>
                <div className="flex flex-wrap gap-1.5">
                  {history.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      title={c}
                      className="h-7 w-7 rounded-md border border-border/60 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pick from image */}
      {!image ? (
        <UploadCard
          onSelect={select}
          title="Pick colors from an image"
          subtitle="Upload an image, then click anywhere on it to sample a color"
          icon={ImageIcon}
        />
      ) : (
        <div className="rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Click the image to sample a color</p>
            <button
              onClick={clear}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div
            className="flex max-h-[440px] items-center justify-center overflow-hidden rounded-xl border border-border/60 p-2"
            style={checkerStyle}
          >
            <canvas
              ref={canvasRef}
              onClick={sampleCanvas}
              className="max-h-[420px] max-w-full cursor-crosshair rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
