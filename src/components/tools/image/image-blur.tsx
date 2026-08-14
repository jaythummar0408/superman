"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Droplets, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  PreviewImage,
  RangeField,
  ResultCard,
  Segmented,
  UploadCard,
} from "@/components/tools/image/image-tool-ui";
import { useImageFile } from "@/components/tools/image/use-image-file";
import {
  blurImageToBlob,
  downloadBlob,
  extensionForMime,
  formatBytes,
  resolveOutputMime,
  stripExtension,
  type OutputMime,
} from "@/lib/image-utils";

type FormatChoice = "auto" | OutputMime;

export function ImageBlur() {
  const { image, select, clear } = useImageFile();
  const [radius, setRadius] = useState(8);
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
    setRadius(8);
    select(files);
  };

  const apply = async () => {
    if (!image) return;
    setIsProcessing(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const mime = resolveOutputMime(format, image.file.type);
      const blob = await blurImageToBlob(image.file, radius, mime);
      const url = URL.createObjectURL(blob);
      const name = `${stripExtension(image.file.name)}-blurred.${extensionForMime(mime)}`;
      setResult({ blob, url, size: blob.size, name });
      toast.success(`Blur applied (${radius}px)`);
    } catch (err) {
      console.error(err);
      toast.error("Blur failed. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!image) {
    return (
      <UploadCard
        onSelect={onSelect}
        title="Drop an image to blur"
        subtitle="Adjustable Gaussian blur · processed privately in your browser"
        icon={Droplets}
      />
    );
  }

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
            imgStyle={{ filter: `blur(${radius}px)` }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Droplets className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Blur settings</h3>
          </div>

          <RangeField
            label="Blur radius"
            value={radius}
            min={0}
            max={40}
            step={1}
            onChange={setRadius}
            display={`${radius}px`}
          />

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
                Applying blur…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Apply blur
              </span>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <ResultCard
          title="Blurred image ready"
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
