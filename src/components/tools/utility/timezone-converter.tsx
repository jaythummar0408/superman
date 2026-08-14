"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Panel, Field, ResultCard, controlInputClass } from "@/components/tools/utility/utility-tool-ui";

const FALLBACK_ZONES = [
  "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago", "Europe/London",
  "Europe/Paris", "Europe/Berlin", "Asia/Kolkata", "Asia/Dubai", "Asia/Tokyo",
  "Asia/Shanghai", "Asia/Singapore", "Australia/Sydney",
];

function zoneList(): string[] {
  try {
    const sv = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
    if (typeof sv === "function") return sv("timeZone");
  } catch {
    /* fall through */
  }
  return FALLBACK_ZONES;
}

/** Offset (minutes) of a timezone at a given instant: tz-local minus UTC. */
function tzOffset(tz: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) map[p.type] = p.value;
  const asUTC = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour === 24 ? 0 : +map.hour, +map.minute, +map.second);
  return (asUTC - date.getTime()) / 60000;
}

/** Interpret y/mo/d/h/mi as wall-clock time in `tz`, return the UTC instant. */
function zonedTimeToUtc(y: number, mo: number, d: number, h: number, mi: number, tz: string): Date {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const offset = tzOffset(tz, new Date(guess));
  return new Date(guess - offset * 60000);
}

function localNowInput(): string {
  const t = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(t.getHours())}:${p(t.getMinutes())}`;
}

export function TimezoneConverter() {
  const zones = useMemo(zoneList, []);
  const localTz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  }, []);

  const [when, setWhen] = useState(localNowInput());
  const [from, setFrom] = useState(zones.includes(localTz) ? localTz : "UTC");
  const [to, setTo] = useState(zones.includes("Asia/Kolkata") ? "Asia/Kolkata" : "UTC");

  const converted = useMemo(() => {
    const m = when.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return null;
    const [, y, mo, d, h, mi] = m.map(Number);
    const utc = zonedTimeToUtc(y, mo, d, h, mi, from);
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat(undefined, { timeZone: tz, dateStyle: "full", timeStyle: "short" }).format(utc);
    const abbr = (tz: string) => {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(utc);
      return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    };
    const diffH = (tzOffset(to, utc) - tzOffset(from, utc)) / 60;
    return { source: fmt(from), target: fmt(to), targetAbbr: abbr(to), sourceAbbr: abbr(from), diffH };
  }, [when, from, to]);

  const zoneSelect = (value: string, onChange: (v: string) => void) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${controlInputClass} cursor-pointer`}>
      {zones.map((z) => (
        <option key={z} value={z}>
          {z.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel title="Timezone converter">
        <div className="space-y-4">
          <Field label="Date & time">
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={controlInputClass} />
          </Field>
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <Field label="From timezone">{zoneSelect(from, setFrom)}</Field>
            <button
              type="button"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              title="Swap"
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <Field label="To timezone">{zoneSelect(to, setTo)}</Field>
          </div>
        </div>
      </Panel>

      {converted && (
        <div className="space-y-4">
          <ResultCard label={`${to.replace(/_/g, " ")} · ${converted.targetAbbr}`} value={converted.target} />
          <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{from.replace(/_/g, " ")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{to.replace(/_/g, " ")}</span>
            </div>
            <div className="mt-1">
              {converted.source} · Difference:{" "}
              <span className="font-medium text-foreground">
                {converted.diffH >= 0 ? "+" : ""}
                {converted.diffH} h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
