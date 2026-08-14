"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { json } from "@codemirror/lang-json";
import { Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeEditor,
  CopyButton,
  Panel,
  StatusNote,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

const jsonExt = [json()];

const CSV_SAMPLE = `name,role,active
Ada,Engineer,true
Grace,Scientist,true
Alan,Mathematician,false`;

const JSON_SAMPLE = `[
  { "name": "Ada", "role": "Engineer", "active": true },
  { "name": "Grace", "role": "Scientist", "active": true }
]`;

/* ------------------------------------------------------------------ */
/* CSV → JSON                                                         */
/* ------------------------------------------------------------------ */
export function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [header, setHeader] = useState(true);

  const run = (text: string, useHeader: boolean) => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    const result = Papa.parse(text, {
      header: useHeader,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    if (result.errors.length > 0) {
      const e = result.errors[0];
      setError(`${e.message}${e.row != null ? ` (row ${e.row + 1})` : ""}`);
    } else {
      setError(null);
    }
    setOutput(JSON.stringify(result.data, null, 2));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Input CSV"
        actions={
          <>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-foreground">
              <input
                type="checkbox"
                checked={header}
                onChange={(e) => {
                  setHeader(e.target.checked);
                  run(input, e.target.checked);
                }}
                className="h-3.5 w-3.5 accent-primary"
              />
              First row is header
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(CSV_SAMPLE);
                run(CSV_SAMPLE, header);
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
            run(v, header);
          }}
          placeholder="Paste CSV data…"
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title="JSON output"
        actions={
          <>
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() => downloadText("data.json", output, "application/json")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor value={output} extensions={jsonExt} readOnly placeholder="JSON appears here…" />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* JSON → CSV                                                         */
/* ------------------------------------------------------------------ */
export function JsonToCsv() {
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
      const parsed = JSON.parse(text);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      if (rows.some((r) => typeof r !== "object" || r === null || Array.isArray(r))) {
        throw new Error("Provide a JSON array of flat objects.");
      }
      setOutput(Papa.unparse(rows));
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(JSON_SAMPLE);
                run(JSON_SAMPLE);
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
          placeholder="Paste a JSON array of objects…"
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title="CSV output"
        actions={
          <>
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() => downloadText("data.csv", output, "text/csv")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor value={output} readOnly placeholder="CSV appears here…" />
      </Panel>
    </div>
  );
}
