"use client";

import React, { useState } from "react";
import { v1, v4, v5, v7, validate } from "uuid";
import { toast } from "sonner";
import { RefreshCw, Copy, Check, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  Panel,
  Segmented,
  StatusNote,
  controlInputClass,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

type Version = "v4" | "v1" | "v7" | "v5";
type NsChoice = "DNS" | "URL" | "custom";

const NAMESPACES: Record<"DNS" | "URL", string> = {
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
};

const VERSION_HINT: Record<Version, string> = {
  v4: "Random — the most common choice.",
  v1: "Time-based (timestamp + node).",
  v7: "Time-ordered random — sortable by creation time.",
  v5: "Deterministic — derived from a namespace + name (SHA-1).",
};

export function UuidGenerator() {
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [nsChoice, setNsChoice] = useState<NsChoice>("DNS");
  const [customNs, setCustomNs] = useState("");
  const [name, setName] = useState("");
  const [results, setResults] = useState<string[]>(() => [v4()]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const formatOne = (u: string) => {
    let s = hyphens ? u : u.replace(/-/g, "");
    if (uppercase) s = s.toUpperCase();
    return s;
  };

  const generate = () => {
    let list: string[];
    if (version === "v5") {
      const ns = nsChoice === "custom" ? customNs.trim() : NAMESPACES[nsChoice];
      if (!validate(ns)) {
        toast.error("Namespace must be a valid UUID.");
        return;
      }
      list = [v5(name, ns)];
    } else {
      const gen: () => string = version === "v1" ? v1 : version === "v7" ? v7 : v4;
      list = Array.from({ length: count }, () => gen());
    }
    setResults(list.map(formatOne));
  };

  const copyOne = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1200);
    } catch {
      toast.error("Copy failed");
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(results.join("\n"));
      toast.success(`Copied ${results.length} UUID${results.length > 1 ? "s" : ""}`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <Panel title="Options">
        <div className="flex flex-col gap-5">
          <Field label="Version" hint={VERSION_HINT[version]}>
            <Segmented<Version>
              value={version}
              onChange={setVersion}
              options={[
                { label: "v4", value: "v4" },
                { label: "v1", value: "v1" },
                { label: "v7", value: "v7" },
                { label: "v5", value: "v5" },
              ]}
            />
          </Field>

          {version === "v5" ? (
            <>
              <Field label="Namespace">
                <Segmented<NsChoice>
                  value={nsChoice}
                  onChange={setNsChoice}
                  options={[
                    { label: "DNS", value: "DNS" },
                    { label: "URL", value: "URL" },
                    { label: "Custom", value: "custom" },
                  ]}
                />
              </Field>
              {nsChoice === "custom" && (
                <input
                  value={customNs}
                  onChange={(e) => setCustomNs(e.target.value)}
                  placeholder="Namespace UUID"
                  className={controlInputClass}
                />
              )}
              <Field label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. example.com"
                  className={controlInputClass}
                />
              </Field>
            </>
          ) : (
            <Field label="How many" hint={`${count}`}>
              <input
                type="range"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-primary"
              />
            </Field>
          )}

          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Uppercase
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Hyphens
            </label>
          </div>

          <Button className="gap-2" onClick={generate}>
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </Panel>

      <Panel
        title={`Result${results.length > 1 ? `s (${results.length})` : ""}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5" disabled={!results.length} onClick={copyAll}>
              <Copy className="h-3.5 w-3.5" />
              Copy all
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!results.length}
              onClick={() => downloadText("uuids.txt", results.join("\n"))}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        {results.length === 0 ? (
          <StatusNote variant="info">Click generate to create UUIDs.</StatusNote>
        ) : (
          <div className="flex flex-col gap-2">
            {results.map((u, i) => (
              <button
                key={`${u}-${i}`}
                onClick={() => copyOne(u, i)}
                title="Click to copy"
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-left font-mono text-sm text-foreground transition-colors hover:bg-muted/40"
              >
                <span className="truncate">{u}</span>
                {copiedIdx === i ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
