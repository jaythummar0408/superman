"use client";

import React, { useMemo, useState } from "react";
import { Cake } from "lucide-react";

import {
  Panel,
  Field,
  StatTile,
  ResultCard,
  StatusNote,
  controlInputClass,
  formatNumber,
} from "@/components/tools/utility/utility-tool-ui";

function parseDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Add whole months to a date, clamping the day to the target month's length. */
function addMonthsClamped(date: Date, months: number): Date {
  const total = date.getMonth() + months;
  const y = date.getFullYear() + Math.floor(total / 12);
  const m = ((total % 12) + 12) % 12;
  const dim = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(date.getDate(), dim));
}

/** Calendar difference between two dates (from ≤ to) as whole years/months/days. */
function diffYMD(from: Date, to: Date) {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  let anchor = addMonthsClamped(from, months);
  if (anchor.getTime() > to.getTime()) {
    months -= 1;
    anchor = addMonthsClamped(from, months);
  }
  const d = Math.round((to.getTime() - anchor.getTime()) / 86400000);
  return { y: Math.floor(months / 12), m: ((months % 12) + 12) % 12, d };
}

const DAY = 86400000;
const todayStr = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

/* ------------------------------------------------------------------ */
/* Age Calculator                                                     */
/* ------------------------------------------------------------------ */
export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(todayStr());

  const result = useMemo(() => {
    const from = parseDate(dob);
    const to = parseDate(asOf);
    if (!from || !to || to < from) return null;
    const { y, m, d } = diffYMD(from, to);
    const totalDays = Math.floor((to.getTime() - from.getTime()) / DAY);

    // Next birthday
    let next = new Date(to.getFullYear(), from.getMonth(), from.getDate());
    if (next < to) next = new Date(to.getFullYear() + 1, from.getMonth(), from.getDate());
    const daysToBirthday = Math.ceil((next.getTime() - to.getTime()) / DAY);

    return {
      y,
      m,
      d,
      totalMonths: y * 12 + m,
      totalWeeks: Math.floor(totalDays / 7),
      totalDays,
      totalHours: totalDays * 24,
      daysToBirthday,
    };
  }, [dob, asOf]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Dates">
        <div className="space-y-4">
          <Field label="Date of birth">
            <input type="date" value={dob} max={asOf} onChange={(e) => setDob(e.target.value)} className={controlInputClass} />
          </Field>
          <Field label="Age at date">
            <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className={controlInputClass} />
          </Field>
        </div>
      </Panel>

      <div className="space-y-4">
        {result ? (
          <>
            <ResultCard label="Age" value={`${result.y} yr ${result.m} mo ${result.d} d`} />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Total months" value={formatNumber(result.totalMonths)} />
              <StatTile label="Total weeks" value={formatNumber(result.totalWeeks)} />
              <StatTile label="Total days" value={formatNumber(result.totalDays)} />
              <StatTile label="Total hours" value={formatNumber(result.totalHours)} />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <Cake className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {result.daysToBirthday === 0 ? "🎉 Happy birthday!" : `${result.daysToBirthday} days until the next birthday`}
              </span>
            </div>
          </>
        ) : (
          <StatusNote variant="info">Pick a date of birth to calculate age.</StatusNote>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Date Difference                                                    */
/* ------------------------------------------------------------------ */
export function DateDifference() {
  const [start, setStart] = useState(todayStr());
  const [end, setEnd] = useState("");

  const result = useMemo(() => {
    const a = parseDate(start);
    const b = parseDate(end);
    if (!a || !b) return null;
    const [from, to] = a <= b ? [a, b] : [b, a];
    const { y, m, d } = diffYMD(from, to);
    const totalDays = Math.round((to.getTime() - from.getTime()) / DAY);
    return {
      y,
      m,
      d,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      remWeekDays: totalDays % 7,
      totalMonths: y * 12 + m,
    };
  }, [start, end]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Dates">
        <div className="space-y-4">
          <Field label="Start date">
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={controlInputClass} />
          </Field>
          <Field label="End date">
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={controlInputClass} />
          </Field>
        </div>
      </Panel>

      <div className="space-y-4">
        {result ? (
          <>
            <ResultCard label="Difference" value={`${result.y} yr ${result.m} mo ${result.d} d`} />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Total days" value={formatNumber(result.totalDays)} />
              <StatTile label="Total months" value={formatNumber(result.totalMonths)} />
              <StatTile label="Weeks" value={`${formatNumber(result.totalWeeks)} w ${result.remWeekDays} d`} />
              <StatTile label="Total weeks" value={formatNumber(result.totalWeeks)} />
            </div>
          </>
        ) : (
          <StatusNote variant="info">Pick both dates to see the difference.</StatusNote>
        )}
      </div>
    </div>
  );
}
