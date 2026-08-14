"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, Archive } from "lucide-react";

import { pdfjsLib } from "@/components/tools/pdf/pdfjs";
import {
  FileUploader,
  Panel,
  FileChip,
  Slider,
  ProcessButton,
  ResultCard,
  StatusNote,
  formatBytes,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [scale, setScale] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number; original: number } | null>(null);

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const src = await pdfjsLib.getDocument({ data }).promise;
      const out = await PDFDocument.create();
      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvas, viewport }).promise;
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality / 100));
        if (!blob) continue;
        const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
        const p = out.addPage([jpg.width, jpg.height]);
        p.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
      }
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      setResult({ blob, name: file.name.replace(/\.pdf$/i, "") + "_compressed.pdf", size: blob.size, original: file.size });
    } catch {
      setError("Couldn't compress this PDF. It may be corrupted or password-protected.");
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    const saved = result.original - result.size;
    const pct = Math.round((saved / result.original) * 100);
    return (
      <div className="mx-auto max-w-2xl">
        <ResultCard
          fileName={result.name}
          size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          onReset={() => {
            setResult(null);
            setFile(null);
          }}
          title="PDF compressed"
          note={
            saved > 0
              ? `${formatBytes(result.original)} → ${formatBytes(result.size)} · ${pct}% smaller`
              : `${formatBytes(result.original)} → ${formatBytes(result.size)} · already well optimized (try lower quality)`
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        {!file ? (
          <FileUploader onFileSelect={(f) => setFile(f[0])} accept=".pdf,application/pdf" maxSizeMB={50} title="Select a PDF to compress" icon={FileUp} />
        ) : (
          <div className="space-y-5">
            <FileChip file={file} onRemove={() => setFile(null)} />
            <Slider label="Image quality" value={quality} onChange={setQuality} min={30} max={90} step={5} format={(v) => `${v}%`} />
            <Slider label="Resolution" value={scale} onChange={setScale} min={0.6} max={1.5} step={0.1} format={(v) => `${v}×`} />
            <StatusNote variant="info">Compression rasterizes each page — text becomes an image (not selectable). Best for scans and image-heavy PDFs.</StatusNote>
          </div>
        )}
      </Panel>
      {error && <StatusNote variant="error">{error}</StatusNote>}
      {file && (
        <ProcessButton onClick={compress} loading={processing}>
          <Archive className="h-5 w-5" />
          Compress PDF
        </ProcessButton>
      )}
    </div>
  );
}
