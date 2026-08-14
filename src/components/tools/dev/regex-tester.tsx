"use client";

import React, { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CopyButton,
  Field,
  Panel,
  StatusNote,
  controlInputClass,
  monoTextareaClass,
} from "@/components/tools/dev/dev-tool-ui";

const FLAGS: { flag: string; hint: string }[] = [
  { flag: "g", hint: "global — find all matches" },
  { flag: "i", hint: "ignore case" },
  { flag: "m", hint: "multiline — ^ and $ match line breaks" },
  { flag: "s", hint: "dotAll — . matches newlines" },
  { flag: "u", hint: "unicode" },
  { flag: "y", hint: "sticky — match from lastIndex only" },
];

const SAMPLE_PATTERN = "\\b(\\w+)@(\\w+)\\.(\\w+)\\b";
const SAMPLE_TEXT = "Contact us at hello@notch.dev or support@example.com for help.";
const SAMPLE_FLAGS: Record<string, boolean> = { g: true, i: true };

interface MatchInfo {
  full: string;
  index: number;
  groups: string[];
  named: Record<string, string>;
}

interface Segment {
  text: string;
  match: boolean;
}

export function RegexTester() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [flags, setFlags] = useState<Record<string, boolean>>(SAMPLE_FLAGS);
  const [text, setText] = useState(SAMPLE_TEXT);

  const flagString = FLAGS.filter((f) => flags[f.flag])
    .map((f) => f.flag)
    .join("");

  const { error, matches, segments } = useMemo(() => {
    const empty = { error: null as string | null, matches: [] as MatchInfo[], segments: [] as Segment[] };
    if (!pattern) return empty;

    let re: RegExp;
    try {
      re = new RegExp(pattern, flagString);
    } catch (e) {
      return { ...empty, error: e instanceof Error ? e.message : "Invalid regular expression" };
    }

    const found: MatchInfo[] = [];
    const spans: { index: number; length: number }[] = [];

    const push = (m: RegExpExecArray) => {
      found.push({
        full: m[0],
        index: m.index,
        groups: m.slice(1).map((g) => g ?? ""),
        named: m.groups ? { ...m.groups } : {},
      });
      spans.push({ index: m.index, length: m[0].length });
    };

    if (re.global || re.sticky) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        push(m);
        if (m.index === re.lastIndex) re.lastIndex++; // avoid infinite loop on empty match
        if (found.length > 5000) break; // safety valve
      }
    } else {
      const m = re.exec(text);
      if (m) push(m);
    }

    // Build highlight segments from the ordered, non-overlapping match spans.
    const segs: Segment[] = [];
    let last = 0;
    for (const s of spans) {
      if (s.length === 0) continue; // zero-length matches have nothing to highlight
      if (s.index > last) segs.push({ text: text.slice(last, s.index), match: false });
      segs.push({ text: text.slice(s.index, s.index + s.length), match: true });
      last = s.index + s.length;
    }
    if (last < text.length) segs.push({ text: text.slice(last), match: false });

    return { error: null as string | null, matches: found, segments: segs };
  }, [pattern, flagString, text]);

  const toggleFlag = (flag: string) => setFlags((f) => ({ ...f, [flag]: !f[flag] }));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Pattern & test string"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPattern(SAMPLE_PATTERN);
                setFlags(SAMPLE_FLAGS);
                setText(SAMPLE_TEXT);
              }}
            >
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setPattern("");
                setText("");
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Regular expression">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm text-muted-foreground">/</span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="pattern"
                spellCheck={false}
                className={`${controlInputClass} font-mono`}
              />
              <span className="min-w-[1.5rem] font-mono text-sm text-muted-foreground">/{flagString}</span>
            </div>
          </Field>

          <Field label="Flags">
            <div className="flex flex-wrap gap-1.5">
              {FLAGS.map((f) => (
                <button
                  key={f.flag}
                  type="button"
                  onClick={() => toggleFlag(f.flag)}
                  title={f.hint}
                  className={cn(
                    "h-8 w-8 rounded-md border font-mono text-sm transition-colors",
                    flags[f.flag]
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.flag}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Test string">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text to run the expression against…"
              spellCheck={false}
              className={`${monoTextareaClass} min-h-[180px]`}
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Matches"
        actions={
          matches.length > 0 ? (
            <CopyButton value={matches.map((m) => m.full).join("\n")} label="Copy matches" />
          ) : undefined
        }
      >
        {error ? (
          <StatusNote variant="error">{error}</StatusNote>
        ) : !pattern ? (
          <StatusNote variant="info">Enter a pattern to start matching.</StatusNote>
        ) : (
          <div className="space-y-4">
            <StatusNote variant={matches.length > 0 ? "success" : "info"}>
              {matches.length > 0
                ? `${matches.length} match${matches.length > 1 ? "es" : ""} found`
                : "No matches in the test string."}
            </StatusNote>

            <div className="max-h-[200px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border/60 bg-muted/10 p-3 font-mono text-sm">
              {text.length === 0 ? (
                <span className="text-muted-foreground">Test string is empty.</span>
              ) : segments.length === 0 ? (
                <span className="text-muted-foreground">{text}</span>
              ) : (
                segments.map((s, i) =>
                  s.match ? (
                    <mark
                      key={i}
                      className="rounded bg-amber-200/70 text-foreground dark:bg-amber-400/30 dark:text-amber-100"
                    >
                      {s.text}
                    </mark>
                  ) : (
                    <span key={i}>{s.text}</span>
                  )
                )
              )}
            </div>

            {matches.length > 0 && (
              <div className="space-y-2">
                {matches.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="break-all font-mono text-foreground">
                        {m.full || <span className="text-muted-foreground">(empty match)</span>}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">at {m.index}</span>
                    </div>
                    {(m.groups.length > 0 || Object.keys(m.named).length > 0) && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {m.groups.map((g, gi) => (
                          <span
                            key={gi}
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                          >
                            ${gi + 1}: {g || "∅"}
                          </span>
                        ))}
                        {Object.entries(m.named).map(([name, val]) => (
                          <span
                            key={name}
                            className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary"
                          >
                            {name}: {val || "∅"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
