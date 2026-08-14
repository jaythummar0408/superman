"use client";

import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const controlInputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60";

const ACCENTS: Record<string, string> = {
  rose: "from-rose-500 to-pink-500",
  indigo: "from-indigo-500 to-violet-500",
  amber: "from-amber-500 to-orange-500",
  purple: "from-purple-500 to-fuchsia-500",
  blue: "from-blue-500 to-cyan-500",
  emerald: "from-emerald-500 to-teal-500",
  cyan: "from-cyan-500 to-sky-500",
};

type Behavior = "direct" | "recurring" | "newyear";

const pad = (n: number) => String(n).padStart(2, "0");

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function defaultDateTimeLocal(daysAhead: number): string {
  const t = new Date(Date.now() + daysAhead * 86400000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(12)}:${p(0)}`;
}

function defaultDate(): string {
  const t = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

function computeTarget(behavior: Behavior, input: string): number | null {
  if (behavior === "newyear") {
    return new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0).getTime();
  }
  if (behavior === "recurring") {
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    const month = +m[2] - 1;
    const day = +m[3];
    const now = new Date();
    let t = new Date(now.getFullYear(), month, day, 0, 0, 0);
    if (t.getTime() <= now.getTime()) t = new Date(now.getFullYear() + 1, month, day, 0, 0, 0);
    return t.getTime();
  }
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime();
}

function Cell({ value, label, grad }: { value: string; label: string; grad: string }) {
  return (
    <div className={cn("rounded-2xl bg-gradient-to-br p-3 text-center text-white shadow-lg sm:p-6", grad)}>
      <div className="text-3xl font-bold tabular-nums sm:text-5xl">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest opacity-90 sm:text-xs">{label}</div>
    </div>
  );
}

interface Config {
  title: string;
  emoji: string;
  accent: keyof typeof ACCENTS;
  behavior: Behavior;
  nameLabel?: string;
}

function CountdownTool({ title, emoji, accent, behavior, nameLabel }: Config) {
  const grad = ACCENTS[accent];
  const [name, setName] = useState("");
  const [input, setInput] = useState(() =>
    behavior === "recurring" ? defaultDate() : defaultDateTimeLocal(30)
  );
  const now = useNow();

  const target = useMemo(() => computeTarget(behavior, input), [behavior, input]);
  const diff = target != null ? target - now : null;
  const reached = diff != null && diff <= 0;

  let d = 0;
  let h = 0;
  let m = 0;
  let s = 0;
  if (diff != null && diff > 0) {
    d = Math.floor(diff / 86400000);
    h = Math.floor((diff % 86400000) / 3600000);
    m = Math.floor((diff % 3600000) / 60000);
    s = Math.floor((diff % 60000) / 1000);
  }

  const targetLabel =
    target != null
      ? new Date(target).toLocaleString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
          ...(behavior !== "recurring" ? { hour: "2-digit", minute: "2-digit" } : {}),
        })
      : "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl">{emoji}</div>
        <h2 className="mt-2 text-2xl font-bold text-foreground">{name.trim() ? name : title}</h2>
        {targetLabel && <p className="mt-1 text-sm text-muted-foreground">{targetLabel}</p>}
      </div>

      {/* Countdown */}
      {reached ? (
        <div className={cn("rounded-2xl bg-gradient-to-br p-10 text-center text-white shadow-lg", grad)}>
          <div className="text-3xl font-bold">{emoji} The moment is here! {emoji}</div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <Cell value={String(d)} label={d === 1 ? "Day" : "Days"} grad={grad} />
          <Cell value={pad(h)} label="Hours" grad={grad} />
          <Cell value={pad(m)} label="Minutes" grad={grad} />
          <Cell value={pad(s)} label="Seconds" grad={grad} />
        </div>
      )}

      {/* Controls */}
      {behavior !== "newyear" && (
        <div className="rounded-2xl border border-border/40 bg-white p-4 shadow-sm dark:bg-card sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {nameLabel && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{nameLabel}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  className={controlInputClass}
                />
              </div>
            )}
            <div className={nameLabel ? "" : "sm:col-span-2"}>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {behavior === "recurring" ? "Date" : "Target date & time"}
              </label>
              <input
                type={behavior === "recurring" ? "date" : "datetime-local"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={controlInputClass}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Themed wrappers                                                    */
/* ------------------------------------------------------------------ */
export function BirthdayCountdown() {
  return <CountdownTool title="Birthday Countdown" emoji="🎂" accent="rose" behavior="recurring" nameLabel="Whose birthday?" />;
}
export function WeddingCountdown() {
  return <CountdownTool title="Wedding Countdown" emoji="💍" accent="rose" behavior="direct" nameLabel="Couple" />;
}
export function EventCountdown() {
  return <CountdownTool title="Event Countdown" emoji="📅" accent="indigo" behavior="direct" nameLabel="Event name" />;
}
export function ExamCountdown() {
  return <CountdownTool title="Exam Countdown" emoji="🎓" accent="amber" behavior="direct" nameLabel="Exam name" />;
}
export function NewYearCountdown() {
  return <CountdownTool title="New Year Countdown" emoji="🎉" accent="purple" behavior="newyear" />;
}
export function ProductLaunchCountdown() {
  return <CountdownTool title="Product Launch" emoji="🚀" accent="blue" behavior="direct" nameLabel="Product name" />;
}
export function LiveCountdown() {
  return <CountdownTool title="Live Countdown" emoji="⏳" accent="emerald" behavior="direct" nameLabel="Title" />;
}
export function AnniversaryCountdown() {
  return <CountdownTool title="Anniversary Countdown" emoji="💝" accent="rose" behavior="recurring" nameLabel="Anniversary of" />;
}
export function WebinarCountdown() {
  return <CountdownTool title="Webinar Countdown" emoji="🎥" accent="cyan" behavior="direct" nameLabel="Webinar title" />;
}
