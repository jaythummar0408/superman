"use client";

import React, { useState } from "react";
import { load, dump } from "js-yaml";
import { yaml as yamlLang } from "@codemirror/lang-yaml";
import { json as jsonLang } from "@codemirror/lang-json";
import { Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeEditor,
  CopyButton,
  Panel,
  Segmented,
  StatusNote,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

const yamlExt = [yamlLang()];
const jsonExt = [jsonLang()];

const SAMPLE = `name: Notch Tools
version: 2
free: true
tags:
  - dev
  - design
nested: { a: 1, b: [2, 3] }`;

type Mode = "yaml" | "json";

export function YamlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("yaml");

  const run = (text: string, m: Mode) => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const doc = load(text);
      if (m === "json") {
        setOutput(JSON.stringify(doc ?? null, null, 2));
      } else {
        setOutput(dump(doc, { indent: 2, lineWidth: -1, noRefs: true }).trimEnd());
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
      setOutput("");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Input YAML"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(SAMPLE);
                run(SAMPLE, mode);
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
            run(v, mode);
          }}
          extensions={yamlExt}
          placeholder="Paste YAML here…"
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title="Output"
        actions={
          <>
            <Segmented<Mode>
              value={mode}
              onChange={(v) => {
                setMode(v);
                run(input, v);
              }}
              options={[
                { label: "YAML", value: "yaml" },
                { label: "JSON", value: "json" },
              ]}
            />
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() =>
                downloadText(
                  mode === "json" ? "data.json" : "formatted.yaml",
                  output,
                  mode === "json" ? "application/json" : "text/yaml"
                )
              }
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor
          value={output}
          extensions={mode === "json" ? jsonExt : yamlExt}
          readOnly
          placeholder="Formatted output appears here…"
        />
      </Panel>
    </div>
  );
}
