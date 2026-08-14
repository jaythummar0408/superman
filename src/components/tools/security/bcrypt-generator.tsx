"use client";

import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Field,
  Slider,
  ResultField,
  StatusNote,
  controlInputClass,
} from "@/components/tools/security/security-tool-ui";

export function BcryptGenerator() {
  // Generate
  const [text, setText] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);

  // Verify
  const [vText, setVText] = useState("");
  const [vHash, setVHash] = useState("");
  const [match, setMatch] = useState<boolean | null>(null);
  const [vBusy, setVBusy] = useState(false);
  const [vError, setVError] = useState<string | null>(null);

  const doGenerate = async () => {
    if (!text) return;
    setBusy(true);
    setHash("");
    try {
      setHash(await bcrypt.hash(text, rounds));
    } catch {
      setHash("");
    } finally {
      setBusy(false);
    }
  };

  const doVerify = async () => {
    setMatch(null);
    setVError(null);
    if (!vText || !vHash) return;
    setVBusy(true);
    try {
      setMatch(await bcrypt.compare(vText, vHash.trim()));
    } catch {
      setVError("That doesn't look like a valid bcrypt hash.");
    } finally {
      setVBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <Panel title="Generate a bcrypt hash">
        <div className="space-y-4">
          <Field label="Text / password">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text to hash…"
              autoComplete="off"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </Field>
          <Slider
            label="Salt rounds (cost factor)"
            value={rounds}
            onChange={setRounds}
            min={4}
            max={15}
          />
          {rounds >= 13 && (
            <StatusNote variant="info">
              High cost factors are more secure but noticeably slower to compute.
            </StatusNote>
          )}
          <Button className="w-full gap-2" onClick={doGenerate} disabled={!text || busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Hashing…" : "Generate hash"}
          </Button>
          {hash && <ResultField label={`bcrypt hash (cost ${rounds})`} value={hash} />}
        </div>
      </Panel>

      <Panel title="Verify a hash">
        <div className="space-y-4">
          <Field label="Text / password">
            <input
              value={vText}
              onChange={(e) => setVText(e.target.value)}
              placeholder="Original text…"
              autoComplete="off"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </Field>
          <Field label="Bcrypt hash">
            <input
              value={vHash}
              onChange={(e) => setVHash(e.target.value)}
              placeholder="$2b$10$…"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </Field>
          <Button className="w-full gap-2" variant="outline" onClick={doVerify} disabled={!vText || !vHash || vBusy}>
            {vBusy && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify
          </Button>
          {vError && <StatusNote variant="error">{vError}</StatusNote>}
          {match !== null && !vError && (
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${
                match
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {match ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {match ? "Match — the text produces this hash." : "No match."}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
