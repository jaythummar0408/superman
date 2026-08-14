"use client";

import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import {
  ImageDown,
  Download,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  Gauge,
  X,
} from "lucide-react";

import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Field,
  PreviewImage,
  RangeField,
  Segmented,
  StatTile,
} from "@/components/tools/image/image-tool-ui";
import {
  downloadBlob,
  extensionForMime,
  formatBytes,
  getImageDimensions,
  stripExtension,
  type OutputMime,
} from "@/lib/image-utils";

type FormatChoice = "auto" | OutputMime;

interface CompressedResult {
  blob: Blob;
  url: string;
  size: number;
  name: string;
  type: string;
}

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);

  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<FormatChoice>("auto");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressedResult | null>(null);

  // Revoke object URLs on unmount / change to avoid leaks.
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
    setProgress(0);
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    try {
      setDims(await getImageDimensions(selected));
    } catch {
      setDims(null);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPreviewUrl("");
    setDims(null);
    setResult(null);
    setProgress(0);
  };

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const compressed = await imageCompression(file, {
        initialQuality: quality / 100,
        useWebWorker: true,
        maxSizeMB: 1000, // effectively uncapped — quality drives the output
        alwaysKeepResolution: true,
        fileType: format === "auto" ? undefined : format,
        onProgress: (p: number) => setProgress(p),
      });

      const url = URL.createObjectURL(compressed);
      const ext = extensionForMime(compressed.type || file.type);
      const name = `${stripExtension(file.name)}-compressed.${ext}`;
      setResult({ blob: compressed, url, size: compressed.size, name, type: compressed.type });

      const saved = file.size - compressed.size;
      if (saved > 0) {
        toast.success(
          `Saved ${formatBytes(saved)} · ${Math.round((saved / file.size) * 100)}% smaller`
        );
      } else {
        toast.info("This image is already highly optimized.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Compression failed. Try another image or format.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const savedBytes = file && result ? file.size - result.size : 0;
  const savedPct = file && result && file.size > 0 ? (savedBytes / file.size) * 100 : 0;

  if (!file) {
    return (
      <div className="rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-card">
        <FileUploader
          onFileSelect={handleSelect}
          accept="image/*"
          multiple={false}
          maxSizeMB={30}
          title="Drop an image to compress"
          subtitle="JPG, PNG, WebP · processed privately in your browser · max 30MB"
          icon={ImageDown}
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
            <span className="rounded-md bg-muted px-2 py-1 font-medium">
              {formatBytes(file.size)}
            </span>
            {dims && (
              <span className="rounded-md bg-muted px-2 py-1 font-medium tabular-nums">
                {dims.width} × {dims.height}px
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Gauge className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Compression settings</h3>
          </div>

          <RangeField
            label="Quality"
            value={quality}
            min={10}
            max={100}
            step={1}
            onChange={setQuality}
            display={`${quality}%`}
          />
          <p className="-mt-3 text-xs text-muted-foreground">
            Lower quality means smaller files. 70–85% is the sweet spot for most photos.
          </p>

          <Field label="Output format">
            <Segmented<FormatChoice>
              value={format}
              onChange={setFormat}
              options={[
                { label: "Keep original", value: "auto" },
                { label: "JPG", value: "image/jpeg" },
                { label: "WebP", value: "image/webp" },
                { label: "PNG", value: "image/png" },
              ]}
            />
          </Field>

          <div className="mt-auto space-y-3">
            {/* Progress bar */}
            {isProcessing && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <Button
              size="lg"
              className="h-12 w-full text-base shadow-md"
              disabled={isProcessing}
              onClick={compress}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Compressing… {progress}%
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ImageDown className="h-5 w-5" />
                  Compress image
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-border/40 bg-white p-5 shadow-sm duration-500 dark:bg-card lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500">
              <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Compression complete</h3>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <StatTile label="Original" value={formatBytes(file.size)} />
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            <StatTile label="Compressed" value={formatBytes(result.size)} />
            <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />
            <div className="hidden flex-1 sm:block">
              <StatTile
                label="Saved"
                accent={savedPct > 0 ? "positive" : "default"}
                value={savedPct > 0 ? `${Math.round(savedPct)}%` : "—"}
              />
            </div>
          </div>

          {/* Reduction bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>File size reduction</span>
              <span className="font-semibold text-foreground">
                {savedPct > 0 ? `${Math.round(savedPct)}% smaller` : "no reduction"}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out"
                style={{ width: `${Math.max(2, Math.min(100, savedPct))}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 flex-1 gap-2 shadow-md"
              onClick={() => downloadBlob(result.blob, result.name)}
            >
              <Download className="h-5 w-5" />
              Download compressed image
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
