"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ImageUp, FileDown, X } from "lucide-react";

import {
  FileUploader,
  Panel,
  SelectField,
  ProcessButton,
  ResultCard,
  StatusNote,
  formatBytes,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

type PageSize = "fit" | "a4" | "letter";
const SIZES: Record<Exclude<PageSize, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const convert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const isPng = f.type.includes("png") || /\.png$/i.test(f.name);
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        if (pageSize === "fit") {
          const page = pdf.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        } else {
          const [pw, ph] = SIZES[pageSize];
          const page = pdf.addPage([pw, ph]);
          const margin = 36;
          const scale = Math.min((pw - margin * 2) / img.width, (ph - margin * 2) / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
        }
      }
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      setResult({ blob, name: "images.pdf", size: blob.size });
    } catch {
      setError("Couldn't convert. Only JPG and PNG images are supported.");
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <ResultCard
          fileName={result.name}
          size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          onReset={() => {
            setResult(null);
            setFiles([]);
          }}
          title="PDF created"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        <FileUploader
          onFileSelect={(f) => setFiles((prev) => [...prev, ...f])}
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          multiple
          maxSizeMB={25}
          title="Select images (JPG / PNG)"
          subtitle="Each image becomes one page. Max 25MB each."
          icon={ImageUp}
        />
        {files.length > 0 && (
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                  <span className="truncate text-sm text-foreground">
                    {i + 1}. {f.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(f.size)}</span>
                    <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <SelectField<PageSize>
              label="Page size"
              value={pageSize}
              onChange={setPageSize}
              options={[
                { label: "Fit to image", value: "fit" },
                { label: "A4", value: "a4" },
                { label: "US Letter", value: "letter" },
              ]}
            />
          </div>
        )}
      </Panel>
      {error && <StatusNote variant="error">{error}</StatusNote>}
      {files.length > 0 && (
        <ProcessButton onClick={convert} loading={processing}>
          <FileDown className="h-5 w-5" />
          Create PDF ({files.length} {files.length === 1 ? "image" : "images"})
        </ProcessButton>
      )}
    </div>
  );
}
