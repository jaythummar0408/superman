"use client";

import React, { useState } from "react";
import { Hash, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Field,
  Slider,
  CopyButton,
  StatusNote,
  controlInputClass,
  pickRandom,
} from "@/components/tools/social/social-tool-ui";

const SUFFIXES = [
  "life", "lover", "lovers", "daily", "gram", "addict", "community", "ofinstagram",
  "oftheday", "inspo", "tips", "ideas", "goals", "style", "world",
];
const PREFIXES = ["insta", "best", "my", "the", "love"];
const POPULAR = [
  "instagood", "love", "photooftheday", "instadaily", "viral", "trending", "explore",
  "reels", "instagram", "follow", "photography", "art", "style", "beautiful", "happy",
  "instamood", "picoftheday", "bestoftheday", "aesthetic", "explorepage",
];

function generateHashtags(keyword: string, count: number): string[] {
  const words = keyword
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
  const slug = words.join("");
  if (!slug) return [];

  const niche = new Set<string>();
  niche.add(slug);
  for (const suf of SUFFIXES) niche.add(slug + suf);
  for (const pre of PREFIXES) niche.add(pre + slug);
  for (const w of words) {
    niche.add(w);
    for (const suf of SUFFIXES.slice(0, 6)) niche.add(w + suf);
  }

  // ~65% niche, rest from popular pool.
  const nicheCount = Math.min(niche.size, Math.ceil(count * 0.65));
  const chosen = new Set<string>(pickRandom([...niche], nicheCount));
  for (const p of pickRandom(POPULAR, POPULAR.length)) {
    if (chosen.size >= count) break;
    chosen.add(p);
  }
  return [...chosen].slice(0, count).map((t) => `#${t}`);
}

export function InstagramHashtagGenerator() {
  const [keyword, setKeyword] = useState("");
  const [count, setCount] = useState(20);
  const [tags, setTags] = useState<string[]>([]);

  const generate = () => setTags(generateHashtags(keyword, count));

  return (
    <div className="space-y-5">
      <Panel title="Instagram hashtag generator">
        <div className="space-y-4">
          <Field label="Topic or keyword" hint="one or more words">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. street photography"
              className={controlInputClass}
            />
          </Field>
          <Slider label="How many hashtags" value={count} onChange={setCount} min={5} max={30} />
          <Button className="w-full gap-2" onClick={generate} disabled={!keyword.trim()}>
            <Hash className="h-4 w-4" />
            Generate hashtags
          </Button>
          {count === 30 && (
            <StatusNote variant="info">Instagram allows a maximum of 30 hashtags per post.</StatusNote>
          )}
        </div>
      </Panel>

      {tags.length > 0 && (
        <Panel
          title={`${tags.length} hashtags`}
          actions={
            <>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={generate}>
                <RefreshCw className="h-3.5 w-3.5" />
                Shuffle
              </Button>
              <CopyButton value={tags.join(" ")} label="Copy all" />
            </>
          }
        >
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-border/50 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
