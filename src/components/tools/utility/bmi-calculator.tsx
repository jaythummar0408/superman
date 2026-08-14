"use client";

import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Panel, NumberField, ResultCard, formatNumber } from "@/components/tools/utility/utility-tool-ui";

type Unit = "metric" | "imperial";

const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "text-blue-500", bar: "bg-blue-500" },
  { max: 25, label: "Normal", color: "text-emerald-500", bar: "bg-emerald-500" },
  { max: 30, label: "Overweight", color: "text-amber-500", bar: "bg-amber-500" },
  { max: Infinity, label: "Obese", color: "text-red-500", bar: "bg-red-500" },
];

function categoryOf(bmi: number) {
  return CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [cm, setCm] = useState<number | "">(170);
  const [kg, setKg] = useState<number | "">(65);
  const [ft, setFt] = useState<number | "">(5);
  const [inch, setInch] = useState<number | "">(7);
  const [lb, setLb] = useState<number | "">(145);

  const { bmi, heightM } = useMemo(() => {
    let hM = 0;
    let wKg = 0;
    if (unit === "metric") {
      hM = (typeof cm === "number" ? cm : 0) / 100;
      wKg = typeof kg === "number" ? kg : 0;
    } else {
      const totalIn = (typeof ft === "number" ? ft : 0) * 12 + (typeof inch === "number" ? inch : 0);
      hM = totalIn * 0.0254;
      wKg = (typeof lb === "number" ? lb : 0) * 0.453592;
    }
    const b = hM > 0 ? wKg / (hM * hM) : 0;
    return { bmi: b, heightM: hM };
  }, [unit, cm, kg, ft, inch, lb]);

  const cat = categoryOf(bmi);
  const markerPct = Math.max(0, Math.min(100, ((bmi - 15) / (40 - 15)) * 100));
  const healthyMin = heightM > 0 ? 18.5 * heightM * heightM : 0;
  const healthyMax = heightM > 0 ? 24.9 * heightM * heightM : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Your measurements">
        <div className="space-y-5">
          <div className="inline-flex w-full gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {(["metric", "imperial"] as Unit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                  unit === u ? "bg-white text-foreground shadow-sm dark:bg-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {unit === "metric" ? (
            <>
              <NumberField label="Height" value={cm} onChange={setCm} min={0} suffix="cm" />
              <NumberField label="Weight" value={kg} onChange={setKg} min={0} suffix="kg" />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <NumberField label="Height" value={ft} onChange={setFt} min={0} suffix="ft" />
                <NumberField label="&nbsp;" value={inch} onChange={setInch} min={0} suffix="in" />
              </div>
              <NumberField label="Weight" value={lb} onChange={setLb} min={0} suffix="lb" />
            </>
          )}
        </div>
      </Panel>

      <div className="space-y-4">
        <ResultCard
          label="Your BMI"
          value={bmi > 0 ? formatNumber(bmi, 1) : "—"}
          sub={bmi > 0 ? <span className={cn("font-semibold", cat.color)}>{cat.label}</span> : undefined}
        />
        <Panel title="BMI scale">
          <div className="space-y-3">
            <div className="relative">
              <div className="flex h-3 overflow-hidden rounded-full">
                <div className="bg-blue-500" style={{ width: "14%" }} />
                <div className="bg-emerald-500" style={{ width: "26%" }} />
                <div className="bg-amber-500" style={{ width: "20%" }} />
                <div className="bg-red-500" style={{ width: "40%" }} />
              </div>
              {bmi > 0 && (
                <div
                  className="absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow ring-2 ring-white dark:ring-card"
                  style={{ left: `${markerPct}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
            {healthyMin > 0 && (
              <p className="text-sm text-muted-foreground">
                Healthy weight for your height:{" "}
                <span className="font-medium text-foreground">
                  {formatNumber(unit === "metric" ? healthyMin : healthyMin / 0.453592, 1)}–
                  {formatNumber(unit === "metric" ? healthyMax : healthyMax / 0.453592, 1)}{" "}
                  {unit === "metric" ? "kg" : "lb"}
                </span>
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
