"use client";

import React, { useMemo, useState } from "react";

import { Panel, monoTextareaClass } from "@/components/tools/social/social-tool-ui";
import { cn } from "@/lib/utils";

const LIMIT = 280;
const URL_RE = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

/** Approximates Twitter's weighted character count (URLs=23, CJK/emoji=2). */
function weightedLength(text: string): number {
  let weighted = 0;
  const rest = text.replace(URL_RE, () => {
    weighted += 23;
    return "";
  });
  for (const ch of rest) {
    const cp = ch.codePointAt(0)!;
    const wide =
      (cp >= 0x1100 && cp <= 0x115f) ||
      (cp >= 0x2e80 && cp <= 0xa4cf) ||
      (cp >= 0xac00 && cp <= 0xd7a3) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xfe30 && cp <= 0xfe4f) ||
      (cp >= 0xff00 && cp <= 0xff60) ||
      (cp >= 0xffe0 && cp <= 0xffe6) ||
      cp >= 0x1f000;
    weighted += wide ? 2 : 1;
  }
  return weighted;
}

export function TwitterCharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const weighted = weightedLength(text);
    const chars = Array.from(text).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const tweets = Math.max(1, Math.ceil(weighted / LIMIT));
    return { weighted, chars, words, tweets, remaining: LIMIT - weighted };
  }, [text]);

  const pct = Math.min(100, (stats.weighted / LIMIT) * 100);
  const over = stats.remaining < 0;
  const near = stats.remaining >= 0 && stats.remaining <= 20;
  const barColor = over ? "bg-destructive" : near ? "bg-amber-500" : "bg-emerald-500";
  const numColor = over ? "text-destructive" : near ? "text-amber-600 dark:text-amber-400" : "text-foreground";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel title="Compose your tweet">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className={`${monoTextareaClass} min-h-[160px]`}
        />
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {stats.weighted} / {LIMIT} weighted characters
            </span>
            <span className={cn("text-lg font-bold tabular-nums", numColor)}>{stats.remaining}</span>
          </div>
          {over && (
            <p className="text-xs font-medium text-destructive">
              {Math.abs(stats.remaining)} over the limit — this will need {stats.tweets} tweets as a thread.
            </p>
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Weighted" value={stats.weighted} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="Words" value={stats.words} />
        <Stat label="Tweets" value={stats.tweets} />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Links count as 23 characters and most non-Latin characters count as 2, matching Twitter/X.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-center">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
