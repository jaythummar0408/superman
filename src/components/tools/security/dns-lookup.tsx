"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  SelectField,
  StatusNote,
  controlInputClass,
} from "@/components/tools/security/security-tool-ui";

type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SOA" | "CAA";

const TYPE_NAMES: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  257: "CAA",
};

interface Answer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState<RecordType>("A");
  const [records, setRecords] = useState<Answer[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async () => {
    const name = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!name) return;
    setBusy(true);
    setError(null);
    setRecords(null);
    setStatus(null);
    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`
      );
      if (!res.ok) throw new Error(`Resolver responded ${res.status}`);
      const data = await res.json();
      if (data.Status === 3) {
        setStatus(`Domain not found (NXDOMAIN): ${name}`);
      } else if (data.Status !== 0) {
        setStatus(`Lookup failed (DNS status ${data.Status}).`);
      } else if (!data.Answer || data.Answer.length === 0) {
        setStatus(`No ${type} records found for ${name}.`);
      } else {
        setRecords(data.Answer as Answer[]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed — check your connection.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <Panel title="DNS lookup">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Domain</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="example.com"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </div>
          <div className="sm:w-40">
            <SelectField<RecordType>
              label="Record type"
              value={type}
              onChange={setType}
              options={(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA"] as RecordType[]).map((t) => ({
                label: t,
                value: t,
              }))}
            />
          </div>
          <Button className="gap-2 sm:w-auto" onClick={lookup} disabled={!domain.trim() || busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Look up
          </Button>
        </div>
      </Panel>

      {error && <StatusNote variant="error">{error}</StatusNote>}
      {status && <StatusNote variant="info">{status}</StatusNote>}

      {records && (
        <Panel title={`${records.length} record${records.length > 1 ? "s" : ""}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 pr-4 font-medium">TTL</th>
                  <th className="pb-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0">
                    <td className="py-2 pr-4">
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                        {TYPE_NAMES[r.type] ?? r.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-mono text-muted-foreground">{r.TTL}s</td>
                    <td className="py-2 break-all font-mono text-foreground">{r.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Resolved via Google Public DNS over HTTPS (dns.google).
      </p>
    </div>
  );
}
