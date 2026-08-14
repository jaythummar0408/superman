"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, RefreshCw, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Field,
  NumberField,
  ResultCard,
  StatusNote,
  controlInputClass,
  formatNumber,
} from "@/components/tools/utility/utility-tool-ui";

export function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState<number | "">(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      if (data.result === "success" && data.rates) {
        setRates(data.rates);
        setUpdated(data.time_last_update_utc || "");
      } else {
        setError("Couldn't load exchange rates. Please try again.");
      }
    } catch {
      setError("Network error — couldn't reach the rates service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const codes = useMemo(() => (rates ? Object.keys(rates).sort() : []), [rates]);

  const amt = typeof amount === "number" ? amount : 0;
  const result = rates && rates[from] && rates[to] ? amt * (rates[to] / rates[from]) : null;
  const unitRate = rates && rates[from] && rates[to] ? rates[to] / rates[from] : null;

  const select = (value: string, onChange: (v: string) => void) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${controlInputClass} cursor-pointer`}>
      {codes.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel
        title="Currency converter"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </Button>
        }
      >
        {error ? (
          <StatusNote variant="error">{error}</StatusNote>
        ) : loading && !rates ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading live rates…
          </div>
        ) : (
          <div className="space-y-5">
            <NumberField label="Amount" value={amount} onChange={setAmount} min={0} />
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
              <Field label="From">{select(from, setFrom)}</Field>
              <button
                type="button"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                title="Swap"
                className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
              <Field label="To">{select(to, setTo)}</Field>
            </div>
          </div>
        )}
      </Panel>

      {result !== null && (
        <div className="space-y-2">
          <ResultCard label={`${formatNumber(amt, 2)} ${from} =`} value={`${formatNumber(result, 2)} ${to}`} />
          <p className="text-center text-xs text-muted-foreground">
            1 {from} = {formatNumber(unitRate ?? 0, 4)} {to}
            {updated ? ` · Updated ${updated}` : ""} · Rates by open.er-api.com
          </p>
        </div>
      )}
    </div>
  );
}
