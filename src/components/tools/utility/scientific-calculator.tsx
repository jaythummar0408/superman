"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Panel } from "@/components/tools/utility/utility-tool-ui";
import { evaluate } from "@/components/tools/utility/scientific-eval";

type Kind = "num" | "op" | "fn" | "eq" | "clear";
interface Key {
  label: string;
  insert?: string;
  kind: Kind;
  action?: "eval" | "clear" | "back";
}

const KEYS: Key[] = [
  { label: "sin", insert: "sin(", kind: "fn" },
  { label: "cos", insert: "cos(", kind: "fn" },
  { label: "tan", insert: "tan(", kind: "fn" },
  { label: "(", insert: "(", kind: "fn" },
  { label: ")", insert: ")", kind: "fn" },

  { label: "ln", insert: "ln(", kind: "fn" },
  { label: "log", insert: "log(", kind: "fn" },
  { label: "√", insert: "√(", kind: "fn" },
  { label: "xʸ", insert: "^", kind: "op" },
  { label: "n!", insert: "!", kind: "op" },

  { label: "7", insert: "7", kind: "num" },
  { label: "8", insert: "8", kind: "num" },
  { label: "9", insert: "9", kind: "num" },
  { label: "÷", insert: "÷", kind: "op" },
  { label: "C", kind: "clear", action: "clear" },

  { label: "4", insert: "4", kind: "num" },
  { label: "5", insert: "5", kind: "num" },
  { label: "6", insert: "6", kind: "num" },
  { label: "×", insert: "×", kind: "op" },
  { label: "⌫", kind: "clear", action: "back" },

  { label: "1", insert: "1", kind: "num" },
  { label: "2", insert: "2", kind: "num" },
  { label: "3", insert: "3", kind: "num" },
  { label: "−", insert: "−", kind: "op" },
  { label: "π", insert: "π", kind: "fn" },

  { label: "0", insert: "0", kind: "num" },
  { label: ".", insert: ".", kind: "num" },
  { label: "e", insert: "e", kind: "fn" },
  { label: "+", insert: "+", kind: "op" },
  { label: "=", kind: "eq", action: "eval" },
];

function formatResult(n: number): string {
  if (!isFinite(n)) return "Error";
  return String(parseFloat(n.toPrecision(12)));
}

export function ScientificCalculator() {
  const [expr, setExpr] = useState("");
  const [deg, setDeg] = useState(true);

  let preview = "";
  try {
    if (expr.trim()) {
      const r = evaluate(expr, deg);
      if (isFinite(r)) preview = formatResult(r);
    }
  } catch {
    preview = "";
  }

  const doEval = () => {
    try {
      const r = evaluate(expr, deg);
      setExpr(isFinite(r) ? formatResult(r) : "");
    } catch {
      /* keep expression, ignore */
    }
  };

  const press = (k: Key) => {
    if (k.action === "clear") return setExpr("");
    if (k.action === "back") return setExpr((e) => e.slice(0, -1));
    if (k.action === "eval") return doEval();
    if (k.insert) setExpr((e) => e + k.insert);
  };

  const kindClass: Record<Kind, string> = {
    num: "bg-muted/40 text-foreground hover:bg-muted",
    op: "bg-muted/60 text-primary hover:bg-muted",
    fn: "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground text-[13px]",
    clear: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    eq: "bg-primary text-primary-foreground hover:bg-primary/90",
  };

  return (
    <div className="mx-auto max-w-md">
      <Panel>
        {/* Display */}
        <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 p-4">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doEval();
              }
            }}
            placeholder="0"
            spellCheck={false}
            className="w-full bg-transparent text-right font-mono text-2xl text-foreground outline-none"
          />
          <div className="mt-1 h-5 text-right font-mono text-sm text-muted-foreground">
            {preview && preview !== expr ? `= ${preview}` : ""}
          </div>
        </div>

        {/* Deg / Rad */}
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {(["deg", "rad"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDeg(m === "deg")}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium uppercase transition-all",
                  (deg ? "deg" : "rad") === m ? "bg-white text-foreground shadow-sm dark:bg-card" : "text-muted-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-5 gap-2">
          {KEYS.map((k, i) => (
            <button
              key={i}
              type="button"
              onClick={() => press(k)}
              className={cn(
                "flex h-12 items-center justify-center rounded-lg text-base font-medium transition-colors",
                kindClass[k.kind]
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
