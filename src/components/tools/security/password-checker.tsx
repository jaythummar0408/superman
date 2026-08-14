"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lightbulb } from "lucide-react";

import { Panel, StrengthBar, controlInputClass } from "@/components/tools/security/security-tool-ui";
import { analyzePassword } from "@/components/tools/security/password-utils";

export function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const analysis = analyzePassword(password);

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Panel title="Test a password">
        <div className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a password…"
              autoComplete="off"
              spellCheck={false}
              className={`${controlInputClass} pr-10 font-mono`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              title={show ? "Hide" : "Show"}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password && (
            <>
              <StrengthBar score={analysis.score} />
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Length" value={`${password.length}`} />
                <Stat label="Entropy" value={`~${analysis.entropy} bits`} />
                <Stat label="Crack time" value={analysis.crackTime} />
              </div>
            </>
          )}
        </div>
      </Panel>

      {password && (
        <Panel title="Suggestions">
          <ul className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {s}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Your password never leaves your browser — all analysis happens locally.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-center">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
