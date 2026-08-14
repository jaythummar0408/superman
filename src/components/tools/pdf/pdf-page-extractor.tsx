"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, FileOutput } from "lucide-react";

import {
  FileUploader,
  Panel,
  Field,
  FileChip,
  ProcessButton,
  ResultCard,
  StatusNote,
  controlInputClass,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

function parseRanges(str: string, max: number): number[] {
  const set = new Set<number>();
  for (const part of str.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const m = t.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`Invalid range: "${t}"`);
    const a = +m[1];
    const b = m[2] ? +m[2] : a;
    for (let p = Math.min(a, b); p <= Math.max(a, b); p++) {
      if (p >= 1 && p <= max) set.add(p - 1);
    }
  }
  return [...set].sort((x, y) => x - y);
}

export function PdfPageExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const onSelect = async (f: File) => {
    setFile(f);
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Couldn't read this PDF.");
      setFile(null);
    }
  };

  const extract = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const indices = parseRanges(ranges, pageCount);
      if (indices.length === 0) {
        setError("Enter at least one valid page or range.");
        setProcessing(false);
        return;
      }
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const pages = await out.copyPages(doc, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      setResult({ blob, name: file.name.replace(/\.pdf$/i, "") + "_extracted.pdf", size: blob.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
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
            setFile(null);
            setRanges("");
          }}
          title="Pages extracted"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        {!file ? (
          <FileUploader onFileSelect={(f) => onSelect(f[0])} accept=".pdf,application/pdf" maxSizeMB={50} title="Select a PDF" icon={FileUp} />
        ) : (
          <div className="space-y-5">
            <FileChip file={file} onRemove={() => setFile(null)} />
            <Field label="Pages to extract" hint={`${pageCount} pages total`}>
              <input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1-3, 5, 8-10" className={`${controlInputClass} font-mono`} />
            </Field>
          </div>
        )}
      </Panel>
      {error && <StatusNote variant="error">{error}</StatusNote>}
      {file && (
        <ProcessButton onClick={extract} loading={processing} disabled={!ranges.trim()}>
          <FileOutput className="h-5 w-5" />
          Extract pages
        </ProcessButton>
      )}
    </div>
  );
}
