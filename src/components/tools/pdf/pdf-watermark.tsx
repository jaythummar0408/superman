"use client";

import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { FileUp, Stamp } from "lucide-react";

import {
  FileUploader,
  Panel,
  Field,
  FileChip,
  Slider,
  SelectField,
  ProcessButton,
  ResultCard,
  StatusNote,
  controlInputClass,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

type Layout = "diagonal" | "tiled";

function hex01(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) return [0.6, 0.6, 0.6];
  const int = parseInt(m[1], 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(20);
  const [size, setSize] = useState(48);
  const [color, setColor] = useState("#FF0000");
  const [layout, setLayout] = useState<Layout>("diagonal");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const apply = async () => {
    if (!file || !text.trim()) return;
    setProcessing(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const [r, g, b] = hex01(color);
      const op = opacity / 100;

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        if (layout === "diagonal") {
          const tw = font.widthOfTextAtSize(text, size);
          page.drawText(text, {
            x: width / 2 - tw / 2,
            y: height / 2,
            size,
            font,
            color: rgb(r, g, b),
            opacity: op,
            rotate: degrees(45),
          });
        } else {
          const step = size * 4;
          for (let y = 0; y < height + step; y += step) {
            for (let x = -step; x < width; x += step) {
              page.drawText(text, { x, y, size, font, color: rgb(r, g, b), opacity: op, rotate: degrees(45) });
            }
          }
        }
      }
      const out = await doc.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      setResult({ blob, name: file.name.replace(/\.pdf$/i, "") + "_watermarked.pdf", size: blob.size });
    } catch {
      setError("Couldn't watermark this file. Make sure it is a valid, unprotected PDF.");
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
          title="Watermark added"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        {!file ? (
          <FileUploader onFileSelect={(f) => setFile(f[0])} accept=".pdf,application/pdf" maxSizeMB={50} title="Select a PDF to watermark" icon={FileUp} />
        ) : (
          <div className="space-y-5">
            <FileChip file={file} onRemove={() => setFile(null)} />
            <Field label="Watermark text">
              <input value={text} onChange={(e) => setText(e.target.value)} className={controlInputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <SelectField<Layout>
                label="Layout"
                value={layout}
                onChange={setLayout}
                options={[
                  { label: "Diagonal (center)", value: "diagonal" },
                  { label: "Tiled (repeat)", value: "tiled" },
                ]}
              />
              <Field label="Color">
                <div className="flex items-center gap-2">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-border/60 bg-transparent p-1" />
                  <input value={color} onChange={(e) => setColor(e.target.value)} className={`${controlInputClass} font-mono uppercase`} />
                </div>
              </Field>
            </div>
            <Slider label="Opacity" value={opacity} onChange={setOpacity} min={5} max={100} format={(v) => `${v}%`} />
            <Slider label="Font size" value={size} onChange={setSize} min={12} max={120} format={(v) => `${v}px`} />
          </div>
        )}
      </Panel>
      {error && <StatusNote variant="error">{error}</StatusNote>}
      {file && (
        <ProcessButton onClick={apply} loading={processing} disabled={!text.trim()}>
          <Stamp className="h-5 w-5" />
          Add watermark
        </ProcessButton>
      )}
    </div>
  );
}
