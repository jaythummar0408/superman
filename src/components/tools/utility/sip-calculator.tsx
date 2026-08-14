"use client";

import React, { useMemo, useState } from "react";

import {
  Panel,
  NumberField,
  Slider,
  SelectField,
  ResultCard,
  StatTile,
  ProportionBar,
  CURRENCIES,
  formatMoney,
} from "@/components/tools/utility/utility-tool-ui";

export function SipCalculator() {
  const [monthly, setMonthly] = useState<number | "">(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [currency, setCurrency] = useState("INR");

  const p = typeof monthly === "number" ? monthly : 0;
  const { fv, invested, returns } = useMemo(() => {
    const i = rate / 12 / 100;
    const n = years * 12;
    const futureValue = i === 0 ? p * n : p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = p * n;
    return { fv: futureValue, invested: totalInvested, returns: futureValue - totalInvested };
  }, [p, rate, years]);

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Investment details">
        <div className="space-y-5">
          <NumberField label="Monthly investment" value={monthly} onChange={setMonthly} min={0} prefix={sym} />
          <Slider label="Expected return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} format={(v) => `${v}%`} />
          <Slider label="Time period" value={years} onChange={setYears} min={1} max={40} format={(v) => `${v} yr`} />
          <SelectField label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map((c) => ({ label: c.label, value: c.code }))} />
        </div>
      </Panel>

      <div className="space-y-4">
        <ResultCard label="Total value" value={formatMoney(fv, currency, 0)} sub={`after ${years} years`} />
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Invested" value={formatMoney(invested, currency, 0)} />
          <StatTile label="Est. returns" value={formatMoney(returns, currency, 0)} />
        </div>
        <Panel title="Invested vs returns">
          <ProportionBar
            segments={[
              { label: "Invested", value: invested, className: "bg-primary" },
              { label: "Returns", value: returns, className: "bg-emerald-500" },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
