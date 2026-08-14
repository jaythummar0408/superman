"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CopyButton,
  Panel,
  StatusNote,
  monoTextareaClass,
} from "@/components/tools/dev/dev-tool-ui";

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function base64ToUtf8(b64: string): string {
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* ------------------------------------------------------------------ */
/* Base64 Encode                                                      */
/* ------------------------------------------------------------------ */
export function Base64Encode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  const run = (text: string, safe: boolean) => {
    if (!text) {
      setOutput("");
      return;
    }
    const encoded = utf8ToBase64(text);
    setOutput(safe ? toUrlSafe(encoded) : encoded);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Text"
        actions={
          <>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-foreground">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => {
                  setUrlSafe(e.target.checked);
                  run(input, e.target.checked);
                }}
                className="h-3.5 w-3.5 accent-primary"
              />
              URL-safe
            </label>
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
            run(e.target.value, urlSafe);
          }}
          placeholder="Type or paste text to encode…"
          className={`${monoTextareaClass} min-h-[220px]`}
        />
      </Panel>

      <Panel title="Base64" actions={<CopyButton value={output} />}>
        <textarea
          value={output}
          readOnly
          placeholder="Base64 output appears here…"
          className={`${monoTextareaClass} min-h-[220px]`}
        />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Base64 Decode                                                      */
/* ------------------------------------------------------------------ */
export function Base64Decode() {
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
      setOutput(base64ToUtf8(text));
      setError(null);
    } catch {
      setError("Invalid Base64 input.");
      setOutput("");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Base64"
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
          placeholder="Paste Base64 (standard or URL-safe)…"
          className={`${monoTextareaClass} min-h-[220px]`}
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel title="Decoded text" actions={<CopyButton value={output} />}>
        <textarea
          value={output}
          readOnly
          placeholder="Decoded text appears here…"
          className={`${monoTextareaClass} min-h-[220px]`}
        />
      </Panel>
    </div>
  );
}
