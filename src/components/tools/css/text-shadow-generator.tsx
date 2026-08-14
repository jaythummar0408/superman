"use client";

import React, { useState } from "react";

import {
  GenLayout,
  Slider,
  ColorInput,
  CodeOutput,
  PreviewSurface,
  hexToRgba,
} from "@/components/tools/css/css-tool-ui";

export function TextShadowGenerator() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState("#6366F1");
  const [opacity, setOpacity] = useState(60);

  const rgba = hexToRgba(color, opacity / 100);
  const shadow = `${x}px ${y}px ${blur}px ${rgba}`;
  const css = `text-shadow: ${shadow};`;

  return (
    <GenLayout
      controls={
        <div className="space-y-4">
          <Slider label="Offset X" value={x} onChange={setX} min={-50} max={50} unit="px" />
          <Slider label="Offset Y" value={y} onChange={setY} min={-50} max={50} unit="px" />
          <Slider label="Blur radius" value={blur} onChange={setBlur} min={0} max={50} unit="px" />
          <ColorInput label="Shadow color" value={color} onChange={setColor} />
          <Slider label="Opacity" value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
        </div>
      }
      preview={
        <PreviewSurface className="bg-zinc-50 dark:bg-zinc-900" minHeight="260px">
          <span
            className="text-5xl font-extrabold tracking-tight text-foreground"
            style={{ textShadow: shadow }}
          >
            Notch
          </span>
        </PreviewSurface>
      }
      code={<CodeOutput code={css} />}
    />
  );
}
