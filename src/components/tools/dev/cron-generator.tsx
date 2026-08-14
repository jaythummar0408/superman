"use client";

import React, { useMemo, useState } from "react";
import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { Clock } from "lucide-react";

import {
  CopyButton,
  Field,
  Panel,
  StatusNote,
  controlInputClass,
} from "@/components/tools/dev/dev-tool-ui";

const PRESETS: { label: string; expr: string }[] = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily at midnight", expr: "0 0 * * *" },
  { label: "Daily at 9 AM", expr: "0 9 * * *" },
  { label: "Weekdays at 9 AM", expr: "0 9 * * 1-5" },
  { label: "Every Sunday", expr: "0 0 * * 0" },
  { label: "1st of month", expr: "0 0 1 * *" },
];

const FIELDS = [
  { name: "Minute", range: "0–59" },
  { name: "Hour", range: "0–23" },
  { name: "Day / mo", range: "1–31" },
  { name: "Month", range: "1–12" },
  { name: "Day / wk", range: "0–6" },
];

function formatDate(d: Date) {
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CronGenerator() {
  const [expr, setExpr] = useState("0 9 * * 1-5");

  const { description, error, nextRuns, parts } = useMemo(() => {
    const value = expr.trim();
    const base = {
      description: "",
      error: null as string | null,
      nextRuns: [] as Date[],
      parts: value ? value.split(/\s+/) : [],
    };
    if (!value) return base;

    let desc: string;
    try {
      desc = cronstrue.toString(value, { throwExceptionOnParseError: true });
    } catch (e) {
      // cronstrue throws a plain string (e.g. "Error: minutes part must be >= 0 …"),
      // not an Error object — normalise both shapes into a readable message.
      const raw = e instanceof Error ? e.message : typeof e === "string" ? e : "";
      return { ...base, error: raw.replace(/^Error:\s*/, "") || "Invalid cron expression" };
    }

    let runs: Date[] = [];
    try {
      const interval = CronExpressionParser.parse(value, { currentDate: new Date() });
      runs = interval.take(5).map((d) => d.toDate());
    } catch {
      // cronstrue parsed it but the scheduler couldn't — still show the description.
      runs = [];
    }

    return { description: desc, error: null as string | null, nextRuns: runs, parts: base.parts };
  }, [expr]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Cron expression" actions={<CopyButton value={expr} />}>
        <div className="space-y-4">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="0 9 * * 1-5"
            spellCheck={false}
            className={`${controlInputClass} font-mono text-base`}
          />

          {parts.length === 5 && !error && (
            <div className="grid grid-cols-5 gap-1.5">
              {FIELDS.map((f, i) => (
                <div
                  key={f.name}
                  className="rounded-md border border-border/50 bg-muted/20 p-2 text-center"
                >
                  <div className="font-mono text-sm text-foreground">{parts[i]}</div>
                  <div className="mt-1 text-[10px] leading-tight text-muted-foreground">{f.name}</div>
                  <div className="text-[10px] text-muted-foreground/70">{f.range}</div>
                </div>
              ))}
            </div>
          )}

          <Field label="Presets">
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.expr}
                  type="button"
                  onClick={() => setExpr(p.expr)}
                  className="rounded-md border border-border/60 bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Panel>

      <Panel title="Schedule">
        {error ? (
          <StatusNote variant="error">{error}</StatusNote>
        ) : !description ? (
          <StatusNote variant="info">Enter a cron expression to see its schedule.</StatusNote>
        ) : (
          <div className="space-y-4">
            <StatusNote variant="success">{description}</StatusNote>
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Next runs <span className="text-xs font-normal text-muted-foreground">(local time)</span>
              </div>
              {nextRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming runs.</p>
              ) : (
                <ul className="space-y-1.5">
                  {nextRuns.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm text-foreground"
                    >
                      <span className="w-4 text-xs text-muted-foreground">{i + 1}</span>
                      <span className="font-mono">{formatDate(d)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
