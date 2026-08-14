"use client";

import React, { useState } from "react";
import { json } from "@codemirror/lang-json";
import { Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeEditor,
  CopyButton,
  Field,
  Panel,
  Segmented,
  StatusNote,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

const SAMPLE = `{"name":"Notch Tools","version":2,"free":true,"tags":["dev","design"],"nested":{"a":1,"b":[2,3]}}`;

const jsonExt = [json()];

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

/* ------------------------------------------------------------------ */
/* JSON Formatter                                                     */
/* ------------------------------------------------------------------ */
export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");

  const run = (text: string, ind: "2" | "4" | "tab") => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      const space = ind === "tab" ? "\t" : Number(ind);
      setOutput(JSON.stringify(parsed, null, space));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Input JSON"
        actions={
          <>
            <Segmented<"2" | "4" | "tab">
              value={indent}
              onChange={(v) => {
                setIndent(v);
                run(input, v);
              }}
              options={[
                { label: "2 spaces", value: "2" },
                { label: "4 spaces", value: "4" },
                { label: "Tab", value: "tab" },
              ]}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(SAMPLE);
                run(SAMPLE, indent);
              }}
            >
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setInput("");
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <CodeEditor
          value={input}
          onChange={(v) => {
            setInput(v);
            run(v, indent);
          }}
          extensions={jsonExt}
          placeholder="Paste JSON here…"
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title="Formatted"
        actions={
          <>
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() => downloadText("formatted.json", output, "application/json")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor value={output} extensions={jsonExt} readOnly placeholder="Formatted JSON appears here…" />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* JSON Validator                                                     */
/* ------------------------------------------------------------------ */
export function JsonValidator() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);

  const validate = (text: string) => {
    if (!text.trim()) {
      setState(null);
      return;
    }
    try {
      JSON.parse(text);
      setState({ ok: true, message: "Valid JSON — syntax is correct." });
    } catch (e) {
      setState({ ok: false, message: e instanceof Error ? e.message : "Invalid JSON" });
    }
  };

  return (
    <div className="space-y-5">
      <Panel
        title="JSON to validate"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(SAMPLE);
                validate(SAMPLE);
              }}
            >
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setInput("");
                setState(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <CodeEditor
          value={input}
          onChange={(v) => {
            setInput(v);
            validate(v);
          }}
          extensions={jsonExt}
          placeholder="Paste JSON to check…"
        />
        {state && (
          <div className="mt-3">
            <StatusNote variant={state.ok ? "success" : "error"}>{state.message}</StatusNote>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* JSON Minifier                                                      */
/* ------------------------------------------------------------------ */
export function JsonMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (text: string) => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(JSON.stringify(JSON.parse(text)));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const saved = input && output ? input.length - output.length : 0;
  const savedPct = input.length > 0 ? Math.max(0, Math.round((saved / input.length) * 100)) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Input JSON"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(SAMPLE);
                run(SAMPLE);
              }}
            >
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setInput("");
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <CodeEditor
          value={input}
          onChange={(v) => {
            setInput(v);
            run(v);
          }}
          extensions={jsonExt}
          placeholder="Paste JSON to minify…"
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title="Minified"
        actions={
          <>
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() => downloadText("minified.json", output, "application/json")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor value={output} extensions={jsonExt} readOnly placeholder="Minified JSON appears here…" />
        {output && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-1 font-medium">{formatBytes(input.length)} → {formatBytes(output.length)}</span>
            {saved > 0 && (
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
                {savedPct}% smaller
              </span>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
