"use client";

import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Panel, StatTile, monoTextareaClass } from "@/components/tools/text/text-tool-ui";

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
}

function computeStats(text: string): Stats {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return {
    words,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    sentences: (text.match(/[^.!?]+[.!?]+/g) || []).length,
    paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
    lines: text ? text.split(/\n/).length : 0,
    readingTime: Math.max(1, Math.ceil(words / 200)),
  };
}

function TextArea({ text, setText }: { text: string; setText: (v: string) => void }) {
  return (
    <Panel title="Your text">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here…"
        className={`${monoTextareaClass} min-h-[180px]`}
      />
    </Panel>
  );
}

export function WordCounter() {
  const [text, setText] = useState("");
  const s = useMemo(() => computeStats(text), [text]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <TextArea text={text} setText={setText} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Words" value={s.words} />
        <StatTile label="Characters" value={s.characters} />
        <StatTile label="No spaces" value={s.charactersNoSpaces} />
        <StatTile label="Sentences" value={s.sentences} />
        <StatTile label="Paragraphs" value={s.paragraphs} />
        <StatTile label="Reading time" value={`${s.readingTime} min`} />
      </div>
    </div>
  );
}

const LIMITS: { label: string; max: number }[] = [
  { label: "Tweet / X", max: 280 },
  { label: "Meta title", max: 60 },
  { label: "Meta description", max: 160 },
  { label: "Instagram caption", max: 2200 },
];

export function CharacterCounter() {
  const [text, setText] = useState("");
  const s = useMemo(() => computeStats(text), [text]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <TextArea text={text} setText={setText} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Characters" value={s.characters} />
        <StatTile label="No spaces" value={s.charactersNoSpaces} />
        <StatTile label="Words" value={s.words} />
        <StatTile label="Lines" value={s.lines} />
      </div>
      <Panel title="Platform limits">
        <div className="space-y-2">
          {LIMITS.map((l) => {
            const remaining = l.max - s.characters;
            const over = remaining < 0;
            return (
              <div key={l.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{l.label}</span>
                <div className="flex items-center gap-3">
                  <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:block">
                    <div
                      className={cn("h-full rounded-full", over ? "bg-destructive" : "bg-emerald-500")}
                      style={{ width: `${Math.min(100, (s.characters / l.max) * 100)}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "w-16 text-right font-mono text-xs",
                      over ? "font-semibold text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {remaining}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
