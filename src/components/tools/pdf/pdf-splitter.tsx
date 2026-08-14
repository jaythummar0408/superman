"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { FileUp, Scissors } from "lucide-react";

import {
  FileUploader,
  Panel,
  FileChip,
  Slider,
  ProcessButton,
  ResultCard,
  StatusNote,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [perFile, setPerFile] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number; count: number } | null>(null);

  const split = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const total = doc.getPageCount();
      const zip = new JSZip();
      let count = 0;
      for (let start = 0; start < total; start += perFile) {
        const end = Math.min(start + perFile, total);
        const sub = await PDFDocument.create();
        const idxs = Array.from({ length: end - start }, (_, k) => start + k);
        const pages = await sub.copyPages(doc, idxs);
        pages.forEach((p) => sub.addPage(p));
        const out = await sub.save();
        zip.file(`pages_${start + 1}-${end}.pdf`, out);
        count++;
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const name = file.name.replace(/\.pdf$/i, "") + "_split.zip";
      setResult({ blob, name, size: blob.size, count });
    } catch {
      setError("Couldn't split this file. Make sure it is a valid, unprotected PDF.");
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
          }}
          title="PDF split successfully"
          note={`${result.count} file${result.count > 1 ? "s" : ""} in the ZIP`}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        {!file ? (
          <FileUploader onFileSelect={(f) => setFile(f[0])} accept=".pdf,application/pdf" maxSizeMB={50} title="Select a PDF to split" icon={FileUp} />
        ) : (
          <div className="space-y-5">
            <FileChip file={file} onRemove={() => setFile(null)} />
            <Slider
              label="Pages per file"
              value={perFile}
              onChange={setPerFile}
              min={1}
              max={20}
              format={(v) => (v === 1 ? "each page" : `${v} pages`)}
            />
          </div>
        )}
      </Panel>
      {error && <StatusNote variant="error">{error}</StatusNote>}
      {file && (
        <ProcessButton onClick={split} loading={processing}>
          <Scissors className="h-5 w-5" />
          Split PDF
        </ProcessButton>
      )}
    </div>
  );
}
