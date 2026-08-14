"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ScanLine, Copy, Check, ExternalLink, X, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PreviewImage, UploadCard } from "@/components/tools/image/image-tool-ui";
import { useImageFile, type LoadedImage } from "@/components/tools/image/use-image-file";
import { loadImageElement } from "@/lib/image-utils";

export function QrScanner() {
  const { image, select, clear } = useImageFile();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const decode = React.useCallback(async (img: LoadedImage) => {
    setScanning(true);
    setResult(null);
    setNotFound(false);
    try {
      const el = await loadImageElement(img.url);
      const maxDim = 1600;
      const scale = Math.min(1, maxDim / Math.max(el.naturalWidth, el.naturalHeight));
      const w = Math.max(1, Math.round(el.naturalWidth * scale));
      const h = Math.max(1, Math.round(el.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(el, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const jsQR = (await import("jsqr")).default;
      const code = jsQR(imageData.data, w, h, { inversionAttempts: "attemptBoth" });
      if (code && code.data) {
        setResult(code.data);
        toast.success("QR code decoded");
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not scan this image.");
    } finally {
      setScanning(false);
    }
  }, []);

  const onSelect = async (files: File[]) => {
    const img = await select(files);
    if (img) decode(img);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const isUrl = result ? /^https?:\/\//i.test(result.trim()) : false;

  if (!image) {
    return (
      <UploadCard
        onSelect={onSelect}
        title="Drop a QR code image to scan"
        subtitle="Decode QR codes from a screenshot or photo · processed in your browser"
        icon={ScanLine}
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
        <PreviewImage src={image.url} alt={image.file.name} className="h-[280px] lg:h-[320px]" />
      </div>

      <div className="flex flex-col justify-center">
        {scanning && (
          <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Scanning image…</p>
          </div>
        )}

        {!scanning && result && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Decoded content</h3>
            </div>
            <div className="max-h-40 overflow-auto rounded-lg border border-border/60 bg-muted/20 p-3 font-mono text-sm break-all text-foreground">
              {result}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1 gap-2" onClick={copy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy text"}
              </Button>
              {isUrl && (
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open link
                </a>
              )}
            </div>
          </div>
        )}

        {!scanning && notFound && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No QR code found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a clearer, more cropped image of the code.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clear}>
              Try another image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
