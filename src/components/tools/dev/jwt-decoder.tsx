"use client";

import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { json } from "@codemirror/lang-json";
import { Trash2, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeEditor,
  Panel,
  StatusNote,
  monoTextareaClass,
} from "@/components/tools/dev/dev-tool-ui";

const jsonExt = [json()];

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5vdGNoIFRvb2xzIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE5MDAwMDAwMDB9.f7lXv5xO2i3n0kD7l4t3T0m0m2s0aQx0hVnQ2y3l0kQ";

interface Decoded {
  header: string;
  payload: string;
  claims: { label: string; value: string }[];
  expired: boolean | null;
}

function decode(token: string): Decoded {
  const header = jwtDecode(token, { header: true }) as Record<string, unknown>;
  const payload = jwtDecode(token) as Record<string, unknown>;

  const claims: { label: string; value: string }[] = [];
  const addTime = (key: string, label: string) => {
    const v = payload[key];
    if (typeof v === "number") {
      claims.push({ label, value: new Date(v * 1000).toLocaleString() });
    }
  };
  addTime("iat", "Issued at");
  addTime("nbf", "Not before");
  addTime("exp", "Expires");

  let expired: boolean | null = null;
  if (typeof payload.exp === "number") {
    expired = payload.exp * 1000 < Date.now();
  }

  return {
    header: JSON.stringify(header, null, 2),
    payload: JSON.stringify(payload, null, 2),
    claims,
    expired,
  };
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (text: string) => {
    if (!text.trim()) {
      setDecoded(null);
      setError(null);
      return;
    }
    try {
      setDecoded(decode(text.trim()));
      setError(null);
    } catch {
      setDecoded(null);
      setError("Invalid JWT — expected three dot-separated Base64URL segments.");
    }
  };

  return (
    <div className="space-y-5">
      <Panel
        title="JWT"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setToken(SAMPLE);
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
                setToken("");
                setDecoded(null);
                setError(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <textarea
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            run(e.target.value);
          }}
          placeholder="Paste a JWT (header.payload.signature)…"
          className={`${monoTextareaClass} min-h-[120px] break-all`}
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      {decoded && (
        <>
          {decoded.expired !== null && (
            <StatusNote variant={decoded.expired ? "error" : "success"}>
              {decoded.expired ? "This token has expired." : "This token is not expired."}
            </StatusNote>
          )}

          {decoded.claims.length > 0 && (
            <Panel title="Standard claims">
              <div className="grid gap-2 sm:grid-cols-3">
                {decoded.claims.map((c) => (
                  <div key={c.label} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{c.value}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Header">
              <CodeEditor value={decoded.header} extensions={jsonExt} readOnly minHeight="160px" />
            </Panel>
            <Panel title="Payload">
              <CodeEditor value={decoded.payload} extensions={jsonExt} readOnly minHeight="160px" />
            </Panel>
          </div>

          <StatusNote variant="info">
            <span className="inline-flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              Decoding does not verify the signature — never trust an unverified token.
            </span>
          </StatusNote>
        </>
      )}
    </div>
  );
}
