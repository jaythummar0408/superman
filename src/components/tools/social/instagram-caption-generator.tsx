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

type Tone = "casual" | "funny" | "inspirational" | "professional" | "bold";

const TONES: Record<Tone, { emojis: string[]; templates: string[] }> = {
  casual: {
    emojis: ["✨", "😊", "💫", "🙌", "💕", "🌿"],
    templates: [
      "Just another day with {kw}",
      "Currently obsessed with {kw}",
      "A little bit of {kw} never hurt anybody",
      "Keeping it simple with {kw}",
      "{kw} kind of mood today",
      "Soaking up all the {kw} vibes",
    ],
  },
  funny: {
    emojis: ["😂", "🤪", "😅", "🙃", "😆", "💀"],
    templates: [
      "I put the fun in {kw}… I think",
      "Me + {kw} = unstoppable (mostly)",
      "Warning: {kw} may cause excessive smiling",
      "Nobody: … Me: talking about {kw} again",
      "{kw} is my cardio",
      "Plot twist: {kw} was the answer all along",
    ],
  },
  inspirational: {
    emojis: ["✨", "🌱", "🚀", "💫", "🌟", "🔆"],
    templates: [
      "Dream big, start with {kw}",
      "Every expert in {kw} was once a beginner",
      "Your {kw} journey starts now",
      "Believe in your {kw} and the rest will follow",
      "Small steps in {kw} lead to big changes",
      "Progress over perfection with {kw}",
    ],
  },
  professional: {
    emojis: ["📈", "💼", "✅", "🎯", "📊"],
    templates: [
      "Sharing my latest thoughts on {kw}",
      "Excited to dive into {kw} with you today",
      "Here's what I've learned about {kw}",
      "Consistency is the key to great {kw}",
      "Elevating my approach to {kw}",
      "A few lessons from my work in {kw}",
    ],
  },
  bold: {
    emojis: ["🔥", "💥", "⚡", "😎", "🚨"],
    templates: [
      "Owning my {kw} era",
      "No limits. Just {kw}",
      "This is your sign to start {kw}",
      "Unapologetically into {kw}",
      "Making {kw} look easy",
      "Less talk, more {kw}",
    ],
  },
};

function buildTags(kw: string): string {
  const slug = kw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (!slug) return "";
  return [`#${slug}`, `#${slug}life`, `#${slug}gram`, "#instagood", "#instadaily", "#love"].join(" ");
}

export function InstagramCaptionGenerator() {
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState<Tone>("casual");
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
      if (tags) c += "\n\n" + tags;
      return c;
    });
    setCaptions(list);
  };

  return (
    <div className="space-y-5">
      <Panel title="Instagram caption generator">
        <div className="space-y-4">
          <Field label="Topic or keyword">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. coffee, travel, fitness"
              className={controlInputClass}
            />
          </Field>
          <SelectField<Tone>
            label="Tone"
            value={tone}
            onChange={setTone}
            options={[
              { label: "Casual", value: "casual" },
              { label: "Funny", value: "funny" },
              { label: "Inspirational", value: "inspirational" },
              { label: "Professional", value: "professional" },
              { label: "Bold", value: "bold" },
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
