"use client";

import React, { useState } from "react";

import {
  GenLayout,
  Slider,
  SelectField,
  CodeOutput,
  PreviewSurface,
} from "@/components/tools/css/css-tool-ui";

type Dir = "row" | "row-reverse" | "column" | "column-reverse";
type Justify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type Align = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";

export function FlexboxGenerator() {
  const [direction, setDirection] = useState<Dir>("row");
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("stretch");
  const [wrap, setWrap] = useState<Wrap>("nowrap");
  const [gap, setGap] = useState(12);
  const [count, setCount] = useState(4);

  const css = `display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
flex-wrap: ${wrap};
gap: ${gap}px;`;

  return (
    <GenLayout
      controls={
        <div className="space-y-4">
          <SelectField<Dir>
            label="flex-direction"
            value={direction}
            onChange={setDirection}
            options={[
              { label: "row", value: "row" },
              { label: "row-reverse", value: "row-reverse" },
              { label: "column", value: "column" },
              { label: "column-reverse", value: "column-reverse" },
            ]}
          />
          <SelectField<Justify>
            label="justify-content"
            value={justify}
            onChange={setJustify}
            options={[
              { label: "flex-start", value: "flex-start" },
              { label: "center", value: "center" },
              { label: "flex-end", value: "flex-end" },
              { label: "space-between", value: "space-between" },
              { label: "space-around", value: "space-around" },
              { label: "space-evenly", value: "space-evenly" },
            ]}
          />
          <SelectField<Align>
            label="align-items"
            value={align}
            onChange={setAlign}
            options={[
              { label: "stretch", value: "stretch" },
              { label: "flex-start", value: "flex-start" },
              { label: "center", value: "center" },
              { label: "flex-end", value: "flex-end" },
              { label: "baseline", value: "baseline" },
            ]}
          />
          <SelectField<Wrap>
            label="flex-wrap"
            value={wrap}
            onChange={setWrap}
            options={[
              { label: "nowrap", value: "nowrap" },
              { label: "wrap", value: "wrap" },
              { label: "wrap-reverse", value: "wrap-reverse" },
            ]}
          />
          <Slider label="gap" value={gap} onChange={setGap} min={0} max={40} unit="px" />
          <Slider label="Items" value={count} onChange={setCount} min={1} max={8} />
        </div>
      }
      preview={
        <PreviewSurface className="items-stretch p-3" minHeight="260px">
          <div
            className="w-full rounded-lg border border-dashed border-border/70 bg-background/40 p-2"
            style={{
              display: "flex",
              flexDirection: direction,
              justifyContent: justify,
              alignItems: align,
              flexWrap: wrap,
              gap: `${gap}px`,
              minHeight: "232px",
            }}
          >
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                className="flex h-12 min-w-12 items-center justify-center rounded-md bg-primary/80 px-3 text-sm font-semibold text-primary-foreground"
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
