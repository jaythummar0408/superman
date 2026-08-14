"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  Field,
  SelectField,
  Toggle,
  CopyRow,
  controlInputClass,
  pickRandom,
} from "@/components/tools/social/social-tool-ui";

type Tone = "trendy" | "funny" | "motivational";

const TONES: Record<Tone, { emojis: string[]; templates: string[] }> = {
  trendy: {
    emojis: ["👀", "✨", "🔥", "😳", "🤫"],
    templates: [
      "POV: you just discovered {kw}",
      "Wait for it… {kw} edition",
      "{kw} but make it aesthetic",
      "Nobody's talking about {kw} but they should",
      "This {kw} hack is everything",
      "Rating {kw} because why not",
    ],
  },
  funny: {
    emojis: ["😂", "💀", "🤡", "😭", "🙃"],
    templates: [
      "Tell me you love {kw} without telling me",
      "Me pretending I'm good at {kw}",
      "{kw} said hold my drink",
      "When the {kw} hits different",
      "It's the {kw} for me",
      "No thoughts, just {kw}",
    ],
  },
  motivational: {
    emojis: ["🚀", "💪", "🙌", "💚", "⚡"],
    templates: [
      "Day 1 of {kw} until I make it",
      "Trust the {kw} process",
      "Your sign to start {kw} today",
      "Small steps, big {kw} energy",
      "Green flags: {kw}",
      "Show up for your {kw} goals",
    ],
  },
};

function buildTags(kw: string): string {
  const slug = kw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const base = ["#fyp", "#foryou", "#foryoupage", "#viral", "#trending"];
  if (slug) base.push(`#${slug}`, `#${slug}tiktok`);
  return base.join(" ");
}

export function TiktokCaptionGenerator() {
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState<Tone>("trendy");
  const [emojis, setEmojis] = useState(true);
  const [withTags, setWithTags] = useState(true);
  const [captions, setCaptions] = useState<string[]>([]);

  const generate = () => {
    const kw = keyword.trim();
    if (!kw) {
      setCaptions([]);
      return;
    }
    const tags = withTags ? buildTags(kw) : "";
    const list = pickRandom(TONES[tone].templates, 5).map((tpl) => {
      let c = tpl.replace(/\{kw\}/g, kw);
      if (emojis) c += " " + pickRandom(TONES[tone].emojis, 2).join("");
      if (tags) c += "\n" + tags;
      return c;
    });
    setCaptions(list);
  };

  return (
    <div className="space-y-5">
      <Panel title="TikTok caption generator">
        <div className="space-y-4">
          <Field label="Topic or keyword">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. dance, cooking, gym"
              className={controlInputClass}
            />
          </Field>
          <SelectField<Tone>
            label="Style"
            value={tone}
            onChange={setTone}
            options={[
              { label: "Trendy", value: "trendy" },
              { label: "Funny", value: "funny" },
              { label: "Motivational", value: "motivational" },
            ]}
          />
          <div className="flex flex-wrap gap-4">
            <Toggle label="Include emojis" checked={emojis} onChange={setEmojis} />
            <Toggle label="Include hashtags" checked={withTags} onChange={setWithTags} />
          </div>
          <Button className="w-full gap-2" onClick={generate} disabled={!keyword.trim()}>
            <Sparkles className="h-4 w-4" />
            Generate captions
          </Button>
        </div>
      </Panel>

      {captions.length > 0 && (
        <Panel
          title={`${captions.length} captions`}
          actions={
            <Button variant="outline" size="sm" className="gap-1.5" onClick={generate}>
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          }
        >
          <div className="space-y-2">
            {captions.map((c, i) => (
              <CopyRow key={i} text={c} />
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
