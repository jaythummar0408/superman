"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eraser, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PreviewImage,
  ResultCard,
  UploadCard,
} from "@/components/tools/image/image-tool-ui";
import { useImageFile } from "@/components/tools/image/use-image-file";
import { downloadBlob, formatBytes, stripExtension } from "@/lib/image-utils";

export function BackgroundRemover() {
  const { image, select, clear } = useImageFile();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number; name: string } | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const onSelect = (files: File[]) => {
    setResult(null);
    setProgress(0);
    select(files);
  };

  const run = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    setPhase("Loading AI model…");
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(image.file, {
        progress: (key: string, current: number, total: number) => {
          setProgress(total ? Math.round((current / total) * 100) : 0);
          setPhase(key.startsWith("fetch") ? "Downloading AI model…" : "Removing background…");
        },
        output: { format: "image/png" },
      });
      const url = URL.createObjectURL(blob);
      setResult({
        blob,
        url,
        size: blob.size,
        name: `${stripExtension(image.file.name)}-no-bg.png`,
      });
      toast.success("Background removed");
    } catch (err) {
      console.error(err);
      toast.error("Background removal failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!image) {
    return (
      <UploadCard
        onSelect={onSelect}
        title="Drop an image to remove its background"
        subtitle="AI runs entirely in your browser — your photo never leaves your device"
        icon={Eraser}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:p-6">
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

        <PreviewImage src={image.url} alt={image.file.name} className="h-[300px] lg:h-[360px]" />

        <div className="mt-5 space-y-3">
          {isProcessing && (
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>{phase}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="h-12 w-full text-base shadow-md"
            disabled={isProcessing}
            onClick={run}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Working…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Remove background
              </span>
            )}
          </Button>

          {!result && !isProcessing && (
            <p className="text-center text-xs text-muted-foreground">
              The first run downloads a one-time AI model, so it may take a little longer.
            </p>
          )}
        </div>
      </div>

      {result && (
        <ResultCard
          title="Background removed"
          previewUrl={result.url}
          stats={[{ label: "File size", value: formatBytes(result.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download PNG"
          onReset={clear}
        />
      )}
    </div>
  );
}
