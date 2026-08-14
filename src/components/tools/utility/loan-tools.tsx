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
  StatusNote,
  CURRENCIES,
  formatMoney,
} from "@/components/tools/utility/utility-tool-ui";

function computeEmi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (months <= 0) return { emi: 0, total: 0, interest: 0 };
  if (r === 0) {
    const emi = principal / months;
    return { emi, total: principal, interest: 0 };
  }
  const pow = Math.pow(1 + r, months);
  const emi = (principal * r * pow) / (pow - 1);
  return { emi, total: emi * months, interest: emi * months - principal };
}

function CurrencyPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <SelectField
      label="Currency"
      value={value}
      onChange={onChange}
      options={CURRENCIES.map((c) => ({ label: c.label, value: c.code }))}
    />
  );
}

/* ------------------------------------------------------------------ */
/* EMI Calculator                                                     */
/* ------------------------------------------------------------------ */
export function EmiCalculator() {
  const [amount, setAmount] = useState<number | "">(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(20);
  const [currency, setCurrency] = useState("INR");

  const p = typeof amount === "number" ? amount : 0;
  const { emi, total, interest } = useMemo(() => computeEmi(p, rate, years * 12), [p, rate, years]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Loan details">
        <div className="space-y-5">
          <NumberField label="Loan amount" value={amount} onChange={setAmount} min={0} prefix={CURRENCIES.find((c) => c.code === currency)?.symbol} />
          <Slider label="Interest rate (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.1} format={(v) => `${v}%`} />
          <Slider label="Tenure" value={years} onChange={setYears} min={1} max={30} format={(v) => `${v} yr`} />
          <CurrencyPicker value={currency} onChange={setCurrency} />
        </div>
      </Panel>

      <div className="space-y-4">
        <ResultCard label="Monthly EMI" value={formatMoney(emi, currency)} sub={`for ${years * 12} months`} />
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Total interest" value={formatMoney(interest, currency, 0)} />
          <StatTile label="Total payable" value={formatMoney(total, currency, 0)} />
        </div>
        <Panel title="Principal vs interest">
          <ProportionBar
            segments={[
              { label: "Principal", value: p, className: "bg-primary" },
              { label: "Interest", value: interest, className: "bg-amber-500" },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loan Calculator (with amortization schedule)                       */
/* ------------------------------------------------------------------ */
export function LoanCalculator() {
  const [amount, setAmount] = useState<number | "">(500000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);
  const [currency, setCurrency] = useState("INR");

  const p = typeof amount === "number" ? amount : 0;
  const months = years * 12;
  const { emi, total, interest } = useMemo(() => computeEmi(p, rate, months), [p, rate, months]);

  const schedule = useMemo(() => {
    const r = rate / 12 / 100;
    let balance = p;
    const rows: { year: number; principal: number; interest: number; balance: number }[] = [];
    let yp = 0;
    let yi = 0;
    let mIn = 0;
    let year = 1;
    for (let m = 1; m <= months; m++) {
      const intPart = balance * r;
      const prinPart = emi - intPart;
      balance -= prinPart;
      yi += intPart;
      yp += prinPart;
      mIn++;
      if (mIn === 12 || m === months) {
        rows.push({ year, principal: yp, interest: yi, balance: Math.max(0, balance) });
        year++;
        yp = 0;
        yi = 0;
        mIn = 0;
      }
    }
    return rows;
  }, [p, rate, months, emi]);

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Loan details">
          <div className="space-y-5">
            <NumberField label="Loan amount" value={amount} onChange={setAmount} min={0} prefix={sym} />
            <Slider label="Interest rate (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.1} format={(v) => `${v}%`} />
            <Slider label="Tenure" value={years} onChange={setYears} min={1} max={30} format={(v) => `${v} yr`} />
            <CurrencyPicker value={currency} onChange={setCurrency} />
          </div>
        </Panel>
        <div className="space-y-4">
          <ResultCard label="Monthly payment" value={formatMoney(emi, currency)} sub={`over ${months} months`} />
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total interest" value={formatMoney(interest, currency, 0)} />
            <StatTile label="Total payable" value={formatMoney(total, currency, 0)} />
          </div>
          <ProportionBar
            segments={[
              { label: "Principal", value: p, className: "bg-primary" },
              { label: "Interest", value: interest, className: "bg-amber-500" },
            ]}
          />
        </div>
      </div>

      <Panel title="Amortization schedule (yearly)">
        {p > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Year</th>
                  <th className="pb-2 pr-4 text-right font-medium">Principal</th>
                  <th className="pb-2 pr-4 text-right font-medium">Interest</th>
                  <th className="pb-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.year} className="border-b border-border/30 last:border-0">
                    <td className="py-1.5 pr-4 font-medium text-foreground">{row.year}</td>
                    <td className="py-1.5 pr-4 text-right font-mono tabular-nums text-foreground">
                      {formatMoney(row.principal, currency, 0)}
                    </td>
                    <td className="py-1.5 pr-4 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">
                      {formatMoney(row.interest, currency, 0)}
                    </td>
                    <td className="py-1.5 text-right font-mono tabular-nums text-muted-foreground">
                      {formatMoney(row.balance, currency, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StatusNote variant="info">Enter a loan amount to see the schedule.</StatusNote>
        )}
      </Panel>
    </div>
  );
}
