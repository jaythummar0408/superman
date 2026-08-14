"use client";

import React, { useMemo, useState } from "react";

import {
  Panel,
  SelectField,
  Toggle,
  StatTile,
  StatusNote,
  monoTextareaClass,
} from "@/components/tools/text/text-tool-ui";

const STOPWORDS = new Set(
  ("a an the and or but if then else of to in on at by for with from as is are was were be been being this that " +
    "these those it its i you he she we they them his her our your my me do does did will would can could should " +
    "has have had not no so than too very just about over out up down into").split(" ")
);

type Ngram = "1" | "2" | "3";

interface Row {
  phrase: string;
  count: number;
  density: number;
}

function analyze(text: string, n: number, minLen: number, ignoreStop: boolean) {
  const all = (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(Boolean);
  const totalWords = all.length;

  // For unigrams we can filter individual words; for phrases keep sequence intact
  // but skip phrases that are entirely stopwords/short.
  const counts = new Map<string, number>();
  for (let i = 0; i + n <= all.length; i++) {
    const gram = all.slice(i, i + n);
    if (n === 1) {
      const w = gram[0];
      if (w.length < minLen) continue;
      if (ignoreStop && STOPWORDS.has(w)) continue;
    } else if (ignoreStop && gram.every((w) => STOPWORDS.has(w))) {
      continue;
    }
    const key = gram.join(" ");
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rows: Row[] = [...counts.entries()]
    .map(([phrase, count]) => ({ phrase, count, density: totalWords ? (count / totalWords) * 100 : 0 }))
    .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase))
    .slice(0, 30);

  return { rows, totalWords, unique: counts.size };
}

export function KeywordDensity() {
  const [text, setText] = useState("");
  const [ngram, setNgram] = useState<Ngram>("1");
  const [minLen, setMinLen] = useState(true);
  const [ignoreStop, setIgnoreStop] = useState(true);

  const { rows, totalWords, unique } = useMemo(
    () => analyze(text, Number(ngram), minLen ? 3 : 1, ignoreStop),
    [text, ngram, minLen, ignoreStop]
  );

  return (
    <div className="space-y-5">
      <Panel title="Your text">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article or paragraph to analyze keyword frequency…"
          className={`${monoTextareaClass} min-h-[160px]`}
        />
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="w-40">
            <SelectField<Ngram>
              label="Phrase length"
              value={ngram}
              onChange={setNgram}
              options={[
                { label: "1 word", value: "1" },
                { label: "2 words", value: "2" },
                { label: "3 words", value: "3" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2 pb-1">
            <Toggle label="Ignore short words (< 3)" checked={minLen} onChange={setMinLen} />
            <Toggle label="Ignore common words" checked={ignoreStop} onChange={setIgnoreStop} />
          </div>
        </div>
      </Panel>

      {totalWords > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile label="Total words" value={totalWords} />
            <StatTile label="Unique phrases" value={unique} />
            <StatTile label="Showing top" value={rows.length} />
          </div>

          <Panel title="Keyword density">
            {rows.length === 0 ? (
              <StatusNote variant="info">No keywords matched the current filters.</StatusNote>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="w-8 pb-2 pr-3 font-medium">#</th>
                      <th className="pb-2 pr-3 font-medium">Keyword</th>
                      <th className="pb-2 pr-3 text-right font-medium">Count</th>
                      <th className="pb-2 font-medium text-right">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.phrase} className="border-b border-border/30 last:border-0">
                        <td className="py-1.5 pr-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                        <td className="py-1.5 pr-3 font-medium text-foreground">{r.phrase}</td>
                        <td className="py-1.5 pr-3 text-right font-mono tabular-nums text-foreground">{r.count}</td>
                        <td className="py-1.5 text-right font-mono tabular-nums text-muted-foreground">
                          {r.density.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
