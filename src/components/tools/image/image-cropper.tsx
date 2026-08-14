"use client";

import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { toast } from "sonner";
import {
  Crop as CropIcon,
  Download,
  RotateCcw,
  RotateCw,
  X,
} from "lucide-react";

import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Field,
  PreviewImage,
  RangeField,
  Segmented,
} from "@/components/tools/image/image-tool-ui";
import {
  downloadBlob,
  extensionForMime,
  formatBytes,
  getCroppedBlob,
  stripExtension,
  type OutputMime,
} from "@/lib/image-utils";

type FormatChoice = "auto" | OutputMime;
type AspectKey = "free" | "1:1" | "4:3" | "3:2" | "16:9" | "9:16";

const ASPECTS: Record<AspectKey, number | undefined> = {
  free: undefined,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
};

interface CropResult {
  blob: Blob;
  url: string;
  size: number;
  name: string;
  dims: { width: number; height: number };
}

export function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectKey, setAspectKey] = useState<AspectKey>("free");
  const [format, setFormat] = useState<FormatChoice>("auto");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CropResult | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);
  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSelect = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setFile(selected);
    setImageUrl(URL.createObjectURL(selected));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setImageUrl("");
    setResult(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspectKey("free");
    setFormat("auto");
    setCroppedAreaPixels(null);
  };

  const resolveMime = (): OutputMime => {
    if (format !== "auto") return format;
    const t = file?.type;
    if (t === "image/jpeg" || t === "image/png" || t === "image/webp") return t;
    return "image/png";
  };

  const applyCrop = async () => {
    if (!file || !imageUrl || !croppedAreaPixels) return;
    setIsProcessing(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const mime = resolveMime();
      const blob = await getCroppedBlob(imageUrl, croppedAreaPixels, rotation, mime, 0.92);
      const url = URL.createObjectURL(blob);
      const ext = extensionForMime(mime);
      const dims = {
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
      };
      const name = `${stripExtension(file.name)}-cropped.${ext}`;
      setResult({ blob, url, size: blob.size, name, dims });
      toast.success(`Cropped to ${dims.width} × ${dims.height}px`);
    } catch (err) {
      console.error(err);
      toast.error("Crop failed. Please try again.");
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
          title="Drop an image to crop"
          subtitle="JPG, PNG, WebP · processed privately in your browser · max 30MB"
          icon={CropIcon}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:grid-cols-[1.3fr_1fr] lg:p-6">
        {/* Crop stage */}
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
          <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/40 lg:h-[400px]">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={ASPECTS[aspectKey]}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              showGrid
              restrictPosition={false}
            />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Drag to reposition · scroll or pinch to zoom
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <CropIcon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Crop settings</h3>
          </div>

          <Field label="Aspect ratio">
            <Segmented<AspectKey>
              value={aspectKey}
              onChange={setAspectKey}
              options={[
                { label: "Free", value: "free" },
                { label: "1:1", value: "1:1" },
                { label: "4:3", value: "4:3" },
                { label: "3:2", value: "3:2" },
                { label: "16:9", value: "16:9" },
                { label: "9:16", value: "9:16" },
              ]}
            />
          </Field>

          <RangeField
            label="Zoom"
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={setZoom}
            display={`${zoom.toFixed(2)}×`}
          />

          <div>
            <RangeField
              label="Rotation"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={setRotation}
              display={`${rotation}°`}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 270) % 360)}
                className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> 90° left
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCw className="h-3.5 w-3.5" /> 90° right
              </button>
            </div>
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
            disabled={isProcessing || !croppedAreaPixels}
            onClick={applyCrop}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Cropping…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CropIcon className="h-5 w-5" />
                Crop image
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
              <CropIcon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Cropped image ready</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <PreviewImage src={result.url} alt="Cropped preview" className="h-[240px]" />
            <div className="flex flex-row gap-3 sm:w-56 sm:flex-col">
              <StatMini label="Dimensions" value={`${result.dims.width}×${result.dims.height}`} />
              <StatMini label="File size" value={formatBytes(result.size)} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 flex-1 gap-2 shadow-md"
              onClick={() => downloadBlob(result.blob, result.name)}
            >
              <Download className="h-5 w-5" />
              Download cropped image
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

function StatMini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
