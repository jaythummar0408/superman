"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GenLayout,
  Slider,
  SelectField,
  CodeOutput,
  PreviewSurface,
} from "@/components/tools/css/css-tool-ui";

type Preset = "fade" | "slide-up" | "zoom" | "spin" | "pulse" | "shake";
type Timing = "ease" | "linear" | "ease-in" | "ease-out" | "ease-in-out";
type Iteration = "1" | "3" | "infinite";
type Direction = "normal" | "alternate";

const KEYFRAMES: Record<Preset, string> = {
  fade: `@keyframes notch-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
  "slide-up": `@keyframes notch-slide-up {
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
  zoom: `@keyframes notch-zoom {
  from { transform: scale(0.4); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
  spin: `@keyframes notch-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
  pulse: `@keyframes notch-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}`,
  shake: `@keyframes notch-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}`,
};

const ALL_KEYFRAMES = Object.values(KEYFRAMES).join("\n\n");

export function CssAnimationGenerator() {
  const [preset, setPreset] = useState<Preset>("slide-up");
  const [duration, setDuration] = useState(1);
  const [timing, setTiming] = useState<Timing>("ease-out");
  const [delay, setDelay] = useState(0);
  const [iteration, setIteration] = useState<Iteration>("1");
  const [direction, setDirection] = useState<Direction>("normal");
  const [runKey, setRunKey] = useState(0);

  const name = `notch-${preset}`;
  const shorthand = `${name} ${duration}s ${timing} ${delay}s ${iteration} ${direction} both`;
  const css = `${KEYFRAMES[preset]}

.element {
  animation: ${shorthand};
}`;

  return (
    <>
      {/* Static, self-authored keyframes — safe to inline. */}
      <style dangerouslySetInnerHTML={{ __html: ALL_KEYFRAMES }} />
      <GenLayout
        controls={
          <div className="space-y-4">
            <SelectField<Preset>
              label="Animation"
              value={preset}
              onChange={setPreset}
              options={[
                { label: "Fade in", value: "fade" },
                { label: "Slide up", value: "slide-up" },
                { label: "Zoom in", value: "zoom" },
                { label: "Spin", value: "spin" },
                { label: "Pulse", value: "pulse" },
                { label: "Shake", value: "shake" },
              ]}
            />
            <Slider label="Duration" value={duration} onChange={setDuration} min={0.1} max={5} step={0.1} unit="s" />
            <SelectField<Timing>
              label="Timing function"
              value={timing}
              onChange={setTiming}
              options={[
                { label: "ease", value: "ease" },
                { label: "linear", value: "linear" },
                { label: "ease-in", value: "ease-in" },
                { label: "ease-out", value: "ease-out" },
                { label: "ease-in-out", value: "ease-in-out" },
              ]}
            />
            <Slider label="Delay" value={delay} onChange={setDelay} min={0} max={3} step={0.1} unit="s" />
            <SelectField<Iteration>
              label="Iterations"
              value={iteration}
              onChange={setIteration}
              options={[
                { label: "1 time", value: "1" },
                { label: "3 times", value: "3" },
                { label: "Infinite", value: "infinite" },
              ]}
            />
            <SelectField<Direction>
              label="Direction"
              value={direction}
              onChange={setDirection}
              options={[
                { label: "normal", value: "normal" },
                { label: "alternate", value: "alternate" },
              ]}
            />
          </div>
        }
        preview={
          <div className="flex h-full flex-col">
            <PreviewSurface minHeight="220px">
              <div
                key={`${preset}-${duration}-${timing}-${delay}-${iteration}-${direction}-${runKey}`}
                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg"
                style={{ animation: shorthand }}
              >
                Notch
              </div>
            </PreviewSurface>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5 self-center" onClick={() => setRunKey((k) => k + 1)}>
              <RotateCcw className="h-3.5 w-3.5" />
              Replay
            </Button>
          </div>
        }
        code={<CodeOutput code={css} />}
      />
    </>
  );
}
