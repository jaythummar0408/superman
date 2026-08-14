"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Field,
  CopyRow,
  StatusNote,
  controlInputClass,
  pickRandom,
} from "@/components/tools/social/social-tool-ui";

const TEMPLATES = [
  "How to {kw} (Step-by-Step Guide)",
  "{n} {kw} Tips You NEED to Know",
  "The Ultimate Guide to {kw} in {year}",
  "Why Your {kw} Isn't Working (And How to Fix It)",
  "{kw}: Everything You Need to Know",
  "I Tried {kw} for 30 Days — Here's What Happened",
  "STOP Making These {kw} Mistakes!",
  "{kw} for Beginners — Start Here",
  "The Truth About {kw} Nobody Tells You",
  "{n} Secrets to Master {kw}",
  "{kw} Explained in {n} Minutes",
  "This {kw} Trick Changed Everything",
  "{n} {kw} Ideas That Actually Work",
  "The Fastest Way to Learn {kw}",
  "{kw} — Beginner to Pro in {year}",
  "Watch This BEFORE You Try {kw}",
  "{n} Things I Wish I Knew About {kw}",
  "Is {kw} Worth It? (Honest Review)",
];

const NUMBERS = [3, 5, 7, 10, 12, 15, 21];

function titleCase(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fill(tpl: string, kw: string) {
  const year = new Date().getFullYear();
  return tpl
    .replace(/\{kw\}/g, kw)
    .replace(/\{n\}/g, String(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]))
    .replace(/\{year\}/g, String(year));
}

export function YoutubeTitleGenerator() {
  const [keyword, setKeyword] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  const generate = () => {
    const kw = titleCase(keyword);
    if (!kw) {
      setTitles([]);
      return;
    }
    const chosen = pickRandom(TEMPLATES, 10).map((t) => fill(t, kw));
    setTitles([...new Set(chosen)]);
  };

  return (
    <div className="space-y-5">
      <Panel title="YouTube title generator">
        <div className="space-y-4">
          <Field label="Video topic or keyword">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. meal prep, react hooks, home workout"
              className={controlInputClass}
            />
          </Field>
          <Button className="w-full gap-2" onClick={generate} disabled={!keyword.trim()}>
            <Sparkles className="h-4 w-4" />
            Generate titles
          </Button>
        </div>
      </Panel>

      {titles.length > 0 && (
        <Panel
          title={`${titles.length} title ideas`}
          actions={
            <Button variant="outline" size="sm" className="gap-1.5" onClick={generate}>
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          }
        >
          <div className="space-y-2">
            {titles.map((t, i) => (
              <div key={i} className="space-y-1">
                <CopyRow text={t} />
                {t.length > 70 && (
                  <p className="pl-1 text-xs text-amber-600 dark:text-amber-400">
                    {t.length} chars — may be truncated in search results (aim for ≤70).
                  </p>
                )}
              </div>
            ))}
          </div>
        </Panel>
      )}

      <StatusNote variant="info">
        Titles are built from proven formulas — tweak them to match your video before publishing.
      </StatusNote>
    </div>
  );
}
