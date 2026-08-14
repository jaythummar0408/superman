"use client";

import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Panel, StatusNote, monoTextareaClass } from "@/components/tools/text/text-tool-ui";

type DiffType = "common" | "add" | "remove";
interface DiffOp {
  type: DiffType;
  text: string;
}

/** Longest-common-subsequence line diff. */
function diffLines(a: string[], b: string[]): DiffOp[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "common", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: a[i] });
      i++;
    } else {
      ops.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: "remove", text: a[i++] });
  while (j < m) ops.push({ type: "add", text: b[j++] });
  return ops;
}

const ROW: Record<DiffType, { cls: string; sign: string }> = {
  common: { cls: "text-muted-foreground", sign: " " },
  add: { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", sign: "+" },
  remove: { cls: "bg-destructive/10 text-destructive", sign: "-" },
};

export function TextDiff() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const { ops, added, removed } = useMemo(() => {
    if (!a && !b) return { ops: [] as DiffOp[], added: 0, removed: 0 };
    const result = diffLines(a.split("\n"), b.split("\n"));
    return {
      ops: result,
      added: result.filter((o) => o.type === "add").length,
      removed: result.filter((o) => o.type === "remove").length,
    };
  }, [a, b]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Original">
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Paste the original text…"
            className={`${monoTextareaClass} min-h-[180px]`}
          />
        </Panel>
        <Panel title="Changed">
          <textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Paste the changed text…"
            className={`${monoTextareaClass} min-h-[180px]`}
          />
        </Panel>
      </div>

      {ops.length > 0 && (
        <Panel
          title="Differences"
          actions={
            <div className="flex gap-2 text-xs">
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
                +{added} added
              </span>
              <span className="rounded-md bg-destructive/10 px-2 py-1 font-semibold text-destructive">
                −{removed} removed
              </span>
            </div>
          }
        >
          {added === 0 && removed === 0 ? (
            <StatusNote variant="success">The two texts are identical.</StatusNote>
          ) : (
            <div className="max-h-[400px] overflow-auto rounded-lg border border-border/50 bg-muted/5 font-mono text-sm">
              {ops.map((op, i) => {
                const r = ROW[op.type];
                return (
                  <div key={i} className={cn("flex gap-2 px-3 py-0.5", r.cls)}>
                    <span className="select-none opacity-60">{r.sign}</span>
                    <span className="whitespace-pre-wrap break-words">{op.text || " "}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
