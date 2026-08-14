"use client";

import React, { useState } from "react";

import { Panel, NumberField, ResultCard, formatNumber } from "@/components/tools/utility/utility-tool-ui";

type Mode = "of" | "isWhat" | "change";

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");

  // shared inputs per mode
  const [a, setA] = useState<number | "">(20);
  const [b, setB] = useState<number | "">(150);

  const na = typeof a === "number" ? a : 0;
  const nb = typeof b === "number" ? b : 0;

  let result: string;
  let label: string;
  if (mode === "of") {
    label = `${na}% of ${nb}`;
    result = formatNumber((na / 100) * nb, 4);
  } else if (mode === "isWhat") {
    label = `${na} is what % of ${nb}`;
    result = nb === 0 ? "—" : `${formatNumber((na / nb) * 100, 4)}%`;
  } else {
    label = `Change from ${na} to ${nb}`;
    result = na === 0 ? "—" : `${formatNumber(((nb - na) / Math.abs(na)) * 100, 4)}%`;
  }

  const modes: { value: Mode; label: string }[] = [
    { value: "of", label: "% of value" },
    { value: "isWhat", label: "X is what %" },
    { value: "change", label: "% change" },
  ];

  const labels =
    mode === "of"
      ? ["Percentage", "Of value", "%", ""]
      : mode === "isWhat"
      ? ["Value", "Of value", "", ""]
      : ["From", "To", "", ""];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel title="Percentage calculator">
        <div className="space-y-5">
          <div className="inline-flex w-full flex-wrap gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {modes.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  mode === m.value ? "bg-white text-foreground shadow-sm dark:bg-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberField label={labels[0]} value={a} onChange={setA} suffix={labels[2] || undefined} />
            <NumberField label={labels[1]} value={b} onChange={setB} />
          </div>
        </div>
      </Panel>

      <ResultCard label={label} value={result} />
    </div>
  );
}
