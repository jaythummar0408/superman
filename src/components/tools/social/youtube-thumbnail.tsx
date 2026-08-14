"use client";

import React, { useState } from "react";
import { Search, Download, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, StatusNote, controlInputClass } from "@/components/tools/social/social-tool-ui";

const QUALITIES: { key: string; label: string; res: string }[] = [
  { key: "maxresdefault", label: "Max resolution", res: "1280×720" },
  { key: "sddefault", label: "Standard", res: "640×480" },
  { key: "hqdefault", label: "High quality", res: "480×360" },
  { key: "mqdefault", label: "Medium quality", res: "320×180" },
];

/** Extract an 11-char video id from any common YouTube URL shape (or a bare id). */
function extractVideoId(input: string): string | null {
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // watch?v=… or …&v=…
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:embed|shorts|v|live)\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

export function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState<Set<string>>(new Set());

  const load = async () => {
    const id = extractVideoId(url);
    if (!id) {
      setError("Couldn't find a valid YouTube video ID in that link.");
      setVideoId(null);
      return;
    }
    setError(null);
    setFailed(new Set());
    setVideoId(id);
    setTitle(null);
    // oEmbed is CORS-enabled — grab the title as a nice touch (best effort).
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://youtu.be/${id}&format=json`
      );
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title ?? null);
      }
    } catch {
      /* title is optional */
    }
  };

  const download = async (key: string) => {
    if (!videoId) return;
    const src = `https://img.youtube.com/vi/${videoId}/${key}.jpg`;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = `${videoId}-${key}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
    } catch {
      window.open(src, "_blank", "noopener");
    }
  };

  return (
    <div className="space-y-5">
      <Panel title="YouTube thumbnail downloader">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Video URL or ID</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="https://youtube.com/watch?v=…  or  youtu.be/…"
              spellCheck={false}
              className={`${controlInputClass} font-mono`}
            />
          </div>
          <Button className="gap-2" onClick={load} disabled={!url.trim()}>
            <Search className="h-4 w-4" />
            Get thumbnails
          </Button>
        </div>
      </Panel>

      {error && <StatusNote variant="error">{error}</StatusNote>}

      {videoId && (
        <Panel
          title={
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-red-500" />
              {title ?? "Available thumbnails"}
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {QUALITIES.filter((q) => !failed.has(q.key)).map((q) => {
              const src = `https://img.youtube.com/vi/${videoId}/${q.key}.jpg`;
              return (
                <div key={q.key} className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${q.label} thumbnail`}
                    className="aspect-video w-full bg-muted object-cover"
                    onError={() => setFailed((f) => new Set(f).add(q.key))}
                  />
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{q.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">{q.res}</div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => download(q.key)}>
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
