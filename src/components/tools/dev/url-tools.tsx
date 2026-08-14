"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CopyButton,
  Panel,
  Segmented,
  StatusNote,
  monoTextareaClass,
} from "@/components/tools/dev/dev-tool-ui";

type Mode = "component" | "full";

/* ------------------------------------------------------------------ */
/* URL Encoder                                                        */
/* ------------------------------------------------------------------ */
export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("component");

  const run = (text: string, m: Mode) => {
    if (!text) {
      setOutput("");
      return;
    }
    setOutput(m === "full" ? encodeURI(text) : encodeURIComponent(text));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Text"
        actions={
          <>
            <Segmented<Mode>
              value={mode}
              onChange={(v) => {
                setMode(v);
                run(input, v);
              }}
              options={[
                { label: "Component", value: "component" },
                { label: "Full URL", value: "full" },
              ]}
            />
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setInput("");
                setOutput("");
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            run(e.target.value, mode);
          }}
          placeholder="Type or paste text / a URL to encode…"
          className={`${monoTextareaClass} min-h-[200px]`}
        />
      </Panel>

      <Panel title="Encoded" actions={<CopyButton value={output} />}>
        <textarea
          value={output}
          readOnly
          placeholder="Percent-encoded output appears here…"
          className={`${monoTextareaClass} min-h-[200px]`}
        />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* URL Decoder                                                        */
/* ------------------------------------------------------------------ */
export function UrlDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (text: string) => {
    if (!text) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(decodeURIComponent(text.replace(/\+/g, " ")));
      setError(null);
    } catch {
      setError("Malformed percent-encoding — check for stray % characters.");
      setOutput("");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Encoded URL"
        actions={
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
        }
      >
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            run(e.target.value);
          }}
          placeholder="Paste a percent-encoded string…"
          className={`${monoTextareaClass} min-h-[200px]`}
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel title="Decoded" actions={<CopyButton value={output} />}>
        <textarea
          value={output}
          readOnly
          placeholder="Decoded text appears here…"
          className={`${monoTextareaClass} min-h-[200px]`}
        />
      </Panel>
    </div>
  );
}
