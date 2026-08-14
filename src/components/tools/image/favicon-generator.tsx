"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Download, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UploadCard } from "@/components/tools/image/image-tool-ui";
import { useImageFile, type LoadedImage } from "@/components/tools/image/use-image-file";
import {
  canvasToBlob,
  loadImageElement,
  pngBlobsToIco,
  downloadBlob,
} from "@/lib/image-utils";

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];
const PREVIEW_SIZES = [16, 32, 48, 64];

const HTML_SNIPPET = `<!-- Place these in your site's <head> -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
`;

const WEBMANIFEST = JSON.stringify(
  {
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  null,
  2
);

interface Preview {
  size: number;
  url: string;
}

export function FaviconGenerator() {
  const { image, select, clear } = useImageFile();
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const revokePreviews = useCallback((list: Preview[]) => {
    list.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawSquare = (el: HTMLImageElement, size: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    // "contain" — keep the whole logo visible on a transparent square.
    const scale = Math.min(size / el.naturalWidth, size / el.naturalHeight);
    const w = el.naturalWidth * scale;
    const h = el.naturalHeight * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(el, (size - w) / 2, (size - h) / 2, w, h);
    return canvas;
  };

  const generate = useCallback(
    async (img: LoadedImage) => {
      setBusy(true);
      setZipBlob(null);
      setPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
      try {
        const el = await loadImageElement(img.url);
        const pngs = await Promise.all(
          SIZES.map(async (size) => ({
            size,
            blob: await canvasToBlob(drawSquare(el, size), "image/png"),
          }))
        );

        const ico = await pngBlobsToIco(pngs.filter((p) => [16, 32, 48].includes(p.size)));

        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();
        zip.file("favicon.ico", ico);
        pngs.forEach((p) => zip.file(`favicon-${p.size}x${p.size}.png`, p.blob));
        const apple = pngs.find((p) => p.size === 180);
        if (apple) zip.file("apple-touch-icon.png", apple.blob);
        zip.file("site.webmanifest", WEBMANIFEST);
        zip.file("README.txt", HTML_SNIPPET);
        const generated = await zip.generateAsync({ type: "blob" });
        setZipBlob(generated);

        setPreviews(
          pngs
            .filter((p) => PREVIEW_SIZES.includes(p.size))
            .map((p) => ({ size: p.size, url: URL.createObjectURL(p.blob) }))
        );
        toast.success("Favicons generated");
      } catch (err) {
        console.error(err);
        toast.error("Could not generate favicons. Please try another image.");
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const onSelect = async (files: File[]) => {
    const img = await select(files);
    if (img) generate(img);
  };

  const reset = () => {
    revokePreviews(previews);
    setPreviews([]);
    setZipBlob(null);
    clear();
  };

  if (!image) {
    return (
      <UploadCard
        onSelect={onSelect}
        title="Drop a logo to generate favicons"
        subtitle="A square PNG works best · all sizes + favicon.ico, zipped in your browser"
        icon={Star}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="truncate pr-3 text-sm font-medium text-foreground">{image.file.name}</p>
          <button
            onClick={reset}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {busy ? (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Generating favicon sizes…</p>
          </div>
        ) : (
          previews.length > 0 && (
            <div className="animate-in fade-in space-y-6 duration-300">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Live preview
                </p>
                <div className="flex flex-wrap items-end gap-6 rounded-xl border border-border/50 bg-muted/20 p-6">
                  {previews.map((p) => (
                    <div key={p.size} className="flex flex-col items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url}
                        alt={`${p.size}px favicon`}
                        width={p.size}
                        height={p.size}
                        style={{ width: p.size, height: p.size }}
                        className="rounded-[3px]"
                      />
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {p.size}×{p.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                The download includes <code className="rounded bg-muted px-1">favicon.ico</code>,
                PNGs at {SIZES.join(", ")}px, an apple-touch-icon, a web manifest, and the HTML
                snippet to paste into your <code className="rounded bg-muted px-1">&lt;head&gt;</code>.
              </p>
            </div>
          )
        )}
      </div>

      {zipBlob && !busy && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 flex-1 gap-2 shadow-md"
            onClick={() => downloadBlob(zipBlob, "favicons.zip")}
          >
            <Download className="h-5 w-5" />
            Download favicon package (.zip)
          </Button>
          <Button size="lg" variant="outline" className="h-12 gap-2 sm:w-auto" onClick={reset}>
            New image
          </Button>
        </div>
      )}
    </div>
  );
}
