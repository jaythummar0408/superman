"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Smile, X, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  RangeField,
  UploadCard,
  controlInputClass,
} from "@/components/tools/image/image-tool-ui";
import { useImageFile } from "@/components/tools/image/use-image-file";
import {
  canvasToBlob,
  checkerStyle,
  downloadBlob,
  loadImageElement,
  stripExtension,
} from "@/lib/image-utils";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function MemeGenerator() {
  const { image, select, clear } = useImageFile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const [top, setTop] = useState("TOP TEXT");
  const [bottom, setBottom] = useState("BOTTOM TEXT");
  const [sizePct, setSizePct] = useState(10);

  useEffect(() => {
    let alive = true;
    if (!image) return;
    loadImageElement(image.url)
      .then((el) => alive && setImgEl(el))
      .catch(() => alive && setImgEl(null));
    return () => {
      alive = false;
    };
  }, [image]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgEl, 0, 0);

    const fontPx = Math.max(14, Math.round((sizePct / 100) * canvas.width));
    ctx.font = `bold ${fontPx}px Impact, "Arial Narrow Bold", "Arial Black", sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(2, fontPx / 12);
    ctx.lineJoin = "round";
    ctx.textAlign = "center";

    const maxWidth = canvas.width * 0.92;
    const lineHeight = fontPx * 1.1;
    const pad = fontPx * 0.4;
    const cx = canvas.width / 2;

    // Top text — grows downward from the top edge.
    if (top.trim()) {
      ctx.textBaseline = "top";
      const lines = wrapLines(ctx, top.toUpperCase(), maxWidth);
      lines.forEach((line, i) => {
        const y = pad + i * lineHeight;
        ctx.strokeText(line, cx, y);
        ctx.fillText(line, cx, y);
      });
    }

    // Bottom text — stacks upward from the bottom edge.
    if (bottom.trim()) {
      ctx.textBaseline = "bottom";
      const lines = wrapLines(ctx, bottom.toUpperCase(), maxWidth);
      lines.forEach((line, i) => {
        const y = canvas.height - pad - (lines.length - 1 - i) * lineHeight;
        ctx.strokeText(line, cx, y);
        ctx.fillText(line, cx, y);
      });
    }
  }, [imgEl, top, bottom, sizePct]);

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    try {
      const blob = await canvasToBlob(canvas, "image/png", 0.92);
      downloadBlob(blob, `${stripExtension(image.file.name)}-meme.png`);
      toast.success("Meme downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not export the meme.");
    }
  };

  if (!image) {
    return (
      <UploadCard
        onSelect={select}
        title="Drop an image to make a meme"
        subtitle="Classic top/bottom caption meme · processed privately in your browser"
        icon={Smile}
      />
    );
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:grid-cols-2 lg:p-6">
      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <p className="truncate pr-3 text-sm font-medium text-foreground">{image.file.name}</p>
          <button
            onClick={clear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className="flex h-[300px] items-center justify-center overflow-hidden rounded-xl border border-border/60 p-2 lg:h-[380px]"
          style={checkerStyle}
        >
          <canvas ref={canvasRef} className="max-h-full max-w-full rounded-md object-contain" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <Smile className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Captions</h3>
        </div>

        <Field label="Top text">
          <input
            type="text"
            value={top}
            onChange={(e) => setTop(e.target.value)}
            placeholder="Top caption"
            className={controlInputClass}
          />
        </Field>
        <Field label="Bottom text">
          <input
            type="text"
            value={bottom}
            onChange={(e) => setBottom(e.target.value)}
            placeholder="Bottom caption"
            className={controlInputClass}
          />
        </Field>

        <RangeField
          label="Font size"
          value={sizePct}
          min={5}
          max={18}
          step={1}
          onChange={setSizePct}
          display={`${sizePct}%`}
        />

        <Button size="lg" className="mt-auto h-12 w-full gap-2 text-base shadow-md" onClick={download}>
          <Download className="h-5 w-5" />
          Download meme
        </Button>
      </div>
    </div>
  );
}
