"use client";

import React, { useEffect, useState } from "react";
import { md5 } from "js-md5";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Field,
  Toggle,
  ResultField,
  StatusNote,
  controlInputClass,
  monoTextareaClass,
} from "@/components/tools/security/security-tool-ui";

type Algo = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
const ALL_ALGOS: Algo[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];
const SAMPLE = "The quick brown fox jumps over the lazy dog";

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function computeHash(algo: Algo, text: string): Promise<string> {
  if (algo === "MD5") return md5(text);
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return toHex(buf);
}

/* ------------------------------------------------------------------ */
/* Single-algorithm generator (SHA-256, MD5)                          */
/* ------------------------------------------------------------------ */
function SingleHash({ algo }: { algo: Algo }) {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setHash("");
      return;
    }
    computeHash(algo, input).then((h) => {
      if (!cancelled) setHash(h);
    });
    return () => {
      cancelled = true;
    };
  }, [algo, input]);

  return (
    <div className="space-y-5">
      <Panel
        title="Text to hash"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>
              Sample
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setInput("")}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash…"
          className={`${monoTextareaClass} min-h-[140px]`}
        />
      </Panel>
      <Panel title={`${algo} hash`}>
        <ResultField label={algo} value={hash} />
      </Panel>
    </div>
  );
}

export function Sha256Generator() {
  return <SingleHash algo="SHA-256" />;
}

export function Md5Generator() {
  return <SingleHash algo="MD5" />;
}

/* ------------------------------------------------------------------ */
/* Multi-algorithm hash generator                                     */
/* ------------------------------------------------------------------ */
export function HashGenerator() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Record<Algo, boolean>>({
    MD5: true,
    "SHA-1": true,
    "SHA-256": true,
    "SHA-512": true,
  });
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setHashes({});
      return;
    }
    const active = ALL_ALGOS.filter((a) => selected[a]);
    Promise.all(active.map((a) => computeHash(a, input).then((h) => [a, h] as const))).then((pairs) => {
      if (!cancelled) setHashes(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [input, selected]);

  return (
    <div className="space-y-5">
      <Panel
        title="Text to hash"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>
              Sample
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setInput("")}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash…"
          className={`${monoTextareaClass} min-h-[120px]`}
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {ALL_ALGOS.map((a) => (
            <Toggle
              key={a}
              label={a}
              checked={selected[a]}
              onChange={(v) => setSelected((s) => ({ ...s, [a]: v }))}
            />
          ))}
        </div>
      </Panel>

      <Panel title="Hashes">
        {Object.keys(hashes).length === 0 ? (
          <StatusNote variant="info">Enter text and pick one or more algorithms.</StatusNote>
        ) : (
          <div className="space-y-4">
            {ALL_ALGOS.filter((a) => selected[a] && hashes[a]).map((a) => (
              <ResultField key={a} label={a} value={hashes[a]} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hash checker — compute + compare                                   */
/* ------------------------------------------------------------------ */
const LEN_TO_ALGO: Record<number, Algo> = { 32: "MD5", 40: "SHA-1", 64: "SHA-256", 128: "SHA-512" };

export function HashChecker() {
  const [input, setInput] = useState("");
  const [expected, setExpected] = useState("");
  const [result, setResult] = useState<{ match: boolean; algo: Algo; computed: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectedAlgo = LEN_TO_ALGO[expected.trim().length];

  const check = async () => {
    const exp = expected.trim().toLowerCase();
    setResult(null);
    setError(null);
    if (!input) return setError("Enter the original text.");
    if (!/^[0-9a-f]+$/i.test(exp)) return setError("The expected hash must be hexadecimal.");
    const algo = LEN_TO_ALGO[exp.length];
    if (!algo) return setError("Unrecognized hash length — expected MD5, SHA-1, SHA-256 or SHA-512.");
    const computed = await computeHash(algo, input);
    setResult({ match: computed === exp, algo, computed });
  };

  return (
    <div className="space-y-5">
      <Panel title="Verify a hash">
        <div className="space-y-4">
          <Field label="Original text">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="The text that was hashed…"
              className={`${monoTextareaClass} min-h-[100px]`}
            />
          </Field>
          <Field label="Expected hash" hint={detectedAlgo ? `Detected: ${detectedAlgo}` : undefined}>
            <input
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              placeholder="Paste the hash to compare against…"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </Field>
          <Button className="w-full" onClick={check} disabled={!input || !expected}>
            Check hash
          </Button>
          {error && <StatusNote variant="error">{error}</StatusNote>}
        </div>
      </Panel>

      {result && (
        <Panel title="Result">
          <div className="space-y-3">
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${
                result.match
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {result.match ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {result.match
                ? `Match — the ${result.algo} hash is correct.`
                : `No match — the ${result.algo} hash does not correspond to this text.`}
            </div>
            <ResultField label={`Computed ${result.algo}`} value={result.computed} />
          </div>
        </Panel>
      )}
    </div>
  );
}
