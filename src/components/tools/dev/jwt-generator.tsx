"use client";

import React, { useState } from "react";
import { SignJWT } from "jose";
import { json } from "@codemirror/lang-json";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeEditor,
  CopyButton,
  Field,
  Panel,
  Segmented,
  StatusNote,
  controlInputClass,
  monoTextareaClass,
} from "@/components/tools/dev/dev-tool-ui";

const jsonExt = [json()];
type Alg = "HS256" | "HS384" | "HS512";

const DEFAULT_PAYLOAD = `{
  "sub": "1234567890",
  "name": "Notch Tools",
  "role": "admin"
}`;

export function JwtGenerator() {
  const [alg, setAlg] = useState<Alg>("HS256");
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [expiry, setExpiry] = useState("2h");
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!secret) {
      setError("Enter a signing secret.");
      return;
    }
    let payloadObj: unknown;
    try {
      payloadObj = JSON.parse(payload || "{}");
    } catch {
      setError("Payload must be valid JSON.");
      return;
    }
    if (typeof payloadObj !== "object" || payloadObj === null || Array.isArray(payloadObj)) {
      setError("Payload must be a JSON object.");
      return;
    }
    setBusy(true);
    try {
      const key = new TextEncoder().encode(secret);
      let builder = new SignJWT(payloadObj as Record<string, unknown>)
        .setProtectedHeader({ alg })
        .setIssuedAt();
      if (expiry.trim()) builder = builder.setExpirationTime(expiry.trim());
      const jwt = await builder.sign(key);
      setToken(jwt);
      setError(null);
      toast.success("JWT generated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign the token.");
      setToken("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Payload (claims)">
          <CodeEditor
            value={payload}
            onChange={setPayload}
            extensions={jsonExt}
            placeholder="JSON object of claims…"
            minHeight="220px"
          />
        </Panel>

        <Panel title="Signing settings">
          <div className="flex flex-col gap-5">
            <Field label="Algorithm">
              <Segmented<Alg>
                value={alg}
                onChange={setAlg}
                options={[
                  { label: "HS256", value: "HS256" },
                  { label: "HS384", value: "HS384" },
                  { label: "HS512", value: "HS512" },
                ]}
              />
            </Field>
            <Field label="Secret">
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="HMAC secret"
                className={`${controlInputClass} font-mono`}
              />
            </Field>
            <Field label="Expires in" hint="e.g. 2h, 30m, 7d — leave blank for none">
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="2h"
                className={controlInputClass}
              />
            </Field>
            <Button className="mt-auto gap-2" disabled={busy} onClick={generate}>
              <KeyRound className="h-4 w-4" />
              {busy ? "Signing…" : "Generate JWT"}
            </Button>
            {error && <StatusNote variant="error">{error}</StatusNote>}
          </div>
        </Panel>
      </div>

      {token && (
        <Panel title="Signed JWT" actions={<CopyButton value={token} />}>
          <textarea
            value={token}
            readOnly
            className={`${monoTextareaClass} min-h-[120px] break-all`}
          />
          <div className="mt-3">
            <StatusNote variant="info">
              This is an HMAC-signed token. Anyone with the secret can forge tokens — keep it safe
              and never expose it in client-side production code.
            </StatusNote>
          </div>
        </Panel>
      )}
    </div>
  );
}
