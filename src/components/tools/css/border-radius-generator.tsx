"use client";

import React, { useState } from "react";

import {
  GenLayout,
  Slider,
  Toggle,
  CodeOutput,
  PreviewSurface,
} from "@/components/tools/css/css-tool-ui";

export function BorderRadiusGenerator() {
  const [linked, setLinked] = useState(true);
  const [all, setAll] = useState(24);
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);

  const setAllCorners = (v: number) => {
    setAll(v);
    setTl(v);
    setTr(v);
    setBr(v);
    setBl(v);
  };

  const radius = linked
    ? `${all}px`
    : `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = `border-radius: ${radius};`;

  return (
    <GenLayout
      controls={
        <div className="space-y-4">
          <Toggle label="Link all corners" checked={linked} onChange={setLinked} />
          {linked ? (
            <Slider label="Radius" value={all} onChange={setAllCorners} min={0} max={150} unit="px" />
          ) : (
            <div className="space-y-4">
              <Slider label="Top left" value={tl} onChange={setTl} min={0} max={150} unit="px" />
              <Slider label="Top right" value={tr} onChange={setTr} min={0} max={150} unit="px" />
              <Slider label="Bottom right" value={br} onChange={setBr} min={0} max={150} unit="px" />
              <Slider label="Bottom left" value={bl} onChange={setBl} min={0} max={150} unit="px" />
            </div>
          )}
        </div>
      }
      preview={
        <PreviewSurface minHeight="260px">
          <div
            className="h-40 w-40 border-2 border-primary/60 bg-primary/15"
            style={{ borderRadius: radius }}
          />
        </PreviewSurface>
      }
      code={<CodeOutput code={css} />}
    />
  );
}
