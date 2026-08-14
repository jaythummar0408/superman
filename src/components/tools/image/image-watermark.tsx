"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Stamp, X, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Field,
  RangeField,
  Segmented,
  UploadCard,
  controlInputClass,
} from "@/components/tools/image/image-tool-ui";
import { useImageFile } from "@/components/tools/image/use-image-file";
import {
  canvasToBlob,
  checkerStyle,
  downloadBlob,
  extensionForMime,
  loadImageElement,
  resolveOutputMime,
  stripExtension,
  type OutputMime,
} from "@/lib/image-utils";

type FormatChoice = "auto" | OutputMime;
type Pos =
  | "top-left" | "top-center" | "top-right"
  | "middle-left" | "center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

const POSITIONS: Pos[] = [
  "top-left", "top-center", "top-right",
  "middle-left", "center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
];

export function ImageWatermark() {
  const { image, select, clear } = useImageFile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const [text, setText] = useState("© Your Brand");
  const [sizePct, setSizePct] = useState(6);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(60);
  const [position, setPosition] = useState<Pos>("bottom-right");
  const [tile, setTile] = useState(false);
  const [format, setFormat] = useState<FormatChoice>("auto");

  // Load the base image into an <img> we can draw from.
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

  // Redraw the watermarked canvas whenever inputs change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgEl, 0, 0);

    if (!text.trim()) return;
    const fontPx = Math.max(10, Math.round((sizePct / 100) * canvas.width));
    ctx.font = `bold ${fontPx}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;

    if (tile) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const stepX = ctx.measureText(text).width + fontPx * 2.5;
      const stepY = fontPx * 3;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      const spanX = canvas.width + canvas.height;
      const spanY = canvas.width + canvas.height;
      for (let y = -spanY; y < spanY; y += stepY) {
        for (let x = -spanX; x < spanX; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    } else {
      const pad = Math.round(fontPx * 0.6);
      const [v, h] = positionParts(position);
      ctx.textAlign = h;
      ctx.textBaseline = v;
      const x = h === "left" ? pad : h === "right" ? canvas.width - pad : canvas.width / 2;
      const y = v === "top" ? pad : v === "bottom" ? canvas.height - pad : canvas.height / 2;
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
  }, [imgEl, text, sizePct, color, opacity, position, tile]);

  const onSelect = (files: File[]) => select(files);

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    try {
      const mime = resolveOutputMime(format, image.file.type);
      const blob = await canvasToBlob(canvas, mime, 0.92);
      downloadBlob(blob, `${stripExtension(image.file.name)}-watermarked.${extensionForMime(mime)}`);
      toast.success("Watermarked image downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not export the image.");
    }
  };

  if (!image) {
    return (
      <UploadCard
        onSelect={onSelect}
        title="Drop an image to watermark"
        subtitle="Add a text watermark · processed privately in your browser"
        icon={Stamp}
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
          <Stamp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Watermark</h3>
        </div>

        <Field label="Watermark text">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="© Your Brand"
            className={controlInputClass}
          />
        </Field>

        <RangeField
          label="Text size"
          value={sizePct}
          min={2}
          max={20}
          step={1}
          onChange={setSizePct}
          display={`${sizePct}%`}
        />
        <RangeField
          label="Opacity"
          value={opacity}
          min={5}
          max={100}
          step={1}
          onChange={setOpacity}
          display={`${opacity}%`}
        />

        <div className="flex items-center justify-between gap-4">
          <Field label="Color">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded-md border border-border/60 bg-transparent"
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={tile}
              onChange={(e) => setTile(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Tile across image
          </label>
        </div>

        {!tile && (
          <Field label="Position">
            <div className="grid w-[120px] grid-cols-3 gap-1">
              {POSITIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPosition(p)}
                  aria-label={p}
                  className={cn(
                    "h-8 rounded-md border transition-colors",
                    position === p
                      ? "border-primary bg-primary/15"
                      : "border-border/60 bg-muted/30 hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "mx-auto block h-1.5 w-1.5 rounded-full",
                      position === p ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </Field>
        )}

        <Field label="Output format">
          <Segmented<FormatChoice>
            value={format}
            onChange={setFormat}
            options={[
              { label: "Keep original", value: "auto" },
              { label: "PNG", value: "image/png" },
              { label: "JPG", value: "image/jpeg" },
              { label: "WebP", value: "image/webp" },
            ]}
          />
        </Field>

        <Button size="lg" className="mt-auto h-12 w-full gap-2 text-base shadow-md" onClick={download}>
          <Download className="h-5 w-5" />
          Download watermarked image
        </Button>
      </div>
    </div>
  );
}

function positionParts(p: Pos): [CanvasTextBaseline, CanvasTextAlign] {
  const v: CanvasTextBaseline = p.startsWith("top")
    ? "top"
    : p.startsWith("bottom")
      ? "bottom"
      : "middle";
  const h: CanvasTextAlign = p.endsWith("left")
    ? "left"
    : p.endsWith("right")
      ? "right"
      : "center";
  return [v, h];
}
