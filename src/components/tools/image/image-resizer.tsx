"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Scaling,
  Download,
  RotateCcw,
  Link2,
  Link2Off,
  X,
  Ruler,
} from "lucide-react";

import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Field,
  PreviewImage,
  RangeField,
  Segmented,
  StatTile,
  controlInputClass,
} from "@/components/tools/image/image-tool-ui";
import { cn } from "@/lib/utils";
import {
  downloadBlob,
  extensionForMime,
  formatBytes,
  getImageDimensions,
  resizeImageToBlob,
  stripExtension,
  type OutputMime,
} from "@/lib/image-utils";

type FormatChoice = "auto" | OutputMime;
type Mode = "px" | "percent";

interface Dims {
  width: number;
  height: number;
}
interface ResizeResult {
  blob: Blob;
  url: string;
  size: number;
  name: string;
  dims: Dims;
}

const WIDTH_PRESETS = [1920, 1280, 800, 640];
const PERCENT_PRESETS = [75, 50, 25];

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [orig, setOrig] = useState<Dims | null>(null);

  const [mode, setMode] = useState<Mode>("px");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percent, setPercent] = useState(100);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<FormatChoice>("auto");

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ResizeResult | null>(null);

  const aspect = orig ? orig.width / orig.height : 1;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleSelect = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    try {
      const d = await getImageDimensions(selected);
      setOrig(d);
      setWidth(d.width);
      setHeight(d.height);
      setPercent(100);
    } catch {
      setOrig(null);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPreviewUrl("");
    setOrig(null);
    setResult(null);
    setMode("px");
    setLock(true);
    setFormat("auto");
  };

  const onWidthChange = (v: number) => {
    setWidth(v);
    if (lock && orig) setHeight(Math.max(1, Math.round(v / aspect)));
  };
  const onHeightChange = (v: number) => {
    setHeight(v);
    if (lock && orig) setWidth(Math.max(1, Math.round(v * aspect)));
  };

  const target: Dims = useMemo(() => {
    if (!orig) return { width: 0, height: 0 };
    if (mode === "percent") {
      return {
        width: Math.max(1, Math.round((orig.width * percent) / 100)),
        height: Math.max(1, Math.round((orig.height * percent) / 100)),
      };
    }
    return { width: Math.max(1, width || 0), height: Math.max(1, height || 0) };
  }, [mode, percent, width, height, orig]);

  const resolveMime = (): OutputMime => {
    if (format !== "auto") return format;
    const t = file?.type;
    if (t === "image/jpeg" || t === "image/png" || t === "image/webp") return t;
    return "image/png";
  };

  const doResize = async () => {
    if (!file || !orig) return;
    setIsProcessing(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const mime = resolveMime();
      const blob = await resizeImageToBlob(file, target.width, target.height, mime, 0.92);
      const url = URL.createObjectURL(blob);
      const ext = extensionForMime(mime);
      const name = `${stripExtension(file.name)}-${target.width}x${target.height}.${ext}`;
      setResult({ blob, url, size: blob.size, name, dims: { ...target } });
      toast.success(`Resized to ${target.width} × ${target.height}px`);
    } catch (err) {
      console.error(err);
      toast.error("Resize failed. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return (
      <div className="rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-card">
        <FileUploader
          onFileSelect={handleSelect}
          accept="image/*"
          multiple={false}
          maxSizeMB={30}
          title="Drop an image to resize"
          subtitle="JPG, PNG, WebP · processed privately in your browser · max 30MB"
          icon={Scaling}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:grid-cols-2 lg:p-6">
        {/* Preview */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="truncate pr-3 text-sm font-medium text-foreground" title={file.name}>
              {file.name}
            </p>
            <button
              onClick={reset}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <PreviewImage src={previewUrl} alt={file.name} className="h-[300px] lg:h-[360px]" />
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-1 font-medium">{formatBytes(file.size)}</span>
            {orig && (
              <span className="rounded-md bg-muted px-2 py-1 font-medium tabular-nums">
                {orig.width} × {orig.height}px
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Ruler className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Resize settings</h3>
          </div>

          <Field label="Resize by">
            <Segmented<Mode>
              value={mode}
              onChange={setMode}
              options={[
                { label: "Dimensions", value: "px" },
                { label: "Percentage", value: "percent" },
              ]}
            />
          </Field>

          {mode === "px" ? (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-foreground">Width (px)</label>
                <input
                  type="number"
                  min={1}
                  value={width || ""}
                  onChange={(e) => onWidthChange(Number(e.target.value))}
                  className={controlInputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => setLock((l) => !l)}
                aria-label={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                className={cn(
                  "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors",
                  lock
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground"
                )}
              >
                {lock ? <Link2 className="h-4 w-4" /> : <Link2Off className="h-4 w-4" />}
              </button>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-foreground">Height (px)</label>
                <input
                  type="number"
                  min={1}
                  value={height || ""}
                  onChange={(e) => onHeightChange(Number(e.target.value))}
                  className={controlInputClass}
                />
              </div>
            </div>
          ) : (
            <RangeField
              label="Scale"
              value={percent}
              min={1}
              max={200}
              step={1}
              onChange={setPercent}
              display={`${percent}%`}
            />
          )}

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {mode === "px"
              ? WIDTH_PRESETS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onWidthChange(w)}
                    className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                  >
                    {w}px
                  </button>
                ))
              : PERCENT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPercent(p)}
                    className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                  >
                    {p}%
                  </button>
                ))}
          </div>

          <Field label="Output format">
            <Segmented<FormatChoice>
              value={format}
              onChange={setFormat}
              options={[
                { label: "Keep original", value: "auto" },
                { label: "JPG", value: "image/jpeg" },
                { label: "PNG", value: "image/png" },
                { label: "WebP", value: "image/webp" },
              ]}
            />
          </Field>

          <div className="mt-auto flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">New size</span>
            <span className="font-semibold tabular-nums text-foreground">
              {target.width} × {target.height}px
            </span>
          </div>

          <Button
            size="lg"
            className="h-12 w-full text-base shadow-md"
            disabled={isProcessing || target.width < 1 || target.height < 1}
            onClick={doResize}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Resizing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Scaling className="h-5 w-5" />
                Resize image
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-border/40 bg-white p-5 shadow-sm duration-500 dark:bg-card lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500">
              <Scaling className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Resized image ready</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <PreviewImage src={result.url} alt="Resized preview" className="h-[240px]" />
            <div className="flex flex-row gap-3 sm:w-56 sm:flex-col">
              <StatTile label="Dimensions" value={`${result.dims.width}×${result.dims.height}`} />
              <StatTile label="File size" value={formatBytes(result.size)} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 flex-1 gap-2 shadow-md"
              onClick={() => downloadBlob(result.blob, result.name)}
            >
              <Download className="h-5 w-5" />
              Download resized image
            </Button>
            <Button size="lg" variant="outline" className="h-12 gap-2 sm:w-auto" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              New image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
