"use client";

import React, { useState } from "react";
import { validate, version as uuidVersion } from "uuid";

import {
  Field,
  Panel,
  StatusNote,
  controlInputClass,
} from "@/components/tools/dev/dev-tool-ui";

interface Result {
  ok: boolean;
  message: string;
}

export function UuidValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const check = (text: string) => {
    const value = text.trim();
    if (!value) {
      setResult(null);
      return;
    }
    if (validate(value)) {
      let v: number | string = "unknown";
      try {
        v = uuidVersion(value);
      } catch {
        v = "unknown";
      }
      setResult({ ok: true, message: `Valid UUID — version ${v}.` });
    } else {
      setResult({ ok: false, message: "Not a valid UUID." });
    }
  };

  return (
    <Panel title="Validate a UUID">
      <div className="space-y-4">
        <Field label="UUID">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              check(e.target.value);
            }}
            placeholder="123e4567-e89b-12d3-a456-426614174000"
            className={`${controlInputClass} font-mono`}
          />
        </Field>
        {result && (
          <StatusNote variant={result.ok ? "success" : "error"}>{result.message}</StatusNote>
        )}
      </div>
    </Panel>
  );
}
