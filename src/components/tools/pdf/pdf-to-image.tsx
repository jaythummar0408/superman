"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { FileUp, Images, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pdfjsLib } from "@/components/tools/pdf/pdfjs";
import {
  FileUploader,
  Panel,
  FileChip,
  SelectField,
  Slider,
  ProcessButton,
  StatusNote,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

type Fmt = "png" | "jpeg";
interface PageImg {
  page: number;
  blob: Blob;
  url: string;
}

export function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Fmt>("png");
  const [scale, setScale] = useState(1.5);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<PageImg[]>([]);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setImages([]);
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const out: PageImg[] = [];
      const mime = format === "png" ? "image/png" : "image/jpeg";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvas, viewport }).promise;
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, mime, 0.92));
        if (blob) out.push({ page: i, blob, url: URL.createObjectURL(blob) });
      }
      setImages(out);
    } catch {
      setError("Couldn't render this PDF. It may be corrupted or password-protected.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const ext = format === "png" ? "png" : "jpg";
    images.forEach((img) => zip.file(`page_${img.page}.${ext}`, img.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, (file?.name.replace(/\.pdf$/i, "") || "pdf") + "_images.zip");
  };

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setFile(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Panel>
        {!file ? (
          <FileUploader onFileSelect={(f) => setFile(f[0])} accept=".pdf,application/pdf" maxSizeMB={50} title="Select a PDF to convert to images" icon={FileUp} />
        ) : (
          <div className="space-y-5">
            <FileChip file={file} onRemove={reset} />
            <div className="grid grid-cols-2 gap-4">
              <SelectField<Fmt>
                label="Format"
                value={format}
                onChange={setFormat}
                options={[
                  { label: "PNG (lossless)", value: "png" },
                  { label: "JPEG (smaller)", value: "jpeg" },
                ]}
              />
              <Slider label="Quality / scale" value={scale} onChange={setScale} min={1} max={3} step={0.5} format={(v) => `${v}×`} />
            </div>
          </div>
        )}
      </Panel>

      {error && <StatusNote variant="error">{error}</StatusNote>}

      {file && images.length === 0 && (
        <ProcessButton onClick={convert} loading={processing}>
          <Images className="h-5 w-5" />
          Convert to images
        </ProcessButton>
      )}

      {images.length > 0 && (
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{images.length} page{images.length > 1 ? "s" : ""}</span>
            <Button size="sm" className="gap-1.5" onClick={downloadAll}>
              <Download className="h-3.5 w-3.5" />
              Download all (ZIP)
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <button
                key={img.page}
                onClick={() => downloadBlob(img.blob, `page_${img.page}.${format === "png" ? "png" : "jpg"}`)}
                className="group overflow-hidden rounded-lg border border-border/50 bg-muted/20 transition-transform hover:-translate-y-0.5"
                title={`Download page ${img.page}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Page ${img.page}`} className="aspect-[3/4] w-full bg-white object-contain" />
                <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground">
                  <span>Page {img.page}</span>
                  <Download className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
