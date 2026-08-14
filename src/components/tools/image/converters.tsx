"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FileImage,
  ArrowRightLeft,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react";

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
  convertImageToBlob,
  downloadBlob,
  extensionForMime,
  formatBytes,
  stripExtension,
  type OutputMime,
} from "@/lib/image-utils";

const LABEL: Record<OutputMime, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
};

function isHeic(file: File) {
  return (
    /\.(heic|heif)$/i.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}

interface ConverterBaseProps {
  defaultTo: OutputMime;
  /** When provided, the user can switch the output format. */
  formats?: OutputMime[];
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

function ConverterBase({ defaultTo, formats, title, subtitle, icon }: ConverterBaseProps) {
  const { image, select, clear } = useImageFile();
  const [to, setTo] = useState<OutputMime>(defaultTo);
  const [quality, setQuality] = useState(92);
  const [preparing, setPreparing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number; name: string } | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const onSelect = async (files: File[]) => {
    setResult(null);
    let file = files[0];
    if (!file) return;

    if (isHeic(file)) {
      try {
        setPreparing(true);
        const heic2any = (await import("heic2any")).default;
        const out = await heic2any({ blob: file, toType: "image/png" });
        const blob = Array.isArray(out) ? out[0] : out;
        file = new File([blob], `${stripExtension(file.name)}.png`, { type: "image/png" });
      } catch (err) {
        console.error(err);
        toast.error("Could not read this HEIC image.");
        return;
      } finally {
        setPreparing(false);
      }
    }
    await select([file]);
  };

  const lossy = to === "image/jpeg" || to === "image/webp";

  const convert = async () => {
    if (!image) return;
    setIsProcessing(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const blob = await convertImageToBlob(image.file, to, quality / 100);
      const url = URL.createObjectURL(blob);
      const name = `${stripExtension(image.file.name)}.${extensionForMime(to)}`;
      setResult({ blob, url, size: blob.size, name });
      toast.success(`Converted to ${LABEL[to]}`);
    } catch (err) {
      console.error(err);
      toast.error("Conversion failed. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!image) {
    return (
      <div className="space-y-4">
        <UploadCard
          onSelect={onSelect}
          title={title}
          subtitle={subtitle}
          icon={icon}
          accept="image/*,.heic,.heif"
        />
        {preparing && (
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Decoding HEIC image…
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:grid-cols-2 lg:p-6">
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="truncate pr-3 text-sm font-medium text-foreground" title={image.file.name}>
              {image.file.name}
            </p>
            <button
              onClick={clear}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <PreviewImage src={image.url} alt={image.file.name} className="h-[280px] lg:h-[340px]" />
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-1 font-medium">{formatBytes(image.file.size)}</span>
            {image.width > 0 && (
              <span className="rounded-md bg-muted px-2 py-1 font-medium tabular-nums">
                {image.width} × {image.height}px
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Conversion settings</h3>
          </div>

          {formats && (
            <Field label="Convert to">
              <Segmented<OutputMime>
                value={to}
                onChange={setTo}
                options={formats.map((f) => ({ label: LABEL[f], value: f }))}
              />
            </Field>
          )}

          {lossy ? (
            <RangeField
              label="Quality"
              value={quality}
              min={10}
              max={100}
              onChange={setQuality}
              display={`${quality}%`}
            />
          ) : (
            <p className="rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              PNG is lossless — every pixel is preserved exactly.
            </p>
          )}

          <Button
            size="lg"
            className="mt-auto h-12 w-full text-base shadow-md"
            disabled={isProcessing}
            onClick={convert}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Converting…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Convert to {LABEL[to]}
              </span>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <ResultCard
          title="Converted image ready"
          previewUrl={result.url}
          stats={[
            { label: "Format", value: LABEL[to] },
            { label: "File size", value: formatBytes(result.size) },
          ]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel={`Download ${LABEL[to]}`}
          onReset={clear}
        />
      )}
    </div>
  );
}

export function ImageToPng() {
  return (
    <ConverterBase
      defaultTo="image/png"
      title="Drop an image to convert to PNG"
      subtitle="Any format (incl. HEIC) → high-quality PNG · processed in your browser"
      icon={FileImage}
    />
  );
}

export function JpgToPng() {
  return (
    <ConverterBase
      defaultTo="image/png"
      title="Drop a JPG to convert to PNG"
      subtitle="Convert JPG/JPEG images to lossless PNG · processed in your browser"
      icon={FileImage}
    />
  );
}

export function PngToJpg() {
  return (
    <ConverterBase
      defaultTo="image/jpeg"
      title="Drop a PNG to convert to JPG"
      subtitle="Convert PNG images to compressed JPG · transparent areas become white"
      icon={FileImage}
    />
  );
}

export function WebpConverter() {
  return (
    <ConverterBase
      defaultTo="image/webp"
      formats={["image/webp", "image/png", "image/jpeg"]}
      title="Drop an image to convert"
      subtitle="Convert to or from WebP · JPG, PNG, WebP, HEIC supported"
      icon={ArrowRightLeft}
    />
  );
}
