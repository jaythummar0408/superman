"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { QrCode, Download, FileCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  RangeField,
  Segmented,
  controlInputClass,
} from "@/components/tools/image/image-tool-ui";
import { downloadBlob } from "@/lib/image-utils";

type Ecc = "L" | "M" | "Q" | "H";

export function QrGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://notchtools.com");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [ecc, setEcc] = useState<Ecc>("M");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!text.trim()) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    QRCode.toCanvas(canvas, text, {
      width: size,
      margin,
      color: { dark, light },
      errorCorrectionLevel: ecc,
    }).catch((err) => {
      console.error(err);
      toast.error("Could not generate the QR code (input too long?).");
    });
  }, [text, size, margin, dark, light, ecc]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qr-code.png");
    }, "image/png");
  };

  const downloadSvg = async () => {
    if (!text.trim()) return;
    try {
      const svg = await QRCode.toString(text, {
        type: "svg",
        margin,
        width: size,
        color: { dark, light },
        errorCorrectionLevel: ecc,
      });
      downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
    } catch (err) {
      console.error(err);
      toast.error("Could not export SVG.");
    }
  };

  return (
    <div className="grid gap-6 rounded-2xl border border-border/40 bg-white p-5 shadow-sm dark:bg-card lg:grid-cols-2 lg:p-6">
      {/* Preview */}
      <div className="flex flex-col">
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border/60 bg-muted/20 p-6">
          {text.trim() ? (
            <canvas ref={canvasRef} className="h-auto max-h-[320px] w-auto max-w-full rounded-md" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
              <QrCode className="h-10 w-10" strokeWidth={1.5} />
              <p className="text-sm">Enter text to generate a QR code</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1 gap-2 shadow-md" disabled={!text.trim()} onClick={downloadPng}>
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
          <Button variant="outline" className="flex-1 gap-2" disabled={!text.trim()} onClick={downloadSvg}>
            <FileCode className="h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <QrCode className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">QR content &amp; style</h3>
        </div>

        <Field label="Text or URL">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="https://example.com or any text"
            className={`${controlInputClass} h-auto resize-y py-2`}
          />
        </Field>

        <RangeField label="Size" value={size} min={128} max={1024} step={16} onChange={setSize} display={`${size}px`} />
        <RangeField label="Margin" value={margin} min={0} max={8} step={1} onChange={setMargin} display={`${margin}`} />

        <div className="flex gap-6">
          <Field label="Foreground">
            <input
              type="color"
              value={dark}
              onChange={(e) => setDark(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded-md border border-border/60 bg-transparent"
            />
          </Field>
          <Field label="Background">
            <input
              type="color"
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded-md border border-border/60 bg-transparent"
            />
          </Field>
        </div>

        <Field label="Error correction" hint="higher = more scannable if damaged">
          <Segmented<Ecc>
            value={ecc}
            onChange={setEcc}
            options={[
              { label: "Low", value: "L" },
              { label: "Medium", value: "M" },
              { label: "Quartile", value: "Q" },
              { label: "High", value: "H" },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}
