"use client";

import React, { useState } from "react";

import {
  GenLayout,
  Slider,
  CodeOutput,
  PreviewSurface,
  StatusNote,
} from "@/components/tools/css/css-tool-ui";

const ROOT = 16; // 1rem = 16px
const round = (n: number) => Math.round(n * 1000) / 1000;

export function ClampCalculator() {
  const [minFont, setMinFont] = useState(16);
  const [maxFont, setMaxFont] = useState(48);
  const [minVw, setMinVw] = useState(320);
  const [maxVw, setMaxVw] = useState(1280);

  const valid = maxVw > minVw;

  // Standard fluid-type formula: a line through (minVw, minFont) → (maxVw, maxFont).
  const slope = valid ? (maxFont - minFont) / (maxVw - minVw) : 0;
  const yIntersect = minFont - minVw * slope; // px value at 0vw
  const preferred = `${round(yIntersect / ROOT)}rem + ${round(slope * 100)}vw`;
  const minRem = round(minFont / ROOT);
  const maxRem = round(maxFont / ROOT);

  const clamp = `clamp(${minRem}rem, ${preferred}, ${maxRem}rem)`;
  const css = `font-size: ${clamp};`;

  return (
    <GenLayout
      controlsTitle="Fluid size"
      codeTitle="Generated clamp()"
      controls={
        <div className="space-y-4">
          <Slider label="Min font size" value={minFont} onChange={setMinFont} min={8} max={80} unit="px" />
          <Slider label="Max font size" value={maxFont} onChange={setMaxFont} min={10} max={160} unit="px" />
          <Slider label="Min viewport" value={minVw} onChange={setMinVw} min={200} max={1000} unit="px" />
          <Slider label="Max viewport" value={maxVw} onChange={setMaxVw} min={600} max={2560} unit="px" />
          {!valid && (
            <StatusNote variant="error">Max viewport must be greater than min viewport.</StatusNote>
          )}
        </div>
      }
      previewTitle="Live preview (resize your window)"
      preview={
        <PreviewSurface className="flex-col gap-3 text-center" minHeight="240px">
          <span
            className="font-bold leading-tight text-foreground"
            style={{ fontSize: valid ? clamp : `${minFont}px` }}
          >
            Fluid heading
          </span>
          <span className="text-xs text-muted-foreground">
            Scales from {minFont}px → {maxFont}px between {minVw}px and {maxVw}px wide
          </span>
        </PreviewSurface>
      }
      code={<CodeOutput code={valid ? css : "/* fix the viewport range */"} />}
    />
  );
}
