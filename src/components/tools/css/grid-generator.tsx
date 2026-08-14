"use client";

import React, { useState } from "react";

import {
  GenLayout,
  Slider,
  CodeOutput,
  PreviewSurface,
} from "@/components/tools/css/css-tool-ui";

export function GridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rowGap, setRowGap] = useState(12);
  const [colGap, setColGap] = useState(12);
  const [items, setItems] = useState(6);

  const gap = rowGap === colGap ? `${rowGap}px` : `${rowGap}px ${colGap}px`;
  const css = `display: grid;
grid-template-columns: repeat(${columns}, 1fr);
gap: ${gap};`;

  return (
    <GenLayout
      controls={
        <div className="space-y-4">
          <Slider label="Columns" value={columns} onChange={setColumns} min={1} max={6} />
          <Slider label="Row gap" value={rowGap} onChange={setRowGap} min={0} max={40} unit="px" />
          <Slider label="Column gap" value={colGap} onChange={setColGap} min={0} max={40} unit="px" />
          <Slider label="Items" value={items} onChange={setItems} min={1} max={12} />
        </div>
      }
      preview={
        <PreviewSurface className="items-stretch p-3" minHeight="260px">
          <div
            className="w-full rounded-lg border border-dashed border-border/70 bg-background/40 p-2"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap,
            }}
          >
            {Array.from({ length: items }, (_, i) => (
              <div
                key={i}
                className="flex h-16 items-center justify-center rounded-md bg-primary/80 text-sm font-semibold text-primary-foreground"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </PreviewSurface>
      }
      code={<CodeOutput code={css} />}
    />
  );
}
