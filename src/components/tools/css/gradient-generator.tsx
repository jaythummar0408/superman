"use client";

import React, { useState } from "react";
import { Plus, X, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GenLayout,
  Slider,
  ColorInput,
  Segmented,
  CodeOutput,
  PreviewSurface,
  Field,
} from "@/components/tools/css/css-tool-ui";

type GradType = "linear" | "radial" | "conic";
interface Stop {
  color: string;
  pos: number;
}

const randomHex = () =>
  "#" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");

function buildGradient(type: GradType, angle: number, stops: Stop[]) {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const list = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");
  if (type === "radial") return `radial-gradient(circle, ${list})`;
  if (type === "conic") return `conic-gradient(from ${angle}deg, ${list})`;
  return `linear-gradient(${angle}deg, ${list})`;
}

export function GradientGenerator() {
  const [type, setType] = useState<GradType>("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#6366F1", pos: 0 },
    { color: "#EC4899", pos: 100 },
  ]);

  const gradient = buildGradient(type, angle, stops);
  const css = `background: ${gradient};`;

  const updateStop = (i: number, patch: Partial<Stop>) =>
    setStops((s) => s.map((st, idx) => (idx === i ? { ...st, ...patch } : st)));

  const addStop = () =>
    setStops((s) => [...s, { color: randomHex(), pos: 50 }]);

  const removeStop = (i: number) =>
    setStops((s) => (s.length > 2 ? s.filter((_, idx) => idx !== i) : s));

  const randomize = () =>
    setStops([
      { color: randomHex(), pos: 0 },
      { color: randomHex(), pos: 100 },
    ]);

  return (
    <GenLayout
      controls={
        <div className="space-y-4">
          <Field label="Gradient type">
            <Segmented<GradType>
              value={type}
              onChange={setType}
              options={[
                { label: "Linear", value: "linear" },
                { label: "Radial", value: "radial" },
                { label: "Conic", value: "conic" },
              ]}
            />
          </Field>

          {type !== "radial" && (
            <Slider label="Angle" value={angle} onChange={setAngle} min={0} max={360} unit="°" />
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Color stops</label>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="gap-1" onClick={randomize}>
                  <Shuffle className="h-3.5 w-3.5" />
                  Random
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={addStop} disabled={stops.length >= 6}>
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {stops.map((s, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <ColorInput value={s.color} onChange={(color) => updateStop(i, { color })} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStop(i)}
                      disabled={stops.length <= 2}
                      title="Remove stop"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <Slider
                      label="Position"
                      value={s.pos}
                      onChange={(pos) => updateStop(i, { pos })}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      preview={
        <PreviewSurface className="p-0" minHeight="300px">
          <div className="h-full w-full" style={{ minHeight: "300px", background: gradient }} />
        </PreviewSurface>
      }
      code={<CodeOutput code={css} />}
    />
  );
}
