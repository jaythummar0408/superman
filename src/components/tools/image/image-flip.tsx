"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FlipHorizontal2, FlipVertical2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Field,
  PreviewImage,
  ResultCard,
  Segmented,
  UploadCard,
} from "@/components/tools/image/image-tool-ui";
import { useImageFile } from "@/components/tools/image/use-image-file";
import {
  downloadBlob,
  extensionForMime,
  formatBytes,
  resolveOutputMime,
  stripExtension,
  transformImageToBlob,
  type OutputMime,
} from "@/lib/image-utils";

type FormatChoice = "auto" | OutputMime;

export function ImageFlip() {
  const { image, select, clear } = useImageFile();
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState<FormatChoice>("auto");
  const [isProcessing, setIsProcessing] = useState(false);
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
    setFlipH(false);
    setFlipV(false);
    select(files);
  };

  const apply = async () => {
    if (!image) return;
    if (!flipH && !flipV) {
      toast.info("Choose horizontal or vertical flip first.");
      return;
    }
    setIsProcessing(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const mime = resolveOutputMime(format, image.file.type);
      const blob = await transformImageToBlob(image.file, { flipH, flipV, mime });
      const url = URL.createObjectURL(blob);
      const name = `${stripExtension(image.file.name)}-flipped.${extensionForMime(mime)}`;
      setResult({ blob, url, size: blob.size, name });
      toast.success("Image flipped");
    } catch (err) {
      console.error(err);
      toast.error("Flip failed. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!image) {
    return (
      <UploadCard
        onSelect={onSelect}
        title="Drop an image to flip"
        subtitle="Mirror horizontally or vertically · processed privately in your browser"
        icon={FlipHorizontal2}
      />
    );
  }

  const toggleCls = (active: boolean) =>
    cn(
      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
      active
        ? "border-primary/40 bg-primary/10 text-primary"
        : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
    );

  return (
    <div className="space-y-6">
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
          <PreviewImage
            src={image.url}
            alt={image.file.name}
            className="h-[280px] lg:h-[340px]"
            imgStyle={{ transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})` }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <FlipHorizontal2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Flip direction</h3>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setFlipH((v) => !v)} className={toggleCls(flipH)}>
              <FlipHorizontal2 className="h-4 w-4" /> Horizontal
            </button>
            <button type="button" onClick={() => setFlipV((v) => !v)} className={toggleCls(flipV)}>
              <FlipVertical2 className="h-4 w-4" /> Vertical
            </button>
          </div>

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

          <Button
            size="lg"
            className="mt-auto h-12 w-full text-base shadow-md"
            disabled={isProcessing}
            onClick={apply}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Flipping…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FlipHorizontal2 className="h-5 w-5" />
                Apply flip
              </span>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <ResultCard
          title="Flipped image ready"
          previewUrl={result.url}
          stats={[{ label: "File size", value: formatBytes(result.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download image"
          onReset={clear}
        />
      )}
    </div>
  );
}
