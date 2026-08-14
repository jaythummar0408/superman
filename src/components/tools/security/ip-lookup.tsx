"use client";

import React, { useState } from "react";
import { Search, Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, StatusNote, controlInputClass } from "@/components/tools/security/security-tool-ui";

interface IpInfo {
  ip: string;
  type?: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  flag?: { emoji?: string };
  connection?: { asn?: number; org?: string; isp?: string };
  timezone?: { id?: string; utc?: string };
  success?: boolean;
  message?: string;
}

export function IpLookup() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip.trim())}`);
      const data: IpInfo = await res.json();
      if (data.success === false) {
        setError(data.message || "Could not look up that IP address.");
      } else {
        setInfo(data);
      }
    } catch {
      setError("Lookup failed — check your connection.");
    } finally {
      setBusy(false);
    }
  };

  const rows = info
    ? [
        { label: "IP address", value: info.ip },
        { label: "Type", value: info.type },
        {
          label: "Location",
          value: [info.city, info.region, info.country].filter(Boolean).join(", "),
        },
        {
          label: "Coordinates",
          value:
            info.latitude != null && info.longitude != null
              ? `${info.latitude}, ${info.longitude}`
              : undefined,
        },
        { label: "Timezone", value: info.timezone?.id, extra: info.timezone?.utc },
        { label: "ISP", value: info.connection?.isp },
        { label: "Organization", value: info.connection?.org },
        { label: "ASN", value: info.connection?.asn ? `AS${info.connection.asn}` : undefined },
      ].filter((r) => r.value)
    : [];

  return (
    <div className="space-y-5">
      <Panel title="IP address lookup">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">IP address</label>
            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="8.8.8.8  (leave blank for your own IP)"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </div>
          <Button className="gap-2" onClick={lookup} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Look up
          </Button>
        </div>
      </Panel>

      {error && <StatusNote variant="error">{error}</StatusNote>}

      {info && (
        <Panel
          title={
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {info.flag?.emoji ? `${info.flag.emoji} ` : ""}
              {info.city ? `${info.city}, ` : ""}
              {info.country ?? "Result"}
            </span>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {r.label}
                </div>
                <div className="mt-0.5 break-all font-mono text-sm text-foreground">
                  {r.value}
                  {"extra" in r && r.extra ? (
                    <span className="ml-1 text-muted-foreground">({r.extra})</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Geolocation data provided by ipwho.is. Accuracy varies and is approximate.
      </p>
    </div>
  );
}
