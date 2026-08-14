"use client";

import React, { useMemo, useState } from "react";

import {
  Panel,
  Field,
  NumberField,
  ResultCard,
  StatTile,
  formatMoney,
  controlInputClass,
} from "@/components/tools/utility/utility-tool-ui";

const RATES = [3, 5, 12, 18, 28];
type Mode = "add" | "remove";

export function GstCalculator() {
  const [amount, setAmount] = useState<number | "">(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<Mode>("add");

  const a = typeof amount === "number" ? amount : 0;
  const { net, gst, gross } = useMemo(() => {
    if (mode === "add") {
      const g = (a * rate) / 100;
      return { net: a, gst: g, gross: a + g };
    }
    const n = a / (1 + rate / 100);
    return { net: n, gst: a - n, gross: a };
  }, [a, rate, mode]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="GST details">
        <div className="space-y-5">
          <div className="inline-flex w-full gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {(["add", "remove"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  mode === m ? "bg-white text-foreground shadow-sm dark:bg-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "add" ? "Add GST" : "Remove GST"}
              </button>
            ))}
          </div>
          <NumberField
            label={mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"}
            value={amount}
            onChange={setAmount}
            min={0}
            prefix="₹"
          />
          <Field label="GST rate">
            <div className="flex flex-wrap gap-1.5">
              {RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRate(r)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    rate === r ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}%
                </button>
              ))}
              <input
                type="number"
                value={rate}
                min={0}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                className={`${controlInputClass} w-20`}
              />
            </div>
          </Field>
        </div>
      </Panel>

      <div className="space-y-4">
        <ResultCard label={mode === "add" ? "Total (incl. GST)" : "Net (excl. GST)"} value={formatMoney(mode === "add" ? gross : net, "INR")} />
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Net amount" value={formatMoney(net, "INR", 0)} />
          <StatTile label={`GST (${rate}%)`} value={formatMoney(gst, "INR", 0)} />
          <StatTile label="Gross" value={formatMoney(gross, "INR", 0)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label={`CGST (${rate / 2}%)`} value={formatMoney(gst / 2, "INR", 0)} />
          <StatTile label={`SGST (${rate / 2}%)`} value={formatMoney(gst / 2, "INR", 0)} />
        </div>
      </div>
    </div>
  );
}
