"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, Merge, ArrowUp, ArrowDown, X, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FileUploader,
  Panel,
  ProcessButton,
  ResultCard,
  StatusNote,
  formatBytes,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

export function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const next = [...files];
    [next[i], next[j]] = [next[j], next[i]];
    setFiles(next);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      setResult({ blob, name: "merged.pdf", size: blob.size });
    } catch {
      setError("Couldn't merge these files. Make sure they are valid, unprotected PDFs.");
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
          title="PDFs merged successfully"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        <FileUploader
          onFileSelect={(f) => setFiles((prev) => [...prev, ...f])}
          accept=".pdf,application/pdf"
          multiple
          maxSizeMB={50}
          title="Select PDF files to merge"
          subtitle="Add two or more PDFs. Max 50MB each."
          icon={FileUp}
        />

        {files.length > 0 && (
          <div className="mt-5 space-y-2">
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-5 text-center text-xs font-semibold text-muted-foreground">{i + 1}</span>
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30" title="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === files.length - 1} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30" title="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="rounded p-1 text-muted-foreground hover:text-destructive" title="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {error && <StatusNote variant="error">{error}</StatusNote>}
      {files.length === 1 && <StatusNote variant="info">Add at least one more PDF to merge.</StatusNote>}

      {files.length >= 2 && (
        <ProcessButton onClick={merge} loading={processing}>
          <Merge className="h-5 w-5" />
          Merge {files.length} PDFs
        </ProcessButton>
      )}
    </div>
  );
}
