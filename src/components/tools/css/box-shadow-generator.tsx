"use client";

import React, { useState } from "react";

import {
  GenLayout,
  Slider,
  ColorInput,
  Toggle,
  CodeOutput,
  PreviewSurface,
  hexToRgba,
} from "@/components/tools/css/css-tool-ui";

export function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState("#0F172A");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);

  const rgba = hexToRgba(color, opacity / 100);
  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
  const css = `box-shadow: ${shadow};`;

  return (
    <GenLayout
      controls={
        <div className="space-y-4">
          <Slider label="Offset X" value={x} onChange={setX} min={-100} max={100} unit="px" />
          <Slider label="Offset Y" value={y} onChange={setY} min={-100} max={100} unit="px" />
          <Slider label="Blur radius" value={blur} onChange={setBlur} min={0} max={100} unit="px" />
          <Slider label="Spread" value={spread} onChange={setSpread} min={-50} max={50} unit="px" />
          <ColorInput label="Shadow color" value={color} onChange={setColor} />
          <Slider label="Opacity" value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
          <Toggle label="Inset shadow" checked={inset} onChange={setInset} />
        </div>
      }
      preview={
        <PreviewSurface className="bg-zinc-100 dark:bg-zinc-800" minHeight="260px">
          <div
            className="h-32 w-32 rounded-2xl bg-white dark:bg-zinc-700"
            style={{ boxShadow: shadow }}
          />
        </PreviewSurface>
      }
      code={<CodeOutput code={css} />}
    />
  );
}
